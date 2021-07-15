<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="公司名称">
              <a-input placeholder="请输入公司名称进行查询" v-model.trim="queryParam.companyName" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号进行查询" v-model.trim="queryParam.contractNo" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="报名编号">
              <a-input placeholder="请输入报名编号进行查询" v-model.trim="queryParam.applyInfoId" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名进行查询" v-model.trim="queryParam.userName" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="身份证">
              <a-input placeholder="请输入身份证进行查询" v-model.trim="queryParam.idCard" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="电话号码">
              <a-input placeholder="请输入电话号码进行查询" v-model.trim="queryParam.mobile" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('学员考试申报资料管理_' + time)">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcelOneByOne"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-button type="primary" icon="download" @click="downLoadTemplate()">下载模板</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <!--        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>-->
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-alert type="info" showIcon style="margin-bottom: 16px;">
        <template slot="message">
          <span>已选择</span>
          <a style="font-weight: 600;padding: 0 4px;">{{ selectedRowKeys.length }}</a>
          <span>项</span>
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </template>
      </a-alert>

      <a-table
        :scroll="{ x: 'max-content' }"
        class="j-table-force-nowrap"
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <!--
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>-->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <stu-apply-exam-modal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import StuApplyExamModal from './modules/StuApplyExamModal'

export default {
  name: 'StuApplyExam',
  mixins: [JeecgListMixin],
  components: { JEllipsis, StuApplyExamModal },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      description: '考试申报资料管理',
      disableSubmit: false,
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          fixed: 'left',
          customRender: (t, r, index) => index + 1
        },
        {
          title: '合同编号',
          align: 'center',
          fixed: 'left',
          dataIndex: 'contractNo'
        },
        {
          title: '公司名称',
          align: 'center',
          dataIndex: 'companyName'
        },
        {
          title: '报名编号',
          align: 'center',
          dataIndex: 'applyInfoId'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'userName'
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'idCard'
        },
        {
          title: '手机号码',
          align: 'center',
          dataIndex: 'mobile'
        },
        {
          title: '从事职业',
          align: 'center',
          dataIndex: 'career'
        },
        {
          title: '身份证地址（省市）',
          align: 'center',
          dataIndex: 'idCardAddr'
        },
        {
          title: '常住地址（省市）',
          align: 'center',
          dataIndex: 'residentialAddr'
        },
        {
          title: '参加工作日期',
          align: 'center',
          dataIndex: 'workStartDate'
        },
        {
          title: '本工种职业年限',
          align: 'center',
          dataIndex: 'curProfessionDuration'
        },
        {
          title: '原职业（工种/等级）',
          align: 'center',
          dataIndex: 'workType'
        },
        {
          title: '原证书编号',
          align: 'center',
          dataIndex: 'preCertificateNo'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: 100,
          fixed: 'right'
        }
      ],
      url: {
        list: '/erp/stuApplyExam/getApplyExams',
        delete: '/erp/stuApplyExam/delete',
        deleteBatch: '/erp/stuApplyExam/deleteBatch',
        exportXlsUrl: 'erp/stuApplyExam/exportXls',
        importExcelUrl: 'erp/stuApplyExam/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    downLoadTemplate() {
      var newFileUrl = encodeURI(
        'https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/upload/考试申报资料管理导入模板.xls',
        'utf-8'
      )
      window.location.href = newFileUrl
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
