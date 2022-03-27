import Quill from 'quill'
var toolbarOptions = [
  [{ 'font': [] },'bold', 'italic', 'underline', 'strike', 'link',{ 'color': [] }, { 'background': [] }],
	[{ 'header': 1 }, { 'header': 2 }], 
	[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

	['blockquote', 'code-block', { 'script': 'sub'}, { 'script': 'super' }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }, { 'align': [] }],

  ['clean']
];
var quill = new Quill('#editor', {
	theme: 'snow',
	modules: {
		toolbar: toolbarOptions
	},
	placeholder: 'Type to get started...',
});