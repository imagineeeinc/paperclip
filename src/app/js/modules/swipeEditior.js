var menuOpen = false
export function editorOpen(l) {
	if (l == true) {
		document.getElementById("editor-box").classList.add("move-side")
		menuOpen = true
	} else if (l == 'opposite') {
		menuOpen = !menuOpen
		if (menuOpen) {
			document.getElementById("editor-box").classList.add("move-side")
		} else {
			document.getElementById("editor-box").classList.remove("move-side")
		}
	} else {
		document.getElementById("editor-box").classList.remove("move-side")
		menuOpen = false
	}
}


let touchstartX = 0
let touchendX = 0

function handleGesture() {
  if (touchendX - touchstartX > 100) {editorOpen(true)}
	if (touchendX - touchstartX < -100) {editorOpen(false)}
}

document.getElementById("editor-box").addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
})

document.getElementById("editor-box").addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  handleGesture()
})

document.getElementById("editor-box").addEventListener('click', e => {
	editorOpen(false)
})
