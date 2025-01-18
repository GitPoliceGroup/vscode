import { createRoot } from "react-dom/client";
import { WebviewApi, WithWebviewContext } from "./WebviewContext";
import { Sidebar } from "./Sidebar";
// import { Terminal } from "./Terminal";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { theme } from "./theme/theme";

export const Views = {
  raiderChat: Sidebar,
  // raiderTerminal: Terminal,
} as const;

export type ViewKey = keyof typeof Views;

export function render<V extends ViewKey>(
  key: V,
  vscodeApi: WebviewApi,
  publicPath: string,
  rootId = "root"
) {
  const container = document.getElementById(rootId);
  if (!container) {
    throw new Error(`Element with id of ${rootId} not found.`);
  }

  __webpack_public_path__ = publicPath;

  const Component: React.ComponentType = Views[key];

  const root = createRoot(container);

  root.render(
    <WithWebviewContext vscodeApi={vscodeApi}>
      <ThemeProvider theme={theme}>
        <Component />
      </ThemeProvider>
    </WithWebviewContext>
  );
}
