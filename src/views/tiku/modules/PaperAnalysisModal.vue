<template>
  <a-modal
    :title="title"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleOk"
    class="modal-container"
  >
    <div class="table-list-warp">
      <div class="table-list-wrap_view">
        <div class="table-list-caption">
          <a-row class="table-caption-head">
            <a-col :span="4">题型</a-col>
            <a-col :span="4">题号</a-col>
            <a-col :span="4">难易程度</a-col>
            <a-col :span="12">知识点</a-col>
          </a-row>
        </div>
        <div class="table-list-body">
          <a-row v-for="item in tableListData" :key="item.sort">
            <a-col :span="4" class="col-group">
              <h3>{{ item.questionTypeStr }}</h3>
            </a-col>
            <a-col :span="20" class="col-question-list">
              <a-row
                v-for="(ele, index) in item.questionList"
                :key="ele.sortKey"
                :class="{ 'no-bottom': index == item.questionList.length - 1 }"
              >
                <a-col :span="5">
                  {{ ele.sortKey }}
                </a-col>
                <a-col :span="5">
                  {{ ele.hardLevelStr }}
                </a-col>
                <a-col :span="14">
                  <p class="col-kownledge-content">{{ ele.knowledgeStr }}</p>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'PaperAnalysisModal', //试卷细目分析弹框
  mixins: [],
  components: {},
  props: {
    initTableListData: {
      type: Array,
      default: () => {
        return []
      },
      required: false
    }
  },
  data() {
    return {
      title: '试卷细目分析表',
      visible: false,
      confirmLoading: false
    }
  },
  created() {},
  computed: {
    tableListData() {
      return this.initTableListData
    }
  },
  watch: {},
  methods: {
    closeModal() {
      this.visible = false
    },
    showModal() {
      this.visible = true
    },
    handleCancel() {
      this.closeModal()
    },
    handleOk() {
      this.closeModal()
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.modal-container {
  .table-list-warp {
    .table-list-wrap_view {
      .table-list-caption {
        .table-caption-head {
          background-color: #fafafa;

          .ant-col {
            padding: 12px 22px;
            border-bottom: 1px solid #e8e8e8;
            white-space: normal;
            overflow-wrap: break-word;
          }
        }
      }

      .table-list-body {
        .ant-row {
          border-bottom: 1px solid #e8e8e8;
          .ant-col {
            padding: 12px 22px;
            white-space: normal;
            overflow-wrap: break-word;
          }

          .col-group {
            display: table-cell;
            vertical-align: middle;

            h3 {
              font-size: 14px;
            }
          }

          .col-question-list {
            padding: 0;

            .ant-col {
              padding: 12px 22px;
              white-space: normal;
              overflow-wrap: break-word;

              p.col-kownledge-content {
                margin-bottom: 0;
                line-height: 24px;
              }
            }
          }
        }

        .no-bottom {
          border-bottom: 0 solid #e8e8e8;
        }
      }
    }
  }
}
</style>
