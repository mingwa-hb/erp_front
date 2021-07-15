<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="4" :sm="8">
            <a-form-item label="公司名称">
              <a-input placeholder="请输入公司名称进行查询" v-model.trim="queryParam.companyName" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名进行查询" v-model.trim="queryParam.userName" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="身份证">
              <a-input placeholder="请输入身份证进行查询" v-model.trim="queryParam.idCard" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="电话号码">
              <a-input placeholder="请输入电话号码进行查询" v-model.trim="queryParam.mobile" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="证书编号">
              <a-input placeholder="请输入证书编号进行查询" v-model.trim="queryParam.certificateNo" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="4" :sm="8">
            <a-form-item label="状态">
              <a-select
                placeholder="请选择状态"
                :disabled="disableSubmit"
                :getPopupContainer="target => target.parentNode"
                v-model="queryParam.status"
              >
                <a-select-option value="正常">正常</a-select-option>
                <a-select-option value="离职">离职</a-select-option>
                <a-select-option value="退费">退费</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="工种/级别">
              <a-input placeholder="请输入工种/级别进行查询" v-model.trim="queryParam.workType" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="业务支持">
              <a-input placeholder="请输入业务支持进行查询" v-model.trim="queryParam.supporter" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="班主任">
              <a-input placeholder="请输入班主任进行查询" v-model.trim="queryParam.headmaster" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号进行查询" v-model.trim="queryParam.contractNo" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button
              >&nbsp;&nbsp;
              <a-button type="primary" icon="download" @click="handleExportXls('学员信息跟踪表_'+time)">导出</a-button>
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
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
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

export default {
  name: 'StuReportInfoList',
  mixins: [JeecgListMixin],
  components: { JEllipsis },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      description: '学员信息跟踪表',
      disableSubmit: false,
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'rowIndex',
          key: 'rowIndex',
          width: 40,
          align: 'center',
          customRender: (t, r, index) => index + 1
        },
        {
          title: '姓名',
          align: 'center',
          width: 30,
          dataIndex: 'userName'
        },
        {
          title: '身份证号',
          align: 'center',
          width: 100,
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
          title: '工种/等级',
          align: 'center',
          dataIndex: 'workType',
          width: 110
        },
        {
          title: '学历',
          dataIndex: 'education',
          align: 'center',
          width: 110
        },
        {
          title: '公司',
          dataIndex: 'companyName',
          align: 'center',
          width: 170
        },
        {
          title: '民族',
          dataIndex: 'nation',
          align: 'center',
          width: 170
        },
        {
          title: '毕业证书编号',
          dataIndex: 'educationNo',
          align: 'center',
          width: 170
        },

        {
          title: '报名日期',
          dataIndex: 'applyDate',
          align: 'center',
          width: 170
        },
        {
          title: '项目经理',
          dataIndex: 'manager',
          align: 'center',
          width: 170
        },
        {
          title: '业务支持',
          dataIndex: 'supporter',
          align: 'center',
          width: 170
        },
        {
          title: '从事职业',
          dataIndex: 'career',
          align: 'center',
          width: 170
        },
        {
          title: '身份证地址(省市)',
          dataIndex: 'idCardAddress',
          align: 'center',
          width: 170
        },
        {
          title: '常住地址(省市)',
          dataIndex: 'residentialAddress',
          align: 'center',
          width: 170
        },
        {
          title: '参加工作日期',
          dataIndex: 'workStartDate',
          align: 'center',
          width: 170
        },
        {
          title: '本工种职业年限',
          dataIndex: 'curProfessionDuration',
          align: 'center',
          width: 170
        },
        {
          title: '原职业(工种/等级)',
          dataIndex: 'preWorkType',
          align: 'center',
          width: 170
        },
        {
          title: '原证书编号',
          dataIndex: 'preCertificateNo',
          align: 'center',
          width: 170
        },

        {
          title: '更换后工种/等级',
          dataIndex: 'newWorkType',
          align: 'center',
          width: 170
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: 170
        }
      ],
      url: {
        list: '/erp/stuInfoReport/getStuInformation',
        exportXlsUrl: 'erp/stuInfoReport/exportXls'
      }
    }
  },
  methods: {}
}
</script>
<style scoped>
@import '~@assets/less/common.less';
@import '~@/assets/less/TableExpand.less';
</style>
