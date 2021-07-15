<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="4" :sm="8">
            <a-form-item label="公司名称">
              <a-input placeholder="请输入公司名称进行查询" v-model.trim="queryParam.companyName"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名进行查询" v-model.trim="queryParam.userName"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="身份证">
              <a-input placeholder="请输入身份证进行查询" v-model.trim="queryParam.idCard"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="电话号码">
              <a-input placeholder="请输入电话号码进行查询" v-model.trim="queryParam.mobile"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="4" :sm="8">
            <a-form-item label="证书编号">
              <a-input placeholder="请输入证书编号进行查询" v-model.trim="queryParam.certificateNo"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="工种/级别">
              <a-input placeholder="请输入工种/级别进行查询" v-model.trim="queryParam.workType"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="业务支持">
              <a-input placeholder="请输入业务支持进行查询" v-model.trim="queryParam.supporter"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="班主任">
              <a-input placeholder="请输入班主任进行查询" v-model.trim="queryParam.headmaster"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="4" :sm="8">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号进行查询" v-model.trim="queryParam.contractNo"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="2">
            <a-form-item label="理论考试日期">
              <j-date style="width: 100%" :getCalendarContainer="node => node.parentNode" v-model="queryParam.examDateFrom" placeholder="理论考试日期" dateFormat="YYYY-MM-DD"></j-date>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="2">
            <a-form-item label="至">
              <j-date style="width: 100%" :getCalendarContainer="node => node.parentNode" v-model="queryParam.examDateFromTo" placeholder="理论考试日期" dateFormat="YYYY-MM-DD"></j-date>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="实操考试日期">
              <j-date style="width: 100%" :getCalendarContainer="node => node.parentNode" v-model="queryParam.operationExamDateFrom" placeholder="实操考试日期" dateFormat="YYYY-MM-DD"></j-date>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="至">
              <j-date style="width: 100%" :getCalendarContainer="node => node.parentNode" v-model="queryParam.operationExamDateTo" placeholder="实操考试日期" dateFormat="YYYY-MM-DD"></j-date>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
        <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>&nbsp;&nbsp;
              <a-button type="primary" icon="download" @click="handleExportXls('学员考试申报资料汇总表_'+time)">导出</a-button>
            </span>
        </a-col>

        </a-row>
      </a-form>
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
        class="j-table-force-nowrap"
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JDate from '@/components/jeecg/JDate'

  export default {
    name: 'StuReportSummary',
    mixins: [JeecgListMixin],
    components: { JEllipsis,JDate},
    data() {
      let ellipsis = (v, l = 20) => (<j-ellipsis value={v} length={l}/>)
      return {
        description: '学员考试申报资料汇总表',
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
            dataIndex: 'showSex',
          },
          {
            title: '工种/等级',
            align: 'center',
            dataIndex: 'workType',
            width: 110
          },
          {
            title: '学历',
            dataIndex: 'education',
            align: "center",
            width: 110
          }
          ,
          {
            title: '公司',
            dataIndex: 'companyName',
            align: "center",
            width: 170
          }
          ,
          {
            title: '民族',
            dataIndex: 'nation',
            align: "center",
            width: 170
          },
          {
            title: '毕业证书编号',
            dataIndex: 'educationNo',
            align: "center",
            width: 170
          }

          ,
          {
            title: '报名日期',
            dataIndex: 'applyDate',
            align: "center",
            width: 170
          }
          ,
          {
            title: '项目经理',
            dataIndex: 'manager',
            align: "center",
            width: 170
          }
          ,
          {
            title: '业务支持',
            dataIndex: 'supporter',
            align: "center",
            width: 170
          },
          {
            title: '帐号启用日期',
            dataIndex: 'accountStartDate',
            align: "center",
            width: 170
          }
          ,
          {
            title: '班主任',
            dataIndex: 'headmaster',
            align: "center",
            width: 170
          },
          {
            title: '学习时长',
            dataIndex: 'learningDuration',
            align: "center",
            width: 170
          }
          ,
          {
            title: '理论考试日期',
            dataIndex: 'examDate',
            align: "center",
            width: 170
          },
          {
            title: '理论考试成绩',
            dataIndex: 'score',
            align: "center",
            width: 170
          }
          ,
          {
            title: '实操考试日期',
            dataIndex: 'operationExamDate',
            align: "center",
            width: 170
          },
          {
            title: '实操考试成绩',
            dataIndex: 'operationScore',
            align: "center",
            width: 170
          },
          {
            title: '证书制作日期',
            dataIndex: 'certificateMadeDate',
            align: "center",
            width: 170
          }
          ,
          {
            title: '证书编号',
            dataIndex: 'certificateNo',
            align: "center",
            width: 170
          }
          ,
          {
            title: '合同编号',
            dataIndex: 'contractNo',
            align: "center",
            width: 170
          }
          ,
          {
            title: '应付合同金额',
            dataIndex: 'totalAmount',
            align: "center",
            width: 170
          }
          ,
          {
            title: '实付合同金额',
            dataIndex: 'actAmount',
            align: "center",
            width: 170
          }
          ,
          {
            title: '应付首付款',
            dataIndex: 'duePayment',
            align: "center",
            width: 170
          }
          ,
          {
            title: '实付首付款',
            dataIndex: 'actDuePayment',
            align: "center",
            width: 170
          }
          ,
          {
            title: '首付日期',
            dataIndex: 'firstPayDate',
            align: "center",
            width: 170
          }
          ,
          {
            title: '应付尾款',
            dataIndex: 'dueBalance',
            align: "center",
            width: 170
          }
          ,
          {
            title: '实付尾款',
            dataIndex: 'actBalance',
            align: "center",
            width: 170
          }
          ,
          {
            title: '尾款支付日期',
            dataIndex: 'balancePaymentDate',
            align: "center",
            width: 170
          }
          ,
          {
            title: '签订日期',
            dataIndex: 'signDate',
            align: "center",
            width: 170
          },
          {
            title: '合同截止日期',
            dataIndex: 'deadLine',
            align: "center",
            width: 170
          },
          {
            title: '证书发放日期',
            dataIndex: 'certificatePassDate',
            align: "center",
            width: 170
          }
        ],
        url: {
          list: '/erp/stuExamReport/getStuExamInformation',
          exportXlsUrl: 'erp/stuExamReport/exportXls',
        },
      }
    },
    methods: {}
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
  @import '~@/assets/less/TableExpand.less'
</style>