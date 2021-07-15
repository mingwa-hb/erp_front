import {
  saveAs
} from 'file-saver'

import $ from 'jquery'

/**
 * jQ 导出html为word：WPS无法默认横向，默认分栏暂不支持WPS；office默认横向分栏在styles中无法使用，需在html中设置
 * @param {上下文} context 
 * @param {文件名称} fileName 
 * @param {其他参数} params 
 */
export function jqWordExport(context, fileName, params) {
  fileName = typeof fileName !== 'undefined' ? fileName : "jQuery-Word-Export";
  let htmlStatic = {
    mhtml: {
      top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" xmlns:m=\"http://schemas.microsoft.com/office/2004/12/omml\" xmlns=\"http://www.w3.org/TR/REC-html40\">\n_html_</html>",
      head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:TrackMoves>false</w:TrackMoves><w:TrackFormatting/><w:ValidateAgainstSchemas/><w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid><w:IgnoreMixedContent>false</w:IgnoreMixedContent><w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText><w:DoNotPromoteQF/><w:LidThemeOther>EN-US</w:LidThemeOther><w:LidThemeAsian>ZH-CN</w:LidThemeAsian><w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript><w:Compatibility><w:BreakWrappedTables/><w:SnapToGridInCell/><w:WrapTextWithPunct/><w:UseAsianBreakRules/><w:DontGrowAutofit/><w:SplitPgBreakAndParaMark/><w:DontVertAlignCellWithSp/><w:DontBreakConstrainedForcedTables/><w:DontVertAlignInTxbx/><w:Word11KerningPairs/><w:CachedColBalance/><w:UseFELayout/></w:Compatibility><w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel><m:mathPr><m:mathFont m:val=\"Cambria Math\"/><m:brkBin m:val=\"before\"/><m:brkBinSub m:val=\"--\"/><m:smallFrac m:val=\"off\"/><m:dispDef/><m:lMargin m:val=\"0\"/> <m:rMargin m:val=\"0\"/><m:defJc m:val=\"centerGroup\"/><m:wrapIndent m:val=\"1440\"/><m:intLim m:val=\"subSup\"/><m:naryLim m:val=\"undOvr\"/></m:mathPr></w:WordDocument></xml><![endif]-->\n<style>\n_styles_\n</style>\n</head>\n",
      body: "<body>_body_</body>"
    }
  };
  // Clone selected element before manipulating it
  let markup = $(context).clone();

  // Remove hidden elements from the output
  markup.each(function () {
    var self = $(context);
    if (self.is(':hidden'))
      self.remove();
  });


  // Prepare bottom of mhtml file with image data
  let mhtmlBottom = "\n";
  mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

  //TODO: load css from included stylesheet
  // styles设置为空：WPS无法默认横向，默认分栏暂不支持WPS；office默认横向分栏在styles中无法使用，需在html中设置
  let styles = "html,body{width:100%;height:100%;}input::-ms-clear,input::-ms-reveal{display:none;}*,*::before,*::after{-webkit-box-sizing:border-box;box-sizing:border-box;}html{font-family:sans-serif;line-height:1.15;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;-ms-overflow-style:scrollbar;-webkit-tap-highlight-color:rgba(0,0,0,0);}@-ms-viewport{width:device-width;}article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block;}hr{-webkit-box-sizing:content-box;box-sizing:content-box;height:0;overflow:visible;}h1,h2,h3,h4,h5,h6{margin-top:0;margin-bottom:0.5em;color:rgba(0,0,0,0.85);font-weight:500;}p{margin-top:0;margin-bottom:1em;}table{border-collapse:collapse;}th{text-align:inherit;}.binding-line-wrap{width:100%;}.binding-line-wrap img{width:120px;height:100%;}.shiti-item-control{margin:0;padding-bottom:0;}.shiti-item-control *{white-space: pre;}.shiti-item-control p{margin:0;padding-bottom:0;}.shiti-item-control .shiti-item-content .shiti-contents{font-size:14px;text-align:left;}.shiti-item-control .shiti-item-content .shiti-contents .shiti-score{font-size:14px;}.shiti-item-control .shiti-item-content table.shiti-opts-list{border:0px solid #e8e8e8;overflow:hidden;}.shiti-item-control .shiti-item-content table.shiti-opts-list tr.shiti-opts-row td.shiti-opts-col .shiti-opts-bs{font-size:14px;}.shiti-item-control .shiti-item-content table.shiti-opts-list tr.shiti-opts-row td.shiti-opts-col .shiti-opts-item{margin-left:0;}.shiti-item-control .shiti-item-content table.shiti-opts-list tr.shiti-opts-row td.shiti-opts-col .shiti-opts-item p{margin:0;padding:0;font-size:14px;font-weight:400;}.shiti-item-control .shiti-item-content table.shiti-opts-list tr.shiti-opts-row td.shiti-opts-col .shiti-opts-item span{font-size:14px;font-weight:400;}.shiti-item-control .shiti-item-content p,.shiti-item-control .shiti-item-content span{font-size:14px;font-weight:400;}.shiti-item-control .shiti-item-content p{margin:0;padding:0;}.group-section-box{padding:0 10px;background-color:#ffffff;}.group-section-box p.group-section-nowrap{width:100%;height:3em;margin:0;padding:0;font-size:14px;}.group-section-box .group-pingfen-container{border-radius:2px;}.group-section-box .group-pingfen-container .group-pingfen-table{border:2px solid #e8e8e8;border-collapse:collapse;}.group-section-box .group-pingfen-container .group-pingfen-table .pingfen-row-tr .pingfen-row-td{width:100px;padding:5px;border:1px solid #e8e8e8;}.group-section-box .group-shiti-container{margin-top:0;border:1px solid transparent;}.group-section-box .group-shiti-container .group-shiti-head .group-shiti-title{font-size:14px;font-weight:600;}.group-section-box .group-shiti-container .group-shiti-list .group-shiti-wrap{font-size:14px;}.page-section-main{margin-left:10px;padding:20px 5px 10px 5px;border-radius:10px;background-color:#ffffff;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view{position:relative;min-height:1000px;overflow:hidden;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-side{position:absolute;left:10px;top:0;width:120px;height:100%;margin:0 auto;z-index:99;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body{position:relative;padding-left:20px;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .paper-base-info{padding:0px 10px;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .paper-base-info h1,.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .paper-base-info h3{text-align:center;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .paper-base-info h1{font-size:24px;font-weight:bold;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .paper-base-info h3{font-size:20px;font-weight:500;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .paper-base-info .stu-info-box{text-align:center;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .paper-base-info .stu-info-box p .info-label{padding:0 5px;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .paper-base-info .stu-info-box p .info-input{display:inline-block;min-width:200px;margin-right:10px;text-align:left;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .paper-base-info .stu-info-box p .info-input img{height:1px;margin-top:10px;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .paper-base-info .note-attention-box p{font-size:14px;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .paper-base-info .note-attention-box p .space{padding:0 5px;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .paper-base-info .note-attention-box .note-title{letter-spacing:10px;font-size:16px;font-weight:bold;text-align:center;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .group-score-box{border-radius:2px;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .group-score-box .group-score-table{border:1px solid #e8e8e8;border-collapse:collapse;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .group-score-box .group-score-table .score-row-tr .score-row-td{width:140px;padding:5px;border:1px solid #e8e8e8;}.page-section-main .WordSection1 .page-main-wrap .page-main-scroll_view .page-main-body .paper-shiti-list{overflow:hidden;}";

  // Aggregate parts of the file together

  let isShowBindLineStyle = "";
  if (!!params.bindLine) {
    isShowBindLineStyle = "mso-title-page:yes;}"
  } else {
    isShowBindLineStyle = "mso-title-page:no;}"
  }
  let WordSection1Styles = `@page WordSection1{size:1190.55pt 841.89pt;mso-page-orientation:landscape;margin:72pt 81pt 72pt 108pt;mso-columns:2 even 30.25pt;mso-header:url('../exportHead/header.htm') h1;${isShowBindLineStyle}div.WordSection1{page:WordSection1;}`;

  styles = styles + WordSection1Styles
  let fileContent = htmlStatic.mhtml.top.replace("_html_", htmlStatic.mhtml.head.replace("_styles_", styles) + htmlStatic.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;

  // Create a Blob with the file contents
  let blob = new Blob([fileContent], {
    type: "application/msword;charset=utf-8"
  });
  saveAs(blob, fileName + ".doc");
}