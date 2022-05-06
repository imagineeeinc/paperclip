import '../css/main.css'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

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

const auth = getAuth(app);
auth.languageCode = 'en'
var googleAuth = new GoogleAuthProvider()
var githubAuth = new GithubAuthProvider()
var signin = (e) => {
  if(e === 'google') {
    signInWithPopup(auth, googleAuth)
    .then((result) => {
      document.getElementById('sign-btns').style.display = 'none'
			document.getElementById('datas').style.display = 'block'
			document.getElementById('data').value = btoa(JSON.stringify(result))
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
      document.getElementById('sign-btns').style.display = 'none'
			document.getElementById('datas').style.display = 'block'
			document.getElementById('data').value = btoa(JSON.stringify(result))
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
document.getElementById('google').addEventListener('click', () => {
	signin('google')
})
document.getElementById('github').addEventListener('click', () => {
	signin('github')
})