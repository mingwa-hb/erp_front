<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="3" :sm="8">
            <a-form-item label="导入人">
              <a-input placeholder="请输入导入人进行查询" v-model.trim="queryParam.userName" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="2">
            <a-form-item label="导入时间">
              <j-date
                style="width: 100%"
                :getCalendarContainer="node => node.parentNode"
                v-model="queryParam.dateFrom"
                placeholder="导入开始时间"
                dateFormat="YYYY-MM-DD"
              ></j-date>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="2">
            <a-form-item label="至">
              <j-date
                style="width: 100%"
                :getCalendarContainer="node => node.parentNode"
                v-model="queryParam.dateTo"
                placeholder="导入结束时间"
                dateFormat="YYYY-MM-DD"
              ></j-date>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="导入模块">
              <a-input placeholder="请输入导入模块进行查询" v-model.trim="queryParam.moduleName" />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
              <a-form-item label="文件名称">
                <a-input placeholder="请输入文件名称进行查询" v-model.trim="queryParam.fileName" />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="4" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="download" @click="handleExportXls('导入日志_'+time)">导出</a-button>
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
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="viewFile(record)">查看</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 
    <student-modal ref="modalForm" @ok="modalFormOk"/>
    -->
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, downloadFile } from '@/api/manage'
import JDate from '@/components/jeecg/JDate'

export default {
  name: 'SysImportLogList',
  mixins: [JeecgListMixin],
  components: { JEllipsis, JDate },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      downErrorZipVisible: false,
      downErrorInfo: [],
      downErrorPath: '',
      description: '导入日志',
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
          title: '导入模块',
          align: 'center',
          dataIndex: 'moduleName'
        },
        {
          title: '导入文件名',
          align: 'center',
          dataIndex: 'fileName'
        },
        {
          title: '导入结果',
          align: 'center',
          dataIndex: 'content'
        },
        {
          title: '导入时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '导入人',
          align: 'center',
          dataIndex: 'userName'
        },
        {
          title: '失败记录',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 170
        }
      ],
      url: {
        list: '/erp/importLog/getLogs',
        exportXlsUrl: 'erp/importLog/exportXls'
      }
    }
  },
  computed: {},
  methods: {
    viewFile(record) {
      if (record.errorFilePath) {
        let newFileUrl = encodeURI(record.errorFilePath, 'utf-8')
        // window.location.href=newFileUrl;
        // window.open(newFileUrl)
        this.downloadFile(newFileUrl)
      } else {
        this.$message.success(`导入成功了或者由于无法解析而没开始导入，没有可查看的文件`)
      }
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
