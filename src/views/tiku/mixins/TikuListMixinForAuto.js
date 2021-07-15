/**
 * 试题管理的mixin
 */
import tikuListMixin from './TikuListMixin'

let mixin = Object.assign({}, tikuListMixin)

//重新tikuListMixin——methods下的formatTypeListData方法
let _thisMixinMethods = {
  formatTypeListData: (originArr) => {
    let res = [{
      id: 0,
      itemText: "全部",
      itemValue: "0" //智能组卷中添加题型弹框里的“全部”传值为“0”（字符串0）
    }]
    let len = originArr.length;
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        let obj = originArr[i]
        res.push({
          id: i + 1,
          itemText: obj.itemText,
          itemValue: obj.itemValue
        })
      }
    }
    return res
  }
}

mixin.methods = Object.assign({}, mixin.methods, _thisMixinMethods)

export default mixin;