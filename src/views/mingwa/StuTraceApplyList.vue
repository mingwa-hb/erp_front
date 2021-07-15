<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="4" :sm="8">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号进行查询" v-model.trim="queryParam.contractNo" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="报名编号">
              <a-input placeholder="请输入报名编号进行查询" v-model.trim="queryParam.applyInfoId" />
            </a-form-item>
          </a-col>
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
            <a-form-item label="手机号码">
              <a-input placeholder="请输入手机号码进行查询" v-model.trim="queryParam.mobile" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="变更原因">
              <a-select
                placeholder="请选择变更原因"
                :disabled="disableSubmit"
                :getPopupContainer="target => target.parentNode"
                v-model="queryParam.cause"
              >
                <a-select-option value="工种变更">工种变更</a-select-option>
                <a-select-option value="学员替换">学员替换</a-select-option>
                <a-select-option value="信息错误变更">信息错误变更</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="4" :sm="8">
              <a-form-item label="状态">
                <a-select
                  placeholder="请选择状态"
                  :disabled="disableSubmit"
                  :getPopupContainer="target => target.parentNode"
                  v-model="queryParam.status"
                >
                  <a-select-option value="0">未处理</a-select-option>
                  <a-select-option value="1">已处理</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="2">
              <a-form-item label="变更时间">
                <j-date
                  style="width: 100%"
                  :getCalendarContainer="node => node.parentNode"
                  v-model="queryParam.dateFrom"
                  placeholder="变更开始时间"
                  dateFormat="YYYY-MM-DD"
                ></j-date>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="2">
              <a-form-item label="至">
                <j-date
                  style="width: 100%"
                  :getCalendarContainer="node => node.parentNode"
                  v-model="queryParam.dateTo"
                  placeholder="变更结束时间"
                  dateFormat="YYYY-MM-DD"
                ></j-date>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="8">
              <a-form-item label="变更人">
                <a-input placeholder="请输入变更人姓名" v-model.trim="queryParam.createBy" />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="8">
              <a-form-item label="备注">
                <a-input placeholder="请输入备注" v-model.trim="queryParam.remark" />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="4" :sm="8">
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
      <a-button type="primary" icon="download" @click="handleExportXls('报名信息变更表_'+time)">导出</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="dealRecordClick">
            <a-icon type="edit" />
            处理
          </a-menu-item>
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>

      <a-modal v-model="dealRecordVisible" title="处理变更记录" @ok="dealRecord">
        <a-form>
          <div>
            <div>
              <a-radio-group v-model="status">
                <a-radio :value="0">
                  未处理
                </a-radio>
                <a-radio :value="1">
                  已处理
                </a-radio>
              </a-radio-group>
            </div>
            <div>
              <a-form-item label="备注">
                <a-textarea placeholder="" v-model="remark" :maxLength="100" />
              </a-form-item>
            </div>
          </div>
        </a-form>
      </a-modal>
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
          <a v-if="record.applyInfoId" @click="showApplyInfo(record.applyInfoId)">查看</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域
    <stu-work-type-modal ref="modalForm" @ok="modalFormOk"/>
    -->
    <stu-apply-info-modal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { studentInformationTracking_dealRecord } from '@/api/api'
import JDate from '@/components/jeecg/JDate'
import StuApplyInfoModal from './modules/StuApplyInfoModal'
import { getAction } from '@/api/manage'

export default {
  name: 'StuTraceApplyList',
  mixins: [JeecgListMixin],
  components: { JEllipsis, JDate, StuApplyInfoModal },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      dealRecordVisible: false,
      status: 1,
      remark: '',
      description: '报名信息变更表',
      disableSubmit: false,
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
          title: '报名编号',
          align: 'center',
          dataIndex: 'applyInfoId'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'userName'
        },
        {
          title: '身份证',
          align: 'center',
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
          title: '变更内容',
          align: 'center',
          dataIndex: 'content',
          width: 180
        },
        {
          title: '变更时间',
          align: 'center',
          dataIndex: 'traceTime'
        },
        {
          title: '变更人',

          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '变更原因',
          align: 'center',
          dataIndex: 'cause'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'statusDesc'
        },
        {
          title: '处理备注',
          align: 'center',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 170
        }
      ],
      url: {
        list: '/erp/sysTrace/list/4',
        exportXlsUrl: 'erp/sysTrace/exportXls/4',
        delete: '/erp/sysTrace/delete',
        deleteBatch: '/erp/sysTrace/deleteBatch'
      }
    }
  },

  methods: {
    dealRecordClick() {
      this.dealRecordVisible = true
    },
    dealRecord() {
      var params = {
        idList: this.selectedRowKeys,
        remark: this.remark,
        status: this.status
      }
      studentInformationTracking_dealRecord(params).then(res => {
        if (res.success) {
          this.dealRecordVisible = false
          this.$message.info(res.message)
          this.loadData()
        } else {
          this.$message.info(res.message)
        }
      })
    },
    handleCancel() {
      this.close()
    },
    showApplyInfo: function(applyInfoId) {
      const url = '/erp/stuApplyInfo/getApplyInfoById/' + applyInfoId
      getAction(url)
        .then(res => {
          if (res.success) {
            this.$refs.modalForm.edit(res.result)
            this.$refs.modalForm.title = '编辑'
            this.$refs.modalForm.disableSubmit = false
          } else {
            this.$message.warning(res.message)
          }
        })
        .catch(() => {})
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
