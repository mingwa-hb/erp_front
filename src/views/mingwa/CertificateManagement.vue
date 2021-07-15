<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="证书编号">
              <a-input placeholder="请输入证书编号进行查询" v-model.trim="queryParam.certificateNo" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入学员姓名进行查询" v-model.trim="queryParam.userName" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="身份证号">
              <a-input placeholder="请输入身份证号进行查询" v-model.trim="queryParam.idCard" />
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="手机号码">
                <a-input placeholder="请输入手机号码进行查询" v-model.trim="queryParam.mobile" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="工种/等级">
                <a-input placeholder="请输入工种/等级进行查询" v-model.trim="queryParam.workType" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="公司名称">
                <a-input placeholder="请输入公司名称进行查询" v-model.trim="queryParam.companyName" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="证书发放状态">
                <a-select placeholder="请选择证书发放状态" v-model.trim="queryParam.certStatus">
                  <a-select-option value="待发放">待发放</a-select-option>
                  <a-select-option value="已发放">已发放</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="合同编号">
                <a-input placeholder="请输入合同编号进行查询" v-model.trim="queryParam.contractNo" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="合同状态">
                <a-select placeholder="请选择合同状态" v-model.trim="queryParam.contractStatus">
                  <a-select-option value="待支付尾款">待支付尾款</a-select-option>
                  <a-select-option value="已结清">已结清</a-select-option>
                  <a-select-option value="已完成">已完成</a-select-option>
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
      <a-button type="primary" icon="download" @click="handleExportXls('证书管理_' + time)">导出</a-button>
      <a-button type="primary" icon="download" @click="downLoadTemplate()">下载模板</a-button>
      <a-button type="primary" icon="download" @click="prompt">催款</a-button>
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
            <a @click="handleEdit(record)">证书发放登记</a>
          </template>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <CertificateManagementModal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import queryCodeListMixin from '@/mixins/queryCodeListMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import CertificateManagementModal from './modules/CertificateManagementModal'
import { postAction } from '@/api/manage'
import StuImgTypeSelectionModal from './modules/StuImgTypeSelectionModal'

export default {
  name: 'CertificateManagement', //证书管理
  mixins: [queryCodeListMixin, JeecgListMixin],
  components: { StuImgTypeSelectionModal, JEllipsis, CertificateManagementModal },
  data() {
    return {
      //   formLayout: 'horizontal',
      //   form: this.$form.createForm(this, { name: 'coordinated' }),
      downErrorInfo: [],
      downErrorPath: '',
      description: '学员基础信息管理',
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
          title: '工种/级别',
          align: 'center',
          dataIndex: 'workType'
        },
        {
          title: '证书编号',
          align: 'center',
          dataIndex: 'certificateNo'
        },
        {
          title: '制作证书日期',
          align: 'center',
          dataIndex: 'certificateMadeDate'
        },
        {
          title: '证书发放状态',
          align: 'center',
          dataIndex: 'certStatus'
        },
        {
          title: '证书发放日期',
          align: 'center',
          dataIndex: 'certificatePassDate'
        },
        {
          title: '所属公司',
          align: 'center',
          dataIndex: 'companyName',
          width: 300
        },
        {
          title: '合同编号',
          align: 'center',
          dataIndex: 'contractNo'
        },
        {
          title: '合同截止日期',
          align: 'center',
          dataIndex: 'deadLine'
        },
        {
          title: '合同状态',
          dataIndex: 'contractStatus',
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
          scopedSlots: { customRender: 'showStatus' },
          fixed: 'right'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          fixed: 'right',
          width: 150
        }
      ],
      url: {
        list: '/erp/mwStuCertVO/list',
        exportXlsUrl: '/erp/mwStuCertVO/exportXls',
        importExcelUrl: '/erp/mwStuCertVO/importExcel',
        cuikuan: '/erp/mwStuCertVO/pushMoney'
      }
    }
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    curTaskKey({ $route }) {
      //从任务列表的Url传过来，此列表对应的是certificateNo字段
      return (!!$route.query && !!$route.query.taskKey && $route.query.taskKey) || undefined
    }
  },
  watch: {
    curTaskKey: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.queryParam.certificateNo = newV
        this.searchQuery()
      }
    }
  },
  methods: {
    downLoadTemplate() {
      var newFileUrl = encodeURI(
        'https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/upload/证书管理导入模板.xls',
        'utf-8'
      )
      window.location.href = newFileUrl
    },

    // 催款
    prompt() {
      let ids = this.selectedRowKeys.toString()
      if (ids.length == 0) {
        this.$message.warning('请至少选择一条数据')
      }

      if (ids.length > 0) {
        for (let i = 0; i < this.selectionRows.length; i++) {
          if (this.selectionRows[i].contractStatus == '已结清' || this.selectionRows[i].contractStatus == '已完成') {
            this.$message.success('合同已结清，无需催款')
          } else {
            postAction(this.url.cuikuan + '?ids=' + ids).then(res => {
              if (res.code == 200 && !!res.success) {
                this.$message.success(res.result)
              } else {
                this.$message.warning(res.message)
              }
            })
          }
        }
      }
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
