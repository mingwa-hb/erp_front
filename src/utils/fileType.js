/**
 * 判断文件格式
 * created by dong in 2021、03、29
 */

const IMG_TYPE_LIST = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
const TEXT_TYPE_LIST = ['txt'];
const EXCEL_TYPE_LIST = ['xls', 'xlsx'];
const WORD_TYPE_LIST = ['doc', 'docx'];
const PDF_TYPE_LIST = ['pdf'];
const PPT_TYPE_LIST = ['ppt', 'pptx'];
const VIDEO_TYPE_LIST = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v'];
const AUDIO_TYPE_LIST = ['mp3', 'wav', 'wmv'];

export const getFileType = (filePath) => {
  let suffix = undefined; // 后缀获取
  try {
    const index = filePath.lastIndexOf(".");
    suffix = filePath.substr(index + 1);
  } catch (err) {
    suffix = undefined;
  }
  // fileName无后缀返回 false
  if (!suffix) {
    return false;
  }

  suffix = suffix.toLocaleLowerCase();
  return suffix;
}