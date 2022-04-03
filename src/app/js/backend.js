// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, query, where, setDoc, doc, getDoc, updateDoc, serverTimestamp, enableIndexedDbPersistence } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8ygrSzvT9zbBFgXiKx-TAQpYN24j7OV4",
  authDomain: "paper-clip-fa4fb.firebaseapp.com",
  projectId: "paper-clip-fa4fb",
  storageBucket: "paper-clip-fa4fb.appspot.com",
  messagingSenderId: "640033365278",
  appId: "1:640033365278:web:fc2ea63f9b0e98e7defd0f",
  measurementId: "G-TRN6WHYMDP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

var store = getFirestore(app)
let documentRef
let unsubscribe

const auth = getAuth(app);
auth.languageCode = 'en'
var googleAuth = new GoogleAuthProvider()
var githubAuth = new GithubAuthProvider()
export var signin = (e) => {
  if(e === 'google') {
    signInWithPopup(auth, googleAuth)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }
}
export var signout = () => {
  auth.signOut()
}


export var updateDb = () => {
  updateDoc(doc(documentRef, localStorage.getItem('uid')), {
    books: localStorage.getItem("notebook"),
    lastEdited: serverTimestamp(),
    lastBook: localStorage.getItem("lastBook"),
    lastPage: localStorage.getItem("lastPage")
  })
}

auth.onAuthStateChanged(async user => {
  if (user) {
    document.getElementById("no-signin").classList.toggle("hide")
    document.getElementById("logdin").classList.toggle("hide")
    document.getElementById("user-name").innerHTML = user.displayName
    let img = new Image()
    img.src = user.photoURL
    document.getElementById("user-photo").append(img)
    document.getElementById("user-email").innerHTML = user.email
    document.getElementById("user-id").innerHTML = user.uid
    localStorage.setItem('uid', user.uid)

    documentRef = collection(store,"userDocuments")
    /* addDoc(documentRef, {
      email: user.email,
      displayName: user.displayName,
      books: {},
      lastEdited: serverTimestamp()
    }, user.uid) */
    //const q = query(documentRef, where("uid", "==", user.uid))
    const docSnap = await getDoc(doc(documentRef, user.uid));
    if (docSnap.exists()) {
      localStorage.setItem('lastPage', docSnap.data().lastPage)
      localStorage.setItem('lastBook', docSnap.data().lastBook)
      localStorage.setItem('notebook', docSnap.data().books)
      window.updateUi(docSnap.data().lastBook, docSnap.data().lastPage)
      updateDb()
    } else {
      setDoc(doc(documentRef, user.uid), {
        email: user.email,
        displayName: user.displayName,
        books: localStorage.getItem("notebook"),
        lastEdited: serverTimestamp(),
        lastBook: localStorage.getItem("lastBook"),
        lastPage: localStorage.getItem("lastPage")
      })
    }
    setInterval(()=>{
      if (localStorage.getItem("notebook") !== localStorage.getItem("lastNotebook")) {
        updateDb()
      }
      localStorage.setItem("lastNotebook", localStorage.getItem("notebook"))
    }, 1000*5)
    
  } else {
    document.getElementById("no-signin").classList.remove('hide')
    document.getElementById("logdin").classList.add("hide")
    document.getElementById("user-name").innerHTML = ''
    document.getElementById("user-photo").innerHTML = ''
  }
})