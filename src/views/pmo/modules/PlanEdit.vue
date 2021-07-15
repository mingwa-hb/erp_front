<template>
  <div>
    <a-modal
      :title="title"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <a-spin :spinning="confirmLoading">
        <a-descriptions>
          <a-descriptions-item label="计划编号">{{ mwPmoPlan.planNo }}</a-descriptions-item>
          <a-descriptions-item label="合同编号">{{ mwPmoPlan.contractNo }}</a-descriptions-item>
        </a-descriptions>

        <a-descriptions>
          <a-descriptions-item label="公司名称">{{ mwPmoPlan.companyName }}</a-descriptions-item>
          <a-descriptions-item label="计划制定人">{{ mwPmoPlan.planCreateBy }}</a-descriptions-item>
        </a-descriptions>

        <a-descriptions>
          <a-descriptions-item label="合同签订证次">{{ mwPmoPlan.certificateCount }}</a-descriptions-item>
          <a-descriptions-item label="计划附件">
            <a-upload
              name="file"
              :multiple="true"
              :action="uploadAction"
              :headers="headers"
              @change="handleChangePlanFile"
              v-model="mwPmoPlan.planFile"
            >
              <a-button> <a-icon type="upload" />上传</a-button>
            </a-upload>
          </a-descriptions-item>
        </a-descriptions>

        <!-- 计划时间 -->
        <a-descriptions class="plan-time">
          <a-descriptions-item label="计划时间">
            <div>
              <a-range-picker
                @change="onChangePlanTime"
                :default-value="[moment(getPlanStartTime(), dateFormat), moment(getPlanEndTime(), dateFormat)]"
                :format="dateFormat"
              />
            </div>
          </a-descriptions-item>
        </a-descriptions>

        <!-- 备注 -->
        <a-descriptions class="beizhu">
          <a-descriptions-item label="备注">
            <a-textarea :cols="80" :rows="4" v-model="mwPmoPlan.remark" />
          </a-descriptions-item>
        </a-descriptions>

        <a-descriptions>
          <a-descriptions-item label="项目经理">{{ mwPmoPlan.manager }}</a-descriptions-item>
          <a-descriptions-item label="合同签订日期">{{ mwPmoPlan.signDate }}</a-descriptions-item>
          <a-descriptions-item label="合同截止日期">{{ mwPmoPlan.deadLine }}</a-descriptions-item>
        </a-descriptions>

        <!-- 报名 -->
        <a-descriptions class="apply">
          <a-descriptions-item label="报名负责人">
            <j-select-user-by-dep v-model="mwPmoPlan.applyAdmin" />
          </a-descriptions-item>
          <div>
            <a-range-picker
              @change="onChangeApplyPlanTime"
              :default-value="[moment(getApplyPlanStartTime(), dateFormat), moment(getApplyPlanEndTime(), dateFormat)]"
              :format="dateFormat"
            />
          </div>
        </a-descriptions>

        <a-descriptions>
          <a-descriptions-item label="报名附件">
            <a-upload
              name="file"
              :multiple="true"
              :action="uploadAction"
              :headers="headers"
              @change="handleChangeApplyFile"
            >
              <a-button> <a-icon type="upload" />上传</a-button>
            </a-upload>
          </a-descriptions-item>
        </a-descriptions>

        <!-- 学习 -->
        <a-descriptions class="learn">
          <a-descriptions-item label="学习负责人">
            <j-select-user-by-dep v-model="mwPmoPlan.studyAdmin" />
          </a-descriptions-item>
          <div>
            <a-range-picker
              @change="onChangeStudyPlanTime"
              :default-value="[moment(getStudyPlanStartTime(), dateFormat), moment(getStudyPlanEndTime(), dateFormat)]"
              :format="dateFormat"
            />
          </div>
        </a-descriptions>

        <a-descriptions class="uploading">
          <a-descriptions-item label="学习附件">
            <a-upload
              name="file"
              :multiple="true"
              :action="uploadAction"
              :headers="headers"
              @change="handleChangeStudyFile"
            >
              <a-button> <a-icon type="upload" />上传</a-button>
            </a-upload>
          </a-descriptions-item>
          <a-descriptions-item label="学习状态">
            <a-form-item label="" style="width: 100px" class="allStudy">
              <!-- @change="changeStudy"  -->
              <a-select v-model="mwPmoPlan.studyStatus" placeholder="未开始">
                <a-select-option value="未开始">未开始</a-select-option>
                <a-select-option value="进行中">进行中</a-select-option>
                <a-select-option value="已完成">已完成</a-select-option>
              </a-select>
            </a-form-item>
          </a-descriptions-item>
        </a-descriptions>

        <!-- 考试 -->
        <a-descriptions class="exam">
          <a-descriptions-item label="考试负责人">
            <j-select-user-by-dep v-model="mwPmoPlan.examAdmin" />
          </a-descriptions-item>
          <div>
            <a-range-picker
              @change="onChangeExamPlanTime"
              :default-value="[moment(getExamPlanStartTime(), dateFormat), moment(getExamPlanEndTime(), dateFormat)]"
              :format="dateFormat"
            />
          </div>
        </a-descriptions>

        <a-descriptions>
          <a-descriptions-item label="考试附件">
            <a-upload
              name="file"
              :multiple="true"
              :action="uploadAction"
              :headers="headers"
              @change="handleChangeExamFile"
            >
              <a-button> <a-icon type="upload" />上传</a-button>
            </a-upload>
          </a-descriptions-item>
        </a-descriptions>

        <!-- 证书 -->
        <a-descriptions class="certificate">
          <a-descriptions-item label="证书负责人">
            <j-select-user-by-dep v-model="mwPmoPlan.certificateAdmin" />
          </a-descriptions-item>
          <div>
            <a-range-picker
              @change="onChangeCertificatePlanTime"
              :default-value="[
                moment(getCertificatePlanStartTime(), dateFormat),
                moment(getCertificatePlanEndTime(), dateFormat),
              ]"
              :format="dateFormat"
            />
          </div>
        </a-descriptions>

        <a-descriptions>
          <a-descriptions-item label="证书附件">
            <a-upload
              name="file"
              :multiple="true"
              :action="uploadAction"
              :headers="headers"
              @change="handleChangeCertificateFile"
            >
              <a-button> <a-icon type="upload" />上传</a-button>
            </a-upload>
          </a-descriptions-item>
        </a-descriptions>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

