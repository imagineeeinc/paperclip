// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInAnonymously, signInWithPopup, signInWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { getFirestore, collection, setDoc, doc, getDoc, updateDoc, onSnapshot /*, enableIndexedDbPersistence */ } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
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

// App check
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6Lc6wmohAAAAAOg9wIEZU4iJBJjCCdOuGmZqmbRr'),
  isTokenAutoRefreshEnabled: true
});

var store = getFirestore(app)
let documentRef
let shareRef

import * as vex from 'vex-js/dist/js/vex.combined.min.js'

function timestamp() {return Math.floor(Date.now() / 1000)}

// Setup Auth
const auth = getAuth(app);
auth.useDeviceLanguage()
var googleAuth = new GoogleAuthProvider()
var githubAuth = new GithubAuthProvider()
shareRef = collection(store,"shares")
export var signin = (e, email, password) => {
  if (window.process && e.indexOf('email') < 0) {
    window.open('https://' + window.location.host + '/signin/')
    vex.dialog.prompt({
      message: 'Please copy the code from the URL and paste it here:',
      placeholder: 'The Code',
      callback: (code) => {
        if (code) {
          let data = JSON.parse(atob(code))
          if (e === 'google') {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(data);
            signInWithCredential(auth, credential)
            //ask would you like to merge currnent local data with the data from the cloud
            /* if (Object.keys(JSON.parse(localStorage.getItem('notebook'))).length > 0) {
              vex.dialog.confirm({
                message: 'Do you want to merge your local data with the data from the cloud?',
                callback: (ask) => {
                  if (!ask) {
                    sessionStorage.setItem('dontMergeLocal', true)
                  }
                }
              }) 
            } */
          } else if (e === 'github') {
            const credential = GithubAuthProvider.credentialFromResult(result);
            signInWithCredential(auth, credential)
            //ask would you like to merge currnent local data with the data from the cloud
            /* if (Object.keys(JSON.parse(localStorage.getItem('notebook'))).length > 0) {
              vex.dialog.confirm({
                message: 'Do you want to merge your local data with the data from the cloud?',
                callback: (ask) => {
                  if (!ask) {
                    sessionStorage.setItem('dontMergeLocal', true)
                  }
                }
              })
            } */
          }
        }
      }
    })
  } else {
    if(e === 'google') {
      signInWithPopup(auth, googleAuth)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        vex.dialog.alert({
          message: errorCode + '\n\n' + errorMessage
        })
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
    }
    if(e === 'github') {
      signInWithPopup(auth, githubAuth)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        vex.dialog.alert({
          message: errorCode + '\n\n' + errorMessage
        })
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
      });
    }
    if (e === 'create-email') {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        updateProfile(auth.currentUser, {photoURL: "https://avatars.dicebear.com/api/initials/" + email + ".svg"
        }).then(() => {
          // Profile updated!
          // ...
        }).catch((error) => {
          // An error occurred
          // ...
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        vex.dialog.alert({
          message: errorCode + '\n\n' + errorMessage
        })
      })
    }
    if (e === 'login-email') {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        vex.dialog.alert({
          message: errorCode + '\n\n' + errorMessage
        })
      });
    }
    if (e === 'anoymous') {
      signInAnonymously(auth)
      .then((result) => {
        //ask would you like to merge currnent local data with the data from the cloud
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        vex.dialog.alert({
          message: errorCode + '\n\n' + errorMessage
        })
      });
    }
  }
}

//auth helper functions
export var signout = () => {
  auth.signOut()

  vex.dialog.confirm({
    message: 'Would you like to delete your local data once signed out?',
    callback: (ask) => {
      if(ask) {
        localStorage.clear()
        sessionStorage.setItem('passUnloadSave', true)
        location.reload()
      }
    }
  })
}
var updateUiCode = (b, p) => {
  updateUi(b, p)
}
export var updateUiCodeFn = (callback) => {
  updateUiCode = callback
}

//Update cloud db
export var updateDb = () => {
  if (localStorage.getItem("notebook") !== localStorage.getItem("lastNotebook")) {
    localStorage.setItem('lastEdited', timestamp())
    updateDoc(doc(documentRef, localStorage.getItem('uid')), {
      books: btoa(localStorage.getItem("notebook")),
      lastEdited: timestamp(),
      lastBook: btoa(localStorage.getItem("lastBook")),
      lastPage: localStorage.getItem("lastPage"),
      theme: localStorage.getItem("theme"),
      loginSite: window.location.href.indexOf("web.app") > -1 ? "web.app" : window.location.href.indexOf("vercel.app") > -1 ? "vercel.app" : "null"
    })
    localStorage.setItem("lastNotebook", localStorage.getItem("notebook"))
  }
}

