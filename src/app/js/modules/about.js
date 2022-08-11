if (window.process) {
	document.getElementById('desktop-ver').innerHTML = 'v'+window.require('electron').remote.app.getVersion()
} else {
	document.querySelectorAll(".desk-obj").forEach(e => {
		e.style.display = 'none'
	})
}

fetch('https://api.github.com/repos/imagineeeinc/paperclip/releases/latest')
.then(res => {
	return res.json()
}).then((data) => {
	document.getElementById('app-ver').innerHTML = data.tag_name
	localStorage.setItem('appVersion', data.tag_name)
}).catch(err => {
	console.log(err)
	document.getElementById('app-ver').innerHTML = localStorage.getItem('appVersion')
})