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
          <j-select-user-by-dep placeholder="请选择班主任" :multi="false" v-model="headmaster" disabled />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始学习日期" :style="formItemCustomStyle">
          <j-date
            style="width: 100%"
            v-decorator="['learningStartTime', validatorRules.learningStartTime]"
            placeholder="请选择开始学习日期"
            dateFormat="YYYY-MM-DD"
            @change="onChangeStartTime"
          ></j-date>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束学习日期" :style="formItemCustomStyle">
          <j-date
            style="width: 100%"
            v-decorator="['learningFinishTime', validatorRules.learningFinishTime]"
            placeholder="请选择结束学习日期"
            dateFormat="YYYY-MM-DD"
            @change="onChangeFinishTime"
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
            @change="learningDurationRules"
            oninput="this.value=this.value.replace(/\D/g,'')"
            :maxLength="5"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否报名考试"
          :style="formItemCustomStyle"
          v-if="isApplyExamShow == 1"
        >
          <a-radio-group v-decorator="['isApplyExam', validatorRules.isApplyExam]">
            <a-radio value="1">否</a-radio>
            <a-radio value="2">是</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否报名考试"
          :style="formItemCustomStyle"
          v-if="isApplyExamShow == 2"
        >
          <a-radio-group v-decorator="['isApplyExam', validatorRules.isApplyExam]" :disabled="ischange">
            <a-radio value="1">否</a-radio>
            <a-radio value="2">是</a-radio>
          </a-radio-group>
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
import moment from 'moment'
import pick from 'lodash.pick'
import JSelectCompany from '@/components/jeecgbiz/JSelectCompany'
import JSelectContract from '@/components/jeecgbiz/JSelectContract'
import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'
import JSelectWorkType from '@/components/jeecgbiz/JSelectWorkType'
import JDate from '@/components/jeecg/JDate'
import { addLearning, editLearning, ajaxGetApplyUserInfo } from '@/api/api'
import JSelectApplyInfo from '@/components/jeecgbiz/JSelectApplyInfo'

export default {
  name: 'StuLearningModal',
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
      isApplyExamShow: undefined,
      ischange: undefined,
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
      headmaster: undefined, //班主任
      validatorRules: {
        applyInfoId: { rules: [{ required: true, message: '请选择报名编号!' }] },
        applyUserName: { rules: [{ required: false, message: '请输入姓名' }] },
        idCard: { rules: [{ required: false, message: '请输入身份证号码!' }] },
        mobile: { rules: [{ required: false, message: '请输入手机号码!' }] },
        workTypeId: { rules: [{ required: false, message: '选择工种/等级!' }] },
        account: { rules: [{ required: false, message: '请输入帐号!' }] },
        accountStartDate: { rules: [{ required: false, message: '请输入账号启用日期!' }] },
        learningStartTime: { rules: [{ required: false, message: '请选择开始学习日期!' }] },
        learningFinishTime: { rules: [{ required: false, message: '请选择结束学习日期!' }] },
        learningDuration: { rules: [{ required: false, message: '请输入学习时长!', trigger: '/^[1-9]d*$/' }] },
        isApplyExam: { rules: [{ required: false, message: '是否报名考试!' }], initialValue: '1' }
      },
      url: {
        add: '/erp/stuLearning/add',
        edit: '/erp/stuLearning/edit'
      },
      newApplyInfoListUrl: '/erp/stuApplyInfo/getApplyInfos?canUse=canLearn',
      applyInfoId: undefined, //报名编号
      startTime: undefined,
      finishTime: undefined
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
      return model.dataStatus == 4 ? false : true
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
    learningDurationRules(val) {
      let value = val.target.value
      let num
      for (let i = 0; i < value.length; i++) {
        if (value[i] != 0) {
          num = i
          val.target.value = value.slice(num)
          return
        }
      }
    },

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
          console.log(res)
          if ((res.code == 0 || res.code == 200) && !!res.success) {
            this.headmaster = res.result.headMaster
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
      this.isApplyExamShow = 1
      this.visible = true
      this.modalType = 'add'
      this.headmaster = ''
      this.model = {}
      this.reSetForm()
    },
    setAddFormVal() {
      this.addForm.scoreStatus = this.model.scoreStatus
      this.addForm.operationStatus = this.model.operationStatus
    },
    edit(record) {
      this.visible = true
      this.isApplyExamShow = 2
      this.modalType = 'edit'
      this.reSetForm()

      this.model = Object.assign({}, record)
      this.headmaster = record.headmaster
      let initKeys = [
        'applyInfoId',
        'applyUserName',
        'idCard',
        'mobile',
        'account',
        'accountStartDate',
        'workTypeId',
        'learningStartTime',
        'learningFinishTime',
        'learningDuration',
        'isApplyExam'
      ]
      if (record.scoreStatus == 1) {
        initKeys.push('score')
      }
      if (record.operationStatus == 1) {
        initKeys.push('operationScore')
      }

      let formObj = pick(this.model, initKeys)
      if (formObj.isApplyExam == '2') {
        this.ischange = true
      } else {
        this.ischange = false
      }

      this.startTime = formObj.learningStartTime
      this.finishTime = formObj.learningFinishTime

      this.$nextTick(() => {
        this.form.setFieldsValue(formObj)
      })

      this.setAddFormVal()
    },
    // 确定
    handleOk(status = '1') {
      //提交前验证 2021/05/28 dongmm 改 start
      if (!!this.startTime && !!this.finishTime) {
        let isAfter = moment(this.startTime).isAfter(this.finishTime)
        if (!!isAfter) {
          this.$message.warning('开始学习日期不能大于结束学习日期')
          return false
        }
      }
      //提交前验证 2021/05/28 dongmm 改 end
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
          formData.dataStatus = data_status
          let obj
          if (!that.model.id) {
            obj = addLearning(formData)
          } else {
            obj = editLearning(formData)
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
    },

    onChangeStartTime(value) {
      this.startTime = value
      this.form.setFieldsValue({ learningStartTime: value })
    },

    onChangeFinishTime(value) {
      this.finishTime = value
      this.form.setFieldsValue({ learningFinishTime: value })
    }
  }
}
</script>

<style lang="less" scoped></style>
