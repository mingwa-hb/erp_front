<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="身份证号">
              <a-input placeholder="请输入身份证号查询" v-model.trim="queryParam.idCard" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="工种/级别">
              <a-input placeholder="请输入工种/级别查询" v-model.trim="queryParam.workType" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="公司名称">
              <a-input placeholder="请输入公司名称查询" v-model.trim="queryParam.companyName" />
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="学生姓名">
                <a-input placeholder="请输入学生姓名查询" v-model.trim="queryParam.userName" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="手机号">
                <a-input placeholder="请输入手机号查询" v-model.trim="queryParam.mobile" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="业务支持">
                <a-input placeholder="请输入文件名称进行查询" v-model.trim="queryParam.supporter" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="8">
              <a-form-item label="上报时间">
                <j-date
                  style="width: 48%"
                  :getCalendarContainer="node => node.parentNode"
                  v-model="queryParam.dateFrom"
                  placeholder="请选择上报开始时间"
                  dateFormat="YYYY-MM-DD"
                ></j-date>
                <span style="display: inline-block; width: 4%; text-align: center">至</span>
                <j-date
                  style="width: 48%"
                  :getCalendarContainer="node => node.parentNode"
                  v-model="queryParam.dateTo"
                  placeholder="请选择上报结束时间"
                  dateFormat="YYYY-MM-DD"
                ></j-date>
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
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
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
      <a-button type="primary" icon="download" @click="handleExportXls('学员信息审核_' + time)">导出</a-button>
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
        rowKey="applyInfoId"
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
          <!-- <a @click="handleCheck(record)" v-if="record.auditStatusDesc == '待审核'">审核</a> -->
          <!-- <a-divider type="vertical" v-if="record.auditStatusDesc == '待审核'" /> -->
          <a @click="viewCheck(record)">查看</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域-->
    <student-check-modal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import queryCodeListMixin from '@/mixins/queryCodeListMixin'
import StudentCheckModal from './modules/StudentCheckModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixinPostList'
import { getAction, downFile } from '@/api/manage'
import JDate from '@/components/jeecg/JDate'

export default {
  name: 'StuInfoCheckList',
  mixins: [queryCodeListMixin, JeecgListMixin],
  components: { StudentCheckModal, JEllipsis, JDate },
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
          fixed: 'left',
          customRender: (t, r, index) => index + 1
        },
        {
          title: '姓名',
          align: 'center',
          fixed: 'left',
          dataIndex: 'userName'
        },
        {
          title: '身份证号',
          align: 'center',
          fixed: 'left',
          dataIndex: 'idCard'
        },
        {
          title: '手机号码',
          align: 'center',
          dataIndex: 'mobile'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'showSex'
        },
        {
          title: '工种/级别',
          align: 'center',
          dataIndex: 'workType'
        },
        {
          title: '公司',
          align: 'center',
          dataIndex: 'companyName',
          width: 300
        },
        {
          title: '民族',
          align: 'center',
          dataIndex: 'nation'
        },
        {
          title: '学历',
          align: 'center',
          dataIndex: 'education'
        },
        {
          title: '毕业证书编号',
          align: 'center',
          dataIndex: 'educationNo'
        },
        {
          title: '报名日期',
          align: 'center',
          dataIndex: 'applyDate'
        },
        {
          title: '项目经理',
          align: 'center',
          dataIndex: 'manager'
        },
        {
          title: '业务支持',
          align: 'center',
          dataIndex: 'supporterName'
        },
        {
          title: '操作类型',
          dataIndex: 'taskAction',
          scopedSlots: { customRender: 'taskAction' },
          fixed: 'right'
        },
        {
          title: '审核状态',
          align: 'center',
          dataIndex: 'showStatus',
          scopedSlots: { customRender: 'showStatus' },
          fixed: 'right'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          fixed: 'right',
          width: 120
        }
      ],
      url: {
        list: '/userAudit/list',
        getUserInfoByApplyInfoId: '/userAudit/getUserInfoByApplyInfoId',
        exportXlsUrl: '/userAudit/exportXls'
      }
    }
  },
  computed: {},
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        let idCard = (!!newV.query && !!newV.query.taskKey && newV.query.taskKey) || undefined
        let workType = (!!newV.query && !!newV.query.taskKey2 && newV.query.taskKey2) || undefined
        this.queryParam.idCard = idCard
        this.queryParam.workType = workType
        this.searchQuery()
      }
    }
  },
  methods: {
    viewFile(record) {
      if (record.errorFilePath) {
        var newFileUrl = encodeURI(record.errorFilePath, 'utf-8')
        window.location.href = newFileUrl
      } else {
        this.$message.success(`导入成功了或者由于无法解析而没开始导入，没有可查看的文件`)
      }
    },
    handleCheck: function(record) {
      // console.log(record)
      getAction(this.url.getUserInfoByApplyInfoId + '/' + record.applyInfoId)
        .then(res => {
          console.log(res.result)
          if (res.success) {
            this.$refs.modalForm.edit(res.result, 1)
            this.$refs.modalForm.title = '审核'
            this.$refs.modalForm.disableSubmit = false
            // this.announcement1 = res.result.anntMsgList;
          }
        })
        .catch(error => {})
    },

    viewCheck: function(record) {
      getAction(this.url.getUserInfoByApplyInfoId + '/' + record.applyInfoId)
        .then(res => {
          if (res.success) {
            this.$refs.modalForm.edit(res.result, 2)
            this.$refs.modalForm.title = '查看'
            this.$refs.modalForm.disableSubmit = true
          }
        })
        .catch(error => {})
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
