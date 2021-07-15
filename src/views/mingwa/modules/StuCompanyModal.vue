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
        <a-row style="width: 80%; margin-left: 9%">
          <a-col :span="16">
            <a-form-item label="营业执照附件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-image-upload
                class="avatar-uploader"
                text="上传"
                v-model="businesslicense"
                :isMultiple="false"
                @change="handleChangeBusinesslicense"
              ></j-image-upload>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <div style="color: #c8cbcf">
              说明：营业执照附件格式支持png、jpg、bmp，尺寸建议为：85.6*54mm/面，图片大小建议小于150KB
            </div>
          </a-col>
        </a-row>
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公司名称">
            <!-- :disabled="!!model.id" -->
            <!-- :readOnly="!!model.id" -->
            <a-input placeholder="请输入公司名称" v-decorator="['name', validatorRules.name]" :maxLength="60" />
          </a-form-item>
          <a-form-item label="上级公司" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-select-company placeholder="请选择上级公司" :multiple="false" v-decorator="['parent', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="统一社会信用代码">
            <a-input placeholder="请输入统一社会信用代码" v-decorator="['licenseNum', {}]" :maxLength="100" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人">
            <a-input placeholder="请输入联系人" v-decorator="['contacts', {}]" :maxLength="36" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系电话">
            <a-input placeholder="请输入联系电话" v-decorator="['phone', validatorRules.phone]" :maxLength="13" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="地址">
            <a-textarea
              placeholder="请输入公司地址"
              v-decorator="['address', validatorRules.address]"
              :rows="4"
              :maxLength="100"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <!-- :confirm-loading="confirmLoading" -->
    <a-modal
      title="身份证/学历OCR识别提示"
      :visible="differentMsgVisible"
      @ok="handleOkDifferent"
      @cancel="handleCancelDifferent"
    >
      <p>{{ differentMsg }}</p>
    </a-modal>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import { httpAction, postAction, getImageInfoByOcr } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import JSelectCompany from '@/components/jeecgbiz/JSelectCompany'
import { addCompany, editCompany } from '@/api/api'
import JImageUpload from '../../../components/jeecg/JImageUpload'

