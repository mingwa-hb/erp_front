<template>
  <a-card :bordered="false">
    <!-- 抽屉 -->
    <a-drawer title="报考信息列表" :width="screenWidth" @close="onClose" :visible="visible">
      <!-- 抽屉内容的border -->
      <div
        :style="{
          padding: '10px',
          border: '1px solid #e9e9e9',
          background: '#fff'
        }"
      >
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <!--
            <a-row>
              <a-col :md="2" :sm="24">
                <a-button style="margin-bottom: 10px" type="primary" @click="handleAdd">关联工种/级别</a-button>
              </a-col>
            </a-row>
            -->
            <a-row>
              <strong
                ><font style="font–weight:bold">原总金额（元）：</font><font id="oriTotalAmountShow"></font></strong
              >&nbsp;&nbsp;
              <strong
                ><font style="font–weight:bold">当前总金额（元）：</font><font id="curTotalAmountShow"></font></strong
              >&nbsp;&nbsp;
              <strong><font style="font–weight:bold">总证件数：</font><font id="totalLicenseShow"></font></strong
              >&nbsp;&nbsp;
              <strong><font style="font–weight:bold">总人数：</font><font id="totalPersonShow"></font></strong>
            </a-row>
          </a-form>
        </div>
        <div>
          <a-table
            ref="table"
            bordered
            rowKey="id"
            size="middle"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <span slot="action" slot-scope="text, record">
              <!--<a @click="addStudent(record)">添加学员</a>-->
              <a-icon
                type="edit"
                class="editable-cell-icon"
                @click="addEditWorkTypeMoalBox(record)"
                title="修改工种价格"
              />
              <a-divider type="vertical" />
              <a @click="studentsList(record)">详情</a>
              <!--
            <a-divider type="vertical"/>
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
            -->
            </span>
          </a-table>
        </div>
      </div>
    </a-drawer>
    <students-selection ref="studentsSelection" @refreshconstus="refreshWk"></students-selection>
    <stu-work-type-selection ref="stuWorkTypeSelection" @refreshworkflow="refreshWk"></stu-work-type-selection>
    <stu-contract-students-list ref="stuContractStudentsList" @refreshconstu="refreshWk"></stu-contract-students-list>

    <!-- 修改工种价格弹框modal -->
    <stu-edit-work-type-modal ref="editWorktypeModalForm" @ok="editWorktypeModalFormOk"></stu-edit-work-type-modal>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { filterObj } from '@/utils/util'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'

import StuWorkTypeSelection from './StuWorkTypeSelection'
import StuContractStudentsList from './StuContractStudentsList'
import StudentsSelection from './StudentsSelection'
import StuEditWorkTypeModal from './modules/StuEditWorkTypeModal'

export default {
  name: 'StuContractDetailsList',
  mixins: [JeecgListMixin],
  components: { StuWorkTypeSelection, StudentsSelection, StuContractStudentsList, StuEditWorkTypeModal },
  data() {
    return {
      confirmLoading: false,
      columns: [
        {
          title: '工种/级别',
          align: 'center',
          dataIndex: 'workTypeName'
        },
        {
          title: '人数',
          align: 'center',
          dataIndex: 'stuNums'
        },
        {
          title: '原价格（元）',
          align: 'center',
          dataIndex: 'price'
        },
        {
          title: '原总金额（元）',
          align: 'center',
          dataIndex: 'oriTotalAmount'
        },
        {
          title: '当前价（元）',
          align: 'center',
          dataIndex: 'curPrice'
        },
        {
          title: '当前总金额（元）',
          align: 'center',
          dataIndex: 'curTotalAmount'
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {
        contractId: ''
      },
      title: '操作',
      visible: false,
      screenWidth: 800,
      model: {},
      id: '',
      status: 1,
      labelCol: {
        xs: { span: 5 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 }
      },
      form: this.$form.createForm(this),
      url: {
        list: '/erp/stuContractWorkTypes/getContractDetails',
        delete: '/erp/stuContractWorkTypes/deleteContractWorkType'
      }
    }
  },
  created() {
    // 当页面初始化时,根据屏幕大小来给抽屉设置宽度
    this.resetScreenSize()

  },
  methods: {
    add(contractId) {
      this.contractId = contractId
      this.edit({})
    },
    edit(record) {
      console.log(record);
      if (record.id) {
        console.log('contract id:' + record.id)
        this.contractId = record.id
      }
      this.queryParam = {}
      this.form.resetFields()
      // this.model = Object.assign({}, record)
      this.model.contractId = this.contractId
      console.log(this.model);
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'workTypeName', 'stuNums', 'price', 'amount'))
      })
      this.loadData()
      this.showTotalAmount()
    },

    getQueryParams() {
      var param = Object.assign({}, this.queryParam)
      param.contractId = (!!this.contractId?this.contractId:"1")
      console.log(param);
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      if (this.superQueryParams) {
        param['superQueryParams'] = encodeURI(this.superQueryParams)
        param['superQueryMatchType'] = this.superQueryMatchType
      }
      return filterObj(param)
    },

    handleAdd() {
      this.$refs.stuWorkTypeSelection.edit(this.contractId)
      this.$refs.stuWorkTypeSelection.title = '关联工种/级别'
    },
    addStudent(record) {
      this.$refs.studentsSelection.edit(this.contractId, record.workTypeId, record.id)
      this.$refs.studentsSelection.title = '添加学员'
    },
    studentsList(record) {
      this.$refs.stuContractStudentsList.edit(this.contractId, record.id)
      this.$refs.stuContractStudentsList.title = '学员列表'
    },
    addEditWorkTypeMoalBox(record) {
      this.$refs.editWorktypeModalForm.edit(record)
      this.$refs.editWorktypeModalForm.title = '修改工种价格'
    },
    editWorktypeModalFormOk() {
      this.$refs.editWorktypeModalForm.handleCancel()
      this.refreshWk()
    },
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
      this.form.resetFields()
      this.dataSource = []
    },
    // 抽屉的宽度随着屏幕大小来改变
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 600) {
        this.screenWidth = screenWidth
      } else {
        this.screenWidth = '50%'
      }
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    showTotalAmount() {
      setTimeout(() => {
        getAction(`/erp/stuContractWorkTypes/showTotalAmountOnDetails/${this.contractId}`)
          .then(res => {
            if (res.success) {
              if(res.result != null){
                document.getElementById('oriTotalAmountShow').innerHTML = res.result.oriTotalMoney
                document.getElementById('totalLicenseShow').innerHTML = res.result.totalLicenses
                document.getElementById('totalPersonShow').innerHTML = res.result.totalPerson
                document.getElementById('curTotalAmountShow').innerHTML = res.result.curTotalAmount
              }else{
                document.getElementById('oriTotalAmountShow').innerHTML = ''
                document.getElementById('totalLicenseShow').innerHTML = ''
                document.getElementById('totalPersonShow').innerHTML = ''
                document.getElementById('curTotalAmountShow').innerHTML = ''
              }
            } else {
              this.$message.error(res.message)
              this.requestCodeSuccess = false
            }
          })
          .catch(() => {
            this.requestCodeSuccess = false
          })
      }, 300)
    },
    refreshWk() {
      getAction(this.url.list, {
        ...this.getQueryParams()
      })
        .then(res => {
          if (res.success) {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
            this.showTotalAmount()
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped></style>
