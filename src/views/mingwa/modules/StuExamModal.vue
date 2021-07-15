<template>
  <a-modal
    :title="title"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          v-if="modalType == 'add'"
          label="报名编号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :style="formItemCustomStyle"
        >
          <j-select-apply-info
            placeholder="请选择报名编号"
            :multiple="false"
            :valueUrl="newApplyInfoListUrl"
            v-decorator="['applyInfoId', validatorRules.applyInfoId]"
            disabled
          />
        </a-form-item>
        <a-form-item
          v-if="modalType == 'edit'"
          label="报名编号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :style="formItemCustomStyle"
        >
          <j-select-apply-info
            placeholder="请选择报名编号"
            :multiple="false"
            :valueUrl="newApplyInfoListUrl"
            v-decorator="['applyInfoId', validatorRules.applyInfoId]"
            :disabled="true"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名" :style="formItemCustomStyle">
          <a-input
            placeholder="请输入姓名"
            v-decorator="['applyUserName', validatorRules.applyUserName]"
            :disabled="true"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号" :style="formItemCustomStyle">
          <a-input placeholder="请输入身份证号" v-decorator="['idCard', validatorRules.idCard]" :disabled="true" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号码" :style="formItemCustomStyle">
          <a-input placeholder="请输入手机号码" v-decorator="['mobile', validatorRules.mobile]" :disabled="true" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工种/等级" :style="formItemCustomStyle">
          <j-select-work-type
            placeholder="请选择工种/级别"
            :multiple="false"
            v-decorator="['workTypeId', validatorRules.workTypeId]"
            :disabled="true"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="帐号" :style="formItemCustomStyle">
          <a-input placeholder="请输入帐号" v-decorator="['account', validatorRules.account]" :disabled="true" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账号启用日期" :style="formItemCustomStyle">
          <j-date
            style="width: 100%"
            v-decorator="['accountStartDate', validatorRules.accountStartDate]"
            placeholder="请输入账号启用日期"
            dateFormat="YYYY-MM-DD"
            :disabled="true"
          ></j-date>
        </a-form-item>
        <a-form-item label="班主任" :labelCol="labelCol" :wrapperCol="wrapperCol" :style="formItemCustomStyle">
          <j-select-user-by-dep
            placeholder="请选择班主任"
            :multi="false"
            v-decorator="['headmaster', validatorRules.headmaster]"
            disabled
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始学习日期" :style="formItemCustomStyle">
          <j-date
            style="width: 100%"
            v-decorator="['learningStartTime', validatorRules.learningStartTime]"
            placeholder="请选择开始学习日期"
            dateFormat="YYYY-MM-DD"
            disabled
          ></j-date>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束学习日期" :style="formItemCustomStyle">
          <j-date
            style="width: 100%"
            v-decorator="['learningFinishTime', validatorRules.learningFinishTime]"
            placeholder="请选择结束学习日期"
            dateFormat="YYYY-MM-DD"
            disabled
          ></j-date>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="学习时长（分钟）"
          :style="formItemCustomStyle"
        >
          <a-input
            placeholder="请输入学习时长"
            v-decorator="['learningDuration', validatorRules.learningDuration]"
            disabled
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="理论考试日期" :style="formItemCustomStyle">
          <j-date
            style="width: 100%"
            v-decorator="['examDate', validatorRules.examDate]"
            placeholder="请输入理论考试日期"
            dateFormat="YYYY-MM-DD"
          ></j-date>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="理论考试状态" :style="formItemCustomStyle">
          <a-radio-group v-decorator="['scoreStatus', validatorRules.scoreStatus]">
            <a-radio value="0">缺考</a-radio>
            <a-radio value="1">正常</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="isShowScore"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="理论考试成绩"
          :style="formItemCustomStyle"
        >
          <a-input
            placeholder="请输入理论考试成绩"
            v-decorator="['score', validatorRules.score]"
            oninput="this.value=this.value.replace(/\D/g,'')"
            :maxLength="5"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实操考试日期" :style="formItemCustomStyle">
          <j-date
            style="width: 100%"
            v-decorator="['operationExamDate', validatorRules.operationExamDate]"
            placeholder="请输入实操考试日期"
            dateFormat="YYYY-MM-DD"
          ></j-date>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实操考试状态" :style="formItemCustomStyle">
          <a-radio-group v-decorator="['operationStatus', validatorRules.operationStatus]">
            <a-radio value="0">缺考</a-radio>
            <a-radio value="1">正常</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="isShowOperationScore"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="实操考试成绩"
          :style="formItemCustomStyle"
        >
          <a-input
            placeholder="请输入实操考试成绩"
            v-decorator="['operationScore', validatorRules.operationScore]"
            oninput="this.value=this.value.replace(/\D/g,'')"
            :maxLength="5"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="总成绩" :style="formItemCustomStyle">
          <a-input
            placeholder="请输入总成绩"
            v-decorator="['totalScore', validatorRules.totalScore]"
            oninput="this.value=this.value.replace(/\D/g,'')"
            :maxLength="5"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="制作证书日期" :style="formItemCustomStyle">
          <j-date
            style="width: 100%"
            v-decorator="['certificateMadeDate', validatorRules.certificateMadeDate]"
            placeholder="请选择制作证书日期"
            dateFormat="YYYY-MM-DD"
          ></j-date>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证书编号" :style="formItemCustomStyle">
          <a-input
            placeholder="请输入证书编号"
            v-decorator="['certificateNo', validatorRules.certificateNo]"
            oninput="this.value=this.value.replace(/[^\x00-\xff]/g,'')"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证书发放日期" :style="formItemCustomStyle">
          <!-- <j-date
            style="width: 100%"
            v-decorator="['certificatePassDate', validatorRules.certificatePassDate]"
            placeholder="请选择证书发放日期"
            dateFormat="YYYY-MM-DD"
          ></j-date> -->
          <a-input
            placeholder="请选择证书发放日期"
            v-decorator="['certificatePassDate', validatorRules.certificatePassDate]"
            dateFormat="YYYY-MM-DD"
            disabled
          />
        </a-form-item>
      </a-form>
    </a-spin>

    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" v-if="!!isShowDraftBtn" @click="handleOk('1')">存入草稿</a-button>
      <a-button type="primary" @click="handleOk('2')">提交审核</a-button>
    </template>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import JSelectCompany from '@/components/jeecgbiz/JSelectCompany'
