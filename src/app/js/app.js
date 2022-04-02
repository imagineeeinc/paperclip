import '../css/main.css'
import {setContents, getContents, changeHandler, editorFocus} from './editor.js'
var menuOpen = false
var folder = {}
var curPage = 0
var curBook = 'default book'
var tree = document.getElementById('tree-view')
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
	setContents(folder[curBook][curPage].data)
    if (menuOpen == true) {
        document.getElementById("editor-box").classList.toggle("move-side")
        menuOpen = false

    }
	editorFocus()
	document.getElementById('cur-note').value = folder[curBook][curPage].name
	document.getElementById('cur-note').dataset.pre = folder[curBook][curPage].name
	if (folder[curBook].length != 1) document.querySelector('.selected-page').classList.toggle('selected-page')
	document.querySelector('.tree-item[data-num="' + page + '"]').classList.toggle('selected-page')
}
function updateTree() {
	let tree = document.getElementById('tree-view')
	tree.innerHTML = ''
	let books = folder[curBook]
	for (let i = 0; i < books.length; i++) {
		let doc = document.createElement('li')
		doc.className = 'tree-item'
		doc.innerHTML = books[i].name
		doc.dataset.num = i
		doc.onclick = () => {
			switchPage(i)
		}
		doc.ondblclick = () => {
			document.getElementById("cur-note").focus()
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
document.getElementById("cur-note").onchange = () => {
	let pre = document.getElementById('cur-note').dataset.pre
	let name = document.getElementById('cur-note').value
	folder[curBook][curPage].name = name
	document.getElementById('cur-note').dataset.pre = name
	updateUi(curBook, curPage)
}
document.getElementById("book-name").onchange = () => {
	let pre = document.getElementById('book-name').dataset.pre
	let name = document.getElementById('book-name').value
	folder[name] = folder[pre]
	delete folder[pre]
	updateUi(name, Object.keys(folder[name])[0])
}
document.getElementById("add-page-btn").onclick = () => {
	let name = prompt('Enter the name of the new page:')
	if (name) {
		folder[curBook].push({name: name, data: {ops: []}})
		updateUi(curBook, Object.keys(folder[curBook])[Object.keys(folder[curBook]).length - 1])
	}
	updateUi(curBook, folder[curBook].length - 1)
}
document.getElementById("del-page-btn").onclick = () => {
	if (folder[curBook].length > 1) {
		let ask = confirm('Are you sure you want to delete this page?')
		if (ask) {
			delete folder[curBook][curPage];
			document.querySelector('.tree-item[data-num="' + Object.keys(folder[curBook])[0] + '"]').classList.toggle('selected-page')
			updateUi(curBook, Object.keys(folder[curBook])[0])
		}
	} else {
		alert("You can't delete the last page")
	}
}
document.getElementById("book-select").onchange = () => {
	let book = document.getElementById('book-select').value
	updateUi(book, 0)
}
document.getElementById("book-select").ondblclick = () => {
	document.getElementById("book-name").focus()
}
document.getElementById("add-book").onclick = () => {
	let name = prompt('Enter the name of the new book:')
	if (name) {
		folder[name] = [{name: 'untitled', data: {ops: []}}]
		updateUi(name, 0)
	}
}
document.getElementById("del-book").onclick = () => {
	if (Object.keys(folder).length > 1) {
		let ask = confirm('Are you sure you want to delete this book?')
		if (ask) {
			delete folder[curBook]
			updateUi(Object.keys(folder)[0], 0)
		}
	} else {
		alert('You cannot delete the last book')
	}
}

changeHandler((eventName, ...args)=>{
	if (eventName === 'text-change') {
		folder[curBook][curPage].data = getContents()
	}
})
setInterval(() => localStorage.setItem('notebook', JSON.stringify(folder)), 5000)

window.onunload = () => {
	localStorage.setItem('lastBook', curBook)
	localStorage.setItem('lastPage', curPage)
	localStorage.setItem('notebook', JSON.stringify(folder))
}

document.getElementById("menu-btn").addEventListener('click', () => {
	document.getElementById("editor-box").classList.toggle("move-side")
    menuOpen = !menuOpen
})
