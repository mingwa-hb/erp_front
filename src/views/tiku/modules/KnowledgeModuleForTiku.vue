<template>
  <div class="knowledge-tree-container">
    <a-tree show-line :load-data="onLoadData" :tree-data="treeData" :replaceFields="replaceFields" @select="onSelect">
      <a-icon slot="switcherIcon" type="down" />
      <template slot="custom" slot-scope="record">
        <span class="tree-node-title">{{ record.content }}</span>
      </template>
    </a-tree>
  </div>
</template>

<script>
import { tikuApiList } from '@/api/api'
import { getAction } from '../../../api/manage'
export default {
  name: 'KnowledgeModuleForTiku',
  props: {
    workType: {
      type: String,
      default: undefined,
      required: true
    }
  },
  data() {
    return {
      queryForm: {
        parent: undefined,
        workTypeId: this.workTypeId
      },
      worktypeLevelTypeList: [],
      replaceFields: { children: 'children', title: 'content', key: 'id', isLeaf: 'hasChild' },
      treeData: [],
      url: {
        queryKnowledgeTree: '/mw-exam/erp/exam/mwExamKnowledge/queryKnowledgeTree'
      }
    }
  },
  created() {
    //初始化tree
    this.initTree()
  },
  watch: {
    workType(newV, oldV) {
      !!newV && this.getWorklevelTypeList(newV)
    },
    worktypeLevelTypeList: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.treeData = [
          {
            children: [],
            content: '全部',
            hasChild: false,
            id: null,
            level: undefined,
            workTypeId: undefined
          }
        ]
        if (!!newV && newV.length > 0) {
          for (let i = 0; i < newV.length; i++) {
            const element = newV[i]
            const obj = {
              children: [],
              content: element.workLevel,
              hasChild: true,
              id: null,
              level: undefined,
              workTypeId: element.id
            }
            this.treeData.push(obj)
          }
        }
      }
    }
  },
  methods: {
    onSelect(keys, e) {
      // console.log('Trigger Select', keys, e)
      this.$emit('doChangeSelected', e.node.dataRef)
    },
    async onLoadData(treeNode) {
      // console.log(treeNode)
      if (!!treeNode.dataRef.hasChild) {
        let parent
        if (!!treeNode.dataRef.id) {
          parent = treeNode.dataRef.id
        } else {
          parent = 0
        }
        let workTypeId = treeNode.dataRef.workTypeId
        // const res = await tikuApiList.getKnowledgeTree(opts)
        getAction(this.url.queryKnowledgeTree + '/' + parent + '/' + workTypeId).then(res => {
          console.log(res)
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            let resp = res.result
            // console.log(resp)
            // this.treeData = resp
            treeNode.dataRef.children = resp
            this.treeData = [...this.treeData]
          } else {
            this.$message.error(res.message || '知识点请求失败！')
          }
        })
      } else {
        this.$message.info('别点了，已经是最后一级了！')
      }
    },
    getKdTreeListData(opts) {
      if (!!opts.workTypeId) {
        tikuApiList.getKnowledgeTree(opts).then(res => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            let resp = res.result
            // console.log(resp)
            // this.treeData = resp
          } else {
            this.$message.error(res.message || '知识点请求失败！')
          }
        })
      } else {
        this.$message.error('workTypeId参数不存在，请联系开发人员！')
      }
    },
    getWorklevelTypeList(workType) {
      let opts = {
        workType: workType
      }
      tikuApiList.getWorkLevelByWorkType(opts).then(res => {
        if (res.code == 200 && !!res.success) {
          // this.$message.success(res.message || '新增成功！')
          this.worktypeLevelTypeList = res.result
        } else {
          this.$message.error(res.message || '获取工种等级列表失败！')
        }
      })
    },
    initTree() {
      this.getWorklevelTypeList(this.workType)
    }
  }
}
</script>
<style lang="less" scoped>
.knowledge-tree-container {
  .ant-tree {
    overflow: hidden;
  }
}
</style>
