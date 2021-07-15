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
              <a-form-item label="班主任">
                <a-input placeholder="请输入班主任进行查询" v-model.trim="queryParam.headmaster" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="合同编号">
                <a-input placeholder="请输入合同编号进行查询" v-model.trim="queryParam.contractNo" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="学习时长是否达标">
                <a-select placeholder="全部" v-model.trim="queryParam.isFinishStudy">
                  <a-select-option value="1">否</a-select-option>
                  <a-select-option value="2">是</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="是否报名考试">
                <a-select placeholder="全部" v-model.trim="queryParam.isApplyExam">
                  <a-select-option value="1">否</a-select-option>
                  <a-select-option value="2">是</a-select-option>
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
      <a-button type="primary" icon="download" @click="handleExportXls('学习管理_' + time)">导出</a-button>
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
      <a-button type="primary" icon="download" @click="applyExamBatch()">报名考试</a-button>
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
        <span slot="isFinishStudyShow" slot-scope="text, record">
          <template v-if="record.isFinishStudy == 1">否</template>
          <template v-else-if="record.isFinishStudy == 2">是</template>
          <template v-else>未知</template>
        </span>
        <span slot="isApplyExamShow" slot-scope="text, record">
          <template v-if="record.isApplyExam == 1">否</template>
          <template v-else-if="record.isApplyExam == 2">是</template>
          <template v-else>未知</template>
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
    <stu-learning-modal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import queryCodeListMixin from '@/mixins/queryCodeListMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixinDaoRuExcel'
import StuLearningModal from './modules/StuLearningModal'
import { applyExamBatch } from '@/api/api'
export default {
  name: 'StuLearning',
  mixins: [queryCodeListMixin, JeecgListMixin],
  components: { JEllipsis, StuLearningModal },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
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
          title: '报名编号',
          fixed: 'left',
          dataIndex: 'applyInfoId'
        },
        {
          title: '姓名',
          dataIndex: 'applyUserName'
        },
        {
          title: '身份证号',
          dataIndex: 'idCard'
        },
        {
          title: '合同编号',
          dataIndex: 'contractNo'
        },
        {
          title: '手机号码',
          align: 'center',
          dataIndex: 'mobile'
        },
        {
          title: '工种/等级',
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
          title: '班主任',
          align: 'center',
          dataIndex: 'headmasterName'
        },
        {
          title: '学习时长(分钟)',
          align: 'center',
          dataIndex: 'learningDuration'
        },
        {
          title: '学习时长是否达标',
          align: 'center',
          dataIndex: 'isFinishStudy',
          scopedSlots: { customRender: 'isFinishStudyShow' }
        },
        {
          title: '是否已报名考试',
          align: 'center',
          dataIndex: 'isApplyExam',
          scopedSlots: { customRender: 'isApplyExamShow' }
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
          scopedSlots: { customRender: 'showStatus' },
          fixed: 'right'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 150,
          fixed: 'right'
        }
      ],
      url: {
        list: '/erp/stuLearning/getLearning',
        delete: '/erp/stuLearning/delete',
        deleteBatch: '/erp/stuLearning/deleteBatch',
        exportXlsUrl: 'erp/stuLearning/exportXlsLearn',
        importExcelUrl: 'erp/stuLearning/importExcelLearn'
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
    downLoadTemplate() {
      var newFileUrl = encodeURI(
        'https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/upload/学习管理导入模板.xls',
        'utf-8'
      )
      window.location.href = newFileUrl
    },

    applyExamBatch() {
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
          title: '确认报名考试',
          content: '选中数据是否报名考试?',
          onOk: function() {
            that.loading = true
            applyExamBatch({
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
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
