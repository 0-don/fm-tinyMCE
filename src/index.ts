import * as editor from './editor';

const editorArea = () => {
  const element = document.createElement('textarea');
  element.id = 'editor';
  return element;
};

const parent = document.createElement('p');
parent.appendChild(editorArea());
document.body.appendChild(parent);

editor.render();
