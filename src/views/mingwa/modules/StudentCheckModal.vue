<template>
  <a-modal
    :title="title"
    width="60%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    okText="提交审核"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-row style="width: 100%" v-if="!isDisabledEdit">
          <a-col :span="24 / 2">
            <a-form-item label="审核结果">
              <a-radio-group v-decorator="['auditStatus', validatorRules.auditStatus]" :disabled="isDisabledEdit">
                <a-radio :value="2">审核通过</a-radio>
                <a-radio :value="3">审核不通过</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%" v-if="!isDisabledEdit">
          <a-col :span="24 / 2">
            <a-form-item label="审核意见">
              <a-textarea
                placeholder="请输入审核意见"
                :auto-size="{ minRows: 2, maxRows: 6 }"
                v-decorator="['auditReason', {}]"
                :disabled="isDisabledEdit"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="合同编号" v-if="isRequiredSubmit">
              <j-select-contract
                placeholder="请输入合同编号"
                :multiple="false"
                v-decorator="['contractNo', validatorRules.contractNo]"
                :disabled="isDisabledEdit"
              />
            </a-form-item>
            <a-form-item label="合同编号" v-else>
              <j-select-contract
                placeholder="请输入合同编号"
                :multiple="false"
                v-decorator="['contractNo', validatorRulesNo.contractNo]"
                :disabled="isDisabledEdit"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="姓名">
              <a-input
                placeholder="请选择学员"
                :multiple="false"
                v-decorator="['userName', validatorRules.userName]"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="项目经理" v-if="isRequiredSubmit">
              <j-select-user-by-dep
                placeholder="请选择项目经理"
                :multi="false"
                v-decorator="['manager', validatorRules.manager]"
                :disabled="true"
              />
            </a-form-item>
            <a-form-item label="项目经理" v-if="!isRequiredSubmit">
              <j-select-user-by-dep
                placeholder="请选择项目经理"
                :multi="false"
                v-decorator="['manager', validatorRulesNo.manager]"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="身份证号">
              <a-input placeholder="请输入身份证号" v-decorator="['idCard', validatorRules.idCard]" :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="业务支持" v-if="isRequiredSubmit">
              <j-select-user-by-dep
                placeholder="请选择业务支持"
                :multi="false"
                v-decorator="['supporter', validatorRules.supporter]"
                :disabled="true"
              />
            </a-form-item>
            <a-form-item label="业务支持" v-if="!isRequiredSubmit">
              <j-select-user-by-dep
                placeholder="请选择业务支持"
                :multi="false"
                v-decorator="['supporter', validatorRulesNo.supporter]"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="手机号码">
              <a-input placeholder="请输入手机号码" v-decorator="['mobile', validatorRules.mobile]" :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="工种/级别">
              <j-select-work-type
                placeholder="请选择工种/级别"
                :multiple="false"
                v-decorator="['workTypeId', validatorRules.workTypeId]"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="报名日期" class="applyDate">
              <j-date
                style="width: 100%"
                :getCalendarContainer="node => node.parentNode"
                v-decorator="['applyDate', validatorRules.applyDate]"
                placeholder="请选择报名日期"
                dateFormat="YYYY-MM-DD"
                :disabled="true"
              ></j-date>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="最高学历">
              <a-select
                v-decorator="['education', {}]"
                placeholder="请选择学历"
                :disabled="true"
                :getPopupContainer="target => target.parentNode"
              >
                <a-select-option value="高中">高中</a-select-option>
                <a-select-option value="大专">大专</a-select-option>
                <a-select-option value="本科">本科</a-select-option>
                <a-select-option value="硕士">硕士</a-select-option>
                <a-select-option value="博士">博士</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="身份证地址">
              <v-distpicker
                hide-area
                :province="(!!model.applyExam && model.applyExam.idCardProvince) || ''"
                :city="(!!model.applyExam && model.applyExam.idCardCity) || ''"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="性别">
              <a-select
                v-decorator="['sex', {}]"
                placeholder="请选择性别"
                :getPopupContainer="target => target.parentNode"
                :disabled="true"
              >
                <a-select-option value="0">男</a-select-option>
                <a-select-option value="1">女</a-select-option>
                <a-select-option value="2">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="生日">
              <a-date-picker
                style="width: 100%"
                placeholder="请选择生日"
                :disabled="true"
                v-decorator="[
                  'birthday',
                  { initialValue: !model.birthday ? null : moment(model.birthday, dateFormat) }
                ]"
                :getCalendarContainer="node => node.parentNode"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="民族">
              <a-input placeholder="请输入民族" v-decorator="['nation', validatorRules.nation]" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="学历证书编号">
              <a-input
                placeholder="请输入学历证书编号"
                v-decorator="['educationNo', validatorRules.educationNo]"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="身份证照片">
              <img style="height: 104px; max-width: 300px" />
              <iframe
                v-if="!!model.mwUser && !!model.mwUser.idCardPics && model.mwUser.idCardPics.endsWith('pdf')"
                :src="model.mwUser.idCardPics"
                frameborder="0"
                class="wh100"
              ></iframe>
              <img
                v-if="
                  !!model.mwUser &&
                    !!model.mwUser.idCardPics &&
                    !model.mwUser.idCardPics.endsWith('pdf') &&
                    (model.mwUser.idCardPics || '').split(',').length == 1
                "
                v-on:click="showImg(model.mwUser.idCardPics)"
                :src="model.mwUser.idCardPics"
                style="height: 104px; max-width: 300px"
              />
              <img
                v-if="
                  !!model.mwUser &&
                    !!model.mwUser.idCardPics &&
                    !model.mwUser.idCardPics.endsWith('pdf') &&
                    (model.mwUser.idCardPics || '').split(',').length > 1
                "
                v-on:click="showImg((model.mwUser.idCardPics || '').split(',')[0])"
                :src="(model.mwUser.idCardPics || '').split(',')[0]"
                style="height: 104px; max-width: 300px"
              />
              <img
                v-if="
                  !!model.mwUser &&
                    !!model.mwUser.idCardPics &&
                    !model.mwUser.idCardPics.endsWith('pdf') &&
                    (model.mwUser.idCardPics || '').split(',').length > 1
                "
                v-on:click="showImg((model.mwUser.idCardPics || '').split(',')[1])"
                :src="(model.mwUser.idCardPics || '').split(',')[1]"
                style="height: 104px; max-width: 300px"
              />
              <j-image-pewview ref="imagePreviewModel" />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="工作证明">
              <iframe
                v-if="!!model.mwUser && model.mwUser.workCertPic && model.mwUser.workCertPic.endsWith('pdf')"
                :src="model.mwUser.workCertPic"
                frameborder="0"
                class="wh100"
              ></iframe>
              <img
                v-if="!!model.mwUser && model.mwUser.workCertPic && !model.mwUser.workCertPic.endsWith('pdf')"
                v-on:click="showImg(model.mwUser.workCertPic)"
                :src="model.mwUser.workCertPic"
                style="height: 104px; max-width: 300px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="学历">
              <iframe
                v-if="!!model.mwUser && model.mwUser.educationPic && model.mwUser.educationPic.endsWith('pdf')"
                :src="model.mwUser.educationPic"
                frameborder="0"
                class="wh100"
              ></iframe>
              <img
                v-if="!!model.mwUser && model.mwUser.educationPic && !model.mwUser.educationPic.endsWith('pdf')"
                v-on:click="showImg(model.mwUser.educationPic)"
                :src="model.mwUser.educationPic"
                style="height: 104px; max-width: 300px"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="证件照片">
              <iframe
                v-if="!!model.mwUser && model.mwUser.workCardPic && model.mwUser.workCardPic.endsWith('pdf')"
                :src="model.mwUser.workCardPic"
                frameborder="0"
                class="wh100"
              ></iframe>
              <img
                v-if="!!model.mwUser && model.mwUser.workCardPic && !model.mwUser.workCardPic.endsWith('pdf')"
                :src="model.mwUser.workCardPic"
                v-on:click="showImg(model.mwUser.workCardPic)"
                style="height: 104px; max-width: 300px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="常住地址">
              <v-distpicker
                hide-area
                :province="(!!model.applyExam && model.applyExam.residentialProvince) || ''"
                :disabled="true"
                :city="(!!model.applyExam && model.applyExam.residentialCity) || ''"
              ></v-distpicker>
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="从事职业">
              <a-input placeholder="请输入从事职业" v-decorator="['career', {}]" :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="参加工作日期" class="workStartDate">
              <j-date
                style="width: 100%"
                :disabled="true"
                :getCalendarContainer="node => node.parentNode"
                v-decorator="['workStartDate', validatorRules.workStartDate]"
                placeholder="请选择参加工作日期"
                dateFormat="YYYY-MM-DD"
              ></j-date>
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="本工种职业年限">
              <a-input
                placeholder="请输入本工种职业年限"
                :disabled="true"
                v-decorator="['curProfessionDuration', validatorRules.curProfessionDuration]"
                :maxLength="2"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="工种/等级(原职业)">
              <j-select-work-type
                placeholder=""
                :multiple="false"
                v-decorator="['preWorkTypeId', {}]"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="原证书编号">
              <a-input
                placeholder="请输入原证书编号"
                v-decorator="['preCertificateNo', {}]"
                :maxLength="100"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="状态">
              <a-select v-decorator="['status', validatorRules.status]" placeholder="请选择状态" :disabled="true">
                <a-select-option value="正常">正常</a-select-option>
                <a-select-option value="离职">离职</a-select-option>
                <a-select-option value="退费">退费</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="退费原因">
              <a-textarea
                placeholder=""
                v-decorator="['refundReason', validatorRules.refundReason]"
                :maxLength="100"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>

    <template slot="footer" v-if="title == '查看'">
      <a-button @click="handleCancel">关闭</a-button>
    </template>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import { httpAction, postAction } from '@/api/manage'
