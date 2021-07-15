<template>
  <div class="page-container-tabs">
    <!-- 报名证次-查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" :model="queryParam" :rules="rules" layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="报名编号" prop="id">
              <a-input placeholder="请输入报名编号" v-model.trim="queryParam.id" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="公司名称" prop="companyName">
              <a-input placeholder="请输入公司名称" v-model.trim="queryParam.companyName" />
            </a-form-model-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="工种/等级" prop="workType">
                <a-input placeholder="请输入工种/等级" v-model.trim="queryParam.workType" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="姓名" prop="userName">
                <a-input placeholder="请输入姓名" v-model.trim="queryParam.userName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="身份证号" prop="idCard">
                <a-input placeholder="请输入身份证号" v-model.trim="queryParam.idCard" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="电话号码" prop="mobile">
                <a-input placeholder="请输入电话号码" v-model.trim="queryParam.mobile" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="项目经理" prop="managerName">
                <a-input placeholder="请输入项目经理" v-model.trim="queryParam.managerName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="状态" prop="status">
                <a-select
                  placeholder="请选择状态"
                  :getPopupContainer="target => target.parentNode"
                  v-model="queryParam.status"
                >
                  <a-select-option value="正常">正常</a-select-option>
                  <a-select-option value="离职">离职</a-select-option>
                  <a-select-option value="退费">退费</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-model-item label="筛选" prop="key">
                <a-select
                  placeholder="请选择"
                  :getPopupContainer="target => target.parentNode"
                  v-model="queryParam.key"
                  @change="handleSelectChange"
                >
                  <a-select-option v-for="item in selectList" :value="item.key" :key="item.key">
                    {{ item.title }}
                  </a-select-option>
                </a-select>
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

    <!-- 报名证次-表格区域 -->
    <div class="table-container">
      <a-table
        class="j-table-force-nowrap"
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <span v-has="'JpdContract:edit'">
            <a @click="handleEdit(record)">编辑</a>
<!--            <a-divider type="vertical" />-->
          </span>
<!--          <span v-has="'JpdContract:delete'">
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </span>-->
        </span>
      </a-table>
    </div>

    <!-- 表单区域 -->
    <stu-apply-info-modal ref="modalForm" @ok="modalFormOk" />
  </div>
</template>

<script>
import JpdModuleListMixin from '../mixins/JpdModuleListMixin'

import StuApplyInfoModal from '@/views/mingwa/modules/StuApplyInfoModal'
export default {
  name: 'JpdSignupModule', //报名证次-模块组件
  mixins: [JpdModuleListMixin],
  components: { StuApplyInfoModal },
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
      defaultSelectedTreeKey: ['2-1'],
      apiUrlList: {
        list: '/erp/workPlanShow/getKanBanInfoInfo',
        delete: '/erp/stuApplyInfo/delete'
      },
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
          title: '报名编号',
          align: 'center',
          dataIndex: 'id'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'userName'
        },
        {
          title: '身份证号',
          align: 'center',
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
          dataIndex: 'sexShow'
        },
        {
          title: '工种/级别',
          align: 'center',
          dataIndex: 'workType'
        },
        {
          title: '学历',
          align: 'center',
          dataIndex: 'education'
        },
        {
          title: '公司',
          align: 'center',
          dataIndex: 'companyName'
        },
        {
          title: '民族',
          align: 'center',
          dataIndex: 'nation'
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
          dataIndex: 'managerName'
        },
        {
          title: '业务支持',
          align: 'center',
          dataIndex: 'supportName'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status'
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
    previewContractDetailsList(record) {
      this.$refs.stuContractDetailsList.edit(record)
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