import JSelectContract from '@/components/jeecgbiz/JSelectContract'
import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'
import JSelectWorkType from '@/components/jeecgbiz/JSelectWorkType'
import JDate from '@/components/jeecg/JDate'
import { addLearning, editLearningExam, ajaxGetApplyUserInfo } from '@/api/api'
import JSelectApplyInfo from '@/components/jeecgbiz/JSelectApplyInfo'

export default {
  name: 'StuExamModal', //考务管理编辑弹窗
  components: {
    JSelectCompany,
    JSelectContract,
    JSelectUserByDep,
    JSelectApplyInfo,
    JDate,
    JSelectWorkType
  },
  data() {
    return {
      title: '操作',
      visible: false,
      modalType: 'add', //弹框类型  add为新增 edit为编辑
      formItemCustomStyle: { display: 'inline-block', width: 'calc(50% - 12px)' },
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      addForm: {
        scoreStatus: '1',
        operationStatus: '1'
      },
      form: null,
      validatorRules: {
        applyInfoId: { rules: [{ required: true, message: '请选择报名编号!' }] },
        applyUserName: { rules: [{ required: false, message: '请输入姓名' }] },
        idCard: { rules: [{ required: false, message: '请输入身份证号码!' }] },
        mobile: { rules: [{ required: false, message: '请输入手机号码!' }] },
        workTypeId: { rules: [{ required: false, message: '选择工种/等级!' }] },
        account: { rules: [{ required: false, message: '请输入帐号!' }] },
        accountStartDate: { rules: [{ required: false, message: '请输入账号启用日期!' }] },
        headmaster: { rules: [{ required: false, message: '请选择班主任!' }] },
        learningStartTime: { rules: [{ required: false, message: '请选择开始学习日期!' }] },
        learningFinishTime: { rules: [{ required: false, message: '请选择结束学习日期!' }] },
        learningDuration: { rules: [{ required: false, message: '请输入学习时长!' }] },
        examDate: { rules: [{ required: false, message: '请选择理论考试日期!' }] },
        scoreStatus: { rules: [{ required: false, message: '理论考试成绩状态!' }], initialValue: '1' },
        score: { rules: [{ required: false, message: '请输入理论考试成绩!' }] },
        operationExamDate: { rules: [{ required: false, message: '请输入实操考试日期!' }] },
        operationStatus: { rules: [{ required: false, message: '请选择实操考试成绩状态!' }], initialValue: '1' },
        operationScore: { rules: [{ required: false, message: '请输入实操考试成绩!' }] },
        totalScore: { rules: [{ required: false, message: '请输入总成绩!' }] },
        certificateMadeDate: { rules: [{ required: false, message: '请输入制作证书日期!' }] },
        certificateNo: { rules: [{ required: false, message: '请输入证书编号!' }] },
        certificatePassDate: { rules: [{ required: false, message: '请输入证书发放日期!' }] }
      },
      url: {
        add: '/erp/stuLearning/add',
        edit: '/erp/stuLearning/editExam'
      },
      newApplyInfoListUrl: '/erp/stuApplyInfo/getApplyInfos?canUse=canLearn',
      applyInfoId: undefined //报名编号
    }
  },
  computed: {
    isShowScore() {
      return this.addForm.scoreStatus == 1 ? true : false
    },
    isShowOperationScore() {
      return this.addForm.operationStatus == 1 ? true : false
    },
    isShowDraftBtn({ model }) {
      return model.dataExamStatus == 4 ? false : true
    }
  },
  watch: {
    applyInfoId(val) {
      if (!!val) {
        this.handleUserInfo()
      }
    }
  },
  created() {
    this.initCreateForm()
  },
  methods: {
    initCreateForm() {
      let that = this
      this.form = this.$form.createForm(this, {
        onValuesChange: that.onFormValuesChange
      })
    },
    onFormValuesChange(props, values) {
      if (!!values.applyInfoId && values.applyInfoId != this.applyInfoId) {
        this.applyInfoId = values.applyInfoId
      }
      if (!!values.scoreStatus && values.scoreStatus != this.addForm.scoreStatus) {
        this.addForm.scoreStatus = values.scoreStatus
      }
      if (!!values.operationStatus && values.operationStatus != this.addForm.operationStatus) {
        this.addForm.operationStatus = values.operationStatus
      }
    },
    handleUserInfo() {
      let that = this
      let userApplyInfoId = this.applyInfoId
      if (!!userApplyInfoId) {
        let params = {
          id: userApplyInfoId
        }
        ajaxGetApplyUserInfo(params).then(res => {
          if ((res.code == 0 || res.code == 200) && !!res.success) {
            that.form.setFieldsValue({ applyUserName: res.result.userName })
            that.form.setFieldsValue({ idCard: res.result.idCard })
            that.form.setFieldsValue({ mobile: res.result.mobile })
            that.form.setFieldsValue({ workTypeId: res.result.workTypeId })
            that.form.setFieldsValue({ account: res.result.account })
            that.form.setFieldsValue({ accountStartDate: res.result.accountStartDate })
          }
        })
      } else {
        that.modalType != 'edit' && that.$message.warning('contractNo缺失，请重新操作！')
      }
    },
    validateDictCode(rule, value, callback) {
      // 重复校验
      var params = {
        tableName: 'mw_stu_company',
        fieldName: 'name',
        fieldVal: value,
        dataId: this.model.id
      }
      duplicateCheck(params).then(res => {
        if (res.success) {
          callback()
        } else {
          callback(res.message)
        }
      })
    },
    reSetForm() {
      this.$nextTick(() => {
        this.form.resetFields()
      })
    },
    add() {
      this.applyInfoId = undefined
      this.addForm.scoreStatus = '1'
      this.addForm.operationStatus = '1'
      this.visible = true
      this.modalType = 'add'
      this.model = {}
      this.reSetForm()
    },
    setAddFormVal() {
      this.addForm.scoreStatus = this.model.scoreStatus
      this.addForm.operationStatus = this.model.operationStatus
    },
    edit(record) {
      this.visible = true
      this.modalType = 'edit'
      this.reSetForm()

      this.model = Object.assign({}, record)
      let initKeys = [
        'applyInfoId',
        'applyUserName',
        'idCard',
        'mobile',
        'account',
        'accountStartDate',
        'headmaster',
        'workTypeId',
        'learningStartTime',
        'learningFinishTime',
        'learningDuration',
        'examDate',
        'scoreStatus',
        'operationExamDate',
        'operationStatus',
        'totalScore',
        'certificateMadeDate',
        'certificateNo',
        'certificatePassDate'
      ]
      if (record.scoreStatus == 1) {
        initKeys.push('score')
      }
      if (record.operationStatus == 1) {
        initKeys.push('operationScore')
      }

      let formObj = pick(this.model, initKeys)

      this.$nextTick(() => {
        this.form.setFieldsValue(formObj)
      })

      this.setAddFormVal()
    },
    // 确定
    handleOk(status = '1') {
      const that = this
      var isWinClose = false
      let data_status = status || '1' //1-草稿,2-待审核
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          if (values.scoreStatus == '0') {
            values.score = ''
          }
          if (values.operationStatus == '0') {
            values.operationScore = ''
          }
          // let formData = Object.assign(that.model, values)
          let formData = Object.assign({ id: this.model.id }, values)
          formData.dataExamStatus = data_status
          let obj
          if (!that.model.id) {
            obj = addLearning(formData)
          } else {
            obj = editLearningExam(formData)
          }
          obj
            .then(res => {
              if (res.success) {
                isWinClose = true
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              if (isWinClose) {
                that.close()
              }
            })
        }
      })
    },
    // 关闭
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped></style>
