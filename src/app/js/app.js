import { registerSW } from 'virtual:pwa-register'
const intervalMS = 60 * 60 * 1000

//PWA
if (import.meta.env.PROD) {
	const updateSW = registerSW({
		onRegistered(r) {
			r && setInterval(() => {
				r.update()
			}, intervalMS)
		},
		onNeedRefresh() {
			if (confirm('A new version of this app is available. Refresh?')) {updateSW()}
		},
		onOfflineReady() {},
	})
}

import '../css/main.css'
import {setContents, getContents, changeHandler, editorFocus, editMode} from './editor.js'
import {signin, signout, updateDb, updateUiCodeFn, reloadState } from './backend.js'
function timestamp() {return Math.floor(Date.now() / 1000)}

//Update Ui
function updateUi(book, page) {
	changeNotebook(book)
	switchPage(page)
}
var tree = document.getElementById('tree-view')
updateUiCodeFn((b,p) => {folder=JSON.parse(localStorage.getItem("notebook"));updateUi(b,p)})
window.updateUi = updateUi
//Micromodal setup
import MicroModal from 'micromodal';
MicroModal.init();
//setModalClass(MicroModal)
import * as vex from 'vex-js/dist/js/vex.combined.min.js'
import 'vex-js/dist/css/vex.css'
import 'vex-js/dist/css/vex-theme-top.css'
vex.defaultOptions.className = 'vex-theme-top'
//TODO: Vex styling dialog

//Load page
window.onload = () => setTimeout(()=>document.body.style.opacity=1,250)

var edit = true

//Defaults
var folder = {}
var curPage = 0
var curBook = 'default book'

//Save
changeHandler((eventName, ...args)=>{
	if (eventName === 'text-change') {
		folder[curBook][curPage].data = getContents()
	}
})
setInterval(() => {
	if (sessionStorage.getItem('noAutoSave') !== 'true') {
		localStorage.setItem('lastEdited', timestamp())
		localStorage.setItem('notebook', JSON.stringify(folder))
		updateDb()
	}
}, 5000)
window.onunload = () => {
	/* if (sessionStorage.getItem('passUnloadSave') !== 'true') {
		localStorage.setItem('lastBook', curBook)
		localStorage.setItem('lastPage', curPage)
		localStorage.setItem('notebook', JSON.stringify(folder))
		updateDb()
	} */
}
//Reload the date from local storage
if (localStorage.getItem('notebook')) {
	folder = JSON.parse(localStorage.getItem('notebook'))
	if (localStorage.getItem('lastBook')) {
		if (localStorage.getItem('lastPage')) {
			curPage = localStorage.getItem('lastPage')
			curBook = localStorage.getItem('lastBook')
		} else {
			curPage = 0
			curBook = localStorage.getItem('lastBook')
		}
	} else {
		let first = Object.keys(folder)[0]
		let firstBook = folder[first]
		curPage = 0
		curBook = first
	}
	updateUi(curBook, curPage)
} else {
	folder = {
		"default book": [
			{
				name: "untitled",
				data: {ops: [{ insert: 'Type', attributes: { bold: true } },{ insert: ' to ' },{ insert: 'get started ...', attributes: { italic: true } }]}
			}
		]
	}
	localStorage.setItem('notebook', JSON.stringify(folder))
	location.reload()
}
import {editorOpen} from './modules/swipeEditior.js'

// Share to script
window.addEventListener('DOMContentLoaded', () => {
	if (sessionStorage.getItem('inputData')) {
		setTimeout(() => {
			let data = sessionStorage.getItem('inputData')
			data = JSON.parse(data)
			folder[curBook].push({
				name: data.title,
				data: {ops: [{ insert: data.body }]}
			})
			curPage = Number.parseInt(curPage)+1
			updateUi(curBook, curPage)
			sessionStorage.removeItem('inputData')
		}, 2000)
	}
})

//Page Update
function changeNotebook(book) {
	curBook = book
	localStorage.setItem('lastBook', book)
	document.getElementById('book-name').value = book
	document.getElementById('book-name').dataset.pre = book
	updateTree()
}
function switchPage(page) {
	if (folder[curBook][curPage]) {
		curPage = page
	} else {
		page = 0
		curPage = page
	}
	localStorage.setItem('lastPage', page)
	setContents(folder[curBook][curPage].data)
  editorOpen(false)
	document.getElementById('cur-page').value = folder[curBook][curPage].name
	document.getElementById('cur-page').dataset.pre = folder[curBook][curPage].name
	//if (folder[curBook].length != 1) document.querySelector('.selected-page').classList.toggle('selected-page')
	document.querySelector('.selected-page').classList.toggle('selected-page')
	document.querySelector('.tree-item[data-num="' + page + '"]').classList.toggle('selected-page')
	editorFocus()
	if (folder[curBook][curPage].shareId) {
		document.getElementById('share-page-link').style.display = 'block' 
		document.getElementById('share-page-link').innerHTML = window.location.origin + "/share/#" + folder[curBook][curPage].shareId + "-" + localStorage.getItem('uid')
		document.getElementById('share-page-name').innerHTML = folder[curBook][curPage].name
	} else {
		document.getElementById('share-page-link').innerHTML = ''
		document.getElementById('share-page-name').innerHTML = ''
		document.getElementById('share-page-link').style.display = 'none'
	}
	document.title = folder[curBook][curPage].name + ' (' + curBook + ')'
}
function updateTree() {
	tree.innerHTML = ''
	if (folder[curBook]) {
	} else {
		curBook = Object.keys(folder)[0]
		curPage = 0
	}
	let books = folder[curBook]
	for (let i = 0; i < books.length; i++) {
		if (!books[i]) continue 
		let doc = document.createElement('li')
		doc.className = 'tree-item'
		doc.innerHTML = books[i].name
		doc.dataset.num = i
		doc.onclick = () => {
			switchPage(i)
		}
		doc.ondblclick = () => {
			document.getElementById("cur-page").focus()
		}
		if (curPage == i) {
			doc.classList.toggle('selected-page')
		}
		tree.appendChild(doc)
	}
	document.getElementById('book-select').innerHTML = ''
	for (let i = 0; i < Object.keys(folder).length; i++) {
		let doc = document.createElement('option')
		doc.innerHTML = Object.keys(folder)[i]
		doc.value = Object.keys(folder)[i]
		document.getElementById('book-select').appendChild(doc)
	}
	document.getElementById('book-select').value = curBook
}

