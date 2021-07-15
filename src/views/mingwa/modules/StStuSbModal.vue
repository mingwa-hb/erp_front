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


        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
              <a-input style="width: 300px" placeholder="请输入姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="证件类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select style="width: 300px" placeholder="请选择">
                <a-select-option v-for="(item,index) in certificateTypeArr" :key="index" :value="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证件号">
              <a-input style="width: 300px" placeholder="请输入证件号" />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select style="width: 300px" placeholder="请选择">
                <a-select-option value="1">男</a-select-option>
                <a-select-option value="2">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="出生日期">
              <a-date-picker style="width: 300px" />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="文化程度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select style="width: 300px" placeholder="请选择">
                <a-select-option v-for="(item,index) in educationArr" :key="index" :value="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="考生来源">
              <a-select style="width: 300px" placeholder="请选择">
                <a-select-option v-for="(item,index) in stuSourceArr" :key="index" :value="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="证书领取" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select style="width: 300px" placeholder="请选择">
                <a-select-option value="全部">全部</a-select-option>
                <a-select-option value="自取">自取</a-select-option>
                <a-select-option value="快递到付">快递到付</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="职业名称">
              <a-input style="width: 300px" placeholder="请输入职业名称" />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="工种名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input style="width: 300px" placeholder="请输入工种名称" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="级别">
              <a-select style="width: 300px" placeholder="全部">
                <a-select-option v-for="(item,index) in levelArr" :key="index" :value="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="申报条件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input style="width: 300px" placeholder="请输入申报条件" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号码">
              <a-input style="width: 300px" placeholder="请输入手机号码" />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="参加工作时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker style="width: 300px" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="从事专业">
              <a-input style="width: 300px" placeholder="请输入从事专业" />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="专业年限" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input style="width: 300px" placeholder="请输入专业年限" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="民族">
              <a-input style="width: 300px" placeholder="请输入民族" />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="政治面貌" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input style="width: 300px" placeholder="请输入政治面貌" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="学历证书编号">
              <a-input style="width: 300px" placeholder="请输入学历证书编号" />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="简要经历" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input style="width: 300px" placeholder="请输入简要经历" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="邮政编码">
              <a-input style="width: 300px" placeholder="请输入邮政编码" />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="所在单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input style="width: 300px" placeholder="请输入所在单位" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="通讯地址">
              <a-input style="width: 300px" placeholder="请输入通讯地址" />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="邮寄地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input style="width: 300px" placeholder="请输入邮寄地址" />
            </a-form-item>
          </a-col>
        </a-row>


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
// import { getAction } from '@/api/manage'
import JDate from '@/components/jeecg/JDate'
import JEditor from '@/components/jeecg/JEditor'
import JFileUpload from '@/components/jeecg/JFileUpload'
// import moment from 'moment'
// import { addContract, editContract } from '@/api/api'
import ACol from 'ant-design-vue/es/grid/Col'
import JSelectCompany from '@/components/jeecgbiz/JSelectCompany'
import JSelectUserByDep from '../../pmo/components/JSelectUserByDep'
import JUpload from '@/components/jeecg/JUpload'

export default {
  components: { ACol, JEditor, JDate, JSelectCompany, JFileUpload, JSelectUserByDep, JUpload },
  name: 'StuContractModal',
  data() {
    return {
      name:'StStuSbModal',  //省厅学员上报表新增编辑弹框
      title: '操作',
      visible: false,
      model:{},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      certificateTypeArr:['身份证','士兵证','军官证','警官证','港澳台证','护照','其他'],
      educationArr:['小学','初中','高中','中专','技校','职高','大专','大学','硕士','博士'],
      stuSourceArr:['国有企业','集体企业','私营企业','个体外企','外商投资','港澳台商投资','职业高中','普通技工学校','高级技工学校','技师学院','职业技术学院','普通中专','普通高中','普通大专','普通大学','研究生院','其他','下岗失业人员','现役军人','农民工','劳改劳教人员','其他人员','机关事业单位'],
      levelArr:['一级/高级技师','二级/技师','三级/高级工','四级/中级工','五级/初级工','无级别'],
      url: {
        add: '/erp/stuContract/add',
        edit: '/erp/stuContract/edit'
      },
    }
  },
  created() {},
  methods: {
    reSetFormVal() {
      this.$nextTick(() => {
        this.form.resetFields()
      })
    },

    add() {
      this.visible = true
    },

    edit(record) {
      this.visible = true
    //   this.model = Object.assign({}, record)
    },

    close() {
      this.$emit('close')
      this.visible = false
    },

    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
      this.$emit('close')
    },
  }
}
</script>

<style scoped></style>
