<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="工种/等级名称">
              <a-input placeholder="请输入工种/等级名称进行查询" v-model.trim="queryParam.workType"/>
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
      <a-button type="primary" icon="download" @click="handleExportXls('工种管理_'+time)">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcelOneByOne">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-button type="primary" icon="download" @click="downLoadTemplate()">下载模板</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
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
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="删除了会影响其它与之关联的业务数据，确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <stu-work-type-modal ref="modalForm" @ok="modalFormOk"/>

  </a-card>
</template>

<script>
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import StuWorkTypeModal from './modules/StuWorkTypeModal'

  export default {
    name: 'StuWorkType',
    mixins: [JeecgListMixin],
    components: { JEllipsis, StuWorkTypeModal },
    data() {
      let ellipsis = (v, l = 20) => (<j-ellipsis value={v} length={l}/>)
      return {
        description: '工种管理',
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: (t, r, index) => index + 1
          },
          {
            title: '工种级别',
            align: 'center',
            dataIndex: 'workType'
          },
          {
            title: '工种学习达标时长(分钟)',
            align: 'center',
            dataIndex: 'standardHour'
          },
          {
            title: '理论合格分数',
            align: 'center',
            dataIndex: 'theoryPassScore'
          },
          {
            title: '实操合格分数',
            align: 'center',
            dataIndex: 'operationPassScore'
          },
          {
            title: '金额',
            align: 'center',
            dataIndex: 'amount'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
            width: 170
          }
        ],
        url: {
          list: '/erp/stuWorkType/getWorkTypes',
          delete: '/erp/stuWorkType/delete',
          deleteBatch: '/erp/stuWorkType/deleteBatch',
          exportXlsUrl: 'erp/stuWorkType/exportXls',
          importExcelUrl: 'erp/stuWorkType/importExcel',
        },
      }
    },
    computed: {
      importExcelUrl() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      }
    },
    methods: {
      downLoadTemplate(){
        var newFileUrl=encodeURI('https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/upload/工种管理模板.xls', "utf-8");
        window.location.href=newFileUrl;
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>