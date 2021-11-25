import E from "wangeditor";

let editor: undefined | E;

function initEditor() {
  editor = new E("#editor");
  editor.config.menus = ["emoticon", "image"];
  editor.config.showMenuTooltips = false;
  editor.config.showFullScreen = false;
  editor.config.height = 200;
  editor.config.pasteTextHandle = filterPasteText;
  editor.create();
  return editor;
}

// 去除 tag
function filterPasteText(pasteStr: string) {
  const regex = /<\/?.+?\/?>/gm;
  return pasteStr.replace(regex, "");
}

export function clearContent() {
  return editor?.txt.clear();
}

export function getHTML() {
  return editor?.txt.html();
}

export default initEditor;
