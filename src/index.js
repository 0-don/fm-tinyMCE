import * as editor from './editor';

function editorArea() {
  const element = document.createElement('textarea');
  return element;
}

function addStyle() {
  const element = document.createElement('style');
  element.innerText = `
   .tox-tinymce {
      height: 98vh !important;
    }
   `;
  return element;
}

document.head.appendChild(addStyle());
document.body.appendChild(editorArea());

editor.render();
