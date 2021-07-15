<template>
  <div class="page-container-tabs">
    <!-- 考试证次-查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" :model="queryParam" :rules="rules" layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="姓名" prop="userName">
              <a-input placeholder="请输入姓名" v-model.trim="queryParam.userName" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="身份证" prop="idCard">
              <a-input placeholder="请输入身份证" v-model.trim="queryParam.idCard" />
            </a-form-model-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="电话号码" prop="mobile">
                <a-input placeholder="请输入电话号码" v-model.trim="queryParam.mobile" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="公司名称" prop="companyName">
                <a-input placeholder="请输入公司名称" v-model.trim="queryParam.companyName" />
              </a-form-model-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-model-item label="工种/等级" prop="companyName">
                <a-input placeholder="请输入工种/等级" v-model.trim="queryParam.workType" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="合同编号" prop="companyName">
                <a-input placeholder="请输入合同编号" v-model.trim="queryParam.contractNo" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="报名编号" prop="companyName">
                <a-input placeholder="请输入报名编号" v-model.trim="queryParam.applyInfoId" />
              </a-form-model-item>
            </a-col>

          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
              <a-button type="primary" icon="reload" @click="searchReset" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <!-- 考试证次-表格区域 -->
    <div class="table-container">
      <a-table
        class="j-table-force-nowrap"
        ref="table"
        size="small"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
      >
        <span slot="action" slot-scope="text, record">
          <span v-has="'JpdContract:edit'">
            <a @click="handleEdit(record)">编辑</a>
<!--            <a-divider type="vertical" />-->
          </span>
          <a @click="previewRecord(record)">查看考试记录</a>
<!--          <span v-has="'JpdContract:delete'">
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </span>-->
        </span>
      </a-table>
    </div>

    <!-- 表单区域 -->
    <stu-learning-modal ref="modalForm" @ok="modalFormOk" />

    <!-- 查看考试记录 -->
    <StuExamListModal ref="examRecordListModal" />
  </div>
</template>

<script>
import JpdModuleListMixin from '../mixins/JpdModuleListMixin'
import StuLearningModal from '@/views/mingwa/modules/StuLearningModal'

import StuExamListModal from '@/views/mingwa/modules/StuExamListModal'

export default {
  name: 'JpdExamModule', //考试证次-模块组件
  mixins: [JpdModuleListMixin],
  components: { StuLearningModal, StuExamListModal },
  props: {
    selectedTreeKey: {
      type: Array,
      default: () => {
        return this.defaultSelectedTreeKey
      },
      required: true
    }
  },
  data() {
    return {
      defaultSelectedTreeKey: ['4-1'],
      apiUrlList: {
        list: '/erp/workPlanShow/getKanBanInfoInfo',
        delete: '/erp/stuLearning/delete'
      },
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          align: 'center',
          customRender: (t, r, index) => index + 1
        },
        // {
        //   title: '帐号启用日期',
        //   align: 'center',
        //   dataIndex: 'accountStartDate'
        // },
        // {
        //   title: '帐号',
        //   align: 'center',
        //   dataIndex: 'account'
        // },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'applyUserName',
        },
        {
          title: '报名编号',
          align: 'center',
          dataIndex: 'applyInfoId',
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'idCard',
        },
        {
          title: '手机号码',
          align: 'center',
          dataIndex: 'mobile',
        },
        {
          title: '工种/级别',
          align: 'center',
          dataIndex: 'workType',
        },
        {
          title: '所属公司',
          align: 'center',
          dataIndex: 'companyName',
        },
        {
          title: '理论考试成绩',
          align: 'center',
          dataIndex: 'score',
        },
        {
          title: '理论考试日期',
          align: 'center',
          dataIndex: 'examDate',
        },
        {
          title: '实操考试成绩',
          align: 'center',
          dataIndex: 'operationScore',
        },
        {
          title: '实操考试日期',
          align: 'center',
          dataIndex: 'operationExamDate',
        },
        {
          title: '总成绩',
          align: 'center',
          dataIndex: 'totalScore',
        },
        {
          title: '制作证书日期',
          align: 'center',
          dataIndex: 'certificateMadeDate',
        },
        {
          title: '证书编号',
          align: 'center',
          dataIndex: 'certificateNo',
        },
        {
          title: '合同编号',
          align: 'center',
          dataIndex: 'contractNo',
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 170
        }
      ]
    }
  },
  computed: {},
  created() {},
  methods: {
    previewRecord(record) {
      this.$refs.examRecordListModal.setRecordID(record)
      this.$refs.examRecordListModal.title = '学员考试记录'
      this.$refs.examRecordListModal.showModal()
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.page-container-tabs {
  .table-page-search-wrapper {
    margin-top: 50px;
  }
}
</style>
