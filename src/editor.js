/* Import TinyMCE */
import tinymce from 'tinymce';
import { html2pdf } from 'html2pdf.js';

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
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/emoticons/plugin';
import 'tinymce/plugins/emoticons/js/emojis';

/* Import premium plugins */
/* NOTE: Download separately and add these to /src/plugins */
/* import './plugins/checklist/plugin'; */
/* import './plugins/powerpaste/plugin'; */
/* import './plugins/powerpaste/js/wordimport'; */

/* Import the skin */
import 'tinymce/skins/ui/oxide/skin.css';

/* Import content css */
import contentUiCss from 'tinymce/skins/ui/oxide/content.css';
import contentCss from 'tinymce/skins/content/default/content.css';

/* Initialize TinyMCE */
export async function render() {
  const tiny = await tinymce.init({
    selector: 'textarea',
    plugins:
      'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help quickbars emoticons',
    menubar: 'file edit view insert format tools table help',
    toolbar:
      'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl | table customInsertButton',
    toolbar_mode: 'wrap',
    language: 'de',
    quickbars_selection_toolbar:
      'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    contextmenu: 'link image table',

    file_picker_types: 'image',
    file_picker_callback: function (cb) {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.onchange = function () {
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = function () {
          cb(reader.result, { title: file.name });
        };
        reader.readAsDataURL(file);
      };
      input.click();
    },

    setup: function (editor) {
      editor.on('init', function () {
        editor.insertContent("&nbsp;<strong>It's my button!</strong>&nbsp;");
      });

      editor.on('NodeChange', function () {
        // FileMaker.PerformScript('setHtmlText', editor.getContent());
      });

      editor.ui.registry.addButton('customInsertButton', {
        text: 'My Button',
        onAction: function (_) {
          createPDF();
          editor.insertContent("&nbsp;<strong>It's my button!</strong>&nbsp;");
        },
      });
    },

    // WEBPACK
    skin: false,
    content_css: false,
    content_style: contentUiCss.toString() + '\n' + contentCss.toString(),
  });

  function createPDF() {
    console.log(tinymce.get('myTextarea').getContent());
    console.log(tinymce.activeEditor.getContent());
    console.log(tiny[0].get('myTextarea').getContent());
    console.log(tiny[0].activeEditor.getContent());
    /*this is how we grab HTML form quill, but you can use other libraries.*/
    const html =
      '<div  class="ql-container ql-snow ql-editor" style="font-size: 16px; border: none">' +
      tiny[0].selection.getContent() +
      '</div>';
    /*convert html to PDF*/
    html2pdf()
      .from(html)
      .set({
        margin: [10, 20, 20, 10],
        filename: 'newfile.pdf',
        image: {
          type: 'jpeg',
          quality: 0.95,
        },
        html2canvas: {
          scale: 4,
        },
        jsPDF: {
          unit: 'mm',
          format: 'A4',
          orientation: 'portrait',
          compressPDF: 'true',
        },
      })
      .outputPdf()
      .then(function (pdf) {
        if (fmversion < 19) {
          const baseurl =
            'fmp' +
            (fmversion < 17 ? '' : fmversion) +
            '://$/' +
            fmfile +
            '?script=savePDF&param=';
          if (isWindows) {
            window.clipboardData.setData('Text', btoa(pdf));
            const url = baseurl + 'copy';
          } else {
            const url = baseurl + encodeURIComponent(btoa(pdf));
          }
          window.location.href = url;
        } else {
          console.log(pdf, html);
          FileMaker.PerformScript('savePDF', btoa(pdf));
        }
      });
  }
}
