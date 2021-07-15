<template>
  <a-card class="page-container" :bordered="false">
    <div class="export-btn-box" v-if="paperType == 'export'">
      <!-- <a-button type="primary" @click.stop.prevent="hanldeExport">导出Word</a-button> -->
      <a-button type="primary" @click.stop.prevent="hanldeExportByJQ" :disabled="isExportOk">导出WORD</a-button>
    </div>
    <div class="page-section-container" ref="pageContainer">
      <div class="page-section-side" v-if="form.bindLine">
        <!--装订线-考生填写信息-->
        <BindLineImageForPreviewPaper />
      </div>
      <div id="pageWordExportContainer" class="page-section-main">
        <div class="WordSection1">
          <div class="page-main-wrap">
            <div class="page-main-scroll_view">
              <table style="width: 100%; border-collapse: collapse;border: none;">
                <tr>
                  <td style="border: none;vertical-align: text-top; ">
                    <div class="page-main-body">
                      <div class="paper-base-info">
                        <h3 style="text-align: center;font-size: 20px;font-weight: 500;" v-if="form.mainTitle">
                          {{ paperBaseData.mainTitle }}
                        </h3>
                        <h1 style="text-align: center;font-size: 24px;font-weight: bold;" v-if="form.secondTitle">
                          {{ paperBaseData.secondTitle }}
                        </h1>
                        <div v-if="form.stuInfo" class="stu-info-box">
                          <p style="text-align: center;">
                            <span class="info-label">姓名：</span>
                            <span class="info-input">
                              <img
                                width="150"
                                height="1"
                                src="https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/jeditor/11111111111_1619768451329.png"
                                alt="横线"
                              />
                            </span>
                            <span class="info-label">准考证号：</span>
                            <span class="info-input" style="width: 200px;">
                              <img
                                width="200"
                                height="1"
                                src="https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/jeditor/11111111111_1619768451329.png"
                                alt="横线"
                              />
                            </span>
                          </p>
                        </div>
                        <div v-if="form.noteAttention" class="note-attention-box">
                          <p
                            class="note-title"
                            style="letter-spacing: 10px;font-size: 16px;font-weight: bold;text-align: center;"
                          >
                            注意事项
                          </p>
                          <p>
                            1、考试时间：{{ paperBaseData.totalTime }}分钟
                            <span class="space"></span>
                            满分：{{ paperBaseData.totalScore }}分
                          </p>
                          <p>2、请在试卷标封处填写姓名、准考证号和所在单位的名称。</p>
                          <p>3、请仔细阅读答题要求，在规定位置填写答案。</p>
                          <p>4、不要在试卷上乱写乱画，不要在标封区填写无关的内容。</p>
                        </div>
                        <div v-if="form.totalScore" class="group-score-box">
                          <table class="group-score-table" style="border-collapse: collapse;border: 1px solid #333333;">
                            <tr class="score-row-tr">
                              <td class="score-row-td" style="width: 140px; border: 1px solid #333333;"></td>
                              <td
                                class="score-row-td"
                                style="width: 140px; border: 1px solid #333333;text-align: center;"
                                v-for="item in groupBaseData"
                                :key="item.sortKey"
                              >
                                {{ item.sortKey | getCapitalizeByNum }}
                              </td>
                              <td
                                class="score-row-td"
                                style="width: 140px; border: 1px solid #333333;text-align: center;"
                              >
                                总分
                              </td>
                              <td
                                class="score-row-td"
                                style="width: 140px; border: 1px solid #333333;text-align: center;"
                              >
                                阅卷人
                              </td>
                            </tr>
                            <tr class="score-row-tr">
                              <td
                                class="score-row-td"
                                style="width: 140px; border: 1px solid #333333;text-align: center;"
                              >
                                得分
                              </td>
                              <td
                                class="score-row-td"
                                style="width: 140px; border: 1px solid #333333;text-align: center;"
                                v-for="item in groupBaseData"
                                :key="item.sortKey"
                              ></td>
                              <td class="score-row-td" style="width: 140px; border: 1px solid #333333;"></td>
                              <td class="score-row-td" style="width: 140px; border: 1px solid #333333;"></td>
                            </tr>
                          </table>
                        </div>
                      </div>

                      <div class="paper-shiti-list">
                        <PreviewTestPaperGroupItem
                          v-for="item in groupBaseData"
                          :key="item.sort"
                          :init-data="item"
                          :group-score-area="form.groupScoreArea"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import $ from 'jquery'

import { tikuApiList } from '@/api/api'
import TYPELIST from './data/test_paper_type_list'

import BindLineImageForPreviewPaper from './modules/BindLineImageForPreviewPaper'
import PreviewTestPaperGroupItem from './components/PreviewTestPaperGroupItem'
import { exportDocx } from '@/utils/export'
import { jqWordExport } from '@/utils/jQwordExport'

