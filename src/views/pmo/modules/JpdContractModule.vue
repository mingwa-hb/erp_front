<template>
  <div class="page-container-tabs">
    <!-- 合同证次-查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model ref="ruleForm" :model="queryParam" :rules="rules" layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="合同编号" prop="contractNo">
              <a-input placeholder="请输入合同编号" v-model.trim="queryParam.contractNo" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="公司名称" prop="companyName">
              <a-input placeholder="请输入公司名称" v-model.trim="queryParam.companyName" />
            </a-form-model-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-model-item label="筛选" prop="key">
                <a-select
                  placeholder="请选择"
                  :getPopupContainer="(target) => target.parentNode"
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
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
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

    <!-- 合同证次-表格区域 -->
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
        <span slot="contractNo" slot-scope="text, record">
          <a @click="tiaozhuan(record)">{{ record.contractNo }}</a>
        </span>
      </a-table>
    </div>

    <!-- 表单区域 -->
    <stu-contract-modal ref="modalForm" @ok="modalFormOk" />
    <!--报考信息列表-->
    <stu-contract-details-list ref="stuContractDetailsList"></stu-contract-details-list>
  </div>
</template>

<script>
import JpdModuleListMixin from '../mixins/JpdModuleListMixin'

import StuContractDetailsList from '@/views/mingwa/StuContractDetailsList'
import StuContractModal from '@/views/mingwa/modules/StuContractModal'

export default {
  name: 'JpdContractModule', //合同证次-模块组件
  mixins: [JpdModuleListMixin],
  components: { StuContractDetailsList, StuContractModal },
  props: {
    selectedTreeKey: {
      type: Array,
      default: () => {
        return this.defaultSelectedTreeKey
      },
      required: true,
    },
  },
  data() {
    return {
      defaultSelectedTreeKey: ['1-2'],
      /* api接口地址 */
      apiUrlList: {
        list: '/erp/workPlanShow/getKanBanInfoInfo',
      },
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (t, r, index) => index + 1,
        },
        {
          title: '合同编号',
          align: 'center',
          dataIndex: 'contractNo',
          scopedSlots: { customRender: 'contractNo' },
        },
        {
          title: '所属公司',
          align: 'center',
          dataIndex: 'companyName',
        },
        {
          title: '项目经理',
          align: 'center',
          dataIndex: 'managerCn',
        },
        {
          title: '业务支持',
          align: 'center',
          dataIndex: 'supporterCn',
        },
        {
          title: '合同创建人',
          align: 'center',
          dataIndex: 'createByCn',
        },
        {
          title: '应付合同金额(元)',
          align: 'center',
          dataIndex: 'totalAmount',
        },
        {
          title: '合同证次',
          align: 'center',
          dataIndex: 'certificateCount',
        },
        {
          title: '应付首付款(元)',
          align: 'center',
          dataIndex: 'duePayment',
        },
        {
          title: '实付首付款(元)',
          align: 'center',
          dataIndex: 'actDuePayment',
        },
        {
          title: '首付日期',
          align: 'center',
          dataIndex: 'firstPayDate',
        },
        {
          title: '应付尾款(元)',
          align: 'center',
          dataIndex: 'dueBalance',
        },
        {
          title: '实付尾款(元)',
          align: 'center',
          dataIndex: 'actBalance',
        },
        {
          title: '尾款支付日期',
          align: 'center',
          dataIndex: 'balancePaymentDate',
        },
        {
          title: '签订日期',
          align: 'center',
          dataIndex: 'signDate',
        },
        {
          title: '合同截止日期',
          align: 'center',
          dataIndex: 'deadLine',
        },
        {
          title: '证书发放日期',
          align: 'center',
          dataIndex: 'certificatePassDate',
        }
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    previewContractDetailsList(record) {
      this.$refs.stuContractDetailsList.edit(record)
    },

    tiaozhuan: function (record) {
      if (record.canHref === "2") {
        this.$message.warning('当前登录人没有权限查看合同详情');
        return;
      }
      this.$router.push({
        path:
          '/imingwa/StuContractList/details?id=' +
          record.id +
          '&contractNo=' +
          record.contractNo +
          '&companyName=' +
          record.companyName +
          '&companyId=' +
          record.companyId,
        query: {
          id: record.id,
          contractNo: record.contractNo,
          companyName: record.companyName,
          companyId: record.companyId,
        },
      })
    },
  },
  mounted() {},
}
</script>
<style lang="less" scoped>
.page-container-tabs {
  .table-page-search-wrapper {
    margin-top: 50px;
  }
}
</style>
