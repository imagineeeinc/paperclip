import '../css/main.css'
import {setContents, getContents, changeHandler, editorFocus} from './editor.js'

var folder = {}
var curPage = 'untitled'
var curBook = 'default book'
var tree = document.getElementById('tree-view')
if (localStorage.getItem('notebook')) {
	folder = JSON.parse(localStorage.getItem('notebook'))
	if (localStorage.getItem('lastBook')) {
		if (localStorage.getItem('lastPage')) {
			setContents(folder[localStorage.getItem('lastBook')][localStorage.getItem('lastPage')])
			curPage = localStorage.getItem('lastPage')
			curBook = localStorage.getItem('lastBook')
		} else {
			setContents(folder[localStorage.getItem('lastBook')][Object.keys(folder[localStorage.getItem('lastBook')])[0]])
			curPage = Object.keys(localStorage.getItem('lastBook'))[0]
			curBook = localStorage.getItem('lastBook')
		}
	} else {
		let first = Object.keys(folder)[0]
		let firstBook = folder[first]
		let firstPage = firstBook[Object.keys(firstBook)[0]]
		console.log(firstPage)
		setContents(firstPage)
		curPage = Object.keys(firstBook)[0]
		curBook = first
	}
	updateUi(curBook, curPage)
} else {
	folder = {
		"default book": {
			"untitled": {ops: [{ insert: 'Type', attributes: { bold: true } },{ insert: ' to ' },{ insert: 'get started ...', attributes: { italic: true } }
				]
			}				
		}
	}
	localStorage.setItem('notebook', JSON.stringify(folder))
	location.reload()
}

function updateUi(book, page) {
	changeNotebook(book)
	switchPage(page)
}
function changeNotebook(book) {
	curBook = book
	localStorage.setItem('lastBook', book)
	document.getElementById('book-name').value = book
	document.getElementById('book-name').dataset.pre = book
	updateTree()
}
function switchPage(page) {
	curPage = page
	localStorage.setItem('lastPage', page)
	setContents(folder[curBook][curPage])
	editorFocus()
	document.getElementById('cur-note').value = page
	document.getElementById('cur-note').dataset.pre = page
}
function updateTree() {
	let tree = document.getElementById('tree-view')
	tree.innerHTML = ''
	let books = Object.keys(folder[curBook])
	for (let i = 0; i < books.length; i++) {
		let doc = document.createElement('li')
		doc.className = 'tree-item'
		doc.innerHTML = books[i]
		doc.dataset.name = books[i]
		doc.onclick = () => {
			switchPage(books[i])
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
}
document.getElementById("cur-note").onchange = () => {
	let pre = document.getElementById('cur-note').dataset.pre
	let name = document.getElementById('cur-note').value
	folder[curBook][pre] = getContents()
	folder[curBook][name] = folder[curBook][pre]
	delete folder[curBook][pre]
	updateUi(curBook, name)
}
function updateBookName(prename, name) {}

changeHandler((eventName, ...args)=>{
	if (eventName === 'text-change') {
		folder[curBook][curPage] = getContents()
	}
})
setInterval(() => localStorage.setItem('notebook', JSON.stringify(folder)), 5000)

window.onunload = () => {
	localStorage.setItem('lastBook', curBook)
	localStorage.setItem('lastPage', curPage)
	localStorage.setItem('notebook', JSON.stringify(folder))
}