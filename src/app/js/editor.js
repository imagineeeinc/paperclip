var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike',{ 'color': [] }, { 'background': [] }],
	[{ 'header': 1 }, { 'header': 2 }], 
	[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

	['link','image','blockquote', { 'script': 'sub'}, { 'script': 'super' }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }, { 'align': [] }],

  ['clean']
];
import Quill from 'quill'
import QuillMarkdown from 'quilljs-markdown'

var quill = new Quill('#editor', {
	theme: 'snow',
	modules: {
		syntax: true,
		toolbar: toolbarOptions,
		history: {
      delay: 500,
      maxStack: 500,
      userOnly: true
    }
	},
	placeholder: 'Type to get started...',
});
new QuillMarkdown(quill)
quill.focus()
document.getElementById("undo-btn").onclick = () => quill.history.undo()
document.getElementById("redo-btn").onclick = () => quill.history.undo()

export var setContents = (contents) => {
	quill.setContents(contents)
}
export var getContents = () => {
	return quill.getContents()
}
export var changeHandler = (handler) => {
	quill.on('editor-change', handler);
}
export var editorFocus = () => {
	quill.focus()
}
export var editMode = (edit) => {
	quill.enable(edit)
}
