document.addEventListener('keydown', (e) => {
	let key = e.key.toLowerCase()
	if (key == 's' && e.ctrlKey) {
		e.preventDefault()
		if (localStorage.getItem('signdIn') == 'true') {
			updateDb()
		}
	}
	if (e.altKey && key == 'arrowleft') {
		e.preventDefault()
		if (Object.keys(folder)[Object.keys(folder).indexOf(curBook) - 1]) {
			curBook = Object.keys(folder)[Object.keys(folder).indexOf(curBook) - 1]
			updateUi(curBook, 0)
		}
	}
	if (e.altKey && key == 'arrowright') {
		e.preventDefault()
		if (Object.keys(folder)[Object.keys(folder).indexOf(curBook) + 1]) {
			curBook = Object.keys(folder)[Object.keys(folder).indexOf(curBook) + 1]
			updateUi(curBook, 0)
		}
	}
	if (e.altKey && key == 'arrowup') {
		e.preventDefault()
		if (Object.keys(folder[curBook]).indexOf(curPage) - 1 >= 0) {
			curPage = Object.keys(folder[curBook])[Object.keys(folder[curBook]).indexOf(curPage) - 1]
			updateUi(curBook, curPage)
		}
	}
	if (e.altKey && key == 'arrowdown') {
		e.preventDefault()
		if (Object.keys(folder[curBook]).indexOf(curPage) + 1 < Object.keys(folder[curBook]).length) {
			curPage = Object.keys(folder[curBook])[Object.keys(folder[curBook]).indexOf(curPage) + 1]
			updateUi(curBook, curPage)
		}
	}
})