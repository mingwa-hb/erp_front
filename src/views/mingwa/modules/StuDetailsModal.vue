<template>
  <a-modal
    :title="title"
    width="60%"
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
          <a-col :md="6" :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名进行查询" v-model="queryParam.userName" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="身份证号">
              <a-input placeholder="请输入身份证号进行查询" v-model="queryParam.idCard" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="工种">
              <a-input placeholder="请输入工种进行查询" v-model="queryParam.workType" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="download" @click="handleExportXls('学员详情_' + time)">导出</a-button>
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
        <!--<span slot="action" slot-scope="text, record">
          <a-popconfirm title="确定删除吗?" @confirm="() => deleteContractStu(record.id)">
                  <a>删除</a>
                </a-popconfirm>
        </span>-->
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
  </a-modal>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import { filterObj } from '@/utils/util'
import { JeecgListMixin } from '@/mixins/JeecgListMixinStuDetailsModal'
import { deleteAction, getAction, downFile, getFileAccessHttpUrl } from '@/api/manage'

export default {
  name: 'stuDetailsModal', //学员详情
  mixins: [JeecgListMixin],
  components: { JEllipsis },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      confirmLoading: false,
      visible: false,
      title: '学员详情',
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
          title: '单位',
          align: 'center',
          dataIndex: 'companyName',
          width: 180
        },
        {
          title: '学员名单',
          align: 'center',
          dataIndex: 'userName',
          width: 100
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'idCard',
          width: 160
        },
        {
          title: '首付日期',
          align: 'center',
          dataIndex: 'firstPayDate',
          width: 100
        },
        {
          title: '首付金额',
          align: 'center',
          dataIndex: 'actDuePayment'
        },
        {
          title: '级别',
          align: 'center',
          dataIndex: 'level',
          width: 50
        },
        {
          title: '工种',
          align: 'center',
          dataIndex: 'workTypeHead'
        },
        {
          title: '报名时间',
          align: 'center',
          dataIndex: 'applyDate',
          width: 100
        },
        {
          title: '考试时间',
          align: 'center',
          dataIndex: 'examDate',
          width: 100
        },
        {
          title: '出证时间',
          align: 'center',
          dataIndex: 'certificatePassDate',
          width: 100
        },
        {
          title: '总价',
          align: 'center',
          dataIndex: 'totalAmount'
        },
        {
          title: '应收尾款',
          align: 'center',
          dataIndex: 'dueBalance'
        },
        {
          title: '尾款时间',
          align: 'center',
          dataIndex: 'deadLine'
        },
        {
          title: '项目经理',
          align: 'center',
          dataIndex: 'managerCn'
        },
        {
          title: '退款日期',
          align: 'center',
          dataIndex: 'refundTime'
        },
        {
          title: '退款金额',
          align: 'center',
          dataIndex: 'refundAmount'
        }
      ],
      url: {
        list: '/erp/billRefund/getApplyRefundsStuDetailList',
        exportStuDetaiList: '/erp/billRefund/exportStuDetaiList'
      },
      refundId: undefined,
      userName: '',
      workType: '',
      idCard: ''
    }
  },
  computed: {},
  methods: {
    handleExportXls(fileName) {
      this.loading = true
      if (!fileName || typeof fileName != 'string') {
        fileName = '导出文件'
      }
      let param = {
        ...this.queryParam
      }
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param['selections'] = this.selectedRowKeys.join(',')
      }
      let refundId = this.refundId
      let userName = ''
      let workType = ''
      let idCard = ''
      if (!!this.queryParam.userName) {
        userName = this.queryParam.userName
      }
      if (!!this.queryParam.workType) {
        workType = this.queryParam.workType
      }
      if (!!this.queryParam.idCard) {
        idCard = this.queryParam.idCard
      }
      downFile(
        this.url.exportStuDetaiList +
          '?refundId=' +
          refundId +
          '&userName=' +
          userName +
          '&workType=' +
          workType +
          '&idCard=' +
          idCard,
        param
      ).then(data => {
        if (!data) {
          this.loading = false
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          this.loading = false
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: 'application/vnd.ms-excel'
            }),
            fileName + '.xls'
          )
        } else {
          let url = window.URL.createObjectURL(
            new Blob([data], {
              type: 'application/vnd.ms-excel'
            })
          )
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
          this.loading = false
        }
      })
    },

    details(record) {
      this.refundId = record.id
      this.visible = true
      this.loadData()
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
