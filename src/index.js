import * as editor from './editor';

function editorArea() {
  const element = document.createElement('textarea');
  return element;
}

function addStyle() {
  const element = document.createElement('style');
  element.innerText = `
   .tox-tinymce {
      height: 100% !important;
    }
    html, body {
      height: 99%;
    }
   `;
  return element;
}

document.head.appendChild(addStyle());
document.body.appendChild(editorArea());

editor.render();
