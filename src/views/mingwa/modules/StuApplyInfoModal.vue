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
        <a-form-item label="合同编号" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="isEditStatus == 2">
          <j-select-contract
            placeholder="请输入合同编号"
            :multiple="false"
            v-decorator="['contractNo', validatorRules.contractNo]"
          />
        </a-form-item>
        <a-form-item label="合同编号" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="isEditStatus == 1">
          <j-select-contract
            placeholder="请输入合同编号"
            :multiple="false"
            v-decorator="['contractNo', validatorRules.contractNo]"
            :disabled="true"
          />
        </a-form-item>
        <!-- <a-form-item label="合同编号" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!!model.id">
          <a-input placeholder="" v-decorator="['contractNo', validatorRules.contractNo]" :disabled="true" />
        </a-form-item> -->
        <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-select-student
            placeholder="请选择学员"
            :multiple="false"
            v-decorator="['stuInfoId', validatorRules.stuInfoId]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号">
          <a-input placeholder="" v-decorator="['idCard', validatorRules.idCard]" :disabled="true" />
        </a-form-item>
        <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="" v-decorator="['mobile', validatorRules.mobile]" :disabled="true" />
        </a-form-item>

        <a-form-item label="累计缴纳社保时长" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            default-value=""
            v-model="socialSecurityDuration"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            @change="handleChange"
          >
            <a-select-option value="0012">小于12个月</a-select-option>
            <a-select-option value="1336">12至36个月</a-select-option>
            <a-select-option value="3600">36个月以上</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="工种/级别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-select-work-type
            placeholder="请选择工种/级别"
            :multiple="false"
            v-decorator="['workTypeId', validatorRules.workTypeId]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="报名日期" class="applyDate">
          <j-date
            style="width: 100%"
            :getCalendarContainer="node => node.parentNode"
            v-decorator="['applyDate', validatorRules.applyDate]"
            placeholder="请选择报名日期"
            dateFormat="YYYY-MM-DD"
          ></j-date>
        </a-form-item>
        <a-form-item label="项目经理" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-select-user-by-dep
            v-if="isEditStatus == 1"
            placeholder="请选择项目经理"
            :multi="false"
            v-decorator="['manager', validatorRules.manager]"
            :disabled="true"
          />
          <j-select-user-by-dep
            v-if="isEditStatus == 2"
            placeholder="请选择项目经理"
            :multi="false"
            v-decorator="['manager', validatorRules.manager]"
            :disabled="true"
          />
        </a-form-item>
        <a-form-item label="业务支持" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-select-user-by-dep
            v-if="isEditStatus == 1"
            placeholder="请选择业务支持"
            :multi="false"
            v-decorator="['supporter', validatorRules.supporter]"
            :disabled="true"
          />
          <j-select-user-by-dep
            v-if="isEditStatus == 2"
            placeholder="请选择业务支持"
            :multi="false"
            v-decorator="['supporter', validatorRules.supporter]"
            :disabled="true"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
          <a-select
            v-decorator="['status', { initialValue: '正常' }, validatorRules.status]"
            placeholder="请选择状态"
            @change="changeStatus"
            :getPopupContainer="target => target.parentNode"
          >
            <a-select-option value="正常">正常</a-select-option>
            <a-select-option value="离职">离职</a-select-option>
            <a-select-option value="退费">退费</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="refundReasonVisible" :labelCol="labelCol" :wrapperCol="wrapperCol" label="退费原因">
          <a-textarea placeholder="" v-decorator="['refundReason', validatorRules.refundReason]" :maxLength="100" />
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
import _ from 'lodash'
import JSelectContract from '@/components/jeecgbiz/JSelectContract'
import JSelectStudent from '@/components/jeecgbiz/JSelectStudent'
import JSelectWorkType from '@/components/jeecgbiz/JSelectWorkType'
import JSelectPosition from '@/components/jeecgbiz/JSelectPosition'
import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'
import { addApplyInfo, editApplyInfo, ajaxGetUserInfoById, ajaxGetContracts } from '@/api/api'
import JDate from '@/components/jeecg/JDate'

