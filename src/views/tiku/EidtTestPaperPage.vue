<template>
  <a-card class="page-container" :bordered="false">
    <div class="page-section-container">
      <div class="page-section-side">
        <div class="page-section-side-control">
          <h3>试卷使用场景</h3>
          <div class="setting-form-container">
            <a-form-model ref="ruleForm" :model="form" :rules="rules">
              <div class="form-row-control line-bottom">
                <a-form-model-item prop="paperType">
                  <a-radio-group v-model.trim="form.paperType" @change="onChangePaperType">
                    <a-radio :value="item.value" v-for="item in paperTypeList.slice(1)" :key="item.value">
                      {{ item.label }}
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </div>
              <div class="form-row-control">
                <a-form-model-item prop="bindLine">
                  <a-checkbox v-model.trim="form.bindLine" @change="onChangePaperFlag" />装订线
                </a-form-model-item>
                <a-form-model-item prop="mainTitle">
                  <a-checkbox v-model.trim="form.mainTitle" @change="onChangePaperFlag" />主标题
                </a-form-model-item>
              </div>
              <div class="form-row-control">
                <a-form-model-item prop="secondTitle">
                  <a-checkbox v-model.trim="form.secondTitle" @change="onChangePaperFlag" />副标题
                </a-form-model-item>
                <a-form-model-item prop="stuInfo">
                  <a-checkbox v-model.trim="form.stuInfo" @change="onChangePaperFlag" />考生信息栏
                </a-form-model-item>
              </div>
              <div class="form-row-control">
                <a-form-model-item prop="totalScore">
                  <a-checkbox v-model.trim="form.totalScore" @change="onChangePaperFlag" />总评分
                </a-form-model-item>
                <a-form-model-item prop="noteAttention">
                  <a-checkbox v-model.trim="form.noteAttention" @change="onChangePaperFlag" />注意事项
                </a-form-model-item>
              </div>
              <div class="form-row-control">
                <a-form-model-item prop="groupScoreArea">
                  <a-checkbox v-model.trim="form.groupScoreArea" @change="onChangePaperFlag" />大题评分区
                </a-form-model-item>
              </div>
            </a-form-model>
          </div>
        </div>
        <div class="page-section-side-control">
          <a-row class="page-row-act-control">
            <a-button block type="primary" @click="hanldeSetPaperFlag">保存试卷使用场景</a-button>
          </a-row>
          <a-row class="page-row-act-control">
            <a-button block type="primary" @click="hanldeAddQuestionToPaper">继续选题</a-button>
          </a-row>
          <a-row class="page-row-act-control">
            <a-button block type="primary" @click="handleShowPaperAnalysisModal">试卷分析</a-button>
          </a-row>
          <a-row class="page-row-act-control">
            <a-button block type="primary" @click="handleShowPaperSettingScoreModal">分数设置</a-button>
          </a-row>
          <a-row class="page-row-act-control">
            <a-button block type="primary" @click="handleShowPaperSettingTimeModal">时间设置</a-button>
          </a-row>
          <a-row class="page-row-act-control">
            <a-button block type="primary" @click="handleShowPaperSettingTitleModal">标题设置</a-button>
          </a-row>
          <a-row class="page-row-act-control">
            <a-button block type="primary">
              <a
                target="_blank"
                :href="'/itiku/PreviewTestPaperPage?paperId=' + paperId"
                :title="paperBaseData.paperName"
                >试卷预览</a
              >
            </a-button>
          </a-row>
        </div>
      </div>
      <div class="page-section-main">
        <div class="page-main-wrap">
          <div class="page-main-scroll_view">
            <table style="width: 100%; border-collapse: collapse;border: none;">
              <tr>
                <td v-if="form.bindLine" style="width: 120px;border: none;vertical-align: top; ">
                  <div class="page-main-side">
                    <!--装订线-考生填写信息-->
                    <BindLineImageForPreviewPaper />
                  </div>
                </td>
                <td style="border: none;vertical-align: top; ">
                  <div class="page-main-body">
                    <div class="paper-base-info">
                      <h3 v-if="form.mainTitle">{{ paperBaseData.mainTitle }}</h3>
                      <h1 v-if="form.secondTitle">{{ paperBaseData.secondTitle }}</h1>
                      <div v-if="form.stuInfo" class="stu-info-box">
                        <p>
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
                        <p class="note-title">注意事项</p>
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
                      <TestPaperGroupItem
                        v-for="item in groupBaseData"
                        :key="item.sortKey"
                        :init-data="item"
                        :group-score-area="form.groupScoreArea"
                        @renovate="refreshGroupList"
                        @doReplace="hanldeShowReplaceListModal"
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

    <!--试卷细目分析表弹框-->
    <PaperAnalysisModal ref="paperAnalysisModal" :init-table-list-data="groupBaseData" />

    <!--试卷设置分数弹框-->
    <PaperSettingScoreModal
      ref="paperSettingScoreModal"
      :paper-base-data="paperBaseData"
      :group-base-data="groupBaseData"
      @afterSetScore="initPage"
    />

    <!--试卷设置时间弹框-->
    <PaperSettingTimeModal ref="paperSettingTimeModal" :paper-base-data="paperBaseData" @afterSetTime="initPage" />

    <!--试卷设置标题弹框-->
    <PaperSettingTitleModal ref="paperSettingTitleModal" :paper-base-data="paperBaseData" @afterSetTime="initPage" />

    <!--换题弹框-->
    <ReplaceQuestionListModal
      ref="replaceQuestionListModal"
      :target-question-item="curQuestionItem"
      @renovate="refreshGroupList"
    />
  </a-card>