export default {
  name: 'StuCompanyModal',
  components: {
    JSelectCompany,
    JImageUpload,
  },
  data() {
    return {
      title: '操作',
      visible: false,
      companyObj: {},
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
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
              },
            },
          ],
        },
        name: { rules: [{ required: true, message: '请输入公司名称!' }] },
        contacts: { rules: [{ required: false, message: '请输入联系人!' }] },
        address: { rules: [{ required: false, message: '请输入公司地址!' }] },
        phone: { rules: [{ required: false, message: '请输入联系电话!' }, { validator: this.validatePhone }] },
        licenseNum: { rules: [{ required: false, message: '请输入统一社会信用代码!' }] },
      },
      url: {
        add: '/erp/stuCompany/add',
        edit: '/erp/stuCompany/edit',
      },
      businesslicense: [],
      differentMsg: '',
      differentMsgVisible: false,
    }
  },
  created() {},
  methods: {
    validateDictCode(rule, value, callback) {
      // 重复校验
      var params = {
        tableName: 'mw_stu_company',
        fieldName: 'name',
        fieldVal: value,
        dataId: this.model.id,
      }
      duplicateCheck(params).then((res) => {
        if (res.success) {
          callback()
        } else {
          callback(res.message)
        }
      })
    },
    handleChange(value) {
      this.model.status = value
    },
    add() {
      this.businesslicense = []
      this.edit({})
    },
    edit(record) {
      if (record.id) {
        this.visiblekey = true
        setTimeout(() => {
          this.businesslicense = record.businesslicense
        }, 5)
      } else {
        this.visiblekey = false
      }
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'name', 'contacts', 'address', 'phone', 'licenseNum', 'parent', 'businesslicense')
        )
      })
    },
    // 确定
    handleOk() {
      let regex = /^[0-9A-Z]+$/
      const that = this
      let close = false
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          values.name = (values.name || '').trim()
          values.contacts = (values.contacts || '').trim()
          values.address = (values.address || '').trim()
          values.phone = (values.phone || '').trim()
          values.licenseNum = (values.licenseNum || '').trim()
          if (!!values.licenseNum) {
            if (regex.test(values.licenseNum)) {
              let formData = Object.assign(this.model, values)
              if (that.businesslicense != '') {
                formData.businesslicense = that.businesslicense
              } else {
                formData.businesslicense = null
              }
              let obj
              if (!this.model.id) {
                obj = addCompany(formData)
              } else {
                obj = editCompany(formData)
              }

              obj
                .then((res) => {
                  if (res.success) {
                    close = true
                    that.$message.success(res.message)
                    that.$emit('ok')
                  } else {
                    that.$message.warning(res.message)
                  }
                })
                .finally(() => {
                  that.confirmLoading = false
                  if (close) {
                    that.close()
                  }
                })
            } else {
              that.$message.warning('统一社会信用代码只能用18位阿拉伯数字或大写英文字母表示')
              that.confirmLoading = false
            }
          } else {
            let formData = Object.assign(this.model, values)
            if (that.businesslicense != '') {
              formData.businesslicense = that.businesslicense
            } else {
              formData.businesslicense = null
            }
            let obj
            if (!this.model.id) {
              obj = addCompany(formData)
            } else {
              obj = editCompany(formData)
            }

            obj
              .then((res) => {
                if (res.success) {
                  close = true
                  that.$message.success(res.message)
                  that.$emit('ok')
                } else {
                  that.$message.warning(res.message)
                }
              })
              .finally(() => {
                that.confirmLoading = false
                if (close) {
                  that.close()
                }
              })
          }
        }
      })
    },
    // 关闭
    handleCancel() {
      this.close()
    },
    close() {
      this.businesslicense = []
      this.$emit('close')
      this.visible = false
    },
    handleCompanyChange(val) {},

    //校验手机号格式
    validatePhone(rule, value, callback) {
      if (value) {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!myreg.test(value)) {
          callback('请输入正确的手机号')
        } else {
          callback()
        }
      } else {
        callback()
      }
    },

    handleOkDifferent() {
      this.setFormFieldsValue()
      this.handleCancelDifferent()
    },

    handleCancelDifferent() {
      this.companyObj = {}
      this.differentMsg = undefined
      this.differentMsgVisible = false
    },

    setFormFieldsValue() {
      if (this.companyObj.name) {
        this.form.setFieldsValue({ name: this.companyObj.name })
      }
      if (this.companyObj.licenseNum) {
        this.form.setFieldsValue({ licenseNum: this.companyObj.licenseNum })
      }
      if (this.companyObj.address) {
        this.form.setFieldsValue({ address: this.companyObj.address })
      }
    },

    handleChangeBusinesslicense(info) {
      if (info.toString() != undefined) {
        //调用百度智能识别图片接口
        getImageInfoByOcr('/erp/system/getImageInfo/license', { url: info.toString() }).then((res) => {
          if (res.code == 200 && !!res.success) {
            if (!!res.result) {
              let result = res.result
              this.companyObj = { ...result }
              let msg = ''
              if (
                this.form.getFieldValue('name') &&
                this.form.getFieldValue('licenseNum') &&
                this.form.getFieldValue('address')
              ) {
                if (!!result.name && result.name != this.form.getFieldValue('name')) {
                  msg = msg + '公司名称' + result.name + '，与输入值不符；'
                }
                if (!!result.licenseNum && result.licenseNum != this.form.getFieldValue('licenseNum')) {
                  msg = msg + '公司名称' + result.licenseNum + '，与输入值不符；'
                }
                if (!!result.address && result.address != this.form.getFieldValue('address')) {
                  msg = msg + '公司名称' + result.address + '，与输入值不符；'
                }

                if (!!msg) {
                  //有不符信息，需要提示
                  this.differentMsg = msg + '确定覆盖吗？'
                  this.differentMsgVisible = true
                }
              } else {
                this.handleOkDifferent()
              }
            }
          }

          // this.form.setFieldsValue({ address: res.result.address })
          // this.form.setFieldsValue({ licenseNum: res.result.licenseNum })
          // this.form.setFieldsValue({ name: res.result.name })
        })
      }
    },
  },
}
</script>

<style lang="less" scoped></style>