// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, query, where, setDoc, doc, getDoc, updateDoc, serverTimestamp, enableIndexedDbPersistence } from "firebase/firestore";

import * as aes from 'crypto-js/aes'
import * as enc from 'crypto-js/enc-utf8'
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
      books: btoa(localStorage.getItem("notebook")),
      lastEdited: serverTimestamp(),
      lastBook: btoa(localStorage.getItem("lastBook")),
      lastPage: localStorage.getItem("lastPage"),
      theme: localStorage.getItem("theme")
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
      let online
      online = docSnap.data().books
      if (online[0] != '{') {
        online = atob(docSnap.data().books)
        localStorage.setItem('lastBook', atob(docSnap.data().lastBook))
      } else {
        localStorage.setItem('lastBook', docSnap.data().lastBook)
      }
      let offline = localStorage.getItem("notebook")
      if (online !== offline) {
        let ask = confirm("You have a different notebook online and offline. Would you like to overwrite the offline copy with the online one?")
        if (ask) {
          let newOne = {...JSON.parse(offline), ...JSON.parse(online)}
          localStorage.setItem("notebook", JSON.stringify(newOne))
        } else {
          let newOne = {...JSON.parse(online), ...JSON.parse(offline)}
          localStorage.setItem("notebook", JSON.stringify(newOne))
        }
      }
      localStorage.setItem('lastPage', docSnap.data().lastPage)
      localStorage.setItem('theme', docSnap.data().theme || 'light')
      document.body.dataset.theme = localStorage.getItem('theme')
      updateUiCode(localStorage.getItem("lastBook"), docSnap.data().lastPage)
      updateDb()
      window.addEventListener('beforeunload', function (e) {
        if (localStorage.getItem("notebook") !== localStorage.getItem("lastNotebook")) {
          // Cancel the event
          e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
          // Chrome requires returnValue to be set
          e.returnValue = '';
          updateDoc(doc(documentRef, localStorage.getItem('uid')), {
            books: btoa(localStorage.getItem("notebook")),
            lastEdited: serverTimestamp(),
            lastBook: btoa(localStorage.getItem("lastBook")),
            lastPage: localStorage.getItem("lastPage"),
            theme: localStorage.getItem("theme")
          })
        }
        localStorage.setItem("lastNotebook", localStorage.getItem("notebook"))
      });
    } else {
      setDoc(doc(documentRef, user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        books: btoa(localStorage.getItem("notebook")),
        lastEdited: serverTimestamp(),
        lastBook: btoa(localStorage.getItem("lastBook")),
        lastPage: localStorage.getItem("lastPage"),
        theme: localStorage.getItem("theme")
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
  let ask = confirm("Are you sure you want to delete all your data? This cannot be undone with no chance of recovering.")
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
  let ask = confirm("Are you sure you want to delete your account? THis will delete all your data and cannot be undone, with no chance of recoverd.")
  if (ask) {
    if (!localStorage.getItem('reqDelAccount')) {
      updateDoc(doc(documentRef, localStorage.getItem('uid')), {
        books: localStorage.getItem("notebook"),
        lastEdited: serverTimestamp(),
        lastBook: localStorage.getItem("lastBook"),
        lastPage: localStorage.getItem("lastPage"),
        reqDelAccount: true,
        theme: localStorage.getItem("theme")
      })
      signout()
      localStorage.setItem('reqDelAccount', true)
      alert("Your account will be deleted in 24 hours")
      alert("By the way the deleting process is currently manually done so it will take longer than 24 hours (upto a month)")
    } else {
      let ask1 = confirm("You have already requested to delete your account, would you like to cancel it?")
      if (ask1) {
        updateDoc(doc(documentRef, localStorage.getItem('uid')), {
          books: localStorage.getItem("notebook"),
          lastEdited: serverTimestamp(),
          lastBook: localStorage.getItem("lastBook"),
          lastPage: localStorage.getItem("lastPage"),
          reqDelAccount: false,
          theme: localStorage.getItem("theme")
        })
        localStorage.removeItem('reqDelAccount')
      }
    }
  }
})
document.getElementById("save-btn").addEventListener("click", () => {
  updateDb()
})
document.getElementById("dl-data").addEventListener("click", () => {
  let data = localStorage.getItem("notebook")
  let key = Math.random().toString(36).substring(2, 12)
  let encrypted = aes.encrypt(data, key).toString()+"|"+key
  let blob = new Blob([encrypted], {type: "text/plain;charset=utf-8"})
  //download file
  let dl = document.createElement('a')
  dl.href = URL.createObjectURL(blob)
  dl.download = "notebook.save"
  dl.click()
})
document.getElementById("ul-data").addEventListener("click", () => {
  document.getElementById("file-input").click()
  document.getElementById("file-input").addEventListener("change", () => {
    let file = document.getElementById("file-input").files[0]
    if (file) {
      let reader = new FileReader()
      reader.onload = (e) => {
        let data = e.target.result
        let dataArr = data.split("|")
        console.log(dataArr)
        let decrypted = aes.decrypt(dataArr[0], dataArr[1])
        //convert to utf8
        decrypted = decrypted.toString(enc.Utf8)
        console.log(decrypted)
        localStorage.setItem("notebook", decrypted)
        updateUiCode(localStorage.getItem("lastBook"), localStorage.getItem("lastPage"))
      }
      reader.readAsText(file)
    }
  })
  document.getElementById("file-input").removeEventListener("change", () => {})
})