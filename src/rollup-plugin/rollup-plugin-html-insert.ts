import * as fs from 'fs';
import { HTMLElement, TextNode, parse } from 'node-html-parser';
import { extname } from 'path';
import type {
  EmittedAsset,
  NormalizedOutputOptions,
  OutputAsset,
  OutputBundle,
  OutputChunk,
  Plugin,
} from 'rollup';
import type { RollupHtmlOptions, RollupHtmlTemplateOptions } from '../types';

const getFiles = (bundle: OutputBundle): RollupHtmlTemplateOptions['files'] => {
  const result = {} as ReturnType<typeof getFiles>;
  for (const file of Object.values(bundle)) {
    const { fileName } = file;
    const extension = extname(fileName).substring(1);

    result[extension] = (result[extension] || []).concat(file);
  }

  return result;
};

const getChildElement = (node: any, tag: any, append = true) => {
  let child = node.querySelector(tag);
  if (!child) {
    child = new HTMLElement(tag, {}, '', node, [0, 0]);
    if (append) {
      node.appendChild(child);
    } else {
      node.childNodes.unshift(child);
    }
  }
  return child;
};

const defaults = {
  entryFileNames: 'index.html',
  insert: 'code',
  publicPath: './',
  template: './public/index.html',
};

/**
 * html
 * @param opts.entryFileNames
 * @param opts.insert            code | path
 * @param opts.publicPath
 * @param opts.template          html
 * @returns html
 */
export function htmlInsert(opts: RollupHtmlOptions = {}): Plugin {
  const { template, insert, entryFileNames, publicPath } = Object.assign(
    defaults,
    opts
  );

  return {
    name: 'htmlInsert',

    async generateBundle(_: NormalizedOutputOptions, bundle: OutputBundle) {
      // let distDir = process.cwd()
      // const htmlFileName = path.resolve(distDir, path.basename(template))

      const htmlTpl = fs.readFileSync(template).toString();

      const doc = parse(htmlTpl, { comment: true });
      const html = doc.querySelector('html');
      if (!html) {
        this.error("The input template doesn't contain the `html`");
      }
      const head = getChildElement(html, 'head', false);
      const body = getChildElement(html, 'body');
      /** { js: [], css: [] } */
      const files = getFiles(bundle);
      // console.log('files', files)

      if (insert === 'path') {
        const scripts = files.js || [];
        for (let index = 0; index < scripts.length; index++) {
          const { fileName, name } = scripts[index];
          const entry = new HTMLElement(
            'script',
            { id: name },
            '',
            body,
            [0, 0]
          );
          entry.setAttribute('src', `${publicPath}${fileName}`);
          body.appendChild(entry);
        }
        const links = files.css || [];
        for (let index = 0; index < links.length; index++) {
          const { fileName, name } = links[index];
          const entry = new HTMLElement('link', { id: name }, '', head, [0, 0]);
          entry.setAttribute('href', `${publicPath}${fileName}`);
          entry.setAttribute('rel', 'stylesheet');
          head.appendChild(entry);
        }
      }

      // html
      if (insert === 'code') {
        const scripts = files.js || [];
        for (let index = 0; index < scripts.length; index++) {
          const { name, code } = (scripts as OutputChunk[])[index];
          const entry = new HTMLElement(
            'script',
            { id: name },
            '',
            body,
            [0, 0]
          );
          entry.appendChild(new TextNode(code, entry));
          body.appendChild(entry);
        }
        const links = files.css || [];
        for (let index = 0; index < links.length; index++) {
          const { source, name } = (links as OutputAsset[])[index];
          const entry = new HTMLElement(
            'style',
            { id: name },
            '',
            head,
            [0, 0]
          );
          entry.appendChild(new TextNode(source as string, entry));
          head.appendChild(entry);
        }
      }

      const source = doc.toString();
      const htmlFile: EmittedAsset = {
        type: 'asset',
        source,
        name: 'public_html',
        fileName: entryFileNames,
      };

      this.emitFile(htmlFile);
    },
  };
}
