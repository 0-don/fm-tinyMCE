# Filemaker tinyMCE

realtime html generation + pdf export

tested on latest filemaker version 20.1.1.35 and webdirect

**suported languages are german or english it detects it via your browser language**

to add more languages go to `src/editor.js` line 50-52

you will need [nodejs](https://nodejs.org/en/) to build it

1.  npm install

    ```bash
    npm install
    ```

2.  build

    ```bash
    npm run build
    ```

3.  copy the content of the `dist` folder to your filemaker

    ```bash
    ./dist/index.html
    ```
