var modalClass = null
export function setModalClass(theclass) {
	modalClass = theclass
}
export function tell(text, title, buttonTxt) {
	document.getElementById("alert-title").innerHTML = title || "Paperclip says"
	document.getElementById("alert-text").innerHTML = text
	document.getElementById("alert-cancel").classList.add("hide")
	document.getElementById("alert-input").classList.add("hide")
	modalClass.show('alert')
}
export function ask(text, title, buttonTxt, cancelTxt) {
	modalClass.show('alert')
}
export function getAns(text, title, egTxt, buttonTxt, cancelTxt) {
	modalClass.show('alert')
}