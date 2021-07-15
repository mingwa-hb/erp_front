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
        <a-form :form="form">
          <a-row style="width: 80%; margin-left: 9%">
            <a-col :span="18">
              <a-form-item label="身份证照片" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <j-file-upload
                  class="avatar-uploader"
                  text="上传"
                  v-decorator="['idCardPics', { initialValue: idCardPics }]"
                  :isMultiple="true"
                  @change="idCardCheckAndFill"
                  :fileTypeOld="idCardPicsFileType"
                ></j-file-upload>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <div style="color: #c8cbcf">
                说明：身份证照片格式支持bmp、jpg、png、jpeg、pdf，尺寸建议为：85.6*54mm/面，图片大小建议小于150KB
              </div>
            </a-col>
          </a-row>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
            <a-input
              placeholder="请输入姓名"
              :disabled="!!model.id"
              v-decorator="['userName', validatorRules.userName]"
              :maxLength="36"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
            <a-input placeholder="请输入手机号" v-decorator="['mobile', validatorRules.mobile]" :maxLength="11" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="学习账号">
            <a-input placeholder="请输入学习账号" v-decorator="['account', validatorRules.account]" :maxLength="32" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账号启用日期" class="accountStartDate">
            <j-date
              style="width: 100%"
              :getCalendarContainer="(node) => node.parentNode"
              v-decorator="['accountStartDate', validatorRules.accountStartDate]"
              placeholder="请选择账号启用日期"
              dateFormat="YYYY-MM-DD"
            ></j-date>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账号失效日期" class="accountStartDate">
            <j-date
              style="width: 100%"
              :getCalendarContainer="(node) => node.parentNode"
              v-decorator="['accountEndDate', validatorRules.accountEndDate]"
              placeholder="请选择账号失效日期"
              dateFormat="YYYY-MM-DD"
            ></j-date>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号码">
            <a-input
              placeholder="请输入身份证号码"
              v-decorator="['idCard', validatorRules.idCard]"
              :maxLength="18"
              @blur.native.capture="getInfoFromIdCard"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="民族">
            <a-input placeholder="请输入民族" v-decorator="['nation', validatorRules.nation]" />
          </a-form-item>
          <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select
              v-decorator="['sex', {}]"
              placeholder="请选择性别"
              :getPopupContainer="(target) => target.parentNode"
            >
              <a-select-option :value="0">男</a-select-option>
              <a-select-option :value="1">女</a-select-option>
              <a-select-option :value="2">其他</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="所属公司" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-select-company placeholder="请选择公司" :multiple="false" v-decorator="['companyId', {}]" />
          </a-form-item>

          <a-form-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              style="width: 100%"
              placeholder="请选择生日"
              v-decorator="['birthday', { initialValue: !model.birthday ? null : moment(model.birthday, dateFormat) }]"
              :getCalendarContainer="(node) => node.parentNode"
            />
          </a-form-item>

          <!-- 上传学历照片 -->
          <a-row style="width: 80%; margin-left: 9%">
            <a-col :span="18">
              <a-form-item label="学历" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <j-image-upload
                  class="avatar-uploader"
                  text="上传"
                  v-decorator="['educationPic', { initialValue: educationPic }]"
                  :isMultiple="false"
                  @change="educationCheckAndFill"
                ></j-image-upload>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <div style="color: #c8cbcf">说明：格式支持png、jpg、bmp、jpng，大小不超过500KB</div>
            </a-col>
          </a-row>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="最高学历">
            <a-select
              v-decorator="['education', {}]"
              placeholder="请选择学历"
              :disabled="disableSubmit"
              :getPopupContainer="(target) => target.parentNode"
            >
              <a-select-option value="高中">高中</a-select-option>
              <a-select-option value="专科">专科</a-select-option>
              <a-select-option value="本科">本科</a-select-option>
              <a-select-option value="硕士">硕士</a-select-option>
              <a-select-option value="博士">博士</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="学历证书编号">
            <a-input placeholder="请输入学历证书编号" v-decorator="['educationNo', validatorRules.educationNo]" />
          </a-form-item>

          <a-row style="width: 80%; margin-left: 9%">
            <a-col :span="18">
              <a-form-item label="证件照片" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <j-image-upload
                  class="avatar-uploader"
                  text="上传"
                  v-decorator="['workCardPic', { initialValue: workCardPic }]"
                  :isMultiple="false"
                ></j-image-upload>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <div style="color: #c8cbcf">说明：格式支持png、jpg、bmp、jpng，大小不超过500KB</div>
            </a-col>
          </a-row>
          <a-row style="width: 80%; margin-left: 9%">
            <a-col :span="18">
              <a-form-item label="工作证明" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <j-file-upload
                  class="avatar-uploader"
                  text="上传"
                  v-decorator="['workCertPic', { initialValue: workCertPic }]"
                  :isMultiple="false"
                  :fileTypeOld="workCertPicFileType"
                ></j-file-upload>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <div style="color: #c8cbcf">说明：格式支持png、jpg、bmp、jpng、pdf，大小不超过1000KB</div>
            </a-col>
          </a-row>
          <a-row style="width: 80%; margin-left: 9%" v-show="showSocialSecurity">
            <a-col :span="17">
              <label style="color: #f5222d;font-family:SimSun, sans-serif">*</label><a-form-item label="电子社保证明" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <j-file-upload
                  class="avatar-uploader"
                  text="上传"
                  v-decorator="['socialSecurityCertificate', { initialValue: socialSecurityCertificate }]"
                  :isMultiple="false"
                  :fileTypeOld="socialSecurityCertificateFileType"
                ></j-file-upload>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <div style="color: #c8cbcf">说明：格式支持png、jpg、bmp、jpng、pdf，大小不超过1000KB</div>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>

    <a-modal
      title="身份证/学历OCR识别提示"
      :visible="differentMsgVisible"
      :confirm-loading="confirmLoading"
      @ok="handleOkDifferent"
      @cancel="handleCancelDifferent"
    >
      <p>{{ differentMsg }}</p>
    </a-modal>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import { httpAction, postAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import JSelectCompany from '@/components/jeecgbiz/JSelectCompany'
import { addStudent, editStudent } from '@/api/api'
import JImageUpload from '../../../components/jeecg/JImageUpload'
import JFileUpload from '../../../components/jeecg/JFileUpload'
import moment from 'moment'
import JDate from '@/components/jeecg/JDate'
import { getAction } from '@/api/manage'
import { registerHelper } from 'codemirror'
// const { getFieldDecorator } = this.props.form;

export default {
  name: 'StudentModal',
  components: {
    JSelectCompany,
    JImageUpload,
    JFileUpload,
    JDate,
  },
  data() {
    return {
      title: '操作',
      visible: false,
      differentMsg: '',
      editObject: {},
      differentMsgVisible: false,
      model: {},
      disableSubmit: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      companyId: '',
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
                }
              },
            },
          ],
        },
        userName: { rules: [{ required: true, message: '请输入姓名!' }] },
        mobile: { rules: [{ required: true, message: '请输入手机号!' }, { validator: this.validatePhone }] },
        account: { rules: [{ required: true, message: '请输入学习账号!' }] },
        idCard: { rules: [{ required: true, message: '请输入身份证号码!' }] },
        accountStartDate: { rules: [{ required: false, message: '请选择账号启用日期!' }] },
        nation: { rules: [{ required: false, message: '请输入民族!' }] },
        educationNo: { rules: [{ required: true, message: '请输入学历证书编号!' }] },
      },
      url: {
        add: '/erp/student/add',
        edit: '/erp/student/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
      },
      uploadLoading: false,
      picUrl: '',
      idCardPics: [],
      workCardPic: [],
      workCertPic: [],
      educationPic: [],
      socialSecurityCertificate:[],
      dateFormat: 'YYYY-MM-DD',
      workCertPicFileType: 1,
      idCardPicsFileType: 1,
      socialSecurityCertificateFileType: 1,
      showSocialSecurity: false,
    }
  },
  created() {},
  computed: {
    uploadAction: function () {
      return this.url.fileUpload
    },
  },
  methods: {
    getInfoFromIdCard() {
      var idCard = this.form.getFieldValue('idCard')
      if (!!idCard) {
        if (idCard.length >= 14) {
          //341204 19910701 2519
          let birthday = idCard.substring(6, 10) + '-' + idCard.substring(10, 12) + '-' + idCard.substring(12, 14)
          this.form.setFieldsValue({ birthday: moment(birthday) })
        }
        if (idCard.length > 16) {
          //身份证长度大于16，解析出第17位为性别：奇数则为男性，偶数则为女性
          //   <a-select-option :value="0">男</a-select-option>
          //   <a-select-option :value="1">女</a-select-option>
          this.form.setFieldsValue({ sex: idCard.substring(16, 17) % 2 == 0 ? 1 : 0 })
        }
      }
    },
    handleChange(value) {
      this.model.status = value
    },
    add() {
      this.idCardPics = []
      this.educationPic = []
      this.workCardPic = []
      this.workCertPic = []
      this.socialSecurityCertificate = []
      this.showSocialSecurity = false
      this.edit({})
    },
    edit(record) {
      this.showSocialSecurity = false
      if (record.hasOwnProperty('id')) {
        this.idCardPics = (!!record.idCardPics && record.idCardPics.split(',')) || []
        this.workCardPic = (!!record.workCardPic && record.workCardPic.split(',')) || []
        this.workCertPic = (!!record.workCertPic && record.workCertPic.split(',')) || []
        this.socialSecurityCertificate = (!!record.socialSecurityCertificate && record.socialSecurityCertificate.split(',')) || []
        this.educationPic = (!!record.educationPic && record.educationPic.split(',')) || []
        this.companyId = !!record.companyId && record.companyId
      }
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, [
            'userName',
            'mobile',
            'account',
            'idCard',
            'sex',
            'parentId',
            'idCardPics',
            'workCardPic',
            'workCertPic',
            'socialSecurityCertificate',
            'educationPic',
            'accountStartDate',
            'accountEndDate',
            'companyId',
            'education',
            'educationNo',
            'nation',
          ])
        )
      })

      if (record.hasOwnProperty('id') && this.companyId) {
        this.fillCompanyField()
      }
      this.changeWorkCertPicFileType(record.workCertPic)
      this.changeidCardPicsFileType(record.idCardPics)
      this.changeSocialSecurityCertificateFileType(record.socialSecurityCertificate)
    },
    //改变工作证明的文件类型
    changeWorkCertPicFileType(url) {
      if (url == undefined) {
        //默认是图片
        this.workCertPicFileType = 1
      } else if (url.indexOf('.pdf') > 0 || url.indexOf('.PDF') > 0) {
        //是pdf
        this.workCertPicFileType = 2
      } else if (
        url.indexOf('.doc') > 0 ||
        url.indexOf('.DOC') > 0 ||
        url.indexOf('.docx') > 0 ||
        url.indexOf('.DOCX') > 0
      ) {
        //是doc
        this.workCertPicFileType = 3
      } else {
        //默认是图片
        this.workCertPicFileType = 1
      }
    },
    //改变身份证的文件类型
    changeidCardPicsFileType(url) {
      if (url == undefined) {
        //默认是图片
        this.idCardPicsFileType = 1
      } else if (url.indexOf('.pdf') > 0 || url.indexOf('.PDF') > 0) {
        //是pdf
        this.idCardPicsFileType = 2
      } else if (
        url.indexOf('.doc') > 0 ||
        url.indexOf('.DOC') > 0 ||
        url.indexOf('.docx') > 0 ||
        url.indexOf('.DOCX') > 0
      ) {
        //是doc
        this.idCardPicsFileType = 3
      } else {
        //默认是图片
        this.idCardPicsFileType = 1
      }
    },
    changeSocialSecurityCertificateFileType(url) {
      if (url == undefined) {
        //默认是图片
        this.socialSecurityCertificateFileType = 1
      } else if (url.indexOf('.pdf') > 0 || url.indexOf('.PDF') > 0) {
        //是pdf
        this.socialSecurityCertificateFileType = 2
      } else if (
        url.indexOf('.doc') > 0 ||
        url.indexOf('.DOC') > 0 ||
        url.indexOf('.docx') > 0 ||
        url.indexOf('.DOCX') > 0
      ) {
        //是doc
        this.socialSecurityCertificateFileType = 3
      } else {
        //默认是图片
        this.socialSecurityCertificateFileType = 1
      }
    },

    fillCompanyField() {
      setTimeout(() => {
        getAction(`/erp/stuCompany/getNameById/${this.companyId}`)
          .then((res) => {
            if (res.success) {
              document.getElementsByClassName('ant-select-selection__choice__content')[0].innerHTML = res.result
            }
          })
          .catch(() => {})
      }, 400)
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
          values.userName = (values.userName || '').trim()
          values.mobile = (values.mobile || '').trim()
          values.account = (values.account || '').trim()
          values.idCard = (values.idCard || '').trim()
          values.nation = (values.nation || '').trim()
          values.birthday = values.birthday.format('YYYY-MM-DD')
          let formData = Object.assign({}, that.model, values)
          let obj
          if (!!values.idCardPics) {
            formData.idCardPics = values.idCardPics.toString()
          } else {
            formData.idCardPics = null
          }
          if (!!values.workCardPic) {
            formData.workCardPic = values.workCardPic.toString()
          } else {
            formData.workCardPic = null
          }
          if (!!values.workCertPic) {
            formData.workCertPic = values.workCertPic.toString()
          } else {
            formData.workCertPic = null
          }
          if (!!values.socialSecurityCertificate) {
            formData.socialSecurityCertificate = values.socialSecurityCertificate.toString()
          } else {
            formData.socialSecurityCertificate = null
          }
          if (!!values.educationPic) {
            formData.educationPic = values.educationPic.toString()
          } else {
            formData.educationPic = null
          }
          if (!this.model.id) {
            obj = addStudent(formData)
          } else {
            obj = editStudent(formData)
          }
          if (regex.test(values.educationNo)) {
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
            that.$message.warning('学历证书编号只能用18位阿拉伯数字或大写英文字母表示')
            that.confirmLoading = false
          }
        }
      })
    },
    // 关闭
    handleCancel() {
      this.close()
    },
    close() {
      this.idCardPics = []
      this.educationPic = []
      this.workCardPic = []
      this.workCertPic = []
      this.socialSecurityCertificate = []
      this.$emit('close')
      ;(this.visible = false), (this.disableSubmit = false)
    },

    handleOkDifferent() {
      this.setFormFieldsValue()
      this.handleCancelDifferent()
    },
    // 关闭
    handleCancelDifferent() {
      this.editObject = {}
      this.differentMsg = undefined
      this.differentMsgVisible = false
    },

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
    setFormFieldsValue() {
      if (this.editObject.idCard) {
        this.form.setFieldsValue({ idCard: this.editObject.idCard })
      }
      if (this.editObject.userName) {
        this.form.setFieldsValue({ userName: this.editObject.userName })
      }
      if (this.editObject.birthday) {
        this.form.setFieldsValue({ birthday: moment(this.editObject.birthday) })
      }
      if (this.editObject.sex == 0 || this.editObject.sex == 1 || this.editObject.sex == 2) {
        this.form.setFieldsValue({ sex: this.editObject.sex })
      }
      if (this.editObject.educationNo) {
        this.form.setFieldsValue({ educationNo: this.editObject.educationNo })
      }
      if (
        this.editObject.education == '高中' ||
        this.editObject.education == '专科' ||
        this.editObject.education == '本科' ||
        this.editObject.education == '硕士' ||
        this.editObject.education == '博士'
      ) {
        this.form.setFieldsValue({ education: this.editObject.education })
      }
    },

    // 识别身份证照片
    idCardCheckAndFill(idCardPics) {


      if(!idCardPics){
        return ;
      }

      let that=this
      let idCardPicArray = idCardPics.split(',')
      idCardPics = idCardPicArray[idCardPicArray.length - 1] //只取最后一张图片补全
      idCardPics = encodeURI(idCardPics)
      getAction('/erp/system/getImageInfo/idCard?url=' + idCardPics).then((res) => {
        if (res.code == 200 && !!res.success) {
          if (!!res.result) {
            let result = res.result
            that.editObject = { ...result }
            let msg = ''
            if (
              that.form.getFieldValue('idCard') &&
              that.form.getFieldValue('userName') &&
              that.form.getFieldValue('birthday')._i &&
              (that.form.getFieldValue('sex') == 0 ||
                that.form.getFieldValue('sex') == 1 ||
                that.form.getFieldValue('sex') == 2)
            ) {
              if (result.idCard && result.idCard != that.form.getFieldValue('idCard')) {
                msg = msg + '身份证号：' + result.idCard + '，与输入值不符；'
              }
              if (result.userName && result.userName != that.form.getFieldValue('userName')) {
                msg = msg + '用户名：' + result.userName + '，与输入值不符；'
              }
              if (result.birthday && result.birthday != that.form.getFieldValue('birthday')._i) {
                msg = msg + '生日：' + result.birthday + '，与输入值不符；'
              }
              if (
                (result.sex == 0 || result.sex == 1 || result.sex == 2) &&
                result.sex != that.form.getFieldValue('sex')
              ) {
                if (result.sex == 0) {
                  msg = msg + '性别：男，与输入值不符；'
                }
                if (result.sex == 1) {
                  msg = msg + '性别：女，与输入值不符；'
                }
                if (result.sex == 2) {
                  msg = msg + '性别：其他，与输入值不符；'
                }
              }
              if (!!msg) {
                //有不符信息，需要提示
                that.differentMsg = msg + '确定覆盖吗？'
                that.differentMsgVisible = true
              }
            } else {
              that.handleOkDifferent()
            }
            if(result.idCard && !result.idCard.startsWith('42')){
              this.showSocialSecurity = true
            }else{
              this.showSocialSecurity = false
            }
          } else {
            that.$message.info('上传的图片不正确，请重新上传！')
          }
        } else {
          that.$message.warning(res.message)
        }
        that.changeidCardPicsFileType(idCardPics)
      })
    },

    // 识别学历照片
    educationCheckAndFill(educationPic) {
      let that = this
      let educationPicArray = educationPic.split(',')
      educationPic = educationPicArray[educationPicArray.length - 1] //只取最后一张图片补全
      getAction('/erp/system/getImageInfo/custom?url=' + educationPic).then((res) => {
        if (res.code == 200 && !!res.success) {
          if (!!res.result) {
            let result = res.result
            let msg = ''
            let educationText = result.highestEducation
            let oldEducationNo = that.form.getFieldValue('educationNo')
            let oldEducation = that.form.getFieldValue('education')
            that.editObject.education = educationText
            that.editObject.educationNo = result.educationNo
            if (!!oldEducationNo || !!oldEducation) {
              if (!!result.educationNo && result.educationNo != oldEducationNo) {
                msg = msg + '学历证书编号：' + result.educationNo + '，与输入值不符；'
              }
              if (oldEducation && educationText != oldEducation) {
                msg = msg + `学历：${educationText}，与输入值不符；`
              }
              if (!!msg) {
                //有不符信息，需要提示
                that.differentMsg = msg + '确定覆盖吗？'
                that.differentMsgVisible = true
              }
            } else {
              that.setFormFieldsValue()
            }
          } else {
            
          }
        } else {
          that.$message.warning(res.message)
        }
      })
    },

    moment,
  },
}
</script>

<style lang="less" scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
</style>
