<template>
  <a-card class="tabs-panel-item" @click.native.prevent.stop="doCheckModule" :loading="loading">
    <h2>{{ moduleTitle }}</h2>
    <div class="tree-wrap-container">
      <a-tree
        blockNode
        default-expand-all
        :show-line="showLine"
        :default-selected-keys="defaultSelectedNode"
        :selected-keys="curSelectedTreeNode"
        @select="onSelectTreeNode"
      >
        <a-tree-node v-for="item in initTreeData" :key="item.key">
          <a-icon type="dash" :style="{ color: '#055df1' }" slot="switcherIcon"></a-icon>
          <template slot="title">
            <span class="tree-node-title">{{ item.title }}</span>
            <span class="tree-node-count">
              <span
                class="count-number"
                :class="{ 'is-click': item.status == '1', 'is-selected': defaultSelectedNode[0] == item.key }"
              >
                {{ item.count }}
              </span>
              <a-icon
                type="check"
                class="is-selected"
                :style="{ visibility: defaultSelectedNode[0] == item.key ? 'visible' : 'hidden' }"
              />
            </span>
          </template>
          <template v-if="!!item.children && item.children.length > 0">
            <a-tree-node v-for="ele in item.children" :key="ele.key">
              <a-icon type="dash" :style="{ color: '#055df1' }" slot="switcherIcon"></a-icon>
              <template slot="title">
                <span class="tree-node-title">{{ ele.title }}</span>
                <span class="tree-node-count">
                  <span
                    class="count-number"
                    :class="{ 'is-click': ele.status == '1', 'is-selected': defaultSelectedNode[0] == ele.key }"
                  >
                    {{ ele.count }}
                  </span>
                  <a-icon
                    type="check"
                    class="is-selected"
                    :style="{ visibility: defaultSelectedNode[0] == ele.key ? 'visible' : 'hidden' }"
                  />
                </span>
              </template>
            </a-tree-node>
          </template>
        </a-tree-node>
      </a-tree>
    </div>
  </a-card>
</template>

<script>
import MixinJpdSelectList from '../mixins/JpdSelectList'
export default {
  name: 'TabsPanelItem', //工作计划看板页面
  mixins: [MixinJpdSelectList],
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    moduleTitle: {
      type: String,
      default: '未知模块',
      required: true
    },
    moduleType: {
      type: String,
      default: '',
      required: true
    },
    initTreeData: {
      type: Array,
      default: () => {
        return []
      },
      required: true
    },
    defaultSelectedNode: {
      type: Array,
      default: () => {
        let tree_data_len = this.initTreeData.length
        let default_tree_keys = tree_data_len > 0 ? [this.initTreeData[tree_data_len - 1].key] : []
        return default_tree_keys
      },
      required: false
    }
  },
  data() {
    return {
      showLine: true //是否显示tree的线
    }
  },
  computed: {
    treeDataOrigin() {
      //不能删，用于构造筛选框的下拉数据
      return this.initTreeData
    },
    curSelectedTreeNode() {
      return this.defaultSelectedNode
    }
  },
  created() {},
  methods: {
    updateDefaultSelectedNode(value) {
      this.$emit('update:default-selected-node', value)
    },
    onSelectTreeNode(value, node, e) {
      // console.log(value, node, e)
      let targetObj = this.getTreeNodeByKey(value[0])
      if (targetObj.status == '1') {
        this.updateDefaultSelectedNode(value)
      } else {
        // this.$message.info('暂无详细数据，无法点击查看！')
        let default_tree_keys = this.getTabsPanelItemDefaultTreeNodeKey()
        this.updateDefaultSelectedNode(default_tree_keys)
      }
    },
    doCheckModule(e) {
      // console.log(e)
      let data = { moduleTitle: this.moduleTitle, moduleType: this.moduleType }
      if (e.target.nodeName != 'SPAN') {
        let default_tree_keys = this.getTabsPanelItemDefaultTreeNodeKey()
        this.onSelectTreeNode(default_tree_keys)
      }
      this.$emit('onSelectedModule', data)
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.tabs-panel-item {
  cursor: pointer;
  h2 {
    text-align: center;
    font-size: 18px;
    font-weight: bolder;
  }
  /deep/.ant-tree li span.ant-tree-switcher {
    background: transparent;
  }
  /deep/.ant-tree.ant-tree-show-line li:not(:last-child)::before {
    left: 5px;
    height: 100%;
    margin: 12px 0 0 0;
    border-left: 1px dashed #055df1;
  }
  /deep/.ant-tree-title {
    display: flex;
    width: 100%;
    .tree-node-title {
      flex: 1;
    }
    .tree-node-count {
      display: inline-block;
      flex: 1;
      text-align: right;
      span.count-number {
        padding-right: 20px;
        cursor: auto;
      }
      span.is-click {
        color: #055df1;
        cursor: pointer;
      }
      span.is-selected {
        color: #f70404;
      }
      .is-selected {
        font-size: 12px;
        color: #f70404;
      }
    }
  }
}
.tabs-panel-item:hover {
  background-color: #fafafa;
}
</style>
