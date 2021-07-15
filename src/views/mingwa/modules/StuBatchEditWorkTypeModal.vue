<template>
  <j-select-biz-component-modal
    v-model="selectValue"
    :visible.sync="visible"
    v-bind="selectModalConfigs"
    @options="handleOptions"
    @input="handleAfterSuccess"
  ></j-select-biz-component-modal>
</template>

<script>
import { batchUpdateWorkTypeApplyInfo } from '@/api/api'
import JSelectBizComponentModal from '@/components/jeecgbiz/JSelectBizComponent/JSelectBizComponentModal'

export default {
  name: 'StuBatchEditWorkTypeModal', //批量修改工种弹框
  components: { JSelectBizComponentModal },
  props: {
    selectedDataKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      selectValue: [],
      selectMsettings: {
        multiple: false,
        name: '工种',
        value: '',
        valueKey: 'id',
        displayKey: 'workType',
        returnKeys: ['workType', 'id'],
        listUrl: '/erp/stuWorkType/getWorkTypes',
        queryParamCode: 'workType',
        queryParamText: '工种',
        columns: [{ title: '工种/等级', dataIndex: 'workType', align: 'center', width: '50%', widthRight: '50%' }]
      }
    }
  },
  computed: {
    selectModalConfigs() {
      //工种选择框配置信息
      return Object.assign({ selectValue: this.selectValue }, this.selectMsettings, this.$attrs)
    }
  },
  created() {},
  methods: {
    showModal() {
      this.visible = true
    },
    hideModal() {
      this.visible = false
    },
    handleOptions() {},
    handleAfterSuccess(data) {
      if (this.selectedDataKeys.length) {
        let opts = {
          selections: this.selectedDataKeys.join(','),
          workTypeId: undefined
        }
        if (data.length > 0) {
          opts.workTypeId = data[0]
          this.submitActionUpdate(opts)
        } else {
          this.$message.error('批量修改工种ID为空，请联系技术人员！')
        }
      } else {
        this.$message.error('selectedDataKeys为空，请联系技术人员！')
      }
    },
    submitActionUpdate(data) {
      let that = this
      let close = false
      batchUpdateWorkTypeApplyInfo(data)
        .then(res => {
          if (res.success) {
            close = true
            that.$message.success(res.message)
            setTimeout(() => {
              this.$emit('refreshList')
            }, 100)
          } else {
            that.$message.error(res.message)
          }
        })
        .finally(() => {
          if (close) {
            that.hideModal()
          }
        })
    }
  }
}
</script>

<style lang="less" scoped></style>
