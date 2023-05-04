import type { OutputAsset, OutputBundle, OutputChunk } from 'rollup';

export interface RollupHtmlTemplateOptions {
  title: string;
  attributes: Record<string, any>;
  publicPath: string;
  meta: Record<string, any>[];
  bundle: OutputBundle;
  files: Record<string, (OutputChunk | OutputAsset)[]>;
}

export interface RollupHtmlOptions {
  title?: string;
  attributes?: Record<string, any>;
  fileName?: string;
  meta?: Record<string, any>[];
  publicPath?: string;
  template?: (templateoptions?: RollupHtmlTemplateOptions) => string;
}

