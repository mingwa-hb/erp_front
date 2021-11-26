<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="分组名称">
              <!-- <a-input placeholder="请输入分组名称进行查询" v-model.trim="queryParam.companyName"/>-->
              <a-auto-complete
                v-model.trim="queryParam.groupName"
                placeholder="请输入分组名称进行查询"
              >
              </a-auto-complete>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="代码">
              <!-- <a-input placeholder="请输入分组名称进行查询" v-model.trim="queryParam.companyName"/>-->
              <a-auto-complete
                v-model.trim="queryParam.code"
                placeholder="请输入代码进行查询"
              >
              </a-auto-complete>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="名称">
              <!-- <a-input placeholder="请输入分组名称进行查询" v-model.trim="queryParam.companyName"/>-->
              <a-auto-complete
                v-model.trim="queryParam.name"
                placeholder="请输入名称进行查询"
              >
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
      <a-button type="primary" icon="download" @click="handleExportXls('分组管理'+'_'+time)">导出</a-button>
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
          <a-popconfirm title="确定删除吗?(会被放到回收站!)" @confirm="() => deleteSingle(record.id)">
            <a>删除</a>
          </a-popconfirm>
           <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?(会删掉数据!)" @confirm="() => deleteRealSingle(record.id)">
            <a>硬删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <ori-stock-modal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import OriStockModal from './modules/OriStockModal'
import { deleteAction, getAction } from '@/api/manage'
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'OriStock',
  mixins: [JeecgListMixin],
  components: { JEllipsis, OriStockModal },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      description: '股票管理',
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
          title: '名称',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '代码',
          align: 'center',
          dataIndex: 'code',
        },
        {
          title: '区域',
          align: 'center',
          dataIndex: 'area',
          customRender: (t) => ellipsis(t),
        },
        {
          title: '分组',
          align: 'center',
          dataIndex: 'groupName',
        },
        {
          title: '加入时价格',
          align: 'center',
          dataIndex: 'price',
        },
        {
          title: '当前价格',
          align: 'center',
          dataIndex: 'curPrice',
        },
        {
          title: '涨跌幅',
          align: 'center',
          dataIndex: 'price',
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'statusDesc',
        },
        {
          title: '描述',
          align: 'center',
          dataIndex: 'remark',
          customRender: (t) => ellipsis(t),
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createBy',
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
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
        list: '/erp/oriStock/list',
        delete: '/erp/oriStock/delete',
        deleteBatch: '/erp/oriStock/deleteBatch',
        realDelete: '/erp/oriStock/realDelete',
        exportXlsUrl: 'erp/oriStock/exportXls',
        importExcelUrl: 'erp/oriStock/importExcel',
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
        this.$message.warning("该功能暂时未实现！")
    },
    deleteSingle(id) {
          var that = this
            this.$confirm({
              title: '请确认是否删除！',
              content: '点击OK按钮后，自选股被放入回收站!',
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
    },
    deleteRealSingle(id) {
          var that = this
            this.$confirm({
              title: '请确认是否真正删除！',
              content: '点击OK按钮后，自选股会被真正删除!',
              okType: 'danger',
              okText: '删除',
              cancelText: '取消',
              onOk() {
                deleteAction(that.url.realDelete, { id: id }).then((res) => {
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