import { auditApplyInfo, auditApplyInfoNew, editApplyInfo, ajaxGetUserInfoById, ajaxGetContracts } from '@/api/api'
import { validateDuplicateValue } from '@/utils/util'

import JSelectContract from '@/components/jeecgbiz/JSelectContract'
import JSelectStudent from '@/components/jeecgbiz/JSelectStudent'
import JSelectWorkType from '@/components/jeecgbiz/JSelectWorkType'
import JSelectPosition from '@/components/jeecgbiz/JSelectPosition'
import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'
import JDate from '@/components/jeecg/JDate'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import VDistpicker from 'v-distpicker'
import JImagePewview from '../../../components/jeecg/JImagePreview'

export default {
  name: 'StudentCheckModal',
  components: {
    JImagePewview,
    ATextarea,
    JSelectContract,
    JSelectStudent,
    JSelectWorkType,
    JSelectPosition,
    JSelectUserByDep,
    JDate,
    VDistpicker
  },
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },
      confirmLoading: false,
      form: null,
      validatorRules: {
        auditStatus: { rules: [{ required: true, message: '请输入审核结果!' }] },
        contractNo: { rules: [{ required: true, message: '请输入合同编号!' }] },
        manager: { rules: [{ required: true, message: '请选择项目经理!' }] },
        supporter: { rules: [{ required: true, message: '请选择业务支持!' }] }
      },
      validatorRulesNo: {
        auditStatus: { rules: [{ required: true, message: '请输入审核结果!' }] },
        contractNo: { rules: [{ required: false, message: '请输入合同编号!' }] },
        manager: { rules: [{ required: false, message: '请选择项目经理!' }] },
        supporter: { rules: [{ required: false, message: '请选择业务支持!' }] }
      },
      url: {
        add: '/erp/stuApplyInfo/add',
        edit: '/erp/stuApplyInfo/edit'
      },
      isRequiredSubmit: true,
      contractNo: undefined, //选择合同带出项目经理和业务支持人员需要
      auditStatus: undefined
    }
  },
  computed: {
    isDisabledEdit({ title }) {
      return title == '查看' ? true : false
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
    auditStatus(val) {
      if (!!val) {
        this.isRequiredSubmit = val == 2 ? true : false
      }
    },
    isRequiredSubmit(val) {
      if (!val) {
        this.form.resetFields(['contractNo', 'manager', 'supporter'])
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
      if (!!values.contractNo && values.contractNo != this.contractNo) {
        this.contractNo = values.contractNo
      }
      if (!!values.auditStatus && values.auditStatus != this.auditStatus) {
        this.auditStatus = values.auditStatus
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
          contractNo: tmpContractNo
        }
        ajaxGetContracts(params).then(res => {
          if ((res.code == 0 || res.code == 200) && !!res.success) {
            let contracts = res.result.records
            let targetObj = _.find(contracts, ['contractNo', params.contractNo])
            that.$nextTick(() => {
              that.form.setFieldsValue({ manager: targetObj.manager, supporter: targetObj.supporter })
            })
          }
        })
      } else {
        that.type == 1 && that.$message.warning('contractNo缺失，请重新操作！')
      }
    },
    handleStudentInfo() {
      let that = this
      setTimeout(() => {
        var tmpStuInfoId = this.form.getFieldValue('stuInfoId')
        if (tmpStuInfoId != undefined && tmpStuInfoId != '') {
          var params = {
            id: tmpStuInfoId
          }
          ajaxGetUserInfoById(params).then(res => {
            if (res.success) {
              that.form.setFieldsValue({ idCard: res.result.idCard })
              that.form.setFieldsValue({ mobile: res.result.mobile })
            }
          })
        }
      }, 30)
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
      this.model.stuInfoId = value
    },
    add() {
      this.contractNo = undefined
      this.edit({})
    },
    edit(result, type) {
      //type 1为审核 2为查看
      if (result.applyInfo.id) {
        this.visiblekey = true
      } else {
        this.visiblekey = false
      }

      this.form.resetFields()
      this.model = Object.assign({}, result)
      if (type == 1) {
        //审核，默认通过
        this.model.applyInfo.auditStatus = 2
      }

      this.visible = true
      this.$nextTick(() => {
        this.model.mwUser.birthday = moment(this.model.mwUser.birthday)
        this.model.mwUser.sex = this.model.mwUser.sex.toString()

        let data_mwUser_obj = pick(this.model.mwUser, [
          'userName',
          'mobile',
          // 'account', //DongMM  修改页面报错的 2021/06/10
          'idCard',
          'sex',
          // 'parentId',//DongMM  修改页面报错的 2021/06/10
          // 'idCardPics',//DongMM  修改页面报错的 2021/06/10
          // 'workCardPic',//DongMM  修改页面报错的 2021/06/10
          // 'workCertPic',//DongMM  修改页面报错的 2021/06/10
          // 'educationPic', //DongMM  修改页面报错的 2021/06/10
          // 'accountStartDate',
          // 'accountEndDate',
          // 'companyId',
          'education',
          'educationNo',
          'nation',
          'birthday'
        ])
        this.model.applyInfo.auditStatus = this.model.applyInfo.auditStatus
        let targetArr = !!this.isDisabledEdit
          ? ['contractNo', 'applyDate', 'manager', 'supporter', 'workTypeId']
          : ['auditStatus', 'auditReason', 'contractNo', 'applyDate', 'manager', 'supporter', 'workTypeId']
        let data_applyInfo_obj = pick(this.model.applyInfo, targetArr)

        // this.model.applyExam.applyDate = moment(this.model.applyExam.applyDate)
        // this.model.applyExam.workStartDate = moment(this.model.applyExam.workStartDate)
        let data_applyExam_obj = pick(this.model.applyExam, [
          // 'applyInfoId',  //DongMM  修改页面报错的 2021/06/10
          // 'workType', //DongMM  修改页面报错的 2021/06/10
          // 'applyDate',//DongMM  修改页面报错的 2021/06/10
          'preWorkTypeId',
          'status',
          'refundReason',
          'curProfessionDuration',
          'workStartDate',
          'career',
          'preCertificateNo'
          // 'idCardProvince',//DongMM  修改页面报错的 2021/06/10
          // 'idCardCity',//DongMM  修改页面报错的 2021/06/10
          // 'residentialProvince',//DongMM  修改页面报错的 2021/06/10
          // 'residentialCity'//DongMM  修改页面报错的 2021/06/10
        ])

        let init_data = Object.assign({}, data_mwUser_obj, data_applyInfo_obj, data_applyExam_obj)
        this.form.setFieldsValue(init_data)
      })
      if (this.model.id) {
        this.handleStudentInfo()
      }
    },
    // 确定
    handleOk() {
      const that = this
      var isWinClose = false
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // if (err) {
        that.confirmLoading = true
        let formData = {
          id: this.model.applyInfo.id, //此条报名信息的id
          applyInfoId: this.model.applyInfo.id,
          auditStatus: values.auditStatus,
          auditReason: values.auditReason,
          manager: values.manager,
          contractNo: values.contractNo,
          supporter: values.supporter
        }
        /** DongMM 2021/06/10 add start */
        let opts = {
          auditReason: formData.auditReason,
          auditStatus: formData.auditStatus,
          id: this.model.taskId, //任务ID
          userInfoDto: formData
        }
        /** DongMM 2021/06/10 add start */
        auditApplyInfoNew(opts)
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
    showImg(imgPath) {
      this.$refs.imagePreviewModel.showImg(imgPath)
    },
    handleCancelImg() {
      this.$refs.imagePreviewModel.handleCancelImg(imgPath)
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
/deep/.ant-modal-body .ant-form .ant-form-item {
  margin-bottom: 10px;
}
</style>
