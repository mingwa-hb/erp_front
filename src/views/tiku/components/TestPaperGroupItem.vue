<template>
  <div class="group-section-box">
    <p class="group-section-nowrap" style="width: 100%;height: 30px;">
      <br />
    </p>
    <div v-if="groupScoreArea" class="group-pingfen-container">
      <table class="group-pingfen-table" style="border-collapse: collapse;border: 2px solid #333333;">
        <tr class="pingfen-row-tr">
          <td class="pingfen-row-td" style="width: 100px; border: 1px solid #333333;text-align: center;">得分</td>
          <td class="pingfen-row-td" style="width: 100px; border: 1px solid #333333;"></td>
        </tr>
        <tr class="pingfen-row-tr">
          <td class="pingfen-row-td" style="width: 100px; border: 1px solid #333333;text-align: center;">评分人</td>
          <td class="pingfen-row-td" style="width: 100px; border: 1px solid #333333;"></td>
        </tr>
      </table>
    </div>
    <div
      class="group-shiti-container"
      :class="{ 'shiti-border': !!showGroupActions }"
      @mouseover="handleGroupActions"
      @mouseout="handleGroupActions"
    >
      <div class="group-shiti-head">
        <h3 class="group-shiti-title">
          <span>{{ itemData.sortKey | getCapitalizeByNum }}、</span>
          <a-input v-if="editable" class="edit-input" :value="itemData.title" @change="handleChangeTtitle" />
          <span v-else>{{ itemData.title }}</span>
          <!-- <span>（共{{ itemData.score }}分）</span> -->
        </h3>
        <div class="group-shiti-actions" v-show="!!showGroupActions">
          <a-button size="small" type="link" @click="handleEidtGroupItemTitle">{{ editText }}</a-button>
          <a-button size="small" type="link" @click="handleMoveUp">上移</a-button>
          <a-button size="small" type="link" @click="handleMoveDwon">下移</a-button>
          <a-button size="small" type="link" @click="handleDeleteGroupItem">删除</a-button>
        </div>
      </div>
      <div class="group-shiti-list">
        <div class="group-shiti-wrap">
          <TestPaperGroupQuestionItem
            v-for="k in itemData.questionList"
            :key="k.sortKey"
            :init-data="k"
            @renovate="hanldeAfterAction"
            @doReplace="hanldeReplaceAction"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tikuApiList } from '@/api/api'
