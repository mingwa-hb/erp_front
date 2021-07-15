<template>
  <a-modal
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <!-- table区域-begin -->
    <div style="margin-top:20px">
      <a-table
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
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
  </a-modal>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import { filterObj } from '@/utils/util'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'stuContractStudentsList',
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
          width: 250,        }
      ],
      url: {
        list: '/erp/stuContractWorkTypes/getContractStudents',
        delete: '/erp/stuContractWorkTypes/deleteStudent'
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
    getQueryParams() {
      var param = Object.assign({}, this.queryParam)
      param['contractId'] = !!this.contractId ? this.contractId : '1'
      param['contractWorkTypeId'] = !!this.contractWorkTypeId ? this.contractWorkTypeId : '1'
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      if (this.superQueryParams) {
        param['superQueryParams'] = encodeURI(this.superQueryParams)
        param['superQueryMatchType'] = this.superQueryMatchType
      }
      return filterObj(param)
    },
    edit(conId, typeId) {
      this.queryParam = {}
      this.contractId = conId
      this.contractWorkTypeId = typeId
      this.visible = true
      // this.url.list =
      //   '/erp/stuContractWorkTypes/getContractStudents?contractId=' +
      //   this.contractId +
      //   '&contractWorkTypeId=' +
      //   this.contractWorkTypeId
      this.loadData(1)
    },
    handleOk() {
      this.visible = false
      this.$emit('close')
    },
    // 关闭
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    deleteContractStu(id) {
      this.handleDelete(id)
      setTimeout(() => {
        this.$emit('refreshconstu')
      }, 400)
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
