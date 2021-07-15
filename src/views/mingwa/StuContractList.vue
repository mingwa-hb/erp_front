<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="5" :sm="8">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号进行查询" v-model.trim="queryParam.contractNo" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="公司名称">
              <a-input placeholder="请输入公司名称进行查询" v-model.trim="queryParam.companyName" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="操作类型" prop="taskAction">
              <a-select placeholder="请选择操作类型" v-model.trim="queryParam.taskAction">
                <a-select-option v-for="item in taskActionsTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="审核状态" prop="showStatus">
              <a-select placeholder="请选择审核状态" v-model.trim="queryParam.showStatus">
                <a-select-option v-for="item in dataStatusTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
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
      <a-button type="primary" icon="download" @click="handleExportXls('合同管理_' + time)">导出</a-button>
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
        <span slot="taskAction" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(taskActionsTypeList) }}
        </span>
        <span slot="showStatus" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(dataStatusTypeList) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <!-- <a title="查看报考信息" @click="editContractDetailsList(record)">
            <a>查看报考信息</a>
          </a> -->
          <!-- <a @click="details(record)">详情</a> -->
          <a target="_blank" :href="detailUrl(record)">详情</a>
          <template v-if="record.dataStatus == 1 || record.dataStatus == 4 || record.dataStatus == 5">
            <a-divider type="vertical" />
            <a @click="handleEdit(record)" v-has="'detailsAdd:add'">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 新增表单区域 -->
    <stu-contract-modal ref="modalForm" @ok="modalFormOk" />

    <!-- 编辑表单区域 -->
    <stu-contract-edit-modal ref="modalEidtForm" @ok="modalFormOk" />

    <!-- 详情表单区域 -->
    <!-- <stu-contract-details ref="stuContractDetails" @ok="modalFormOk"></stu-contract-details> -->

    <!--报考信息列表-->
    <!-- <stu-contract-details-list ref="stuContractDetailsList"></stu-contract-details-list> -->
  </a-card>
</template>

<script>
import { deleteAction } from '@/api/manage'

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import queryCodeListMixin from '@/mixins/queryCodeListMixin'
import StuContractDetailsList from './StuContractDetailsList'
import StuContractModal from './modules/StuContractModal'
import StuContractDetails from './StuContractDetails'
import StuContractEditModal from './modules/StuContractEditModal'

export default {
  name: 'StuContract',
  mixins: [queryCodeListMixin, JeecgListMixin],
  components: { StuContractModal, StuContractDetailsList, StuContractDetails, StuContractEditModal },
  data() {
    return {
      description: '公司管理',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          fixed: 'left',
          align: 'center',
          customRender: (t, r, index) => index + 1
        },
        {
          title: '合同编号',
          fixed: 'left',
          dataIndex: 'contractNo'
        },
        {
          title: '所属公司',
          dataIndex: 'companyName'
        },
        {
          title: '项目经理',
          dataIndex: 'managerCn'
        },
        {
          title: '业务支持',
          dataIndex: 'supporterCn'
        },
        {
          title: '收款人',
          dataIndex: 'receiptUserCn'
        },
        {
          title: '合同创建人',
          dataIndex: 'createByCn'
        },
        {
          title: '应付合同金额(元)',
          dataIndex: 'totalAmount'
        },
        {
          title: '合同证次',
          dataIndex: 'certificateCount'
        },
        {
          title: '应付首付款(元)',
          dataIndex: 'duePayment'
        },
        {
          title: '实付首付款(元)',
          dataIndex: 'actDuePayment'
        },
        {
          title: '首付日期',
          dataIndex: 'firstPayDate'
        },
        {
          title: '应付尾款(元)',
          dataIndex: 'dueBalance'
        },
        {
          title: '实付尾款(元)',
          dataIndex: 'actBalance'
        },
        {
          title: '尾款支付日期',
          dataIndex: 'balancePaymentDate'
        },
        {
          title: '签订日期',
          dataIndex: 'signDate'
        },
        {
          title: '合同截止日期',
          dataIndex: 'deadLine'
        },
        {
          title: '操作类型',
          dataIndex: 'taskAction',
          scopedSlots: { customRender: 'taskAction' },
          align: 'center',
          fixed: 'right'
        },
        {
          title: '审核状态',
          dataIndex: 'showStatus',
          scopedSlots: { customRender: 'showStatus' },
          align: 'center',
          fixed: 'right'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 240,
          align: 'center',
          fixed: 'right'
        }
      ],
      url: {
        list: '/erp/stuContract/getContracts',
        delete: '/erp/stuContract/delete',
        deleteBatch: '/erp/stuContract/deleteBatch',
        exportXlsUrl: 'erp/stuContract/exportXls',
        importExcelUrl: 'erp/stuContract/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    detailUrl({ details }) {
      return record => {
        return details(record)
      }
    },
    curTaskKey({ $route }) {
      //从任务列表的Url传过来，此列表对应的是contractNo字段
      return (!!$route.query && !!$route.query.taskKey && $route.query.taskKey) || undefined
    }
  },
  watch: {
    curTaskKey: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.queryParam.contractNo = newV
        this.searchQuery()
      }
    }
  },
  methods: {
    //编辑合同列表
    editContractDetailsList(record) {
      this.$refs.stuContractDetailsList.edit(record)
    },
    downLoadTemplate() {
      var newFileUrl = encodeURI(
        'https://newmingwaerpbucket.oss-cn-hangzhou.aliyuncs.com/temp/合同管理导入模板_1624524534867.xls',
        'utf-8'
      )
      window.location.href = newFileUrl
    },
    batchDel: function() {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '删除合同会关联删除合同下的所有报名/报考/学习数据！！！，是否确定删除?',
          onOk: function() {
            that.loading = true
            deleteAction(that.url.deleteBatch, {
              ids: ids
            })
              .then(res => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.loadData()
                  that.onClearSelected()
                } else {
                  that.$message.warning(res.message)
                }
              })
              .finally(() => {
                that.loading = false
              })
          }
        })
      }
    },
    // 详情弹窗
    details(record) {
      let url = `/imingwa/StuContractList/details?id=${record.id}&contractNo=${record.contractNo}&companyName=${record.companyName}&companyId=${record.companyId}&dataStatus=${record.dataStatus}`
      return url
    },
    handleEdit(record) {
      this.$refs.modalEidtForm.edit(record)
      this.$refs.modalEidtForm.title = '编辑'
      this.$refs.modalEidtForm.disableSubmit = false
    }
  },
  mounted() {}
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
