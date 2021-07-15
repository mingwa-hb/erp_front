<template>
  <a-modal
    :title="title"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="取消"
    okText="保存"
    class="edit"
  >
    <a-spin :spinning="confirmLoading">
      <!-- 计划信息 -->
      <a-form-model ref="ruleForm" :model="form" layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="24">
          <a-col :span="12">
            <h3 class="form-cap-title">计划信息</h3>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="计划编号" prop="planNo">
              <a-input placeholder="请输入计划编号" v-model.trim="form.planNo" :disabled="readOnly" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合同编号" prop="contractNo">
              <a-input placeholder="请输入合同编号" v-model.trim="form.contractNo" :disabled="readOnly" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="公司名称" prop="companyName">
              <a-input placeholder="请输入公司名称" v-model.trim="form.companyName" :disabled="readOnly" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合同签订证次" prop="certificateCount">
              <a-input placeholder="请输入合同签订证次" v-model.trim="form.certificateCount" :disabled="readOnly" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="合同签订日期" prop="signDate">
              <a-date-picker placeholder="请选择合同签订日期" v-model="form.signDate" :disabled="readOnly" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合同截止日期" prop="deadLine">
              <a-date-picker placeholder="请选择合同截止日期" v-model="form.deadLine" :disabled="readOnly" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="项目经理" prop="manager">
              <a-input placeholder="请输入项目经理" v-model.trim="form.manager" :disabled="readOnly" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="备注" prop="remark">
              <a-textarea placeholder="请输入备注" :rows="3" v-model.trim="form.remark" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 计划 -->
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="计划制定人" prop="planCreateBy">
              <a-input placeholder="请选择计划制定人" v-model.trim="form.planCreateBy" :disabled="readOnly" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="计划时间" prop="planTime">
              <a-range-picker v-model="form.planTime" @change="onChangeDatePlan" :disabled="isShowBaoming" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item label="计划附件" prop="planFile" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <j-upload v-model="form.planFile" @change="handleChangeFilePlan" :disabled="isShowBaoming"></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <h3 class="form-cap-title">项目信息</h3>
          </a-col>
        </a-row>
        <!-- 报名 -->
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="报名负责人" prop="applyAdminEn">
              <j-select-user-by-dep
                :value="form.applyAdminEn"
                placeholder="选择报名负责人"
                :multi="false"
                @change="handleSelectUserChangeApply"
                :disabled="isShowBaoming"
                roleCode="YZRY"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="报名计划日期" prop="applyPlanTime">
              <a-range-picker v-model="form.applyPlanTime" @change="onChangeDateApply" :disabled="isShowBaoming" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item label="报名附件" prop="applyFile" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <j-upload v-model="form.applyFile" @change="handleChangeFileApply" :disabled="isShowBaoming"></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 学习 -->
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="学习负责人" prop="studyAdminEn">
              <j-select-user-by-dep
                :value="form.studyAdminEn"
                placeholder="选择学习负责人"
                :multi="false"
                @change="handleSelectUserChangeStudy"
                :disabled="isShowBaoming"
                roleCode="JWRY"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="学习计划日期" prop="studyPlanTime">
              <a-range-picker v-model="form.studyPlanTime" @change="onChangeDateStudy" :disabled="isShowBaoming" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item label="学习附件" prop="studyFile" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <j-upload v-model="form.studyFile" @change="handleChangeFileStudy" :disabled="isShowXuexi"></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 考试 -->
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="考试负责人" prop="examAdminEn">
              <j-select-user-by-dep
                :value="form.examAdminEn"
                placeholder="选择考试负责人"
                :multi="false"
                @change="handleSelectUserChangeExam"
                :disabled="isShowBaoming"
                roleCode="KWRY"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="考试计划日期" prop="examPlanTime">
              <a-range-picker v-model="form.examPlanTime" @change="onChangeDateExam" :disabled="isShowBaoming" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item label="考试附件" prop="examFile" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <j-upload v-model="form.examFile" @change="handleChangeFileExam" :disabled="isShowKaoshi"></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 证书 -->
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-model-item label="证书负责人" prop="certificateAdminEn">
              <j-select-user-by-dep
                :value="form.certificateAdminEn"
                placeholder="选择证书负责人"
                :multi="false"
                @change="handleSelectUserChangeCertificate"
                :disabled="isShowBaoming"
                roleCode="CWCN"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="发证计划日期" prop="certificatePlanTime">
              <a-range-picker
                v-model="form.certificatePlanTime"
                @change="onChangeDateCertificate"
                :disabled="isShowBaoming"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-model-item
              label="证书附件"
              prop="certificateFile"
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 20 }"
            >
              <j-upload
                v-model="form.certificateFile"
                @change="handleChangeFileCertificate"
                :disabled="isShowZhengshu"
              ></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>

    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" v-if="!!isShowDraftBtn" @click="handleOk('1')">存入草稿</a-button>
      <a-button type="primary" @click="handleOk('2')">提交审核</a-button>
    </template>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import ajax from '@/api/modules/pmoPlanManage'

