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
          <a-col :md="8" :sm="8">
            <a-form-item label="工种/级别">
              <a-input placeholder="请输入工种/级别名称进行查询" v-model.trim="queryParam.workType" />
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
        <span slot="action" slot-scope="text, record"> </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
  </a-modal>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { addContractWorkType } from '@/api/api'

export default {
  name: 'stuWorkTypeSelection',
  mixins: [JeecgListMixin],
  components: { JEllipsis },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      confirmLoading: false,
      visible: false,
      description: '工种选择',
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
          title: '工种级别',
          align: 'center',
          dataIndex: 'workType'
        },
        {
          title: '金额',
          align: 'center',
          dataIndex: 'amount'
        }
      ],
      contractId: '',
      url: {
        list: '/erp/stuWorkType/getWorkTypes'
      }
    }
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    edit(conId) {
      this.queryParam = {}
      this.contractId = conId
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
      // 触发表单验证
      var checks = document.getElementsByClassName('ant-table-row-selected')
      var ids = []
      if (checks != null && checks.length > 0) {
        for (var i = 0; i < checks.length; i++) {
          if (checks[i].getAttribute('data-row-key')) {
            ids.push(checks[i].getAttribute('data-row-key'))
          }
        }
      }
      if (ids.length == 0) {
        that.$message.warning('请至少选择一个工种级别!')
      }
      let formData = { contractId: this.contractId, workTypeIds: ids }
      let obj
      console.log(formData)
      obj = addContractWorkType(formData)
      obj
        .then(res => {
          if (res.success) {
            that.$message.success(res.message)
            this.$emit('refreshworkflow')
          } else {
            that.$message.warning(res.message)
          }
        })
        .finally(() => {
          that.close()
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
