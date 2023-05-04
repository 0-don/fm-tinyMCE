/* Import TinyMCE */
import html2pdf from 'html2pdf.js';
import tinymce from 'tinymce';

/* Default icons are required. After that, import custom icons if applicable */
import 'tinymce/icons/default';

/* Required TinyMCE components */
import 'tinymce/models/dom';
import 'tinymce/themes/silver';

/* Import a skin (can be a custom skin instead of the default) */
import 'tinymce/skins/ui/oxide/skin.css';

/* Import plugins */
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';

import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/template';

import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';

import contentCss from 'tinymce/skins/content/default/content.css';
import contentUiCss from 'tinymce/skins/ui/oxide/content.css';

/* content UI CSS is required */

declare namespace FileMaker {
  function PerformScript(script: string, value?: string): void;
}
/* The default content CSS can be changed or replaced with appropriate CSS for the editor content. */
const runFmScript = (script: string, value?: string) => {
  try {
    FileMaker.PerformScript(script, value);
  } catch (_) {}
};

/* Initialize TinyMCE */
export function render() {
  tinymce.init({
    //tinymce binding area
    selector: 'textarea',

    // plugins available from tinyMCE
    plugins:
      'importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help quickbars',
    menubar: 'edit view insert format tools table',

    // plugin order & button order
    toolbar:
      'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap | fullscreen  save print | insertfile image link anchor codesample | ltr rtl | table printPdf downloadPDF | myCustomScript | setContent getContent', // 'file edit view insert format tools table help',

    toolbar_mode: window.innerHeight <= 500 ? 'sliding' : 'wrap',
    quickbars_selection_toolbar:
      'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    contextmenu: 'link image table',

    // REMOVE THIS LINE TO CHANGE BACK TO DEFAULT ENGLISH
    // language: window.navigator.userLanguage || window.navigator.language,
    //###################################################

    //image proccesing base64 + drag & drop
    image_advtab: true,
    file_picker_types: 'image',
    file_picker_callback: (cb) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.onchange = function () {
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function () {
          const id = 'blobid' + new Date().getTime();
          const blobCache = tinymce.activeEditor?.editorUpload.blobCache;
          const base64 = (reader.result as string)?.split(',')[1];
          const blobInfo = blobCache?.create(id, file, base64);
          if (!blobInfo) return;
          blobCache?.add(blobInfo);
          cb(reader.result as string, { title: file.name });
        };
        reader.readAsDataURL(file);
      };
      input.click();
    },

    setup: (editor) => {
      // function runs on tinymce initializiation, set to Fullscreen & set tinyMCE content if there is any
      editor.on('init', () => {
        console.log('editor Initialized');
        editor.execCommand('mceFullScreen');
        runFmScript('setContent', editor.getContent());
      });

      // !important insert created button into toolbar e.g. printPdf
      editor.ui.registry.addButton('printPdf', {
        text: 'Print PDF',
        onAction: printPDF,
      });

      // !important insert created button into toolbar e.g. downloadPDF
      editor.ui.registry.addButton('downloadPDF', {
        text: 'Download PDF',
        onAction: downloadPDF,
      });

      // !important insert created button into toolbar e.g. myCustomScript
      editor.ui.registry.addButton('myCustomScript', {
        text: 'My Custom Script',
        onAction: () => {
          runFmScript('myCustomScript');
        },
      });

      // !important insert created button into toolbar e.g. setContent
      editor.ui.registry.addButton('setContent', {
        text: 'set Content',
        onAction: () => runFmScript('setContent', editor.getContent()),
      });

      // !important insert created button into toolbar e.g. getContent
      editor.ui.registry.addButton('getContent', {
        text: 'get Content',
        onAction: () => runFmScript('getContent', editor.getContent()),
      });
    },

    // realtime update on editor change
    init_instance_callback: (editor) => {
      editor.on('input Change focusin', () =>
        runFmScript('getContent', editor.getContent())
      );
    },

    // WEBPACK config
    skin: false,
    content_css: false,
    content_style: contentUiCss.toString() + '\n' + contentCss.toString(),
  });
}

function createPDF() {
  // get current tinymce html content
  const html = tinymce.activeEditor?.getContent();

  /*convert html to PDF as DIN A4 hopefully*/
  return html2pdf()
    .from(html)
    .set({
      margin: [10, 20, 20, 10],
      image: {
        type: 'jpeg',
        quality: 0.95,
      },
      html2canvas: {
        scale: 4,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'A4',
        orientation: 'portrait',
        compressPDF: 'true',
      },
    });
}

//creates pdf from content converts to base64 sends it to filemaker which puts it in to a container
const printPDF = () => {
  const pdf = createPDF();
  pdf.outputPdf().then((pdf: string) => {
    console.log('pdf printed');
    runFmScript('savePDF', btoa(pdf));
  });
};

// downloads created pdf in the webvieweres browser => location: default browser download
const downloadPDF = () => {
  const pdf = createPDF();
  console.log('pdf downloaded');
  pdf.save();
};

// set external content (fm) to tinyMCE editor
const setContent = (content: string) =>
  tinymce.activeEditor?.setContent(content);

//make script globally available for filemaker else filemaker wont find the script in the webviewer

window.printPDF = printPDF;
window.setContent = setContent;
window.runFmScript = runFmScript;
