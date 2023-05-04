export {};

declare global {
  interface Window {
    printPDF: () => void;
    setContent: (content: string) => string | undefined;
    runFmScript: (script: string, value?: string) => void;
  }
}