export default {
  name: 'StuApplyInfoModal',
  components: {
    JSelectContract,
    JSelectStudent,
    JSelectWorkType,
    JSelectPosition,
    JSelectUserByDep,
    JDate
  },
  data() {
    return {
      title: '操作',
      visible: false,
      refundReasonVisible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      confirmLoading: false,
      form: null,
      validatorRules: {
        status: { rules: [{ required: true, message: '请选择状态' }] },
        contractNo: { rules: [{ required: true, message: '请输入合同编号!' }] },
        stuInfoId: { rules: [{ required: true, message: '请输入姓名' }] },
        applyDate: { rules: [{ required: true, message: '请输入报名日期!' }] },
        manager: { rules: [{ required: true, message: '请选择项目经理!' }] },
        supporter: { rules: [{ required: true, message: '请选择业务支持!' }] },
        workTypeId: { rules: [{ required: true, message: '请输入工种/级别!' }] }
      },
      url: {
        add: '/erp/stuApplyInfo/add',
        edit: '/erp/stuApplyInfo/edit'
      },
      isEditStatus: 1, //1为编辑edit 2为新增add
      contractNo: undefined,
      stuInfoId: undefined,
      socialSecurityDuration: undefined
    }
  },
  computed: {
    isShowDraftBtn({ model }) {
      return model.dataStatus == 4 ? false : true
    }
  },
  created() {
    this.initCreateForm()
  },
  watch: {
    contractNo(val) {
      if (!!val) {
        this.handleContractNo()
      }
    },
    stuInfoId(val) {
      if (!!val) {
        this.handleStudentInfo()
      }
    }
  },
  methods: {
    initCreateForm() {
      let that = this
      this.form = this.$form.createForm(this, {
        onValuesChange: that.onFormValuesChange
      })
    },
    onFormValuesChange(props, values) {
      if (!!values.stuInfoId) {
        this.stuInfoId = values.stuInfoId
      }
      if (!!values.contractNo) {
        this.contractNo = values.contractNo
      }
    },
    getFormFieldValue(field) {
      return this.form.getFieldValue(field)
    },
    handleContractNo() {
      let that = this
      let tmpContractNo = this.contractNo
      if (!!tmpContractNo) {
        let params = {
          id: tmpContractNo,
          dataStatus: 4
        }
        ajaxGetContracts(params).then(res => {
          if ((res.code == 0 || res.code == 200) && !!res.success) {
            let contracts = res.result.records
            let targetObj = _.find(contracts, ['contractNo', params.id])
            that.$nextTick(() => {
              that.form.setFieldsValue({ manager: targetObj.manager, supporter: targetObj.supporter })
            })
          }
        })
      } else {
        that.isEditStatus != 1 && that.$message.warning('contractNo缺失，请重新操作！')
      }
    },

    handleStudentInfo() {
      let that = this
      let tmpStuInfoId = this.stuInfoId
      if (!!tmpStuInfoId) {
        let params = {
          id: tmpStuInfoId
        }
        ajaxGetUserInfoById(params).then(res => {
          if ((res.code == 0 || res.code == 200) && !!res.success) {
            that.form.setFieldsValue({ idCard: res.result.idCard, mobile: res.result.mobile })
          }
        })
      } else {
        that.isEditStatus != 1 && that.$message.warning('stuInfoId缺失，请重新操作！')
      }
    },
    validateDictCode(rule, value, callback) {
      // 重复校验
      var params = {
        tableName: 'mw_stu_apply_info',
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
    handleChange(value) {
      // this.model.stuInfoId = value
    },
    add() {
      this.stuInfoId = undefined
      this.contractNo = undefined
      this.socialSecurityDuration = undefined
      // this.edit({})
      this.model = {}
      this.visible = true
      this.$nextTick(() => {
        this.form.resetFields()
      })
      this.isEditStatus = 2
    },
    edit(record) {
      this.isEditStatus = 1
      if (record.id) {
        this.visiblekey = true
      } else {
        this.visiblekey = false
      }
      this.model = Object.assign({}, record)
      this.socialSecurityDuration = this.model.socialSecurityDuration
      this.visible = true
      // this.form.resetFields()

      this.$nextTick(() => {
        let opts = _.pick(this.model, [
          'contractNo',
          'stuInfoId',
          'idCard',
          'mobile',
          // 'socialSecurityDuration',
          'applyDate',
          'manager',
          'supporter',
          'workTypeId',
          'refundReason',
          'status'
        ])
        this.form.setFieldsValue(opts)
      })
      if (this.model.id) {
        this.handleStudentInfo()
        this.changeStatus(this.model.status)
      }
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
          values.contractNo = (values.contractNo || '').trim()
          values.stuInfoId = (values.stuInfoId || '').trim()
          values.idCard = (values.idCard || '').trim()
          values.mobile = (values.mobile || '').trim()
          values.applyDate = (values.applyDate || '').trim()
          values.manager = (values.manager || '').trim()
          values.supporter = (values.supporter || '').trim()
          values.workType = (values.workType || '').trim()
          values.socialSecurityDuration = this.socialSecurityDuration
          // let formData = Object.assign(that.model, values)
          let formData = Object.assign({ id: this.model.id }, values)
          formData.dataStatus = data_status
          let objSubmit
          if (!that.model.id) {
            objSubmit = addApplyInfo(formData)
          } else {
            objSubmit = editApplyInfo(formData)
          }
          objSubmit
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
      this.$nextTick(() => {
        this.form.resetFields()
      })
      this.visible = false
      this.$emit('close')
    },
    changeStatus(value) {
      if (value == '退费') {
        this.refundReasonVisible = true
      } else {
        this.refundReasonVisible = false
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
