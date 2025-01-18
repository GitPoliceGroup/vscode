import * as vscode from "vscode";
import { randomBytes } from "crypto";
import path from "node:path";
import { ViewKey } from "./views";

const DEV_SERVER_HOST = "http://localhost:18080";

const template = (params: {
  csp: string;
  view: ViewKey;
  srcUri: string;
  publicPath: string;
  title: string;
  nonce: string;
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${params.title}</title>
    <meta http-equiv="Content-Security-Policy" content="${params.csp}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
    />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">
    <style>
      .vscode-dark {
        padding: 0px;
      }
      * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
      }
    </style>
  </head>

  <body style="padding: 0;" >
    <div id="root"></div>
    <script type="module" nonce="${params.nonce}">
      import { render } from "${params.srcUri}";
      render("${params.view}", acquireVsCodeApi(), "${params.publicPath}");
    </script>
  </body>
</html>
`;

const createView = async <V extends ViewKey>(
  ctx: vscode.ExtensionContext,
  viewId: V,
  options?: vscode.WebviewOptions
): Promise<vscode.WebviewView> => {
  return await new Promise((resolve, reject) => {
    let dispose: vscode.Disposable;
    try {
      const provider: vscode.WebviewViewProvider = {
        resolveWebviewView: (view, _viewCtx, _token) => {
          try {
            view.onDidDispose(() => {
              dispose.dispose();
            });
            view.webview.options = { ...options };
            resolve(view);
          } catch (err: unknown) {
            reject(err);
          }
        },
      };
      dispose = vscode.window.registerWebviewViewProvider(viewId, provider);
      ctx.subscriptions.push(dispose);
    } catch (err: unknown) {
      reject(err);
    }
  });
};

const setViewHtml = <V extends ViewKey>(
  ctx: vscode.ExtensionContext,
  viewId: V,
  webview: vscode.Webview
) => {
  const isProduction = ctx.extensionMode === vscode.ExtensionMode.Production;
  const nonce = randomBytes(16).toString("base64");

  const uri = (...parts: string[]) =>
    webview
      .asWebviewUri(vscode.Uri.file(path.join(ctx.extensionPath, ...parts)))
      .toString(true);

  const publicPath = isProduction ? uri() : `${DEV_SERVER_HOST}/`;
  const srcUri = isProduction ? uri("views.js") : `${DEV_SERVER_HOST}/views.js`;

  const csp = (
    isProduction
      ? [
          `form-action 'none';`,
          `default-src ${webview.cspSource};`,
          `script-src ${webview.cspSource} 'nonce-${nonce}';`,
          `style-src ${webview.cspSource} ${DEV_SERVER_HOST} 'unsafe-inline';`,
        ]
      : [
          `form-action 'none';`,
          `default-src ${webview.cspSource} ${DEV_SERVER_HOST};`,
          `style-src ${webview.cspSource} ${DEV_SERVER_HOST} 'unsafe-inline';`,
          `script-src ${webview.cspSource} ${DEV_SERVER_HOST} 'nonce-${nonce}';`,
          `connect-src 'self' ${webview.cspSource} ${DEV_SERVER_HOST} ws:;`,
        ]
  ).join(" ");

  webview.html = template({
    title: "RAiDer",
    csp,
    srcUri,
    publicPath,
    view: viewId,
    nonce,
  });
  return webview;
};

export const registerView = async <V extends ViewKey>(
  ctx: vscode.ExtensionContext,
  viewId: V
) => {
  const view = await createView(ctx, viewId, { enableScripts: true });
  setViewHtml(ctx, viewId, view.webview);
  return view;
};
