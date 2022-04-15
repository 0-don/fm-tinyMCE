/* Import TinyMCE */
import tinymce from 'tinymce';
import html2pdf from 'html2pdf.js';

/* Default icons are required for TinyMCE 5.3 or above */
import 'tinymce/icons/default';

/* A theme is also required */
import 'tinymce/themes/silver';

/* A model is also required */
import 'tinymce/models/dom';

/* German language */
import './de';

/* Import plugins */
import 'tinymce/plugins/preview';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/save';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/code';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/media';
import 'tinymce/plugins/template';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/table';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/help';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/pagebreak';

/* Import the skin */
import 'tinymce/skins/ui/oxide/skin.css';

/* Import content css */
import contentUiCss from 'tinymce/skins/ui/oxide/content.css';
import contentCss from 'tinymce/skins/content/default/content.css';

/* Initialize TinyMCE */
export function render() {
  const runFmScript = (script, value) => {
    try {
      FileMaker.PerformScript(script, value);
    } catch (_) {}
  };

  tinymce.init({
    selector: 'textarea',
    plugins:
      'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help quickbars',
    menubar: 'file edit view insert format tools table help',
    toolbar:
      'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl | table getPDF downloadPDF setContent',
    toolbar_mode: 'wrap',

    quickbars_selection_toolbar:
      'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    contextmenu: 'link image table',

    // REMOVE THIS LINE TO CHANGE BACK TO DEFAULT ENGLISH
    language: process.env.LANGUAGE,
    //###################################################
    image_advtab: true,
    file_picker_types: 'image',
    file_picker_callback: (cb) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.onchange = function () {
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = function () {
          const id = 'blobid' + new Date().getTime();
          const blobCache = tinymce.activeEditor.editorUpload.blobCache;
          const base64 = reader.result.split(',')[1];
          const blobInfo = blobCache.create(id, file, base64);
          blobCache.add(blobInfo);
          cb(reader.result, { title: file.name });
        };
        reader.readAsDataURL(file);
      };
      input.click();
    },

    setup: (editor) => {
      editor.on('init', () => {
        console.log('editor Initialized');
        runFmScript('setContent', editor.getContent());
      });

      // editor.on('PreInit', function () {
      //   editor.editorUpload.addFilter(function (img) {
      //     console.log(!img.src.indexOf('data:image/svg+xml'))
      //     return false;
      //   });
      // });

      editor.ui.registry.addButton('getPDF', {
        text: 'Get PDF',
        onAction: getPDF,
      });
      editor.ui.registry.addButton('downloadPDF', {
        text: 'Download PDF',
        onAction: downloadPDF,
      });
      editor.ui.registry.addButton('setContent', {
        text: 'set Content',
        onAction: () => runFmScript('setContent', editor.getContent()),
      });
    },

    init_instance_callback: (editor) => {
      editor.on('input Change focusout', () =>
        runFmScript('getContent', editor.getContent())
      );
    },

    // WEBPACK
    skin: false,
    content_css: false,
    content_style: contentUiCss.toString() + '\n' + contentCss.toString(),
  });

  function createPDF() {
    const html = tinymce.activeEditor.getContent();

    /*convert html to PDF*/
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

  const getPDF = () => {
    const pdf = createPDF();
    pdf.outputPdf().then((pdf) => {
      console.log('pdf exported');
      runFmScript('savePDF', btoa(pdf));
    });
  };

  const downloadPDF = () => {
    const pdf = createPDF();
    console.log('pdf downlaoded');
    pdf.save();
  };

  const setContent = (content) => tinymce.activeEditor.setContent(content);

  window.getPDF = getPDF;
  window.setContent = setContent;
  window.runFmScript = runFmScript;
}
