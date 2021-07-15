<template>
  <a-modal
    :title="title"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="报名编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-select-apply-info-exam
            placeholder="请输入报名编号"
            :multiple="false"
            v-decorator="['applyInfoId', validatorRules.applyInfoId]"
            :valueUrl="newApplyInfoListUrl"
            :onchange="handleExamUserInfo()"
            :disabled="pageType"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
          <a-input placeholder="请输入姓名" v-decorator="['userName', {}]" :disabled="true" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号">
          <a-input placeholder="请输入身份证号" v-decorator="['idCard', {}]" :disabled="true" />
        </a-form-item>
        <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入手机号码" v-decorator="['mobile', {}]" :disabled="true" />
        </a-form-item>
        <a-form-item label="工种/级别" :labelCol="labelCol" :wrapperCol="wrapperCol" :disabled="true">
          <a-input placeholder="请输入工种/级别" v-decorator="['workType', {}]" :disabled="true" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="从事职业">
          <a-input placeholder="请输入从事职业" v-decorator="['career', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证地址">
          <v-distpicker
            hide-area
            :province="model.idCardProvince"
            :city="model.idCardCity"
            @province="onChangeIDProvince"
            @city="onChangeIDCity"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="常住地址">
          <v-distpicker
            hide-area
            :province="model.residentialProvince"
            :city="model.residentialCity"
            @province="onChangeAddressProvince"
            @city="onChangeAddressCity"
          ></v-distpicker>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参加工作日期" class="workStartDate">
          <j-date
            style="width: 100%"
            :getCalendarContainer="node => node.parentNode"
            v-decorator="['workStartDate', validatorRules.workStartDate]"
            placeholder="请选择参加工作日期"
            dateFormat="YYYY-MM-DD"
          ></j-date>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="本工种职业年限">
          <a-input
            placeholder="请输入本工种职业年限"
            v-decorator="['curProfessionDuration', validatorRules.curProfessionDuration]"
            :maxLength="2"
          />
        </a-form-item>
        <a-form-item label="原职业（工种/等级）" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-select-work-type
            placeholder="请选择原职业（工种/等级）"
            :multiple="false"
            v-decorator="['preWorkTypeId', {}]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="原证书编号">
          <a-input placeholder="请输入原证书编号" v-decorator="['preCertificateNo', {}]" :maxLength="100" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { httpAction, postAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import JSelectContract from '@/components/jeecgbiz/JSelectContract'
import JSelectStudent from '@/components/jeecgbiz/JSelectStudent'
import JSelectWorkType from '@/components/jeecgbiz/JSelectWorkType'
import { addApplyExam, editApplyExam, ajaxGetApplyUserInfo } from '@/api/api'
import JSelectApplyInfoExam from '@/components/jeecgbiz/JSelectApplyInfoExam'
import JDate from '@/components/jeecg/JDate'
import VDistpicker from 'v-distpicker'
import ATextarea from 'ant-design-vue/es/input/TextArea'

export default {
  name: 'StuApplyExamModal',
  components: {
    ATextarea,
    JSelectContract,
    JSelectStudent,
    JSelectWorkType,
    JSelectApplyInfoExam,
    JDate,
    VDistpicker
  },
  data() {
    return {
      refundReasonVisible: false,
      title: '操作',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      idCardProvince: '',
      validatorRules: {
        code: {
          validateFirst: true,
          rules: [
            { required: true, message: '请输入数据源编码!' },
            {
              validator: (rule, value, callback) => {
                let pattern = /^[a-z|A-Z][a-z|A-Z\d_-]{0,}$/
                if (!pattern.test(value)) {
                  callback('编码必须以字母开头，可包含数字、下划线、横杠')
                } else {
                  validateDuplicateValue('stu_company', 'name', value, this.model.id, callback)
                }
              }
            }
          ]
        },
        applyInfoId: { rules: [{ required: true, message: '请输入报名编号!' }] },
        career: { rules: [{ required: true, message: '请输入从事职业!' }] },
        workStartDate: { rules: [{ required: true, message: '请选择参加工作日期' }] },
        curProfessionDuration: { rules: [{ required: true, message: '本工种职业年限' }] },
        status: { rules: [{ required: true, message: '请选择状态' }] },
        refundReason: { rules: [{ required: true, message: '请填写退费原因' }] }
      },
      url: {
        add: '/erp/stuApplyExam/add',
        edit: '/erp/stuApplyExam/edit'
      },
      newApplyInfoListUrl: '/erp/stuApplyInfo/getApplyInfos?canUse=canExam'
    }
  },
  computed: {
    pageType({ model }) {
      return !!model && !!model.id ? true : false
    }
  },
  created() {},
  methods: {
    handleExamUserInfo() {
      setTimeout(() => {
        var tmpApplyInfoId = this.form.getFieldValue('applyInfoId')
        if (tmpApplyInfoId != undefined && tmpApplyInfoId != '') {
          var params = {
            id: tmpApplyInfoId
          }
          ajaxGetApplyUserInfo(params).then(res => {
            if (res.success) {
              document.getElementById('userName').setAttribute('placeholder', res.result.userName)
              document.getElementById('idCard').setAttribute('placeholder', res.result.idCard)
              document.getElementById('mobile').setAttribute('placeholder', res.result.mobile)
              document.getElementById('workType').setAttribute('placeholder', res.result.workType)
            }
          })
        }
      }, 400)
    },
    clearJSField() {
      if (document.getElementById('userName') != undefined && document.getElementById('userName') != null) {
        document.getElementById('userName').setAttribute('placeholder', '')
        document.getElementById('idCard').setAttribute('placeholder', '')
        document.getElementById('mobile').setAttribute('placeholder', '')
        document.getElementById('workType').setAttribute('placeholder', '')
      }
    },
    onChangeIDProvince(data) {
      this.model.idCardProvince = data.value
    },
    onChangeIDCity(data) {
      this.model.idCardCity = data.value
    },
    onChangeAddressProvince(data) {
      this.model.residentialProvince = data.value
    },
    onChangeAddressCity(data) {
      this.model.residentialCity = data.value
    },
    validateDictCode(rule, value, callback) {
      // 重复校验
      var params = {
        tableName: 'mw_stu_apply_exam',
        fieldName: 'contractNo',
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
    add() {
      this.clearJSField()
      this.edit({})
    },
    edit(record) {
      if (record.id) {
        this.visiblekey = true
      } else {
        this.visiblekey = false
      }
      if (record.status == '退费') {
        this.refundReasonVisible = true
      } else {
        this.refundReasonVisible = false
      }
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, [
            'applyInfoId',
            'userName',
            'workType',
            'idCard',
            'mobile',
            'applyDate',
            'preWorkTypeId',
            'curProfessionDuration',
            'workStartDate',
            'career',
            'preCertificateNo'
            // 'idCardProvince',
            // 'idCardCity',
            // 'residentialProvince',
            // 'residentialCity'
          ])
        )
      })
      if (this.model.id) {
        this.handleExamUserInfo()
      }
    },
    // 确定
    handleOk() {
      const that = this
      var isWinClose = false
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)

          //根据status,判断是否需要重置退费原因字段
          if (formData.status != '退费') {
            formData.refundReason = ''
          }
          let obj
          console.log(formData)
          if (!this.model.id) {
            obj = addApplyExam(formData)
          } else {
            obj = editApplyExam(formData)
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
