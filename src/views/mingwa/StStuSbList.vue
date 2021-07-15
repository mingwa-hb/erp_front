<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item style="padding-left: 56px" label="姓名" labelAlign="right">
              <a-input style="width: 300px" placeholder="请输入学员姓名进行查询" v-model.trim="queryParam.userName" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item style="padding-left: 14px" label="证件号">
              <a-input style="width: 300px" placeholder="请输入证件号进行查询" v-model.trim="queryParam.cardNumber" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="电话号码">
              <a-input style="width: 300px" placeholder="请输入电话号码进行查询" v-model.trim="queryParam.phoneNumber" />
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item style="padding-left: 28px" label="工种等级">
              <a-input style="width: 300px" placeholder="请输入工种进行查询" v-model.trim="queryParam.workType" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="公司名称">
              <a-input style="width: 300px" placeholder="请输入公司名称进行查询" v-model.trim="queryParam.companyName" />
            </a-form-item>
          </a-col>
          <a-col style="float: right" :md="8" :sm="8">
            <span style="padding-left: 204px" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <a-button type="primary" icon="download" @click="handleExportXls('省厅学员上报表_' + time)">导出</a-button>
      <!-- <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcelOneByOne"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-button type="primary" icon="download" @click="downLoadTemplate()">下载模板</a-button> -->
    </div>

    <!-- table区域-begin -->
    <div>
      <a-alert type="info" showIcon style="margin-bottom: 16px">
        <template slot="message">
          <span>已选择</span>
          <a style="font-weight: 600; padding: 0 4px">{{ selectedRowKeys.length }}</a>
          <span>项</span>
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </template>
      </a-alert>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: 5000 }"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <!-- <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span> -->
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <StStuSbModal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import StStuSbModal from './modules/StStuSbModal'
import { postAction } from '@/api/manage'
import StuImgTypeSelectionModal from './modules/StuImgTypeSelectionModal'

export default {
  name: 'StStuSbList', //省厅学员上报表
  mixins: [JeecgListMixin],
  components: { StuImgTypeSelectionModal, JEllipsis, StStuSbModal },
  data() {
    return {
      //   formLayout: 'horizontal',
      //   form: this.$form.createForm(this, { name: 'coordinated' }),
      downErrorInfo: [],
      downErrorPath: '',
      description: '学员基础信息管理',
      educationArr: ['全部', '小学', '初中', '高中', '中专', '技校', '职高', '大专', '大学', '硕士', '博士'],
      stuSourceArr: [
        '全部',
        '国有企业',
        '集体企业',
        '私营企业',
        '个体外企',
        '外商投资',
        '港澳台商投资',
        '职业高中',
        '普通技工学校',
        '高级技工学校',
        '技师学院',
        '职业技术学院',
        '普通中专',
        '普通高中',
        '普通大专',
        '普通大学',
        '研究生院',
        '其他',
        '下岗失业人员',
        '现役军人',
        '农民工',
        '劳改劳教人员',
        '其他人员',
        '机关事业单位',
      ],
      levelArr: ['全部', '一级/高级技师', '二级/技师', '三级/高级工', '四级/中级工', '五级/初级工', '无级别'],
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          fixed: 'left',
          customRender: (t, r, index) => index + 1,
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'userName',
          fixed: 'left',
          width: 100,
        },
        {
          title: '证件类型',
          align: 'center',
          dataIndex: 'cardType',
          width: 100,
        },
        {
          title: '证件号',
          align: 'center',
          dataIndex: 'cardNumber',
          width: 200,
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex',
          width: 60,
        },
        {
          title: '出生日期',
          align: 'center',
          dataIndex: 'birthDate',
          width: 200,
        },
        {
          title: '文化程度',
          align: 'center',
          dataIndex: 'educationLevel',
          width: 100,
        },
        {
          title: '考生来源',
          align: 'center',
          dataIndex: 'studentFrom',
          width: 300,
        },
        {
          title: '证书领取',
          align: 'center',
          dataIndex: 'receiveCertificateMethod',
          width: 100,
        },
        {
          title: '职业名称',
          align: 'center',
          dataIndex: 'jobName',
        },
        {
          title: '工种名称',
          align: 'center',
          dataIndex: 'typeName',
        },
        {
          title: '级别',
          align: 'center',
          dataIndex: 'workLevel',
          width: 100,
        },
        {
          title: '申报条件',
          align: 'center',
          dataIndex: 'applyCondition',
        },
        {
          title: '手机号码',
          align: 'center',
          dataIndex: 'phoneNumber',
          width: 120,
        },
        {
          title: '参加工作时间',
          align: 'center',
          dataIndex: 'startWorkDate',
          width: 200,
        },
        {
          title: '从事专业',
          align: 'center',
          dataIndex: 'workMajor',
        },
        {
          title: '专业年限',
          align: 'center',
          dataIndex: 'majorYear',
          width: 100,
        },
        {
          title: '民族',
          align: 'center',
          dataIndex: 'nation',
          width: 70,
        },
        {
          title: '政治面貌',
          align: 'center',
          dataIndex: 'politic',
          width: 100,
        },
        {
          title: '学历证书编号',
          align: 'center',
          dataIndex: 'certificateNumber',
        },
        {
          title: '简要经历',
          align: 'center',
          dataIndex: 'mainExperience',
        },
        {
          title: '邮政编码',
          align: 'center',
          dataIndex: 'postCode',
        },
        {
          title: '所在单位',
          align: 'center',
          dataIndex: 'workCompanyName',
        },
        {
          title: '通讯地址',
          align: 'center',
          dataIndex: 'emailAddress',
        },
        {
          title: '邮寄地址',
          align: 'center',
          dataIndex: 'postAddress',
        }
      ],
      url: {
        list: '/erp/studentInfoReport/list',
        exportXlsUrl: '/erp/studentInfoReport/exportXls',
        // importExcelUrl: '/erp/mwStuCertVO/importExcel',
      },
    }
  },
  computed: {
    // importExcelUrl() {
    //   return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    // },
  },
  methods: {
    downLoadTemplate() {
      var newFileUrl = encodeURI(
        'https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/upload/证书管理导入模板.xls',
        'utf-8'
      )
      window.location.href = newFileUrl
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
