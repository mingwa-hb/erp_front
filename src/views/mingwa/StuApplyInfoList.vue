<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="报名编号">
              <a-input placeholder="请输入报名编号进行查询" v-model.trim="queryParam.id" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号进行查询" v-model.trim="queryParam.contractNo" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="公司名称">
              <a-input placeholder="请输入公司名称进行查询" v-model.trim="queryParam.companyName" />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="工种/等级名称">
                <a-input placeholder="请输入工种/等级名称进行查询" v-model.trim="queryParam.workType" />
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
              <a-form-item label="项目经理">
                <a-input placeholder="请输入项目经理进行查询" v-model.trim="queryParam.managerName" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <a-select
                  placeholder="请选择状态"
                  :getPopupContainer="target => target.parentNode"
                  v-model="queryParam.status"
                >
                  <a-select-option value="正常">正常</a-select-option>
                  <a-select-option value="离职">离职</a-select-option>
                  <a-select-option value="退费">退费</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="操作类型" prop="taskAction">
                <a-select placeholder="请选择操作类型" v-model.trim="queryParam.taskAction">
                  <a-select-option v-for="item in taskActionsTypeList.slice(1)" :key="item.itemValue">
                    {{ item.itemText }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="审核状态" prop="showStatus">
                <a-select placeholder="请选择审核状态" v-model.trim="queryParam.showStatus">
                  <a-select-option v-for="item in dataStatusTypeList.slice(1)" :key="item.itemValue">
                    {{ item.itemText }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
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
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('报名基础信息管理_' + time)">导出</a-button>
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
          <a-menu-item key="1" @click="batchEditWorkType">
            <a-icon type="edit" title="批量修改工种" />
            修改工种
          </a-menu-item>
          <!--          <a-menu-item key="2" @click="batchDel">
            <a-icon type="delete" title="批量删除" />
            删除
          </a-menu-item>-->
        </a-menu>
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
        <span slot="taskAction" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(taskActionsTypeList) }}
        </span>
        <span slot="showStatus" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(dataStatusTypeList) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template v-if="record.dataStatus == 1 || record.dataStatus == 4 || record.dataStatus == 5">
            <a @click="handleEdit(record)">编辑</a>
          </template>
          <template
            v-if="
              record.dataStatus == 1 || (record.dataStatus == 5 && (record.taskAction == 1 || record.taskAction == 4))
            "
          >
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <stu-apply-info-modal ref="modalForm" @ok="modalFormOk" />

    <!--批量修改工种弹框-->
    <stu-batch-edit-work-type-modal
      ref="batchEditWorktypeModal"
      :selected-data-keys="selectedRowKeys"
      @refreshList="modalFormOk"
    ></stu-batch-edit-work-type-modal>
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import queryCodeListMixin from '@/mixins/queryCodeListMixin'
import StuApplyInfoModal from './modules/StuApplyInfoModal'
import StuBatchEditWorkTypeModal from './modules/StuBatchEditWorkTypeModal'

export default {
  name: 'StuApplyInfo',
  mixins: [queryCodeListMixin, JeecgListMixin],
  components: { JEllipsis, StuApplyInfoModal, StuBatchEditWorkTypeModal },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      description: '报名基础信息管理',
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
          title: '报名编号',
          fixed: 'left',
          dataIndex: 'id'
        },
        {
          title: '合同编号',
          fixed: 'left',
          dataIndex: 'contractNo'
        },
        {
          title: '姓名',
          fixed: 'left',
          dataIndex: 'userName'
        },
        {
          title: '身份证号',
          fixed: 'left',
          dataIndex: 'idCard'
        },
        {
          title: '手机号码',
          dataIndex: 'mobile'
        },
        {
          title: '性别',
          dataIndex: 'sexShow'
        },
        {
          title: '工种/级别',
          dataIndex: 'workType'
        },
        {
          title: '学历',
          dataIndex: 'education'
        },
        {
          title: '公司',
          dataIndex: 'companyName'
        },
        {
          title: '累计缴纳社保时长',
          dataIndex: 'socialSecurityDurationName'
        },
        {
          title: '民族',
          dataIndex: 'nation'
        },
        {
          title: '毕业证书编号',
          dataIndex: 'educationNo'
        },
        {
          title: '报名日期',
          dataIndex: 'applyDate'
        },
        {
          title: '项目经理',
          dataIndex: 'managerName'
        },
        {
          title: '业务支持',
          dataIndex: 'supportName'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          fixed: 'right'
        },
        {
          title: '操作类型',
          dataIndex: 'taskAction',
          scopedSlots: { customRender: 'taskAction' },
          fixed: 'right'
        },
        {
          title: '审核状态',
          dataIndex: 'showStatus',
          align: 'center',
          scopedSlots: { customRender: 'showStatus' },
          fixed: 'right'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          fixed: 'right',
          width: 150
        }
      ],
      url: {
        list: '/erp/stuApplyInfo/getApplyInfos',
        delete: '/erp/stuApplyInfo/delete',
        deleteBatch: '/erp/stuApplyInfo/deleteBatch',
        exportXlsUrl: 'erp/stuApplyInfo/exportXls',
        importExcelUrl: 'erp/stuApplyInfo/importExcel',
        editWorkTypeBatch: 'erp/stuApplyInfo/editWorkTypeBatch'
      }
    }
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    curTaskKey({ $route }) {
      //从任务列表的Url传过来，此列表对应的是id字段(报名编号)
      return (!!$route.query && !!$route.query.taskKey && $route.query.taskKey) || undefined
    }
  },
  watch: {
    curTaskKey: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.queryParam.id = newV
        this.searchQuery()
      }
    }
  },
  methods: {
    batchEditWorkType() {
      if (!this.url.editWorkTypeBatch) {
        this.$message.error('请设置url.editWorkTypeBatch属性!')
        return false
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return false
      } else {
        this.$refs.batchEditWorktypeModal.showModal()
      }
    },
    downLoadTemplate() {
      var newFileUrl = encodeURI(
        'https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/temp/报名基础信息管理模版_1623729340587.xls',
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
