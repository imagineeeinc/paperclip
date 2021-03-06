import '../css/main.css'
import Quill from 'quill'
var quill = new Quill('#viewer', {
	theme: 'snow',
	modules: {
		syntax: true,
		toolbar: [],
	},
	placeholder: 'Type to get started...',
});
quill.enable(false)

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";

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
let shareRef = collection(store,"shares")

window.addEventListener('DOMContentLoaded', async () => {
	if (window.location.href.indexOf("#") > -1) {
		let url = window.location.href.split("#")[1]
		let key = url.split("-")[0]
		let uid = url.split("-")[1]
		let online = await getDoc(doc(shareRef, uid))
		let data = online.data().books[key]
		if (data == undefined || data == "undefined") {
			document.getElementById('name').innerHTML = "Unknown Page"
			quill.setContents(
				{
					ops:[
							{
								insert: 'Hmm, seems like ther is no page here...'
							}
					]
				}
			)
		} else {
			data = JSON.parse(atob(data))
			document.getElementById('name').innerHTML = data.name
			quill.setContents(data.data)
		}
	}
})