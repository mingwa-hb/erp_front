<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="公司名称">
              <!-- <a-input placeholder="请输入公司名称进行查询" v-model.trim="queryParam.companyName"/>-->
              <a-auto-complete
                v-model.trim="queryParam.companyName"
                @select="onSelect"
                @search="handleSearch"
                placeholder="请输入公司名称进行查询"
              >
                <template slot="dataSource">
                  <a-select-option v-for="email in result" :key="email">{{ email }}</a-select-option>
                </template>
              </a-auto-complete>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
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
      <a-button type="primary" icon="download" @click="handleExportXls('公司管理'+'_'+time)">导出</a-button>
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
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
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
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?(与该公司关联的子公司都会删除!)" @confirm="() => deleteSingle(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <stu-company-modal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import StuCompanyModal from './modules/StuCompanyModal'
import { deleteAction, getAction } from '@/api/manage'
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'StuCompany',
  mixins: [JeecgListMixin],
  components: { JEllipsis, StuCompanyModal },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      description: '公司管理',
      // 表头
      result: [],
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (t, r, index) => index + 1,
        },
        {
          title: '公司名称',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '统一社会信用代码',
          align: 'center',
          dataIndex: 'licenseNum',
        },
        {
          title: '联系人',
          align: 'center',
          dataIndex: 'contacts',
        },
        {
          title: '联系电话',
          align: 'center',
          dataIndex: 'phone',
          customRender: (t) => ellipsis(t),
        },
        {
          title: '地址',
          align: 'center',
          dataIndex: 'address',
          customRender: (t) => ellipsis(t),
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 170,
        },
      ],
      url: {
        list: '/erp/stuCompany/getCompanies',
        delete: '/erp/stuCompany/delete',
        deleteBatch: '/erp/stuCompany/deleteBatch',
        exportXlsUrl: 'erp/stuCompany/exportXls',
        importExcelUrl: 'erp/stuCompany/importExcel',
      },
    }
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    downLoadTemplate() {
      var newFileUrl = encodeURI(
        'https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/upload/公司管理导入模板.xls',
        'utf-8'
      )
      window.location.href = newFileUrl
    },
    deleteSingle(id) {
      var that = this
      getAction('/erp/stuCompany/checkSubCompanies/' + id, {
        ...this.getQueryParams(),
      }).then((res) => {
        if (res.success) {
          if (res.result === 1) {
            this.$confirm({
              title: '该公司有关联的子公司，请确认是否删除！',
              content: '点击OK按钮后，与该公司关联的子公司都会删除!',
              okType: 'danger',
              okText: '删除',
              cancelText: '取消',
              onOk() {
                deleteAction(that.url.delete, { id: id }).then((res) => {
                  if (res.success) {
                    that.$message.success(res.message)
                    that.loadData()
                  } else {
                    that.$message.warning(res.message)
                  }
                })
              },
              onCancel() {},
            })
          } else {
            deleteAction(that.url.delete, { id: id }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        }
      })
    },

    handleSearch(value) {
      // console.log('handleSearch', value);
      //this.result  =  ['上海', '武汉', '北京'];
      let paramJson = {
        companyName: value,
      }
      console.log('value:', value)
      getAction('/erp/stuCompany/getNameSelect', paramJson).then((res) => {
        if (res.success) {
          this.result = res.result
        }
      })
    },
    onSelect(value) {
      console.log('onSelect', value)
      //loadData(1)
      this.searchQuery()
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>