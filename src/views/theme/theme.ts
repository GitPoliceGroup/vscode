import { Button } from "@mui/material";
import styled from "@emotion/styled";
import createTheme from "@mui/material/styles/createTheme";

const recognizedFonts = [
  "var(--vscode-font-family)",
  "sans-serif",
  "serif",
  "monospace",
];

function formatFonts(fonts: string[]): string {
  return fonts
    .map((it) => (recognizedFonts.includes(it) ? it : `"${it}"`))
    .join(", ");
}

export const fontArray = formatFonts([
  "Inter",
  "Montserrat",
  "Roboto",
  "sans-serif",
  "var(--vscode-font-family)",
]);

export const ThemeButton = styled(Button)(() => ({
  fontFamily: fontArray,
}));

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    error: { main: "#d32f2f" },
  },
  typography: {
    fontFamily: fontArray,
    fontSize: 12, //px,
    fontWeightLight: 300,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
  spacing: (value: number) => `${value}rem`,
  components: {
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
        disableFocusRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});
