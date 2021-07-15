<template>
  <a-card class="page-container" :bordered="false">
    <!--操作-->
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" @keyup.enter.native="searchQuery" :model="queryParam">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="客户名称" prop="companyName">
              <a-input placeholder="请输入客户名称，模糊搜索" v-model.trim="queryParam.companyName" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="联系方式" prop="phone">
              <a-input placeholder="请输入联系方式查询" v-model.trim="queryParam.phone" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="沟通时间" prop="communicateTime">
              <a-range-picker v-model="queryParam.communicateTime" @change="onChangeCommunicateTime" />
            </a-form-model-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="沟通分类" prop="communicateType">
                <a-select placeholder="请选择沟通分类" v-model.trim="queryParam.communicateType">
                  <a-select-option v-for="item in communicateTypeTypeList.slice(1)" :key="item.itemValue">
                    {{ item.itemText }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="核心诉求" prop="coreDemand">
                <a-select placeholder="请选择核心诉求" v-model.trim="queryParam.coreDemand">
                  <a-select-option v-for="item in coreDemandTypeList.slice(1)" :key="item.itemValue">
                    {{ item.itemText }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="处理意见" prop="dealYj">
                <a-select placeholder="请选择处理意见" v-model.trim="queryParam.dealYj">
                  <a-select-option v-for="item in dealYjTypeList.slice(1)" :key="item.itemValue">
                    {{ item.itemText }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="处理方案关键时间节点" prop="dealCoreTime">
                <a-range-picker v-model="queryParam.dealCoreTime" @change="onChangeDealCoreTime" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="工单状态" prop="workStatus">
                <a-select placeholder="请选择工单状态" v-model.trim="queryParam.workStatus">
                  <a-select-option v-for="item in workStatusTypeList.slice(1)" :key="item.itemValue">
                    {{ item.itemText }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
              <a-button type="primary" icon="reload" style="margin-left: 8px" @click="searchReset">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleWorksheetActModal('add')">工单录入</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('工单管理列表_' + time)">导出工单</a-button>
    </div>

    <!-- table区域-begin -->
    <div class="table-list-wrapper">
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
        <span slot="communicateType" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(communicate_type) }}
        </span>
        <div class="table-text-nowrap" slot="content" slot-scope="text, record" v-html="text"></div>
        <span slot="coreDemand" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(core_demand) }}
        </span>
        <span slot="dealYj" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(deal_yj) }}
        </span>
        <span slot="workStatus" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(work_status) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleSendEmail(record)">邮件转发</a>
          <a-divider type="vertical" />
          <a @click="handleWorksheetActModal('edit', record)">修改</a>
          <!-- <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm> -->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 弹框区域 -->
    <AddWorksheetModal ref="worksheetFormModal" @renovate="refreshTableList" />
  </a-card>
</template>

<script>
import { getAction } from '@/api/manage'
import { taskApiList } from '@/api/api'
import mixin_code_list from './mixins/CodeListMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import JEllipsis from '@/components/jeecg/JEllipsis'
import AddWorksheetModal from './modules/AddWorksheetModal'

export default {
  name: 'WorksheetListManage', //工单管理列表
  mixins: [mixin_code_list, JeecgListMixin],
  components: { JEllipsis, AddWorksheetModal },
  props: {},
  data() {
    let ellipsis = (v, l = 30) => <j-ellipsis value={v} length={l} />
    return {
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
          title: '客户名称',
          dataIndex: 'companyName'
        },
        {
          title: '客户联系人',
          dataIndex: 'realName'
        },
        {
          title: '联系方式',
          dataIndex: 'phone'
        },
        {
          title: '沟通分类',
          dataIndex: 'communicateType',
          scopedSlots: { customRender: 'communicateType' }
        },
        {
          title: '客户问题描述',
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' },
          width: 300
        },
        {
          title: '核心诉求',
          dataIndex: 'coreDemand',
          scopedSlots: { customRender: 'coreDemand' }
        },
        {
          title: '处理意见',
          dataIndex: 'dealYj',
          scopedSlots: { customRender: 'dealYj' }
        },
        {
          title: '处理方案关键时间点',
          dataIndex: 'dealCoreTime'
        },
        {
          title: '客户详细处理情况及意见',
          dataIndex: 'userDetailYj',
          width: 300,
          customRender: t => ellipsis(t)
        },
        {
          title: '沟通时间',
          dataIndex: 'communicateTime'
        },
        {
          title: '沟通人',
          dataIndex: 'realCommunicateName'
        },
        {
          title: '工单状态',
          dataIndex: 'workStatus',
          scopedSlots: { customRender: 'workStatus' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          fixed: 'right',
          align: 'center',
          width: 160
        }
      ],
      url: {
        list: '/erp/workOrder/pageList',
        delete: '/erp/workOrder/delete',
        exportXlsUrl: 'erp/workOrder/exportXls'
      }
    }
  },
  computed: {},
  created() {},
  watch: {},
  methods: {
    onChangeCommunicateTime(date, dateString) {
      this.queryParam.communicateTime = date
      this.queryParam.communicateTimeStart = dateString[0] || undefined
      this.queryParam.communicateTimeEnd = dateString[1] || undefined
    },
    onChangeDealCoreTime(date, dateString) {
      this.queryParam.dealCoreTime = date
      this.queryParam.dealCoreTimeStart = dateString[0] || undefined
      this.queryParam.dealCoreTimeEnd = dateString[1] || undefined
    },
    handleWorksheetActModal(type, record) {
      this.$refs.worksheetFormModal.initModal(type, record)
    },
    handleSendEmail(record) {
      let that = this
      if(record.mailSend ==null || record.mailSend == ''){
        this.$message.error('没有邮件可转发！');
        return;
      }
      this.$confirm({
        title: '重要警告！',
        content: `确定给【${record.mailSend}】发送邮件吗？`,
        onOk: () => {
          // console.log('开始发送邮件')
          let opts = {
            id: record.id,
            mailSend: record.mailSend,
            isSend: 1 //发送邮件(1-发送,2-不发送)
          }
          that.$refs.worksheetFormModal.editWorkSheet(opts)
        }
      })
    },
    refreshTableList() {
      this.loadData()
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
/deep/.table-text-nowrap p {
  width: 290px;
  margin-bottom: 0;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