import Vue from 'vue'
import { mapGetters } from 'vuex'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import ajax from '@/api/modules/pmoPlanManage'
import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'
import moment from 'moment'
export default {
  name: 'PlanEdit',
  components: { JSelectUserByDep },
  data() {
    return {
      // model: {},
      dateFormat: 'YYYY-MM-DD',
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      hasErrors,
      form: this.$form.createForm(this, { name: 'horizontal_login' }),
      title: '操作',
      visible: false,
      confirmLoading: false,
      study: undefined,
      planTime: [], //计划开始结束时间
      mwPmoPlan: {
        id: undefined,
        planNo: undefined, //计划编号
        contractNo: undefined, //合同编号
        companyName: undefined, //公司名称
        planCreateBy: undefined, //计划制定人
        manager: undefined, //项目经理
        signDate: undefined, //合同签订日期
        deadLine: undefined, //合同截止日期
        planStartTime: undefined, //计划开始日期
        planEndTime: undefined, //计划截止日期
        remark: undefined, //备注
        applyAdmin: undefined, //报名负责人
        applyPlanStartTime: undefined, //报名计划开始日期
        applyPlanEndTime: undefined, //报名计划截止日期
        studyAdmin: undefined, //学习负责人
        studyPlanStartTime: undefined, //学习计划开始日期
        studyPlanEndTime: undefined, //学习计划截止日期
        studyStatus: undefined, //学习状态
        examAdmin: undefined, //考试负责人
        examPlanStartTime: undefined, //考试计划开始日期
        examPlanEndTime: undefined, //考试计划截止日期
        certificateAdmin: undefined, //证书负责人
        certificatePlanStartTime: undefined, //发证计划开始日期
        certificatePlanEndTime: undefined, //发证计划截止日期
        planStatus: undefined, //计划状态
        contractStatus: undefined, //合同状态
        applyRealityStartTime: undefined, //报名实际开始日期
        applyRealityEndTime: undefined, //报名实际完成日期
        applyStatus: undefined, //报名状态
        studyRealityStartTime: undefined, //学习实际开始日期
        studyRealityEndTime: undefined, //学习实际完成日期
        examRealityStartTime: undefined, //考试实际开始日期
        examRealityEndTime: undefined, //考试实际完成日期
        examStatus: undefined, //考试状态
        certificateRealityStartTime: undefined, //发证实际开始日期
        certificateRealityEndTime: undefined, //发证实际完成日期
        certificateStatus: undefined, //证书发放状态
        planFile: undefined, //计划附件
        applyFile: undefined, //报名附件
        studyFile: undefined, //学习附件
        examFile: undefined, //考试附件
        certificateFile: undefined, //证书附件
        certificateCount: undefined //合同证次
      },
      headers: {}
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
  },
  computed: {
    ...mapGetters(['allAuthList']),
  },
  methods: {
    // 计划附件
    handleChangePlanFile(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file.response.message)
        this.mwPmoPlan.planFile = info.file.response.message
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },

    // 报名附件
    handleChangeApplyFile(info) {
      if (info.file.status !== 'uploading') {
        this.mwPmoPlan.applyFile = info.file.response.message
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },

    // 学习附件
    handleChangeStudyFile(info) {
      if (info.file.status !== 'uploading') {
        this.mwPmoPlan.studyFile = info.file.response.message
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },

    // 考试附件
    handleChangeExamFile(info) {
      if (info.file.status !== 'uploading') {
        this.mwPmoPlan.examFile = info.file.response.message
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },

    // 证书附件
    handleChangeCertificateFile(info) {
      if (info.file.status !== 'uploading') {
        this.mwPmoPlan.certificateFile = info.file.response.message
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },

    edit(record) {
      this.visible = true
      console.log(record)
      let mwPmoPlan = this.mwPmoPlan
      for (let key in mwPmoPlan) {
        mwPmoPlan[key]=undefined;
      }
      // console.log(mwPmoPlan);
      this.mwPmoPlan.id = record.id
      this.mwPmoPlan.planNo = record.planNo
      this.mwPmoPlan.contractNo = record.contractNo
      this.mwPmoPlan.companyName = record.companyName
      this.mwPmoPlan.planCreateBy = record.planCreateBy
      this.mwPmoPlan.manager = record.manager
      this.mwPmoPlan.signDate = record.signDate
      this.mwPmoPlan.deadLine = record.deadLine
      this.mwPmoPlan.planStatus = record.planStatus
      this.mwPmoPlan.contractStatus = record.contractStatus
      this.mwPmoPlan.applyRealityStartTime = record.applyRealityStartTime
      this.mwPmoPlan.applyRealityEndTime = record.applyRealityEndTime
      this.mwPmoPlan.applyStatus = record.applyStatus
      this.mwPmoPlan.studyRealityStartTime = record.studyRealityStartTime
      this.mwPmoPlan.studyRealityEndTime = record.studyRealityEndTime
      this.mwPmoPlan.examRealityStartTime = record.examRealityStartTime
      this.mwPmoPlan.examRealityEndTime = record.examRealityEndTime
      this.mwPmoPlan.examStatus = record.examStatus
      this.mwPmoPlan.certificateRealityStartTime = record.certificateRealityStartTime
      this.mwPmoPlan.certificateRealityEndTime = record.certificateRealityEndTime
      this.mwPmoPlan.certificateStatus = record.certificateStatus
      this.mwPmoPlan.certificateCount = record.certificateCount
      this.mwPmoPlan.remark = record.remark
      this.mwPmoPlan.planFile = record.planFile
      // 计划
      this.mwPmoPlan.planStartTime = record.planStartTime
      this.mwPmoPlan.planEndTime = record.planEndTime
      // 报名
      this.mwPmoPlan.applyAdmin = record.applyAdmin
      this.mwPmoPlan.applyPlanStartTime = record.applyPlanStartTime
      this.mwPmoPlan.applyPlanEndTime = record.applyPlanEndTime
      // 学习
      this.mwPmoPlan.studyPlanStartTime = record.studyPlanStartTime
      this.mwPmoPlan.studyPlanEndTime = record.studyPlanEndTime
      this.mwPmoPlan.studyStatus = record.studyStatus
      // 考试
      this.mwPmoPlan.examPlanStartTime = record.examPlanStartTime
      this.mwPmoPlan.examPlanEndTime = record.examPlanEndTime
      // 证书
      this.mwPmoPlan.certificatePlanStartTime = record.certificatePlanStartTime
      this.mwPmoPlan.certificatePlanEndTime = record.certificatePlanEndTime

      // this.fillRecord(record)
    },

    // fillRecord(record) {
    //   this.model = Object.assign({}, record)
    //   this.$nextTick(() => {
    //     this.form.setFieldsValue(pick(this.model, 'applyAdmin'))
    //   })
    // },

    // 确定
    handleOk() {
      console.log(111)
      this.visible = false
      console.log(this.mwPmoPlan)
      ajax.EditPlanById(this.mwPmoPlan).then(res => {
        console.log(res)
        if (res.code == 200 && !!res.success) {
          this.$message.success(res.result)
          this.$emit('ok')
        } else {
          this.$message.warning(res.result)
        }
      })
    },
    // 关闭
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      ;(this.visible = false), (this.disableSubmit = false)
    },

    // Only show error after a field is touched.
    userNameError() {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('userName') && getFieldError('userName')
    },
    // Only show error after a field is touched.
    passwordError() {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('password') && getFieldError('password')
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    onChange(date, dateString) {
      console.log(date, dateString)
    },
    changeStudy() {
      console.log(value)
      // if (this.study == 1) {
      //   this.mwPmoPlan.studyStatus = '未开始'
      // }
      // if (this.study == 2) {
      //   this.mwPmoPlan.studyStatus = '进行中'
      // }
      // if (this.study == 3) {
      //   this.mwPmoPlan.studyStatus = '已完成'
      // }
      // console.log(this.mwPmoPlan.studyStatus)
    },

    // 将 计划开始结束时间 分别存入 计划开始日期 和 计划截止日期
    onChangePlanTime(date, dateString) {
      console.log(date)
      console.log(dateString)
      this.mwPmoPlan.planStartTime = moment(date[0]).format('YYYY-MM-DD HH:mm:ss')
      this.mwPmoPlan.planEndTime = moment(date[1]).format('YYYY-MM-DD HH:mm:ss')
    },

    // 将 报名计划日期 分别存入 报名计划开始日期 和 报名计划截止日期
    onChangeApplyPlanTime(date, dateString) {
      this.mwPmoPlan.applyPlanStartTime = moment(date[0]).format('YYYY-MM-DD HH:mm:ss')
      this.mwPmoPlan.applyPlanEndTime = moment(date[1]).format('YYYY-MM-DD HH:mm:ss')
    },

    // 将 学习计划日期 分别存入 学习计划开始日期 和 学习计划截止日期
    onChangeStudyPlanTime(date, dateString) {
      this.mwPmoPlan.studyPlanStartTime = moment(date[0]).format('YYYY-MM-DD HH:mm:ss')
      this.mwPmoPlan.studyPlanEndTime = moment(date[1]).format('YYYY-MM-DD HH:mm:ss')
    },

    // 将 考试计划日期 分别存入 考试计划开始日期 和 考试计划截止日期
    onChangeExamPlanTime(date, dateString) {
      this.mwPmoPlan.examPlanStartTime = moment(date[0]).format('YYYY-MM-DD HH:mm:ss')
      this.mwPmoPlan.examPlanEndTime = moment(date[1]).format('YYYY-MM-DD HH:mm:ss')
    },

    // 将 发证计划日期 分别存入 发证计划开始日期 和 发证计划截止日期
    onChangeCertificatePlanTime(date, dateString) {
      this.mwPmoPlan.certificatePlanStartTime = moment(date[0]).format('YYYY-MM-DD HH:mm:ss')
      this.mwPmoPlan.certificatePlanEndTime = moment(date[1]).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted() {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields()
    })
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-modal-body {
  padding: 20px 40px 10px;
  .ant-spin-container {
    .ant-descriptions {
      .ant-descriptions-view {
        .ant-descriptions-row {
          .ant-descriptions-item {
            width: 50%;
          }
        }
      }
    }
    .plan-time {
      .ant-descriptions-view {
        .ant-descriptions-row {
          .ant-descriptions-item {
            .ant-descriptions-item-content {
              margin-left: 50px;
            }
          }
        }
      }
    }
    .beizhu {
      .ant-descriptions-view {
        .ant-descriptions-row {
          .ant-descriptions-item {
            .ant-descriptions-item-content {
              margin-left: 78px;
            }
          }
        }
      }
    }
    .apply,
    .learn,
    .exam,
    .certificate {
      .ant-descriptions-view {
        .ant-descriptions-row {
          .ant-descriptions-item {
            width: 45%;
            // .ant-descriptions-item-content{
            //     margin-left: 78px;
            // }
            .ant-col {
              width: 120px;
            }
          }
        }
      }
    }
    .uploading {
      position: relative;
      .ant-descriptions-view {
        .ant-descriptions-row {
          .ant-descriptions-item {
            .ant-descriptions-item-content {
              .ant-select {
                width: 140px;
              }
            }
          }
          .ant-descriptions-item:first-child {
            // width: 150px;
            width: 180px;
          }
          .ant-descriptions-item:last-child {
            position: absolute;
            top: -9px;
            right: 35px;
          }
        }
      }
    }
  }
}
</style>
