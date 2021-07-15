<template>
  <div class="basket-popconfirm">
    <a-popconfirm placement="left" @confirm="confirm" trigger="hover" :getPopupContainer="node => node.parentNode">
      <span slot="icon"></span>
      <template slot="title">
        <div class="test-content-box">
          <div class="test-title-box" style="font-size: 20px" v-html="itemData.title"></div>
          <div class="test-opts-list" v-if="questionType == 1 || questionType == 2">
            <div class="test-opts-box" v-for="(item, index) in optionsListData" :key="index">
              <span class="test-opts-bs" style="font-size: 20px">{{ item.sort | getCharsByNum }}.</span>
              <div class="test-opts-item" style="font-size: 20px" v-html="item.optionContent"></div>
            </div>
          </div>
        </div>
      </template>
      <div class="basket-list-test-item-control">
        <div class="test-item-desc" v-html="itemData.title"></div>
        <a-icon type="close" @click="handleDeleteTestItem" />
      </div>
    </a-popconfirm>
  </div>
</template>

<script>
import TYPELIST from './../data/test_data'
import { tikuApiList } from '@/api/api'
export default {
  name: 'TestBasketQuestionItem', //大题下的小题子组件
  mixins: [],
  components: {},
  props: {
    initData: {
      type: Object,
      default: () => {
        return {}
      },
      required: false
    },
    questionType: {
      type: String,
      default: () => {
        return undefined
      },
      required: false
    }
  },
  data() {
    return {
      showTestList: false,
      itemData: Object.assign({}, this.initData)
    }
  },
  computed: {
    paperId() {
      let res = (!!this.$route.query && this.$route.query.paperId) || undefined
      return res
    },
    optionsListData() {
      let res = []
      res =
        !!this.itemData && !!this.itemData.optionList && this.itemData.optionList.length > 0
          ? this.itemData.optionList
          : []
      return res
    }
  },
  created() {},
  filters: {
    getCharsByNum(val) {
      let charsArr = TYPELIST.CHARS_TYPE_LIST
      let res = charsArr[val - 1]
      if (res == undefined) {
        return
      }
      return res.label
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
  },
  methods: {
    handleShowTestList() {
      this.showTestList = !this.showTestList
    },
    confirm() {
      console.log('留点痕迹--唵嘛呢叭咪吽')
    },
    handleDeleteTestItem() {
      let that = this
      this.$confirm({
        title: '重要警告！',
        content: '确认从试题篮中删除此小题吗?',
        onOk: () => {
          that.deleteTpQuestionById()
        }
      })
    },
    deleteTpQuestionById() {
      let opts = {
        paperId: this.paperId,
        paperQuestionId: this.itemData.id
      }
      if (!!opts.paperQuestionId) {
        tikuApiList.deleteTpQuestionById(opts).then(res => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            this.$message.success(res.message || '从试题篮中删除成功！')
            setTimeout(() => {
              this.$emit('renovate', this.itemData)
            })
          } else {
            this.$message.error(res.message || '从试题篮中删除失败！')
          }
        })
      } else {
        this.$message.error('paperQuestionId不存在，请联系开发人员！')
      }
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.basket-popconfirm {
  .basket-list-test-item-control {
    display: flex;
    padding: 5px 0;
    cursor: pointer;

    .test-item-desc {
      flex: 1;
      margin-bottom: 0;
      padding-top: 5px;
      font-size: 10px;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .anticon {
      width: 30px;
      padding-top: 8px;
      color: #409eff;
    }
  }

  .ant-popover {
    .ant-popover-content {
      .ant-popover-message {
        .ant-popover-message-title {
          padding-left: 0;
          .test-content-box {
            width: 510px;

            .test-opts-list {
              overflow: hidden;

              .test-opts-box {
                float: left;
                display: flex;
                margin-right: 20px;

                .test-opts-bs {
                  width: 20px;
                  font-size: 14px;
                }

                .test-opts-item {
                  flex: 1 auto;
                  display: inline-block;
                  margin-left: 10px;
                }
              }
            }

            p,
            span {
              font-size: 20px;
              font-weight: 400;
            }

            p {
              margin: 0;
              padding: 0;
            }
          }
        }
      }
    }
  }

  /deep/.ant-popover .ant-popover-content .ant-popover-buttons {
    display: none;
  }
}
</style>