import TestPaperGroupQuestionItem from './TestPaperGroupQuestionItem'
export default {
  name: 'TestPaperGroupItem', //试卷的大题子项组件
  mixins: [],
  components: { TestPaperGroupQuestionItem },
  props: {
    initData: {
      type: Object,
      default: () => {
        return null
      },
      required: false
    },
    groupScoreArea: {
      type: Boolean,
      default: () => {
        return false
      },
      required: false
    }
  },
  data() {
    return {
      showGroupActions: false,
      itemData: Object.assign({}, this.initData),
      editable: false,
      editType: 'edit',
      editText: '编辑'
    }
  },
  computed: {
    paperId() {
      let res = (!!this.$route.query && this.$route.query.paperId) || undefined
      return res
    }
  },
  created() {},
  filters: {
    getCapitalizeByNum(num) {
      let res = undefined
      let chineseArr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      res = chineseArr[num * 1]
      return res
    }
  },
  watch: {
    initData: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.itemData = Object.assign({}, newV)
      }
    }
    // editable: {
    //   deep: true,
    //   immediate: true,
    //   handler(newV, oldV) {
    //     this.editText = !!newV ? '保存' : '编辑'
    //     this.editType = !!newV ? 'save' : 'edit'
    //   }
    // }
  },
  methods: {
    handleGroupActions() {
      this.showGroupActions = !this.showGroupActions
    },
    hanldeReplaceAction(data) {
      this.$emit('doReplace', data)
    },
    handleMoveUp() {
      let opts = {
        paperId: this.paperId,
        groupId: this.itemData.id,
        moveType: 1
      }
      this.moveTpGroupById(opts)
    },
    handleMoveDwon() {
      let opts = {
        paperId: this.paperId,
        groupId: this.itemData.id,
        moveType: 2
      }
      this.moveTpGroupById(opts)
    },
    hanldeAfterAction(data) {
      this.$emit('renovate', data)
    },
    handleChangeTtitle(e) {
      const value = e.target.value
      this.itemData.title = value
    },
    handleEidtGroupItemTitle() {
      let that = this
      this.editable = !this.editable
      if (this.editType == 'save') {
        this.handleEidtGroupTitle(res => {
          that.editType = 'edit'
          that.editText = '编辑'
          this.editable = false
        })
      } else {
        this.editType = 'save'
        this.editText = '保存'
        this.editable = true
      }
    },
    handleEidtGroupTitle(cb) {
      let opts = {
        id: this.itemData.id,
        paperId: this.paperId,
        title: this.itemData.title
      }
      this.editTpGroupTitleById(opts, cb)
    },
    handleDeleteGroupItem() {
      let that = this
      this.$confirm({
        title: '重要警告！',
        content: '确认从试卷中删除此大题吗?',
        onOk: () => {
          that.deleteTpGroupById()
        }
      })
    },
    editTpGroupTitleById(opts, cb) {
      if (!!opts.id) {
        tikuApiList.editTpGroupById(opts).then(res => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            this.$message.success(res.message || '修改大题标题成功！')
            cb && cb(res)
            setTimeout(() => {
              this.$emit('renovate', this.itemData)
            })
          } else {
            this.$message.error(res.message || '修改大题标题失败！')
          }
        })
      } else {
        this.$message.error('大题Id不存在，请联系开发人员！')
      }
    },
    moveTpGroupById(opts) {
      if (!!opts.groupId) {
        let moveText = opts.moveType == 1 ? '上移' : '下移'
        tikuApiList.moveTpGroupById(opts).then(res => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            this.$message.success(res.message || `大题${moveText}成功！`)
            setTimeout(() => {
              this.$emit('renovate', this.itemData)
            })
          } else {
            this.$message.error(res.message || `大题${moveText}失败！`)
          }
        })
      } else {
        this.$message.error('groupId不存在，请联系开发人员！')
      }
    },
    deleteTpGroupById() {
      let opts = {
        paperId: this.paperId,
        groupId: this.itemData.id
      }
      if (!!opts.groupId) {
        tikuApiList.deleteTpGroupById(opts).then(res => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            this.$message.success(res.message || '从试卷中删除成功！')
            setTimeout(() => {
              this.$emit('renovate', this.itemData)
            })
          } else {
            this.$message.error(res.message || '从试卷中删除失败！')
          }
        })
      } else {
        this.$message.error('groupId不存在，请联系开发人员！')
      }
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.group-section-box {
  padding: 0 10px;
  background-color: #ffffff;

  p.group-section-nowrap {
    width: 100%;
    height: 30px;
    margin: 0;
    padding: 0;
    font-size: 20px;
  }

  .group-pingfen-container {
    border-radius: 2px;

    .group-pingfen-table {
      border: 1px solid #e8e8e8;
      border-collapse: collapse;

      .pingfen-row-tr {
        .pingfen-row-td {
          width: 100px;
          padding: 5px;
          border: 1px solid #e8e8e8;
        }
      }
    }
  }

  .group-shiti-container {
    margin-top: 10px;
    padding-top: 5px;
    border: 1px solid transparent;

    .group-shiti-head {
      display: flex;
      cursor: pointer;

      .group-shiti-title {
        flex: 1 auto;
        font-size: 14px;
        font-weight: 600;

        .edit-input {
          display: inline-block;
          width: 50%;
        }
      }

      .group-shiti-actions {
        width: 240px;
        text-align: right;
      }
    }

    .group-shiti-list {
      .group-shiti-wrap {
        font-size: 14px;
      }
    }
  }

  .shiti-border {
    border: 1px solid #409eff;
  }
}
</style>