//page controls
document.getElementById("cur-page").onchange = () => {
	let pre = document.getElementById('cur-page').dataset.pre
	let name = document.getElementById('cur-page').value
	folder[curBook][curPage].name = name
	document.getElementById('cur-page').dataset.pre = name
	updateUi(curBook, curPage)
}
document.getElementById("add-page-btn").onclick = () => {
	vex.dialog.prompt({
		message: 'Enter new page name:',
		placeholder: 'untitled',
		callback: (name) => {
			if (name) {
				folder[curBook].push({name: name, data: {ops: []}})
				updateUi(curBook, Object.keys(folder[curBook])[Object.keys(folder[curBook]).length - 1])
			}
		}
	})
}
document.getElementById("del-page-btn").onclick = () => {
	if (folder[curBook].length > 1) {
		vex.dialog.confirm({
			message: 'Are you sure you want to delete this page?',
			callback: function (ask) {
				if (ask) {
					folder[curBook].splice(curPage, 1)
					//document.querySelector('.tree-item[data-num="' + curPage + '"]').classList.toggle('selected-page')
					updateUi(curBook, curPage-1)
				}
			}
		})
	} else {
		vex.dialog.alert({
			message: 'You can\'t delete the last page!'
		})
	}
}

//book controls
document.getElementById("book-select").onchange = () => {
	let book = document.getElementById('book-select').value
	updateUi(book, 0)
}
document.getElementById("book-name").onchange = () => {
	let pre = document.getElementById('book-name').dataset.pre
	let name = document.getElementById('book-name').value
	folder[name] = folder[pre]
	delete folder[pre]
	updateUi(name, Object.keys(folder[name])[0])
}
document.getElementById("book-select").ondblclick = () => {
	document.getElementById("book-name").focus()
}
document.getElementById("add-book").onclick = () => {
	vex.dialog.prompt({
		message: 'Enter the name of the new book:',
		placeholder: 'untitled',
		callback: (name) => {
			if (name) {
				folder[name] = [{name: 'untitled', data: {ops: []}}]
				updateUi(name, 0)
			}
		}
	})
}
document.getElementById("del-book").onclick = () => {
	if (Object.keys(folder).length > 1) {
		vex.dialog.confirm({
			message: 'Are you sure you want to delete this book?',
			callback: function (ask) {
				if (ask) {
					delete folder[curBook]
					updateUi(Object.keys(folder)[0], 0)
				}
			}
		})
	} else {
		vex.dialog.alert({
			message: 'You can\'t delete the last book!'
		})
	}
}

//Buttons
document.getElementById("menu-btn").addEventListener('click', () => {
	editorOpen('opposite')
})
document.getElementById("settings-btn").addEventListener('click', () => {
	editorOpen(true)
	MicroModal.show('settings')
})
document.getElementById("account-btn").addEventListener('click', () => {
	editorOpen(true)
	MicroModal.show('account')
})
document.getElementById("edit-btn").addEventListener('click', () => {
	edit = !edit
	editMode(edit)
	if (edit) {
		document.getElementById("edit-btn").innerHTML = "edit_off"
		editorFocus()
	} else {
		document.getElementById("edit-btn").innerHTML = "edit"
	}
	editorOpen(false)
})
document.getElementById("signin-google").addEventListener('click', () => {
	signin('google')
})
document.getElementById("signin-github").addEventListener('click', () => {
	signin('github')
})
document.getElementById("signout-btn").addEventListener('click', () => {
	signout()
})
document.getElementById("share-btn").addEventListener('click', () => {
	MicroModal.show('share')
})

import './modules/installer.js'
import './modules/theme.js'

setTimeout(() => {
	if (window.location.href.indexOf("vercel.app") > -1) {
		let ask = confirm('Paperclip has moved to a new domain. Would you like us to auto switch to the new url.\n\nAlso if you have installed the app from the browser uninstall the old one and install the new one.')
		if (ask) {
			if (navigator.serviceWorker.controller) {
				navigator.serviceWorker.getRegistration().then(reg => {
					reg.unregister()
				})
			}
			if (localStorage.getItem('signdIn') == 'true') {
				updateDb()
				alert("We have automatically saved your data. Sign in to the same account once you are redirected to the new site.")
				window.open("https://paper-clip.web.app/app/#autoSignIn="+localStorage.getItem('signInProvider'))
			} else {
				window.open("https://paper-clip.web.app/app/")
			}
		}
	}
}, 2000)
if (window.location.href.indexOf('autoSignIn=google') > -1) {
	signin('google')
	window.location.href = window.location.href.replace('#autoSignIn=google.com', '')
} else if(window.location.href.indexOf('autoSignIn=github') > -1) {
	signin('github')
	window.location.href = window.location.href.replace('#autoSignIn=github.com', '')
}
reloadState(()=>{
	folder = JSON.parse(localStorage.getItem('notebook'))
})
if (!localStorage.getItem('signInProvider')) {
	MicroModal.show('account')
}