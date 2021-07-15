<template>
  <div class="page-container-tabs">
    <!-- 学习证次-查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" :model="queryParam" :rules="rules" layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="姓名" prop="contractNo">
              <a-input placeholder="请输入姓名" v-model.trim="queryParam.userName" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="身份证" prop="companyName">
              <a-input placeholder="请输入身份证" v-model.trim="queryParam.idCard" />
            </a-form-model-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="电话号码" prop="workType">
                <a-input placeholder="请输入电话号码" v-model.trim="queryParam.mobile" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="公司名称" prop="userName">
                <a-input placeholder="请输入公司名称" v-model.trim="queryParam.companyName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="工种/等级" prop="idCard">
                <a-input placeholder="请输入工种/等级" v-model.trim="queryParam.workType" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="班主任" prop="mobile">
                <a-input placeholder="请输入班主任" v-model.trim="queryParam.headmaster" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="合同编号" prop="supportName">
                <a-input placeholder="请输入合同编号" v-model.trim="queryParam.contractNo" />
              </a-form-model-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-model-item label="是否报名考试">
                <a-select style="width: 300px" placeholder="全部" v-model.trim="queryParam.isApplyExam">
                  <a-select-option value="1">否</a-select-option>
                  <a-select-option value="2">是</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-model-item label="报名编号" prop="headmaster">
                <a-input placeholder="请输入报名编号" v-model.trim="queryParam.applyInfoId" />
              </a-form-model-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-model-item label="学习是否完成">
                <a-select style="width: 300px" placeholder="全部" v-model.trim="queryParam.isFinishStudy">
                  <a-select-option value="1">否</a-select-option>
                  <a-select-option value="2">是</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
<!--            <a-col :md="6" :sm="8">-->
<!--              <a-form-model-item label="状态" prop="status">-->
<!--                <a-select-->
<!--                  placeholder="请选择状态"-->
<!--                  :getPopupContainer="target => target.parentNode"-->
<!--                  v-model="queryParam.status"-->
<!--                >-->
<!--                  <a-select-option value="正常">正常</a-select-option>-->
<!--                  <a-select-option value="离职">离职</a-select-option>-->
<!--                  <a-select-option value="退费">退费</a-select-option>-->
<!--                </a-select>-->
<!--              </a-form-model-item>-->
<!--            </a-col>-->
<!--            <a-col :md="6" :sm="8">-->
<!--              <a-form-model-item label="筛选" prop="key">-->
<!--                <a-select-->
<!--                  placeholder="请选择"-->
<!--                  :getPopupContainer="target => target.parentNode"-->
<!--                  v-model="queryParam.key"-->
<!--                  @change="handleSelectChange"-->
<!--                >-->
<!--                  <a-select-option v-for="item in selectList" :value="item.key" :key="item.key">-->
<!--                    {{ item.title }}-->
<!--                  </a-select-option>-->
<!--                </a-select>-->
<!--              </a-form-model-item>-->
<!--            </a-col>-->
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

    <!-- 学习证次-表格区域 -->
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
        </span>
        <span slot="isFinishStudyShow" slot-scope="record">
          <span v-if="record === 1">否</span>
          <span v-if="record === 2">是</span>
          </span>
        <span slot="isApplyExamShow" slot-scope="record">
            <span v-if="record === '1'">否</span>
            <span v-if="record === '2'">是</span>
          </span>
      </a-table>
    </div>

    <!-- 表单区域 -->
    <stu-learning-modal ref="modalForm" @ok="modalFormOk" />
  </div>
</template>

<script>
import JpdModuleListMixin from '../mixins/JpdModuleListMixin'
import StuLearningModal from '@/views/mingwa/modules/StuLearningModal'

export default {
  name: 'JpdLearnModule', //学习证次-模块组件
  mixins: [JpdModuleListMixin],
  components: { StuLearningModal },
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
      defaultSelectedTreeKey: ['3-1'],
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
          title: '工种/等级',
          align: 'center',
          dataIndex: 'workType',
        },
        {
          title: '所属公司',
          align: 'center',
          dataIndex: 'companyName',
        },
        {
          title: '班主任',
          align: 'center',
          dataIndex: 'headmasterName',
        },
        {
          title: '学习时长(分钟)',
          align: 'center',
          dataIndex: 'learningDuration',
        },
        {
          title: '学习时长是否达标',
          align: 'center',
          dataIndex: 'isFinishStudy',
          scopedSlots: { customRender: 'isFinishStudyShow' },
        },
        {
          title: '是否已报名考试',
          align: 'center',
          dataIndex: 'isApplyExam',
          scopedSlots: { customRender: 'isApplyExamShow' },
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
  methods: {},
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