//on auth state chage
auth.onAuthStateChanged(async user => {
  //on sign in
  if (user) {
    //basic stup
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

    let myDb
    //chek if online data avalible
    documentRef = collection(store,"userDocuments")
    const docSnap = await getDoc(doc(documentRef, user.uid));
    //exsts
    if (docSnap.exists()) {
      myDb = onSnapshot(doc(documentRef, user.uid), async (doc) => {
        //theme
        localStorage.setItem('theme', docSnap.data().theme || 'light')
        document.body.dataset.theme = localStorage.getItem('theme')
        document.querySelector('button[data-theme="' + localStorage.getItem('theme') + '"]').classList.add('active-theme')
        localStorage.setItem('loginSite', doc.data().loginSite)
        if (localStorage.getItem('lastEdited') == doc.data().lastEdited) {
          //do nothing
        } else {
          localStorage.setItem('notebook', atob(doc.data().books))
          localStorage.setItem('lastBook', atob(doc.data().lastBook))
          localStorage.setItem('lastPage', doc.data().lastPage)
          localStorage.setItem('lastEdited', doc.data().lastEdited)
          updateUiCode(localStorage.getItem("lastBook"), docSnap.data().lastPage)
          reloadFolder()
        }
      })
      //setup on window close
      window.addEventListener('beforeunload', function (e) {
        if (localStorage.getItem("notebook") !== localStorage.getItem("lastNotebook")) {
          // Cancel the event
          e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
          // Chrome requires returnValue to be set
          e.returnValue = '';
          updateDoc(doc(documentRef, localStorage.getItem('uid')), {
            books: btoa(localStorage.getItem("notebook")),
            lastEdited: timestamp(),
            lastBook: btoa(localStorage.getItem("lastBook")),
            lastPage: localStorage.getItem("lastPage"),
            theme: localStorage.getItem("theme")
          })
        }
        localStorage.setItem("lastNotebook", localStorage.getItem("notebook"))
      });
    } else {
      //if no cloud data
      //dont merge local data with oneline
      if (sessionStorage.getItem('dontMergeLocal') !== 'true') {
        setDoc(doc(documentRef, user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          books: btoa(localStorage.getItem("notebook")),
          lastEdited: timestamp(),
          lastBook: btoa(localStorage.getItem("lastBook")),
          lastPage: localStorage.getItem("lastPage"),
          theme: localStorage.getItem("theme")
        })
      } else {
        //make fresh online data
        let defaultBook = {
          "default book": [
            {
              name: "untitled",
              data: {ops: [{ insert: 'Type', attributes: { bold: true } },{ insert: ' to ' },{ insert: 'get started ...', attributes: { italic: true } }]}
            }	
          ]
        }
        localStorage.setItem('notebook', JSON.stringify(defaultBook))
        localStorage.setItem('lastBook', 'default book')
        localStorage.setItem('lastPage', 0)
        setDoc(doc(documentRef, user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          books: btoa(localStorage.getItem("notebook")),
          lastEdited: timestamp(),
          lastBook: btoa('default book'),
          lastPage: '0',
          theme: 'light'
        })
        location.reload()
      }
    }
    setInterval(()=>{
      updateDb()
    }, 1000)
    //setup share document
    const shareSnap = await getDoc(doc(shareRef, user.uid));
    //dosen't exists
    if (!shareSnap.exists()) {
      setDoc(doc(shareRef, user.uid), {
        uid: user.uid
      })
    }

    //last auth bit
    document.querySelectorAll(".auth-obj").forEach(e => {
      e.classList.remove("hide")
    })
    document.getElementById("share-btn").classList.remove("hide")
    localStorage.setItem('signInProvider', user.providerData[0].providerId)
    localStorage.setItem('signdIn', true)
  } else {
    // sign out/ no auth
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
    document.getElementById('share-btn').classList.add("hide")
  }
})
//delete data
document.getElementById("del-all").addEventListener("click", () => {
  vex.dialog.confirm({
    message: 'Are you sure you want to delete all your data? This cannot be undone with no chance of recovering.',
    callback: (ask) => {
      if (ask) {
        if (auth.currentUser) {
          deleteDoc(doc(documentRef, auth.currentUser.uid))
        }
        sessionStorage.setItem('passUnloadSave', true)
        sessionStorage.setItem('noAutoSave', true)
        localStorage.removeItem("notebook", "")
        localStorage.removeItem("lastBook", "")
        localStorage.removeItem("lastPage", "")
        localStorage.removeItem("lastNotebook", "")
        location.reload()
      }
    }
  })
})
//delete account
document.getElementById("req-del-account").addEventListener("click", () => {
  vex.dialog.confirm({
    message: 'Are you sure you want to delete your account? This cannot be undone with no chance of recovering.',
    callback: (ask) => {
      if (ask) {
        if (!localStorage.getItem('reqDelAccount')) {
          updateDoc(doc(documentRef, localStorage.getItem('uid')), {
            books: localStorage.getItem("notebook"),
            lastEdited: timestamp(),
            lastBook: localStorage.getItem("lastBook"),
            lastPage: localStorage.getItem("lastPage"),
            reqDelAccount: true,
            theme: localStorage.getItem("theme")
          })
          deleteUser(auth.currentUser).then(() => {
            vex.dialog.alert({
              message: 'Deleted your account',
              callback() {
                location.reload()
              }
            })
          }).catch((error) => {
            let errorCode = error.code
            let errorMessage = error.message
            vex.dialog.alert({
              message: errorCode + '\n\n' + errorMessage
            })
          });
        }
      }
    }
  })
})
// request passoword change
document.getElementById('reset-password').addEventListener('click', ()=>{
  if (document.getElementById('email-email').value === '' || document.getElementById('email-email').value === undefined) {
    vex.dialog.alert({
      message: 'please provide an email'
    })
  } else {
    sendPasswordResetEmail(auth, document.getElementById('email-email').value)
    .then(() => {
      vex.dialog.alert({
        message: 'password reset email sent, check your inbox (if not there check the spam folder)'
      })
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  }
})
//save button
document.getElementById("save-btn").addEventListener("click", () => {
  updateDb()
})
//backup stuff
document.getElementById("dl-data").addEventListener("click", () => {
  let data = localStorage.getItem("notebook")
  data = JSON.parse(data)
  data = {
    lastBook: localStorage.getItem("lastBook"),
    lastPage: localStorage.getItem("lastPage"),
    data: data
  }
  data = JSON.stringify(data)
  let blob = new Blob([data], {type: "text/plain;charset=utf-8"})
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
        data = JSON.parse(data)
        localStorage.setItem("notebook", JSON.stringify(data.data))
        localStorage.setItem("lastBook", data.lastBook)
        localStorage.setItem("lastPage", data.lastPage)
        sessionStorage.setItem('passUnloadSave', true)
        location.reload()
        updateUiCode(localStorage.getItem("lastBook"), localStorage.getItem("lastPage"))
      }
      reader.readAsText(file)
    }
  })
  document.getElementById("file-input").removeEventListener("change", () => {})
})
var reloadFolder = ()=>{}
export var reloadState = (callback) => {reloadFolder = callback}
//share stuff
document.getElementById("share-link").addEventListener("click", async () => {
  let data = localStorage.getItem("notebook")
  data = JSON.parse(data)
  data = data[localStorage.getItem("lastBook")][localStorage.getItem("lastPage")]
  let nameN = data.name
  let key
  if (!data.shareId) {
    data = JSON.stringify(data)
    //generate a key
    key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setDoc(doc(shareRef, auth.currentUser.uid), {
      books: {[key]: btoa(data)}
    }, {merge: true})
    data = localStorage.getItem("notebook")
    data = JSON.parse(data)
    data[localStorage.getItem("lastBook")][localStorage.getItem("lastPage")].shareId = key
    localStorage.setItem("notebook", JSON.stringify(data))
    reloadFolder()
  } else {
    key = data.shareId
    //check if the online one is the same as offline
    let online = await getDoc(doc(shareRef, auth.currentUser.uid))
    online = online.data()
    if (online.books[key] !== btoa(JSON.stringify(data))) {
      online = JSON.stringify(data)
      setDoc(doc(shareRef, auth.currentUser.uid), {
        books: {[key]: btoa(online)}
      }, {merge: true})
    }
  }
  document.getElementById('share-page-link').style.display = 'block' 
	document.getElementById('share-page-link').innerHTML = window.location.origin + "/share/#" + key + "-" + localStorage.getItem('uid')
	document.getElementById('share-page-name').innerHTML = nameN
  if (navigator.share) {
    navigator.share({
      title: nameN,
      text: "Check out my page",
      url: window.location.origin + "/share/#" + key + "-" + auth.currentUser.uid
    })
  } else {
    vex.dialog.alert({
      message: " Sharing is not supported yet, so here is the link to share: " + window.location.origin + "/share/#" + key + "-" + auth.currentUser.uid
    })
  }
})
//TODO: add delete share
document.getElementById("share-del").addEventListener("click", () => {
  let data = localStorage.getItem("notebook")
  data = JSON.parse(data)
  let key = data[localStorage.getItem("lastBook")][localStorage.getItem("lastPage")].shareId
  localStorage.setItem("notebook", JSON.stringify(data))
  reloadFolder()
  document.getElementById('share-page-link').style.display = 'none'
  document.getElementById('share-page-name').innerHTML = ""
  setDoc(doc(shareRef, auth.currentUser.uid), {
    books: {[key]: "undefined"}
  }, {merge: true})
  data[localStorage.getItem("lastBook")][localStorage.getItem("lastPage")].shareId = ""
})