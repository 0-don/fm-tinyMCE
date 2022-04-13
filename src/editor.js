/* Import TinyMCE */
import tinymce from 'tinymce';
// import html2pdf from 'html2pdf.js';
import { jsPDF } from 'jspdf';

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
      'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl | table PDF newPDF',
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
        editor.insertContent(
          `<p style="text-align: right;"><br></p><p><span style="font-size: 36pt;">A</span></p><p><span style="font-size: 36pt;">BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB</span></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p><p><br></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p><p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==" width="100" height=50"></p><p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==" width="100" height=50"></p><p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==" width="100" height=50"></p><p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==" width="100" height=50"></p><p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==" width="100" height=50"></p><p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==" width="100" height=50"></p><p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==" width="100" height=50"></p><p><br></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p><p><br></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p><p><span style="font-size: 36pt;">AAAAAAAAAAAAAAAAAAA</span></p>`
        );
      });

      editor.on('NodeChange', function () {
        runFmScript('setHtmlText', editor.getContent());
      });

      editor.ui.registry.addButton('PDF', {
        text: 'Export PDF',
        onAction: function () {
          createPDF();
        },
      });
      editor.ui.registry.addButton('newPDF', {
        text: 'newPDF',
        onAction: function () {
          newPDF();
        },
      });
    },

    // WEBPACK
    skin: false,
    content_css: false,
    content_style: contentUiCss.toString() + '\n' + contentCss.toString(),
  });

  function newPDF() {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    console.log(
      tinymce.activeEditor.getBody().clientHeight,
      tinymce.activeEditor.getBody().clientWidth
    );

    doc.html(tinymce.activeEditor.getBody(), {
      callback: function (pdf) {
        // console.log(pdf.output('datauristring',  ));
        pdf.save();
        // runFmScript('savePDF', btoa(exportPDF));
      },

      autoPaging: 'text',
      margin: [10, 20, 20, 10],

      html2canvas: {
        allowTaint: true,
        useCORS: true,
        letterRendering: true,
        scale: 1,
      },
    });
  }

  // function createPDF() {
  //   const html = tinymce.activeEditor.getContent();

  //   /*convert html to PDF*/
  //   html2pdf()
  //     .from(html)
  //     .set({
  //       margin: [10, 20, 20, 10],
  //       filename: 'newfile.pdf',
  //       image: {
  //         type: 'jpeg',
  //         quality: 0.95,
  //       },
  //       html2canvas: {
  //         scale: 4,
  //       },
  //       jsPDF: {
  //         unit: 'mm',
  //         format: 'A4',
  //         orientation: 'portrait',
  //         compressPDF: 'true',
  //       },
  //     })
  //     .outputPdf()
  //     .then(function (pdf) {
  //       console.log('pdf printed', typeof pdf);
  //       pdf.save('newfile.pdf');
  //       runFmScript('savePDF', btoa(pdf));
  //     });
  // }

  window.newPDF = newPDF;
  // window.createPDF = createPDF;
}
