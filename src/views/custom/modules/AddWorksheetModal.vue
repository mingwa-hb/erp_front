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
    <a-spin :spinning="confirmLoading" class="form-container">
      <a-form-model ref="ruleForm" :model="form" :rules="rulesDynamic" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="客户名称(公司名称)" prop="companyId">
          <!-- <a-input placeholder="请输入客户名称" v-model.trim="form.companyName" /> -->
          <j-select-company-for-worksheet
            placeholder="请选择客户名称"
            :multiple="false"
            v-model="form.companyId"
            @select="onSelectCompany"
          />
        </a-form-model-item>

        <a-form-model-item label="客户联系人" prop="realName">
          <a-input placeholder="请输入客户联系人" v-model.trim="form.realName" />
        </a-form-model-item>

        <a-form-model-item label="联系方式" prop="phone">
          <a-input placeholder="请输入联系方式" v-model.trim="form.phone" />
        </a-form-model-item>

        <a-form-model-item label="沟通分类" prop="communicateType">
          <a-select placeholder="请选择沟通分类" v-model.trim="form.communicateType">
            <a-select-option v-for="item in communicateTypeTypeList.slice(1)" :key="item.itemValue">
              {{ item.itemText }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="沟通内容(客户问题描述)" prop="content">
          <j-editor v-model="form.content" @input="onChangeConetent" />
        </a-form-model-item>

        <a-form-model-item label="核心诉求" prop="coreDemand">
          <a-select placeholder="请选择核心诉求" v-model.trim="form.coreDemand">
            <a-select-option v-for="item in coreDemandTypeList.slice(1)" :key="item.itemValue">
              {{ item.itemText }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="处理意见" prop="dealYj">
          <a-select placeholder="请选择处理意见" v-model.trim="form.dealYj">
            <a-select-option v-for="item in dealYjTypeList.slice(1)" :key="item.itemValue">
              {{ item.itemText }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="处理方案关键时间点" prop="dealCoreTime">
          <a-date-picker
            placeholder="请选择处理方案关键时间点"
            v-model="form.dealCoreTime"
            show-time
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
          />
        </a-form-model-item>

        <a-form-model-item label="客户详细处理情况及意见" prop="userDetailYj">
          <a-textarea
            placeholder="请输入客户详细处理情况及意见"
            v-model.trim="form.userDetailYj"
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
        </a-form-model-item>

        <a-form-model-item label="沟通时间" prop="communicateTime">
          <a-date-picker
            placeholder="请选择沟通时间"
            v-model="form.communicateTime"
            show-time
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
          />
        </a-form-model-item>

        <a-form-model-item label="沟通人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <JSelectUserByRole
            placeholder="请选择沟通人"
            :multiple="false"
            v-model.trim="form.communicatePerson"
            roleCode=""
          />
        </a-form-model-item>

        <a-form-model-item label="工单状态" prop="workStatus">
          <a-radio-group v-model="form.workStatus">
            <a-radio v-for="item in workStatusTypeList.slice(1)" :key="item.itemValue" :value="item.itemValue">
              {{ item.itemText }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item label="邮件发送地址" prop="mailSend">
          <a-input placeholder="请输入邮件发送地址,用英文分号隔开" v-model.trim="form.mailSend" />
        </a-form-model-item>

        <a-form-model-item label="是否发送邮件" prop="isSend">
          <a-radio-group v-model="form.isSend">
            <a-radio v-for="item in isSendTypeList.slice(1)" :key="item.itemValue" :value="item.itemValue">
              {{ item.itemText }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-spin>

    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleOk" :disabled="submitDisabled">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

import { isEmail, isMobile } from '@/utils/validate'
import { customApiList } from '@/api/api'

import JSelectCompanyForWorksheet from '@/components/jeecgbiz/JSelectCompanyForWorksheet'
import JEditor from '@/components/jeecg/JEditor'

import mixin_code_list from '../mixins/CodeListMixin'

import JSelectUserByRole from '@/components/jeecgbiz/JSelectUserByRole'

export default {
  name: 'AddWorksheetModal', //新增|编辑工单录入弹框
  mixins: [mixin_code_list],
  components: { JSelectCompanyForWorksheet, JEditor, JSelectUserByRole },
  props: {},
  data() {
    return {
      type: 'add',
      visible: false,
      confirmLoading: false,
      submitDisabled: false, //是否可以编辑
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      form: {
        id: undefined,
        companyId: undefined, //客户id  1402445076772229121
        companyName: undefined, //客户名称 测试公司JF
        realName: undefined, //客户联系人
        phone: undefined, //联系方式
        communicateType: undefined, //沟通分类
        content: undefined, //沟通内容
        coreDemand: undefined, //核心诉求
        dealYj: undefined, //处理意见
        dealCoreTime: undefined, //处理方案关键时间点
        userDetailYj: undefined, //客户详细处理情况及意见
        communicateTime: undefined, //沟通时间
        communicatePerson: undefined, //沟通人
        workStatus: undefined, //状态
        mailSend: undefined, //邮件发送地址
        isSend: undefined //是否发送邮件
      },
      rules: {
        companyId: [{ required: true, message: '请输入客户名称', trigger: 'change' }],
        realName: [{ required: true, message: '请输入客户联系人', trigger: 'change' }],
        phone: [{ required: true, validator: this.validatePhone, trigger: 'change' }],
        communicateType: [{ required: true, message: '请选择沟通分类', trigger: 'change' }],
        content: [{ required: true, message: '请输入沟通内容', trigger: 'change' }],
        coreDemand: [{ required: true, message: '请选择核心诉求', trigger: 'change' }],
        dealYj: [{ required: true, message: '请选择处理意见', trigger: 'change' }],
        dealCoreTime: [{ required: true, message: '请选择处理方案关键时间点', trigger: 'change' }],
        userDetailYj: [{ required: true, message: '请输入客户详细处理情况及意见', trigger: 'change' }],
        communicateTime: [{ required: true, message: '请选择沟通时间', trigger: 'change' }],
        communicatePerson: [{ required: true, message: '请输入沟通人', trigger: 'change' }],
        workStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
        // mailSend: [{ required: true, message: '请选择状态', trigger: 'change' }],
        isSend: [{ required: true, message: '请选择是否发送邮件', trigger: 'change' }]
      }
    }
  },
  created() {},
  computed: {
    ...mapGetters(['pUserInfo']),
    title({ type }) {
      return type == 'edit' ? '修改工单' : '新增工单'
    },
    rulesDynamic({ form, rules, validateEmail }) {
      let isSendRequired = form.isSend == 1 ? true : false
      let mailSend = [
        {
          required: isSendRequired,
          message: '请输入邮件发送地址,用英文分号隔开',
          trigger: 'change'
        }
      ]
      return Object.assign({ mailSend }, rules)
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
      this.doFormSubmit()
    },
    validatePhone(rule, value, callback) {
      if (!!value) {
        if (isMobile(value)) {
          callback()
        } else {
          callback('请输入正确的联系方式！')
        }
      } else {
        callback('联系方式不能为空！')
      }
    },
    validateEmail(rule, value, callback) {},
    setModalType(type) {
      this.type = type || 'add'
    },
    onSelectCompany(rows) {
      this.form.companyId = rows[0].companyId
      this.form.companyName = rows[0].companyName
    },
    onChangeConetent(content) {
      // console.log(content)
      // this.form.content = content
      this.$refs.ruleForm.clearValidate('content')
    },
    doResetForm() {
      this.form.id = undefined
      this.form.companyId = undefined
      this.form.companyName = undefined
      this.form.realName = undefined
      this.form.phone = undefined
      this.form.communicateType = undefined
      this.form.content = undefined
      this.form.coreDemand = undefined
      this.form.dealYj = undefined
      this.form.dealCoreTime = moment().format('YYYY-MM-DD HH:mm:ss')
      this.form.userDetailYj = undefined
      this.form.communicateTime = moment().format('YYYY-MM-DD HH:mm:ss')
      this.form.communicatePerson = this.pUserInfo.userName
      this.form.workStatus = '1'
      this.form.mailSend = undefined
      this.form.isSend = '2'
    },
    doSetForm(record) {
      if (!!record.id) {
        this.form.id = record.id
        this.form.companyId = record.companyId
        this.form.companyName = record.companyName
        this.form.realName = record.realName
        this.form.phone = record.phone
        this.form.communicateType = !!record.communicateType ? record.communicateType.toString() : undefined
        this.form.content = record.content
        this.form.coreDemand = !!record.coreDemand ? record.coreDemand.toString() : undefined
        this.form.dealYj = !!record.dealYj ? record.dealYj.toString() : undefined
        this.form.dealCoreTime = record.dealCoreTime
        this.form.userDetailYj = record.userDetailYj
        this.form.communicateTime = record.communicateTime
        this.form.communicatePerson = record.communicatePerson
        this.form.workStatus = !!record.workStatus ? record.workStatus.toString() : undefined
        this.form.mailSend = !!record.mailSend ? record.mailSend.toString() : undefined
        this.form.isSend = !!record.isSend ? record.isSend.toString() : undefined
      }
    },
    initModal(type = 'add', record = null) {
      this.setModalType(type)
      this.edit(record)
    },
    edit(record) {
      this.initForm(record)
      this.showModal()
    },
    initForm(record) {
      if (!!record && !!record.id) {
        this.doSetForm(record)
      } else {
        this.doResetForm()
      }
    },
    doFormSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.doSendFormDataSubmit()
        } else {
          return false
        }
      })
    },
    doSendFormSuccessAfter() {
      setTimeout(() => {
        this.$emit('renovate', this.form)
        this.handleCancel()
      }, 0)
    },
    doSendFormDataSubmit() {
      let opts = {
        ...this.form
      }
      this.type == 'add' ? this.addWorkSheet(opts) : this.editWorkSheet(opts)
    },
    addWorkSheet(opts) {
      this.submitDisabled = true
      let mes = opts.isSend == 1 ? '邮件发送' : '工单新增'
      customApiList.addWorkSheet(opts).then(res => {
        this.submitDisabled = false
        if (res.code == 200 && !!res.success) {
          this.$message.success(res.message || `${mes}成功！`)
          this.doSendFormSuccessAfter()
        } else {
          this.$message.error(res.message || `${mes}失败！`)
        }
      })
    },
    editWorkSheet(opts) {
      if (!!opts.id) {
        this.submitDisabled = true
        let mes = opts.isSend == 1 ? '邮件发送' : '工单编辑'
        customApiList.editWorkSheet(opts).then(res => {
          this.submitDisabled = false
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.message || `${mes}成功！`)
            this.doSendFormSuccessAfter()
          } else {
            this.$message.error(res.message || `${mes}失败！`)
          }
        })
      } else {
        this.$message.error('工单ID不存在，请重新刷新页面！')
      }
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.modal-container {
  .form-container {
    .ant-form {
      .ant-form-item {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
