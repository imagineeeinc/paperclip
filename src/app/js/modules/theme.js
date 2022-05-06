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
		if (window.process) {
			window.require('electron').ipcRenderer.send('theme', localStorage.getItem('theme'))
		}
	})
})
if (window.process) {
	window.require('electron').ipcRenderer.send('theme', localStorage.getItem('theme'))
}