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
  if(e === 'github') {
    signInWithPopup(auth, githubAuth)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);
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
      const credential = GithubAuthProvider.credentialFromError(error);
      // ...
    });
  }
  if (e === 'email') {
    //TODO: email signin
  }
}
export var signout = () => {
  auth.signOut()
}
var updateUiCode = (b, p) => {
  updateUi(b, p)
}
export var updateUiCodeFn = (callback) => {
  updateUiCode = callback
}


export var updateDb = () => {
  if (localStorage.getItem("notebook") !== localStorage.getItem("lastNotebook")) {
    updateDoc(doc(documentRef, localStorage.getItem('uid')), {
      books: localStorage.getItem("notebook"),
      lastEdited: serverTimestamp(),
      lastBook: localStorage.getItem("lastBook"),
      lastPage: localStorage.getItem("lastPage")
    })
  }
  localStorage.setItem("lastNotebook", localStorage.getItem("notebook"))
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
    document.getElementById("user-provider").innerHTML = user.providerData[0].providerId
    localStorage.setItem('uid', user.uid)

    documentRef = collection(store,"userDocuments")
    const docSnap = await getDoc(doc(documentRef, user.uid));
    if (docSnap.exists()) {
      let online = docSnap.data().books
      let offline = localStorage.getItem("notebook")
      if (online !== offline) {
        let ask = confirm("You have a different notebook online and offline. Would you like to keep the online one?")
        if (ask) {
          localStorage.setItem("notebook", online)
        } else {
          localStorage.setItem("notebook", offline)
        }
      }
      localStorage.setItem('lastBook', docSnap.data().lastBook)
      localStorage.setItem('lastPage', docSnap.data().lastPage)
      updateUiCode(docSnap.data().lastBook, docSnap.data().lastPage)
      updateDb()
    } else {
      setDoc(doc(documentRef, user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        books: localStorage.getItem("notebook"),
        lastEdited: serverTimestamp(),
        lastBook: localStorage.getItem("lastBook"),
        lastPage: localStorage.getItem("lastPage")
      })
    }
    setInterval(()=>{
      updateDb()
    }, 1000*5)

    document.querySelectorAll(".auth-obj").forEach(e => {
      e.classList.remove("hide")
    })
    
  } else {
    //select all class=auth-obj and hide them
    document.querySelectorAll(".auth-obj").forEach(e => {
      e.classList.add("hide")
    })
    document.getElementById("no-signin").classList.remove('hide')
    document.getElementById("logdin").classList.add("hide")
    document.getElementById("user-name").innerHTML = ''
    document.getElementById("user-photo").innerHTML = ''
    localStorage.removeItem('uid')
    localStorage.removeItem('email')
    localStorage.removeItem('signInProvider')
  }
})
document.getElementById("del-all").addEventListener("click", () => {
  let ask = confirm("Are you sure you want to delete all your data?")
  if (ask) {
    localStorage.removeItem("notebook", "")
    localStorage.removeItem("lastBook", "")
    localStorage.removeItem("lastPage", "")
    localStorage.removeItem("lastNotebook", "")
    //delete of firbase if signed in
    if (auth.currentUser) {
      deleteDoc(doc(documentRef, auth.currentUser.uid))
    }
  }
})
document.getElementById("req-del-account").addEventListener("click", () => {
  let ask = confirm("Are you sure you want to delete your account?")
  if (ask) {
    if (!localStorage.getItem('reqDelAccount')) {
      updateDoc(doc(documentRef, localStorage.getItem('uid')), {
        books: localStorage.getItem("notebook"),
        lastEdited: serverTimestamp(),
        lastBook: localStorage.getItem("lastBook"),
        lastPage: localStorage.getItem("lastPage"),
        reqDelAccount: true
      })
      signout()
      localStorage.setItem('reqDelAccount', true)
      alert("Your account will be deleted in 24 hours")
    } else {
      alert("You have already requested to delete your account")
    }
  }
  alert("By the way the deleteing process is currently manually done so it will take longer than 24 hours (upto a month)")
})
document.getElementById("save-btn").addEventListener("click", () => {
  updateDb()
})