export default {
  name: 'PreviewTestPaperPage', //预览试卷
  mixins: [],
  components: {
    BindLineImageForPreviewPaper,
    PreviewTestPaperGroupItem
  },
  props: {},
  data() {
    return {
      paperTypeList: TYPELIST.TESTPAPER_TYPE_LIST,
      paperFlagTypeList: TYPELIST.TESTPAPER_FLAG_TYPE_LIST,
      isExportOk: true, //导出按钮是否可以点击
      form: {
        paperType: undefined, //试卷类型
        bindLine: false, //是否显示装订线
        mainTitle: false, //是否显示主标题
        secondTitle: false, //是否显示副标题
        stuInfo: false, //是否显示考生信息栏
        totalScore: false, //是否显示总评分
        noteAttention: false, //是否显示注意事项
        groupScoreArea: false //是否显示大题评分区
      },
      paperFlagArr: [], //试卷标签，多个逗号隔开(1-装订线,2-主标题,3-副标题,4-考生信息栏,5-总评分,6-注意事项,7-大题评分区)
      rules: {
        paperType: [{ required: false, message: '请选择试卷类型', trigger: 'change' }]
      },
      paperBaseData: {
        id: undefined,
        paperMode: undefined,
        paperName: undefined,
        paperScope: undefined,
        paperScopeStr: undefined,
        projectType: undefined,
        projectTypeStr: undefined,
        workLevel: undefined,
        workTypeId: undefined,
        workTypeName: undefined
      },
      groupBaseData: []
    }
  },
  computed: {
    paperId() {
      let res = (!!this.$route.query && this.$route.query.paperId) || undefined
      return res
    },
    paperType() {
      let res = (!!this.$route.query && this.$route.query.paperType) || undefined
      return res
    }
  },
  created() {
    //初始化页面
    this.initPage()
  },
  filters: {
    getCapitalizeByNum(num) {
      let res = undefined
      let chineseArr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      res = chineseArr[num * 1]
      return res
    }
  },
  watch: {
    paperId: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.initPage()
      }
    },
    paperFlagArr: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.setFormCheckBoxVal(newV)
      }
    }
  },
  methods: {
    hanldeExport() {
      let paperName = !!this.paperBaseData.paperName ? this.paperBaseData.paperName : '试卷名称'
      let divStr = this.$refs.pageContainer.innerHTML
      // console.log(divStr)

      // exportDocx(divStr, headStr)
      axios
        .get('../style/preview.css')
        .then(response => {
          // console.log(response)
          let headStyle = response.data
          exportDocx(divStr, headStyle, paperName)
        })
        .catch(error => {
          console.log(error)
        })
    },
    hanldeExportByJQ() {
      let that = this
      let paperName = !!this.paperBaseData.paperName ? this.paperBaseData.paperName : '试卷名称'
      this.$confirm({
        title: '重要提醒！',
        content: `建议导出的Word使用office word 2007及以上版本打开，确定导出试卷名为【${paperName}】吗?`,
        onOk: () => {
          let $pageExport = $('#pageWordExportContainer')
          let params = Object.assign({}, this.form)
          jqWordExport($pageExport, paperName, params)
        }
      })
    },
    setFormCheckBoxVal(paperFlagArr) {
      let that = this
      let typeList = this.paperFlagTypeList

      for (let i = 0; i < typeList.length; i++) {
        let name = typeList[i].code
        let key = typeList[i].value
        that.form[name] = paperFlagArr.indexOf(key) > -1 ? true : false
      }
    },
    refreshGroupList() {
      this.initPage()
    },
    initPaperData() {
      let opts = {
        paperId: this.paperId
      }
      this.isExportOk = true
      if (!!opts.paperId) {
        tikuApiList.getTpDetailById(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            // this.$message.success(res.message || '获取页面初始化数据成功！')
            let data = res.result
            Object.assign(this.paperBaseData, data.paper)
            this.groupBaseData = data.groupList.slice(0)
            this.form.paperType = this.paperBaseData.paperType
            this.paperFlagArr = !!this.paperBaseData.paperFlag ? this.paperBaseData.paperFlag.split(',') : []
            this.isExportOk = false
          } else {
            this.$message.error(res.message || '获取页面初始化数据失败！')
          }
        })
      } else {
        this.$message.error('试卷ID没不存在，请重新刷新页面！')
      }
    },
    initPage() {
      this.initPaperData()
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.page-container {
  position: relative;
  .export-btn-box {
    position: absolute;
    top: 50px;
    right: 100px;
    z-index: 99;
  }
  .page-section-container {
    display: flex;
    margin-bottom: 10px;

    .page-section-side {
      width: 120px;
      height: 100%;
      margin: 0 auto;
      padding-top: 70px;
      z-index: 99;
    }

    .page-section-main {
      flex: 1 auto;
      margin-left: 10px;
      padding: 20px 5px 10px 5px;
      border-radius: 10px;
      background-color: #ffffff;

      .WordSection1 {
        .page-main-wrap {
          .page-main-scroll_view {
            position: relative;
            min-height: 1000px;
            overflow: hidden;

            .page-main-body {
              position: relative;

              .paper-base-info {
                padding: 0px 10px;

                h1,
                h3 {
                  text-align: center;
                }

                h1 {
                  font-size: 24px;
                  font-weight: bold;
                }

                h3 {
                  font-size: 20px;
                  font-weight: 500;
                }

                .stu-info-box {
                  text-align: center;

                  p {
                    .info-label {
                      padding: 0 5px;
                    }

                    .info-input {
                      display: inline-block;
                      min-width: 200px;
                      margin-right: 10px;
                      text-align: left;

                      img {
                        height: 1px;
                        margin-top: 10px;
                      }
                    }
                  }
                }

                .note-attention-box {
                  p {
                    font-size: 14px;

                    .space {
                      padding: 0 5px;
                    }
                  }

                  .note-title {
                    letter-spacing: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    text-align: center;
                  }
                }
              }

              .paper-shiti-acitons {
                position: absolute;
                top: 0;
                right: 0;
                transform: translate(0, 50px);

                .ant-btn {
                  margin-right: 40px;
                }
              }

              .group-score-box {
                border-radius: 2px;

                .group-score-table {
                  border: 1px solid #e8e8e8;
                  border-collapse: collapse;

                  .score-row-tr {
                    .score-row-td {
                      width: 140px;
                      padding: 5px;
                      border: 1px solid #e8e8e8;
                    }
                  }
                }
              }

              .paper-shiti-list {
                overflow: hidden;
              }
            }
          }
        }
      }
    }
  }
}
</style>
