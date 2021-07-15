<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
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

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="电话号码">
                <a-input placeholder="请输入电话号码进行查询" v-model.trim="queryParam.mobile" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="公司名称">
                <a-input placeholder="请输入公司名称进行查询" v-model.trim="queryParam.companyName" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="工种/等级">
                <a-input placeholder="请输入工种/等级进行查询" v-model.trim="queryParam.workType" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="合同编号">
                <a-input placeholder="请输入合同编号进行查询" v-model.trim="queryParam.contractNo" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="操作类型" prop="taskExamAction">
                <a-select placeholder="请选择操作类型" v-model.trim="queryParam.taskExamAction">
                  <a-select-option v-for="item in taskActionsTypeList.slice(1)" :key="item.itemValue">
                    {{ item.itemText }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="审核状态" prop="showExamStatus">
                <a-select placeholder="请选择审核状态" v-model.trim="queryParam.showExamStatus">
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
      <a-button type="primary" icon="download" @click="handleExportXls('考务管理_' + time)">导出</a-button>
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
        <span slot="taskExamAction" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(taskActionsTypeList) }}
        </span>
        <span slot="showExamStatus" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(dataStatusTypeList) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template v-if="record.dataExamStatus == 1 || record.dataExamStatus == 4 || record.dataExamStatus == 5">
            <a @click="handleEdit(record)">编辑</a>
            <!-- <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm> -->
          </template>
          <a-divider type="vertical" />
          <a @click="previewRecord(record)">查看考试记录</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <stu-exam-modal ref="modalForm" @ok="modalFormOk" />

    <!-- 查看考试记录 -->
    <StuExamListModal ref="examRecordListModal" />
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import queryCodeListMixin from '@/mixins/queryCodeListMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixinDaoRuExcel'
import StuExamModal from './modules/StuExamModal'
import StuExamListModal from './modules/StuExamListModal'
import { deleteAction, getAction, downFile, getFileAccessHttpUrl, postAction } from '@/api/manage'
export default {
  name: 'StuExamList',
  mixins: [queryCodeListMixin, JeecgListMixin],
  components: { JEllipsis, StuExamModal, StuExamListModal },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      name: 'StuExamList', //考务管理
      description: '学习管理',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          align: 'center',
          fixed: 'left',
          customRender: (t, r, index) => index + 1
        },
        {
          title: '姓名',
          dataIndex: 'applyUserName',
          fixed: 'left'
        },
        {
          title: '报名编号',
          dataIndex: 'applyInfoId',
          fixed: 'left'
        },
        {
          title: '身份证号',
          dataIndex: 'idCard',
          fixed: 'left'
        },
        {
          title: '合同编号',
          dataIndex: 'contractNo',
          fixed: 'left'
        },
        {
          title: '手机号码',
          align: 'center',
          dataIndex: 'mobile'
        },
        {
          title: '工种/级别',
          align: 'center',
          dataIndex: 'workType'
        },
        {
          title: '所属公司',
          align: 'center',
          dataIndex: 'companyName',
          width: 300
        },
        {
          title: '理论考试成绩',
          align: 'center',
          dataIndex: 'score'
        },
        {
          title: '理论考试日期',
          align: 'center',
          dataIndex: 'examDate'
        },
        {
          title: '实操考试成绩',
          align: 'center',
          dataIndex: 'operationScore'
        },
        {
          title: '实操考试日期',
          align: 'center',
          dataIndex: 'operationExamDate'
        },
        {
          title: '总成绩',
          align: 'center',
          dataIndex: 'totalScore'
        },
        {
          title: '制作证书日期',
          align: 'center',
          dataIndex: 'certificateMadeDate'
        },
        {
          title: '证书编号',
          align: 'center',
          dataIndex: 'certificateNo'
        },
        {
          title: '操作类型',
          dataIndex: 'taskExamAction',
          scopedSlots: { customRender: 'taskExamAction' },
          fixed: 'right'
        },
        {
          title: '审核状态',
          dataIndex: 'showExamStatus',
          scopedSlots: { customRender: 'showExamStatus' },
          fixed: 'right'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          fixed: 'right',
          width: 170
        }
      ],
      url: {
        list: '/erp/stuLearning/getLearning',
        delete: '/erp/stuLearning/updateExamNull',
        deleteBatch: '/erp/stuLearning/deleteBatch',
        exportXlsUrl: '/erp/stuLearning/exportXlsExam',
        importExcelUrl: '/erp/stuLearning/importExcelExam'
      }
    }
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    curTaskKey({ $route }) {
      //从任务列表的Url传过来，此列表对应的是applyInfoId字段
      return (!!$route.query && !!$route.query.taskKey && $route.query.taskKey) || undefined
    }
  },
  watch: {
    curTaskKey: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.queryParam.applyInfoId = newV
        this.searchQuery()
      }
    }
  },
  methods: {
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() //查询条件
      this.loading = true
      getAction(this.url.list + '?isApplyExam=2', params).then(res => {
        if (res.success) {
          //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          this.dataSource = res.result.records || res.result
          if (res.result.total) {
            this.ipagination.total = res.result.total
          }
          //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },

    // 导出
    handleExportXls(fileName) {
      this.loading = true
      if (!fileName || typeof fileName != 'string') {
        fileName = '导出文件'
      }
      let param = {
        ...this.queryParam
      }
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param['selections'] = this.selectedRowKeys.join(',')
      }
      downFile(this.url.exportXlsUrl + '?isApplyExam=2', param).then(data => {
        if (!data) {
          this.loading = false
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          this.loading = false
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: 'application/vnd.ms-excel'
            }),
            fileName + '.xls'
          )
        } else {
          let url = window.URL.createObjectURL(
            new Blob([data], {
              type: 'application/vnd.ms-excel'
            })
          )
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
          this.loading = false
        }
      })
    },

    handleDelete(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      getAction(this.url.delete + '?id=' + id).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    downLoadTemplate() {
      var newFileUrl = encodeURI(
        'https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/upload/考务管理导入模板.xls',
        'utf-8'
      )
      window.location.href = newFileUrl
    },
    previewRecord(record) {
      this.$refs.examRecordListModal.setRecordID(record)
      this.$refs.examRecordListModal.title = '学员考试记录'
      this.$refs.examRecordListModal.showModal()
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
