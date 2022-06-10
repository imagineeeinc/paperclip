//Theme setter
if (localStorage.getItem('theme')) {
	document.body.dataset.theme = localStorage.getItem('theme')
} else {
	localStorage.setItem('theme', 'light')
}
document.querySelectorAll(".theme-btn").forEach(btn => {
	btn.addEventListener('click', () => {
		localStorage.setItem('theme', btn.dataset.theme)
		document.body.dataset.theme = btn.dataset.theme
		document.querySelectorAll(".theme-btn").forEach(btn => {
			btn.classList.remove('active-theme')
		})
		btn.classList.add('active-theme')
		document.querySelector('meta[name="theme-color"]').setAttribute('content', btn.dataset.theme === 'dark' ? '#0a131c' : btn.dataset.theme === 'black' ? '#000' : btn.dataset.theme === 'light' ? '#f0f8ff' : '#003b46')
		if (window.process) {
			window.require('electron').ipcRenderer.send('theme', localStorage.getItem('theme'))
		}
	})
})
if (window.process) {
	window.require('electron').ipcRenderer.send('theme', localStorage.getItem('theme'))
}
let t = localStorage.getItem('theme')
document.querySelector('meta[name="theme-color"]').setAttribute('content', t === 'dark' ? '#0a131c' : t === 'black' ? '#000' : t === 'light' ? '#f0f8ff' : '#003b46')