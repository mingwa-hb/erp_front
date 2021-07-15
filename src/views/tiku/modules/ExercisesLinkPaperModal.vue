<template>
  <a-modal
    :title="title"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleOk"
    class="modal-container"
  >
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" @keyup.enter.native="searchQuery" :model="queryParam">
        <a-row :gutter="20">
          <a-col :span="8">
            <a-form-model-item label="试卷名称" prop="paperName">
              <a-input placeholder="请输入试卷名称，模糊搜索" v-model.trim="queryParam.paperName" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
              <a-button type="primary" icon="reload" style="margin-left: 8px" @click="searchReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <a-table
      ref="table"
      bordered
      size="small"
      :loading="loading"
      rowKey="id"
      :columns="columns"
      :data-source="dataSource"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      @change="handleTableChange"
    >
    </a-table>

    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click.stop.prevent="handleOk" :disabled="submitDisabled || !isCheckedMinRow">
        确定
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { tikuApiList } from '@/api/api'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'ExercisesLinkPaperModal', //练习题弹框-关联试卷
  props: ['params'],
  mixins: [JeecgListMixin],
  components: {},
  data() {
    return {
      title: '关联试卷列表',
      visible: false,
      confirmLoading: false,
      submitDisabled: false,
      record: null,
      columns: [
        { title: '序号', dataIndex: '', key: 'rowIndex', width: 60, customRender: (t, r, index) => index + 1 },
        { title: '试卷名称', dataIndex: 'paperName' },
        { title: '工种名称', dataIndex: 'workTypeName' },
        { title: '工种等级', dataIndex: 'workTypeLevel' },
        { title: '试题范围', dataIndex: 'paperScopeStr' }
      ],
      url: {
        list: '/mw-exam/erp/exam/paper/queryPageByUrlParamWhenExerciseSets'
      }
    }
  },
  created() {},
  computed: {
    isCheckedMinRow({ selectedRowKeys }) {
      return selectedRowKeys.length > 0
    }
  },
  watch: {
    params: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.queryParam = Object.assign(
          { paperType: undefined, paperMode: undefined, paperScope: newV.exerciseScope },
          newV
        )
      }
    }
  },
  methods: {
    closeModal() {
      this.visible = false
    },
    showModal() {
      this.visible = true
    },
    handleCancel() {
      this.closeModal()
    },
    handleOk() {
      let opts = {
        questionType: this.record.questionType,
        ids: this.selectedRowKeys.join(',')
      }
      if (!!opts.questionType) {
        this.getPapersByIdAndQt(opts)
      } else {
        this.$message.error('参数【questionType】缺失，请联系技术管理人员！')
      }
    },
    getPapersByIdAndQt(opts) {
      if (!!opts.questionType && !!opts.ids && opts.ids.length > 0) {
        this.submitDisabled = true
        tikuApiList.getPapersByIdAndQt(opts).then(res => {
          this.submitDisabled = false
          if (res.code == 200 && !!res.success) {
            let resp = res.result
            if (!!resp && resp.length > 0) {
              setTimeout(() => {
                this.$emit('ok', resp, this.record)
                this.handleCancel()
              }, 0)
            } else {
              this.$message.error('此试卷没有符合条件的习题，请重新选择！')
            }
          } else {
            this.$message.error(res.message || '获取工种等级列表失败！')
          }
        })
      } else {
        this.$message.error('参数不正确，请联系技术管理人员！')
      }
    },
    initModal(record) {
      this.record = record
      this.showModal()
      this.loadData(1)
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped></style>
