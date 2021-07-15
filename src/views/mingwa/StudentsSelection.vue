<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="7" :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名进行查询" v-model.trim="queryParam.userName" />
            </a-form-item>
          </a-col>
          <a-col :md="9" :sm="8">
            <a-form-item label="手机号码">
              <a-input placeholder="请输入手机号码进行查询" v-model.trim="queryParam.mobile" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="学习账号">
              <a-input placeholder="请输入学习账号进行查询" v-model.trim="queryParam.account" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
        <span slot="action"> </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
  </a-modal>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { addContractStudents } from '@/api/api'

export default {
  name: 'StudentsSelection',
  mixins: [JeecgListMixin],
  components: { JEllipsis },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      confirmLoading: false,
      visible: false,
      description: '学生选择',
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
          title: '手机号',
          align: 'center',
          dataIndex: 'mobile'
        },
        {
          title: '学习账号',
          align: 'center',
          dataIndex: 'account'
        },
        {
          title: '身份证号码',
          align: 'center',
          dataIndex: 'idCard'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'showSex'
        },
        {
          title: '公司名称',
          align: 'center',
          dataIndex: 'companyName'
        }
      ],
      url: {
        list: '/erp/student/getStudents'
      }
    }
  },
  contractId: '',
  workTypeId: '',
  contractWorkTypeId: '',
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    edit(conId, typeId, contractWorkTypeId) {
      this.queryParam = {}
      this.contractId = conId
      this.workTypeId = typeId
      this.contractWorkTypeId = contractWorkTypeId
      this.visible = true
      this.loadData()
    },
    // 关闭
    handleCancel() {
      this.close()
    },
    // 确定
    handleOk() {
      const that = this
      var winClose = false
      // 触发表单验证
      var checks = document.getElementsByClassName('ant-table-row-selected')
      var ids = []
      if (checks != null && checks.length > 0) {
        for (var i = 0; i < checks.length; i++) {
          ids.push(checks[i].getAttribute('data-row-key'))
        }
      }
      if (ids.length == 0) {
        that.$message.warning('请至少选择一个工种等级!')
      }
      let formData = {
        contractId: this.contractId,
        contractWorkTypeId: this.contractWorkTypeId,
        workTypeId: this.workTypeId,
        studentIds: ids
      }
      let obj
      obj = addContractStudents(formData)
      obj
        .then(res => {
          if (res.success) {
            winClose = true
            that.$message.success(res.message)
            that.$emit('refreshconstus')
          } else {
            winClose = false
            that.$message.warning(res.message)
          }
        })
        .finally(() => {
          if (winClose) {
            that.close()
          }
        })
    },
    close() {
      this.selectedRowKeys = []
      this.selectionRows = []
      this.$emit('close')
      this.visible = false
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
