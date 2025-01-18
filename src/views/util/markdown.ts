import markdownit from "markdown-it";
import hljs from "highlight.js"; // https://highlightjs.org

let preStyleField = ` style="background-color: #000; padding: 20px; border-radius: 10px; max-width: 100%; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -pre-wrap; word-wrap: break-word; word-break: keep-all;"`;
let codeStyleField = ` style="background-color: #000; max-width: 100%; text-wrap: wrap;"`;

export const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,

  // TODO: Customize to execution.
  highlight: function (str, lang): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<pre${preStyleField}><code class="hljs"${codeStyleField}>` +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        );
      } catch (__) {}
    }

    return (
      `<pre${preStyleField}><code class="hljs"${codeStyleField}>` +
      md.utils.escapeHtml(str) +
      "</code></pre>"
    );
  },
});

import Shiki from "@shikijs/markdown-it";
import MarkdownIt from "markdown-it";

export async function Markdown() {
  const md = MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  md.use(
    await Shiki({
      themes: {
        light: "vitesse-light",
        dark: "vitesse-dark",
      },
    })
  );

  return md;
}