</template>

<script>
import _ from 'lodash'
import { tikuApiList } from '@/api/api'
import TYPELIST from './data/test_paper_type_list'

import BindLineImageForPreviewPaper from './modules/BindLineImageForPreviewPaper'
import TestPaperGroupItem from './components/TestPaperGroupItem'
import PaperAnalysisModal from './modules/PaperAnalysisModal'
import PaperSettingScoreModal from './modules/PaperSettingScoreModal'
import PaperSettingTimeModal from './modules/PaperSettingTimeModal'
import PaperSettingTitleModal from './modules/PaperSettingTitleModal'
import ReplaceQuestionListModal from './modules/ReplaceQuestionListModal'
export default {
  name: 'EidtTestPaperPage', //编辑试卷
  mixins: [],
  components: {
    BindLineImageForPreviewPaper,
    TestPaperGroupItem,
    PaperAnalysisModal,
    PaperSettingScoreModal,
    PaperSettingTimeModal,
    PaperSettingTitleModal,
    ReplaceQuestionListModal
  },
  props: {},
  data() {
    return {
      paperTypeList: TYPELIST.TESTPAPER_TYPE_LIST,
      paperFlagTypeList: TYPELIST.TESTPAPER_FLAG_TYPE_LIST,
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
      groupBaseData: [],
      curQuestionItem: null //需要替换的试题信息
    }
  },
  computed: {
    paperId() {
      let res = (!!this.$route.query && this.$route.query.paperId) || undefined
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
    goToTqManualPaperPage(id) {
      this.$router.push({ path: '/itiku/TestPaperManualSelect', query: { paperId: id } })
    },
    onChangePaperType(e) {
      // console.log(e.target.value)
      switch (e.target.value) {
        case '2':
          this.paperFlagArr = ['2', '3', '4', '5', '7']
          break
        case '3':
          this.paperFlagArr = ['2']
          break
        case '1':
        default:
          this.paperFlagArr = ['1', '2', '3', '5', '6', '7']
          break
      }
    },
    onChangePaperFlag(e) {
      let checked = e.target.checked
      this.setPaperFlagArr()
    },
    handleShowPaperAnalysisModal() {
      this.$refs.paperAnalysisModal.showModal()
    },
    handleShowPaperSettingScoreModal() {
      this.$refs.paperSettingScoreModal.showModal()
    },
    handleShowPaperSettingTimeModal() {
      this.$refs.paperSettingTimeModal.showModal()
    },
    handleShowPaperSettingTitleModal() {
      this.$refs.paperSettingTitleModal.showModal()
    },
    hanldeShowReplaceListModal(data) {
      this.curQuestionItem = data
      this.$refs.replaceQuestionListModal.showModal()
    },
    setFormCheckBoxVal(paperFlagArr) {
      let that = this
      let typeList = this.paperFlagTypeList

      for (let i = 0; i < typeList.length; i++) {
        let name = typeList[i].code
        let key = typeList[i].value
        that.form[name] = paperFlagArr.indexOf(key) > -1 ? true : false
      }
      // this.form.bindLine = arr.indexOf('1') > -1 ? true : false
      // this.form.mainTitle = arr.indexOf('2') > -1 ? true : false
      // this.form.secondTitle = arr.indexOf('3') > -1 ? true : false
      // this.form.stuInfo = arr.indexOf('4') > -1 ? true : false
      // this.form.totalScore = arr.indexOf('5') > -1 ? true : false
      // this.form.noteAttention = arr.indexOf('6') > -1 ? true : false
      // this.form.groupScoreArea = arr.indexOf('7') > -1 ? true : false
    },
    setPaperFlagArr() {
      let that = this
      let res = []
      let typeList = this.paperFlagTypeList

      for (let i = 0; i < typeList.length; i++) {
        let name = typeList[i].code
        let key = typeList[i].value
        if (!!that.form[name]) {
          res.push(key)
        }
      }
      this.paperFlagArr = res
    },
    hanldeAddQuestionToPaper() {
      let paperId = this.paperId
      if (!!paperId) {
        this.goToTqManualPaperPage(paperId)
      } else {
        this.$message.error('试卷ID没不存在，请返回列表页！')
      }
    },
    hanldeSetPaperFlag() {
      let opts = {
        paperId: this.paperId,
        paperType: this.form.paperType,
        paperFlag: this.paperFlagArr.join(',')
      }
      this.setPaperFlag(opts)
    },
    setPaperFlag(opts) {
      if (!!opts.paperId) {
        tikuApiList.setTpFlag(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.message || '成功设置试卷场景！')
            setTimeout(() => {
              this.initPage()
            }, 30)
          } else {
            this.$message.error(res.message || '设置试卷场景失败！')
          }
        })
      } else {
        this.$message.error('试卷ID没不存在，请重新刷新页面！')
      }
    },
    refreshGroupList() {
      this.initPage()
    },
    initPaperData() {
      let opts = {
        paperId: this.paperId
      }
      if (!!opts.paperId) {
        tikuApiList.getTpDetailById(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            // this.$message.success(res.message || '获取页面初始化数据成功！')
            let data = res.result
            Object.assign(this.paperBaseData, data.paper)
            this.groupBaseData = data.groupList.slice(0)
            this.form.paperType = this.paperBaseData.paperType
            this.paperFlagArr = !!this.paperBaseData.paperFlag ? this.paperBaseData.paperFlag.split(',') : []
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
@import './less/setting.less';
</style>
