import {
  saveAs
} from 'file-saver'
import htmlDocx from 'html-docx-js/dist/html-docx';

// 生成下载链接
export function createDownloadLink(fileObj, fileName) {
  let link = document.createElement("a");
  link.href = URL.createObjectURL(fileObj);
  link.download = fileName || "document.docx";
  link.appendChild(document.createTextNode("如果没有自动下载，点这里"));
  return link;
};

// 导出 word 文档
export function exportDocx(htmlStr, htmlCss, fileName) {
  // 克隆报告HTML
  //let contentDocument = $.clone(this.$refs.report);
  fileName = !!fileName ? fileName : "试卷.docx"
  let contentDocument = document.createElement('div');
  contentDocument.innerHTML = htmlStr;
  convertImagesToBase64(contentDocument);
  convertChartsToBase64(contentDocument);
  //var reportCss = require("raw-loader!./xxx.css.txt");

  let content = `<!DOCTYPE html><html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                  <style>
                    ${htmlCss}
                </style>
            </head>
            <body>
                ${contentDocument.innerHTML}
            </body>
            </html>`;
  // console.log(content);
  let converted = htmlDocx.asBlob(content, {
    orientation: 'landscape',
    margins: {
      top: 960,
      right: 720,
      bottom: 960,
      left: 720,
      header: 720,
      footer: 720,
      gutter: 0
    }
  });
  saveAs(converted, fileName);
  let link = createDownloadLink(converted, fileName);

  document.body.appendChild(link)
};

// 转换图片为 base64 (todo: 有可能因跨域报错)
export function convertImagesToBase64(contentDocument) {
  // 找到所有的图片
  let imgs = contentDocument.querySelectorAll("img");

  // 图片转换用
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  imgs.forEach((img, i) => {
    if (img.src.startsWith("data:image")) return;

    // img表现尺寸
    let realWidth = parseInt(img.style.width);
    let realHeight = parseInt(img.style.height);

    // 清空画布并调整为 img 的大小
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = realWidth;
    canvas.height = realHeight;

    // 画图片到画布
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      realWidth,
      realHeight
    );
    // ctx.drawImage(img, 0, 0);

    // 画布转为 base64
    let dataURL = canvas.toDataURL();
    // img.setAttribute("src", dataURL);
  });

  canvas.remove();
};

export function convertChartsToBase64(contentDocument) {
  // 找到所有的图表 （echart）
  let canvases = contentDocument.querySelectorAll("canvas");

  // 遍历图表，转换为 base64 静态图片
  canvases.forEach((canvas, i) => {
    let echart = this.$refs.chart[i];
    let url = echart.getDataURL();
    let img = document.createElement("img");
    img.src = url;
    canvas.parentNode.replaceChild(img, canvas);
  });
};