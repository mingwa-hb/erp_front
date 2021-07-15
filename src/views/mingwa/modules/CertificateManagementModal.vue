<template>
  <a-modal
    :title="title"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    okText="保存"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
          <a-input placeholder="" :maxLength="36" v-model.trim="userName" disabled />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号">
          <a-input placeholder="" :maxLength="36" v-model.trim="idCard" disabled />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号码">
          <a-input placeholder="" :maxLength="36" v-model.trim="mobile" disabled />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工种/等级">
          <a-input placeholder="" :maxLength="36" v-model.trim="workType" disabled />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证书制作日期">
          <a-input placeholder="" :maxLength="36" v-model.trim="certificateMadeDate" disabled />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证书编号">
          <a-input placeholder="" :maxLength="36" v-model.trim="certificateNo" disabled />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证书发放日期">
          <a-date-picker
            style="width: 100%"
            :valueFormat="dateFormat"
            @change="onChange"
            v-model.trim="certificatePassDate"
          />
        </a-form-item>
      </a-form>
    </a-spin>

    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <!--<a-button type="primary" v-if="!!isShowDraftBtn" @click="handleOk('1')">存入草稿</a-button>-->
      <a-button type="primary" @click="handleOk('2')">提交审核</a-button>
    </template>
  </a-modal>
</template>

<script>
import JSelectCompany from '@/components/jeecgbiz/JSelectCompany'
import JImageUpload from '../../../components/jeecg/JImageUpload'
import JFileUpload from '../../../components/jeecg/JFileUpload'
import JDate from '@/components/jeecg/JDate'
import { putAction } from '@/api/manage'

export default {
  name: 'CertificateManagementModal', //证书发放登记
  components: {
    JSelectCompany,
    JImageUpload,
    JFileUpload,
    JDate
  },
  data() {
    return {
      title: '证书发放登记',
      visible: false,
      disableSubmit: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        add: '/erp/student/add',
        edit: '/erp/mwStuCertVO/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      },
      dateFormat: 'YYYY-MM-DD',
      id: undefined,
      stuLenId: undefined,
      userName: undefined, //姓名
      idCard: undefined, //身份证号
      mobile: undefined, //手机号码
      workType: undefined, //工种/级别
      certificateMadeDate: undefined, //制作证书日期
      certificateNo: undefined, //证书编号
      certificatePassDate: undefined, //证书发放日期
      dateString: undefined, //保存选择的新时间
      dataStatus: undefined
    }
  },
  computed: {
    isShowDraftBtn({ dataStatus }) {
      return dataStatus == 4 ? false : true
    }
  },
  created() {},
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.id = record.id
      this.stuLenId = record.stuLenId
      this.userName = record.userName
      this.idCard = record.idCard
      this.mobile = record.mobile
      this.workType = record.workType
      this.certificateMadeDate = record.certificateMadeDate
      this.certificateNo = record.certificateNo
      this.certificatePassDate = record.certificatePassDate
      this.dataStatus = record.dataStatus
      this.dateString =  record.certificatePassDate
      this.visible = true
    },

    // 确定
    handleOk(status = '1') {
      debugger;
      let data_status = status || '1' //1-草稿,2-待审核
      let parameter = {
        id: this.id,
        stuLenId: this.stuLenId,
        certificatePassDate: this.dateString,
        dataStatus: data_status
      }
      if (!!this.dateString) {
        putAction(this.url.edit, parameter).then(res => {
          if (res.code == 200 && !!res.message) {
            this.$message.success(res.message)
            this.$emit('ok')
          } else {
            this.$message.warning(res.message)
          }
        })
      }else{
        this.$message.warning('未修改任何内容,提交失败')
      }
      this.visible = false
    },
    // 关闭
    handleCancel() {
      this.close()
    },
    close() {
      this.visible = false
      this.disableSubmit = false
    },
    onChange(date, dateString) {
      this.dateString = dateString
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
</style>
