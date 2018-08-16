import katex from "katex";
import marked, { Renderer } from "marked";
import highlightjs from "highlight.js";
import "katex/dist/katex.css";
import mermaid from "mermaid";
mermaid.initialize({});

function highlightCode(code, language) {
  const validLang = !!(language && highlightjs.getLanguage(language));
  const highlighted = validLang
    ? highlightjs.highlight(language, code).value
    : code;
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
}

const renderer = new Renderer();
renderer.code = (code, language) => {
  switch (language) {
    case "mermaid":
      return `<pre class="mermaid">${code}</pre>`;
    case "katex":
      return katex.renderToString(code, { displayMode: true });
    default:
      return highlightCode(code, language);
  }
};

renderer.codespan = text => {
  if (text[0] === "$" && text[text.length - 1] === "$")
    return katex.renderToString(text.substr(1, text.length - 2), {
      displayMode: false
    });
  return "<code>" + text + "</code>";
};

marked.setOptions({ renderer: renderer, kaTex: katex });

export default function render(markdown) {
  try {
    let result = marked(markdown);
    setTimeout(() => mermaid.init(), 50);
    return result;
  } catch (e) {
    return `<pre><code>${e.message}\nSource:\n${markdown}</code></pre>`;
  }
}
