<template>
  <a-card class="page-section-container" :bordered="false">
    <div class="table-operator">
      <div class="btn-group">
        <a-spin :spinning="confirmLoading">
          <a-form-model ref="ruleForm" layout="inline" :model="form" :rules="rules">
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="收款单导入" prop="receiptFile" style="min-width:60%;">
                  <j-upload v-model="form.receiptFile" :number="1" />
                </a-form-model-item>
                <a-form-model-item>
                  <span>模版下载：</span>
                  <a
                    class="file-temp"
                    target="_blank"
                    href="https://newmingwaerpbucket.oss-cn-hangzhou.aliyuncs.com/temp/收款单导入模板_1624524326240.xls"
                    title="收款单导入模板"
                    download="收款单导入模板"
                    >收款单模版下载</a
                  >
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-model-item label="收款单明细导入" prop="receiptUsersFile" style="min-width:60%;">
                  <j-upload v-model="form.receiptUsersFile" :number="1" />
                </a-form-model-item>
                <a-form-model-item>
                  <span>模版下载：</span>
                  <a
                    class="file-temp"
                    target="_blank"
                    href="https://newmingwaerpbucket.oss-cn-hangzhou.aliyuncs.com/temp/收款明细表导入模板_1624524155331.xls"
                    title="收款单明细模版"
                    download="收款单明细模版"
                    >收款单明细表模版下载</a
                  >
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="24" style="text-align: right;">
                <a-button
                  class="excult-btn"
                  type="primary"
                  icon="import"
                  :disabled="submitDisabled"
                  @click="handleExcultImport"
                  >导入执行</a-button
                >
              </a-col>
            </a-row>
          </a-form-model>
        </a-spin>
      </div>
    </div>

    <!-- table区域-begin -->
    <div class="table-list-wrapper">
      <a-table
        class="j-table-force-nowrap"
        size="middle"
        bordered
        :rowKey="
          (record, index) => {
            return index
          }
        "
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="receiptFileShow" slot-scope="text, record">
          <a target="_blank" :href="record.receiptFile">{{ text }}</a>
        </span>
        <span slot="receiptUsersFileShow" slot-scope="text, record">
          <a target="_blank" :href="record.receiptUsersFileShow">{{ text }}</a>
        </span>
        <span slot="status" slot-scope="text, record">
          <template v-if="text == 1">成功</template>
          <template v-else-if="text == 2">失败</template>
          <template v-else>待定</template>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import { postAction, getAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JUpload from '@/components/jeecg/JUpload'
import { setTimeout } from 'timers'
export default {
  name: 'ImportForReceiptModule', //收款导入
  mixins: [JeecgListMixin],
  components: { JUpload },
  props: {},
  data() {
    return {
      confirmLoading: false,
      submitDisabled: false,
      form: {
        receiptFile: undefined,
        receiptUsersFile: undefined
      },
      rules: {
        receiptFile: [{ required: true, message: '请上传收款单', trigger: 'change' }],
        receiptUsersFile: [{ required: true, message: '请上传收款单明细', trigger: 'change' }]
      },
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
          title: '合同收款导入文件名',
          align: 'center',
          dataIndex: 'receiptFileShow',
          scopedSlots: { customRender: 'receiptFileShow' }
        },
        {
          title: '合同收款明细导入文件名',
          align: 'center',
          dataIndex: 'receiptUsersFileShow',
          scopedSlots: { customRender: 'receiptUsersFileShow' }
        },
        {
          title: '是否成功',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '上传人',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '上传时间',
          align: 'center',
          dataIndex: 'createTime'
        }
      ],
      url: {
        list: '/erp/financeImport/list?type=1',
        importExcelUrl: '/erp/financeImport/execute'
      }
    }
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}${this.url.importExcelUrl}`
    }
  },
  created() {},
  watch: {},
  methods: {
    handleExcultImport() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let opts = {
            ...this.form
          }
          this.doSendFormDataSubmit(opts)
        }
      })
    },
    doSendFormDataSubmit(opts) {
      this.confirmLoading = true
      this.submitDisabled = true
      postAction(this.url.importExcelUrl, opts).then(res => {
        this.confirmLoading = false
        this.submitDisabled = false
        if (res.code == 200 || res.code == 0 || !!res.success) {
          // console.log(res)
          this.$message.success(res.message || '导入成功！')
          setTimeout(() => {
            this.refreshTableList()
          }, 30)
        } else {
          this.$message.error(res.message || '导入失败！')
        }
      })
    },
    refreshTableList() {
      this.loadData(1)
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
@import '../less/import.less';
</style>
