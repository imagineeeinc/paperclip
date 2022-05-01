import './style.css'

document.getElementById("start").addEventListener("click", ()=>{
	window.location.href += "app/"
});

const parsedUrl = new URL(window.location);
var searchParam = parsedUrl.searchParams
if (searchParam.get('page')) {
	let data = {
		title: searchParam.get('page'),
		body: searchParam.get('body')
	}
	sessionStorage.setItem('inputData', JSON.stringify(data))
	window.location.href = "app/"
}