# open-abap-gui-example

Simple dynpro example program in abapGit format, rendered in the browser with [open-abap-gui](https://github.com/open-abap/open-abap-gui).

`src/` holds the program `ZGUI_EXAMPLE` with screen 0100. The flow logic is in `zgui_example.prog.screen_0100.abap`.

```sh
npm install
npm run lint     # abaplint
npm run express  # convert, transpile and serve
```

Then open http://localhost:3000 for the workbench, or http://localhost:3000/program?name=ZGUI_EXAMPLE to start the program directly.

## Browser tests

The Playwright tests in `tests/` start transaction `ZGUI_EXAMPLE` from the workbench, enter a name and press Save. They serve the transpiled output, so build first:

```sh
npx playwright install chromium
npm run build
npm test             # starts express.mjs, runs the tests
npm run test:report  # opens the HTML report with traces, screenshots and videos
```