import JSelectUserByDep from '../../pmo/components/JSelectUserByDep'
import JUpload from '@/components/jeecg/JUpload'
import { mapGetters } from 'vuex'
export default {
  name: 'PlanListEditModal',
  components: { JSelectUserByDep, JUpload },
  data() {
    return {
      title: '编辑',
      visible: false,
      confirmLoading: false,
      readOnly: true, //只读
      disableSubmit: true, //禁止提交
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: {
        id: undefined,
        planNo: undefined, //计划编号
        contractNo: undefined, //合同编号
        companyName: undefined, //公司名字
        certificateCount: undefined, //签订证次
        remark: undefined, //备注

        manager: undefined,
        managerEn: undefined,
        signDate: null,
        deadLine: null,

        planCreateBy: undefined, //计划制定人
        planCreateByEn: undefined, //计划制定人ID
        planFile: undefined, //计划附件
        planTime: [], //计划时间
        planStartTime: null, //计划开始时间
        planEndTime: null, //计划结束时间

        applyAdmin: undefined, //报名负责人
        applyAdminEn: undefined, //报名负责人ID
        applyFile: undefined, //报名附件
        applyPlanTime: [], //报名计划时间
        applyPlanEndTime: null, //报名计划结束时间
        applyPlanStartTime: null, //报名计划开始时间

        studyAdmin: undefined, //学习负责人
        studyAdminEn: undefined, //学习负责人ID
        studyFile: undefined, //学习附件
        studyPlanTime: [], //学习计划时间
        studyPlanEndTime: null, //学习计划结束时间
        studyPlanStartTime: null, //学习计划开始时间

        examAdmin: undefined, //考试负责人
        examAdminEn: undefined, //考试负责人ID
        examFile: undefined, //考试附件
        examPlanTime: [], //考试计划时间
        examPlanEndTime: null, //考试计划结束时间
        examPlanStartTime: null, //考试计划开始时间

        certificateAdmin: undefined, //发证负责人
        certificateAdminEn: undefined, //发证负责人ID
        certificateFile: undefined, //证书附件
        certificatePlanTime: [], //发证计划时间
        certificatePlanEndTime: null, //发证计划结束时间
        certificatePlanStartTime: null, //发证计划开始时间

        sDataStatus: undefined
      }
    }
  },
  created() {
    // this.initFormVal()
  },
  computed: {
    ...mapGetters(['pUserInfo']),
    headers() {
      const token = this.$ls.get(ACCESS_TOKEN)
      return { 'X-Access-Token': token }
    },
    uploadAction() {
      return window._CONFIG['domianURL'] + '/sys/common/upload'
    },
    RoleCode() {
      return this.pUserInfo.role
    },
    isShowBaoming() {
      // 业支人员（角色）权限
      let res = this.RoleCode
      return res == 'YZRY' || res == 'admin' ? false : true
    },
    isShowXuexi() {
      // 教务人员（角色）权限
      let res = this.RoleCode
      return res == 'JWRY' || res == 'YZRY' || res == 'admin' ? false : true
    },
    isShowKaoshi() {
      // 考务人员（角色）权限
      let res = this.RoleCode
      return res == 'KWRY' || res == 'YZRY' || res == 'admin' ? false : true
    },
    isShowZhengshu() {
      // 财务出纳（角色）权限
      let res = this.RoleCode
      return res == 'CWCN' || res == 'YZRY' || res == 'admin' ? false : true
    },
    isShowDraftBtn({ form }) {
      return form.sDataStatus == 4 ? false : true
    }
  },
  methods: {
    closeModal() {
      this.visible = false
    },
    handleCancel() {
      this.closeModal()
    },
    setDateSignContract(startTime, endTime) {
      this.form.signDate = !!startTime ? moment(startTime) : null
      this.form.deadLine = !!endTime ? moment(endTime) : null
    },
    onChangeDatePlan(date, dateString) {
      this.form.planTime = date
      this.form.planStartTime = dateString[0] || undefined
      this.form.planEndTime = dateString[1] || undefined
    },
    setDatePlan(startTime, endTime) {
      let sTime = !!startTime ? moment(startTime) : null
      let eTime = !!endTime ? moment(endTime) : null
      this.form.planTime = [sTime, eTime]
    },
    onChangeDateApply(date, dateString) {
      this.form.applyPlanTime = date
      this.form.applyPlanStartTime = dateString[0] || undefined
      this.form.applyPlanEndTime = dateString[1] || undefined
    },
    setDateApply(startTime, endTime) {
      let sTime = !!startTime ? moment(startTime) : null
      let eTime = !!endTime ? moment(endTime) : null
      this.form.applyPlanTime = [sTime, eTime]
    },
    onChangeDateStudy(date, dateString) {
      this.form.studyPlanTime = date
      this.form.studyPlanStartTime = dateString[0] || undefined
      this.form.studyPlanEndTime = dateString[1] || undefined
    },
    setDateStduy(startTime, endTime) {
      let sTime = !!startTime ? moment(startTime) : null
      let eTime = !!endTime ? moment(endTime) : null
      this.form.studyPlanTime = [sTime, eTime]
    },
    onChangeDateExam(date, dateString) {
      this.form.examPlanTime = date
      this.form.examPlanStartTime = dateString[0] || undefined
      this.form.examPlanEndTime = dateString[1] || undefined
    },
    setDateExam(startTime, endTime) {
      let sTime = !!startTime ? moment(startTime) : null
      let eTime = !!endTime ? moment(endTime) : null
      this.form.examPlanTime = [sTime, eTime]
    },
    onChangeDateCertificate(date, dateString) {
      this.form.certificatePlanTime = date
      this.form.certificatePlanStartTime = dateString[0] || undefined
      this.form.certificatePlanEndTime = dateString[1] || undefined
    },
    setDateCertificate(startTime, endTime) {
      let sTime = !!startTime ? moment(startTime) : null
      let eTime = !!endTime ? moment(endTime) : null
      this.form.certificatePlanTime = [sTime, eTime]
    },
    handleChangeFilePlan(fileListStr) {
      let fileList = fileListStr.split(',')
      this.form.planFile = fileList.pop()
    },
    handleChangeFileApply(fileListStr) {
      let fileList = fileListStr.split(',')
      this.form.applyFile = fileList.pop()
    },
    handleChangeFileStudy(fileListStr) {
      let fileList = fileListStr.split(',')
      this.form.studyFile = fileList.pop()
    },
    handleChangeFileExam(fileListStr) {
      let fileList = fileListStr.split(',')
      this.form.examFile = fileList.pop()
    },
    handleChangeFileCertificate(fileListStr) {
      let fileList = fileListStr.split(',')
      this.form.certificateFile = fileList.pop()
    },
    handleSelectUserChangeApply(ids, names) {
      // console.log(ids)
      // console.log(names)
      this.form.applyAdmin = names
      this.form.applyAdminEn = ids
    },
    handleSelectUserChangeStudy(ids, names) {
      this.form.studyAdmin = names
      this.form.studyAdminEn = ids
    },
    handleSelectUserChangeExam(ids, names) {
      this.form.examAdmin = names
      this.form.examAdminEn = ids
    },
    handleSelectUserChangeCertificate(ids, names) {
      this.form.certificateAdmin = names
      this.form.certificateAdminEn = ids
    },
    edit(record) {
      // location.reload();
      this.visible = true
      this.doResetForm()
      this.$nextTick(() => {
        this.initFormVal(record)
      })
    },
    doResetForm() {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },
    doFormSubmit(dataStatus) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let opts = {
            ...this.form,
            dataStatus: dataStatus
          }
          this.doSendFormDataSubmit(opts)
        } else {
          // this.$message.warning('验证没通过！')
          return false
        }
      })
    },
    handleOk(status = '1') {
      let data_status = status || '1' //1-草稿,2-待审核
      this.doFormSubmit(data_status)
    },
    doSendFormDataSubmit(opts) {
      ajax.EditPlanById(opts).then(res => {
        // console.log(res)
        if (res.code == 0 || (res.code == 200 && !!res.success)) {
          this.$message.success('编辑成功！')
          setTimeout(() => {
            this.closeModal()
            this.$emit('ok')
          }, 30)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    initFormVal(data) {
      let keys = Object.keys(this.form)
      let tempForm = _.pick(data, keys)
      this.form.id = tempForm.id
      this.form.planNo = tempForm.planNo
      this.form.contractNo = tempForm.contractNo
      this.form.companyName = tempForm.companyName
      this.form.certificateCount = tempForm.certificateCount
      this.form.remark = tempForm.remark
      this.form.manager = tempForm.manager
      this.form.managerEn = tempForm.managerEn
      this.setDateSignContract(tempForm.signDate, tempForm.deadLine)

      this.form.planCreateBy = tempForm.planCreateBy
      this.form.planCreateByEn = tempForm.planCreateByEn
      this.form.planFile = tempForm.planFile
      this.form.planStartTime = tempForm.planStartTime
      this.form.planEndTime = tempForm.planEndTime
      this.setDatePlan(tempForm.planStartTime, tempForm.planEndTime)

      this.form.applyAdmin = tempForm.applyAdmin
      this.form.applyAdminEn = tempForm.applyAdminEn
      this.form.applyFile = tempForm.applyFile
      this.form.applyPlanEndTime = tempForm.applyPlanEndTime
      this.form.applyPlanStartTime = tempForm.applyPlanStartTime
      this.setDateApply(tempForm.applyPlanStartTime, tempForm.applyPlanEndTime)

      this.form.studyAdmin = tempForm.studyAdmin
      this.form.studyAdminEn = tempForm.studyAdminEn
      this.form.studyFile = tempForm.studyFile
      this.form.studyPlanEndTime = tempForm.studyPlanEndTime
      this.form.studyPlanStartTime = tempForm.studyPlanStartTime
      this.setDateStduy(tempForm.studyPlanStartTime, tempForm.studyPlanEndTime)

      this.form.examAdmin = tempForm.examAdmin
      this.form.examAdminEn = tempForm.examAdminEn
      this.form.examFile = tempForm.examFile
      this.form.examPlanEndTime = tempForm.examPlanEndTime
      this.form.examPlanStartTime = tempForm.examPlanStartTime
      this.setDateExam(tempForm.examPlanStartTime, tempForm.examPlanEndTime)

      this.form.certificateAdmin = tempForm.certificateAdmin
      this.form.certificateAdminEn = tempForm.certificateAdminEn
      this.form.certificateFile = tempForm.certificateFile
      this.form.certificatePlanEndTime = tempForm.certificatePlanEndTime
      this.form.certificatePlanStartTime = tempForm.certificatePlanStartTime
      this.setDateCertificate(tempForm.certificatePlanStartTime, tempForm.certificatePlanEndTime)

      this.form.sDataStatus = data.dataStatus
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
// @import '../less/edit.less';
.ant-modal-body .ant-form .ant-form-item {
  margin-bottom: 5px;
}
h3.form-cap-title {
  font-weight: bold;
}
</style>
