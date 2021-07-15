/**
 * 获取树状结构的数据
 *  By DongMM 
 *  Create at 2021/01/28
 */

import _ from 'lodash'

let mixin = {
  props: {
    initTreeData: {
      type: Array,
      default: () => {
        return []
      },
      required: true
    }
  },
  computed: {
    treeDataOrigin() {
      return this.initTreeData
    },
    selectList() {
      return this.filterTreeNodeByStatus()
    }
  },
  methods: {
    flattenTreeNodeList() {
      let flatten = _.flatMap(this.treeDataOrigin, (ele) => {
        if (!!ele.children && ele.children.length > 0) {
          return [ele].concat(ele.children)
        } else {
          return [ele]
        }
      });
      return flatten
    },
    filterTreeNodeByStatus(status = '1') {
      let flatten = this.flattenTreeNodeList();
      let res = _.filter(flatten, ['status', status]);
      return res
    },
    getTabsPanelItemDefaultTreeNodeKey() {
      let tree_data_len = this.selectList.length
      let default_tree_keys = tree_data_len > 0 ? [this.selectList[tree_data_len - 1].key] : []
      return default_tree_keys
    },
    getTreeNodeByKey(key) {
      let res = null;
      let flatten = this.flattenTreeNodeList();
      res = _.find(flatten, ['key', key]);
      return res
    }
  }
};

export default mixin;