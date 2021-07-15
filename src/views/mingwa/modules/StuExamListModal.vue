<template>
  <a-modal :width="800" :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" cancelText="关闭">
    <!-- table区域-begin -->
    <div class="table-list-container">
      <a-table
        ref="table"
        size="small"
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
  </a-modal>
</template>

<script>
import { filterObj } from '@/utils/util'
import { getAction } from '@/api/manage'
export default {
  name: 'StuExamListModal',
  data() {
    return {
      visible: false,
      title: '学员考试记录',
      queryParam: {
        learnId: undefined
      },
      dataSource: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '100'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      loading: false,
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
          title: '考试类型',
          align: 'center',
          dataIndex: 'examType'
        },
        {
          title: '考试成绩',
          align: 'center',
          dataIndex: 'status'
        },
        {
          title: '考试日期',
          align: 'center',
          dataIndex: 'examTime'
        }
      ],
      url: {
        list: '/erp/stuLearning/getLearnScoreRecordByLearnId'
      }
    }
  },
  methods: {
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      let params = this.getQueryParams() //查询条件
      this.loading = true
      getAction(this.url.list, params).then(res => {
        if ((res.code == 0 || res.code == 200) && !!res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    getQueryParams() {
      //获取查询条件
      let sqp = {}
      let param = Object.assign(sqp, this.queryParam)
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    handleOk() {
      this.closeModal()
    },
    // 关闭
    handleCancel() {
      this.closeModal()
    },
    showModal() {
      this.visible = true
    },
    closeModal() {
      this.$emit('close')
      this.visible = false
    },
    setRecordID(record) {
      if (!!record.id) {
        this.queryParam.learnId = record.id
        this.loadData(1)
      } else {
        this.$message.warning('ID不存在，请联系技术！')
      }
    },
    handleTableChange(pagination) {
      this.ipagination = pagination
      this.loadData()
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
