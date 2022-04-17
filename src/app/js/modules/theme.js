document.querySelectorAll(".theme-btn").forEach(btn => {
	btn.addEventListener('click', () => {
		localStorage.setItem('theme', btn.dataset.theme)
		document.body.dataset.theme = btn.dataset.theme
		document.querySelectorAll(".theme-btn").forEach(btn => {
			btn.classList.remove('active-theme')
		})
		btn.classList.add('active-theme')
	})
})