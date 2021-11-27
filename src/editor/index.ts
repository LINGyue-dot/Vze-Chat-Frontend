import E from "wangeditor";
import { CustomImg } from "@/editor/customImg";

let editor: undefined | E;
const customImg = "customImg";

function initEditor(imgCb: () => {}) {
  editor = new E("#editor");
  // 挂载到静态变量
  // @ts-ignore
  CustomImg.cb = imgCb;
  editor.menus.extend(customImg, CustomImg);
  editor.config.menus = ["emoticon", "customImg"];
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
  return (editor?.txt.html() as string)
    .replaceAll("<img", "<a-image")
    .replaceAll("</img>", "</a-image>");
}

export function addImg(imgUrl: string) {
  return editor?.txt.append(`<img class="input-img" src="${imgUrl}" />`);
}

export default initEditor;
