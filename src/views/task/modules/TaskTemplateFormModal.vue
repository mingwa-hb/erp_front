<template>
  <j-modal
    centered
    class="modal-container"
    :title="title"
    :width="modelStyle.width"
    :visible="visible"
    :switchFullscreen="switchFullscreen"
    :okText="okText"
    :cancelText="cancelText"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div class="form-container">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        layout="horizontal"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="模版操作类型" prop="taskAction">
          <a-select placeholder="请选择任务模版操作类型" v-model.trim="form.taskAction" :disabled="disabled">
            <a-select-option v-for="item in taskActionsTypeList.slice(1)" :key="item.itemValue">
              {{ item.itemText }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="模版所属模块" prop="taskModule">
          <a-select placeholder="请选择任务模版分类" v-model.trim="form.taskModule" :disabled="disabled">
            <a-select-option v-for="item in taskModuleTypeList.slice(1)" :key="item.itemValue">
              {{ item.itemText }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="任务模版名称" prop="settingName">
          <a-input
            placeholder="请输入任务模版名称"
            v-model.trim="form.settingName"
            :min="1"
            :max="30"
            :disabled="disabled"
          />
        </a-form-model-item>
        <a-form-model-item label="任务模版描述" prop="settingContent">
          <a-textarea
            placeholder="请输入任务模版描述"
            v-model="form.settingContent"
            :auto-size="{ minRows: 3, maxRows: 6 }"
            :disabled="disabled"
          />
        </a-form-model-item>
        <a-form-model-item label="关键字段设置" prop="keyField">
          <a-transfer
            :titles="['全部字段', '关键字段']"
            :list-style="{
              width: '50%'
            }"
            :data-source="dataSource"
            :target-keys="targetKeys"
            :disabled="disabled"
            :show-search="showSearch"
            :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
            :show-select-all="false"
            @change="onTransferChange"
          >
            <template
              slot="children"
              slot-scope="{
                props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
                on: { itemSelectAll, itemSelect }
              }"
            >
              <a-table
                size="small"
                :row-selection="getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })"
                :columns="direction === 'left' ? leftColumns : rightColumns"
                :data-source="filteredItems"
                :style="{ pointerEvents: listDisabled ? 'none' : null }"
                :pagination="pagination"
                :custom-row="
                  ({ key, disabled: itemDisabled }) => ({
                    on: {
                      click: () => {
                        if (itemDisabled || listDisabled) return
                        itemSelect(key, !selectedKeys.includes(key))
                      }
                    }
                  })
                "
              />
            </template>
          </a-transfer>
        </a-form-model-item>
      </a-form-model>
    </div>
  </j-modal>
</template>

<script>
import _ from 'lodash'
import { taskApiList } from '@/api/api'
import mixin_task from '../mixins/TaskListMixin'

const columns = [
  {
    title: '字段Key',
    dataIndex: 'key'
  },
  {
    title: '字段Title',
    dataIndex: 'title'
  }
]

export default {
  name: 'TaskTemplateFormModal',
  mixins: [mixin_task],
  components: {},
  data() {
    return {
      actType: 'add',
      okText: '提交',
      cancelText: '取消',
      visible: false,
      switchFullscreen: true,
      loading: false,
      modelStyle: {
        width: '50%',
        style: { top: '20px' },
        fullScreen: false
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      form: {
        id: undefined,
        taskAction: undefined,
        taskModule: undefined,
        settingName: undefined,
        settingContent: undefined,
        columnField: [],
        keyField: []
      },
      rules: {
        taskAction: [{ required: true, message: '请选择任务模版操作类型', trigger: 'change' }],
        taskModule: [{ required: true, message: '请选择任务模版所属模块', trigger: 'change' }],
        settingName: [
          { required: true, message: '请输入任务模版名称', trigger: 'change' },
          { min: 1, max: 30, message: '字数在30个字符以内', trigger: 'blur' }
        ],
        settingContent: [
          { required: true, message: '请输入任务模版描述', trigger: 'change' },
          { min: 1, max: 50, message: '字数在50个字符以内', trigger: 'blur' }
        ],
        keyField: [{ type: 'array', required: false, message: '关键字段设置不能为空', trigger: 'change' }]
      },
      kTableData: [],
      targetKeys: [],
      showSearch: false,
      leftColumns: columns,
      rightColumns: columns,
      pagination: {
        pageSize: 5
      }
    }
  },
  created() {},
  computed: {
    title({ actType }) {
      let res = undefined
      switch (actType) {
        case 'edit':
          res = '编辑任务模版'
          break
        case 'preview':
          res = '任务模版详情'
          break
        case 'add':
        default:
          res = '新增任务模版'
          break
      }
      return res
    },
    disabled({ actType }) {
      let res = actType == 'preview' ? true : false
      return res
    },
    curDescription({ taskModuleTypeList, form }) {
      let res = undefined
      if (!!form.taskModule) {
        let target = _.find(taskModuleTypeList, ['itemValue', form.taskModule])
        let desc = !!target && target.description
        res = desc
      }
      return res
    },
    dataSource({ kTableData }) {
      let res = []
      _.each(kTableData, (ele, i) => {
        let obj = { key: ele.key, value: ele.value, title: ele.value }
        res.push(obj)
      })
      return res
    }
  },
  watch: {
    curDescription: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        // this.targetKeys = []
        if (!!newV) {
          let opts = {
            tableName: newV
          }
          this.getTableList(opts)
        } else {
          this.targetKeys = []
          this.kTableData = []
        }
      }
    },
    kTableData: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        //设置form中的columnField
        this.setFormColumnField(newV)
      }
    },
    targetKeys: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        //设置form中的columnField
        this.setFormKeyField(newV)
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
    setFormColumnField(columnField) {
      this.form.columnField = columnField
    },
    setFormKeyField(targetKeys) {
      let res = []
      let keys = targetKeys
      let originKeys = this.kTableData
      if (!!keys && keys.length > 0 && originKeys.length > 0) {
        let target = _.filter(originKeys, o => {
          return keys.indexOf(o.key) > -1
        })
        res = [...target]
      }
      this.form.keyField = res
    },
    doResetForm() {
      this.form.id = undefined
      this.form.taskAction = undefined
      this.form.taskModule = undefined
      this.form.settingName = undefined
      this.form.settingContent = undefined
      this.kTableData = []
      this.targetKeys = []
    },
    doSetForm(record) {
      this.form.id = record.id
      this.form.taskAction = record.taskAction.toString()
      this.form.taskModule = record.taskModule.toString()
      this.form.settingName = record.settingName
      this.form.settingContent = record.settingContent
      this.kTableData = record.columnField
      this.targetKeys = _.map(record.keyField, 'key')
    },
    initForm(record) {
      if (!!record && !!record.id) {
        this.doSetForm(record)
      } else {
        this.doResetForm()
      }
      this.$forceUpdate()
    },
    /** 切换全屏显示 */
    handleClickToggleFullScreen() {
      let mode = !this.modelStyle.fullScreen
      if (mode) {
        this.modelStyle.width = '100%'
        this.modelStyle.style.top = '20px'
      } else {
        this.modelStyle.width = '50%'
        this.modelStyle.style.top = '50px'
      }
      this.modelStyle.fullScreen = mode
    },
    handleCancel() {
      this.closeModal()
      this.doResetForm()
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.handleSubmit()
        } else {
          return false
        }
      })
    },
    handleAct(type, record) {
      this.showModal()
      this.actType = type || 'add'
      this.initForm(record)
    },
    add() {
      this.handleAct('add', null)
    },
    edit(record) {
      this.handleAct('edit', record)
    },
    preview() {
      this.handleAct('preview', record)
    },
    onTransferChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.filter(item => !item.disabled).map(({ key }) => key)
          const diffKeys = selected
            ? _.difference(treeSelectedKeys, selectedKeys)
            : _.difference(selectedKeys, treeSelectedKeys)
          itemSelectAll(diffKeys, selected)
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys
      }
    },
    handleSubmit() {
      let opts = {
        ...this.form
      }
      if (this.actType == 'edit') {
        this.editTaskTemp(opts)
      } else {
        this.addTaskTemp(opts)
      }
    },
    addTaskTemp(opts) {
      taskApiList.addTaskTemp(opts).then(res => {
        if (res.code == 200 && !!res.success) {
          this.$message.success(res.message || '新增任务模版成功！')
          setTimeout(() => {
            this.$emit('renovate')
            this.handleCancel()
          }, 30)
        } else {
          this.$message.error(res.message || '新增任务模版失败！')
        }
      })
    },
    editTaskTemp(opts) {
      taskApiList.editTaskTemp(opts).then(res => {
        if (res.code == 200 && !!res.success) {
          this.$message.success(res.message || '修改任务模版成功！')
          setTimeout(() => {
            this.$emit('renovate')
            this.handleCancel()
          }, 30)
        } else {
          this.$message.error(res.message || '修改任务模版失败！')
        }
      })
    },
    getTableList(opts) {
      if (!!opts.tableName) {
        taskApiList.getKeywordsByTableName(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            let resp = res.result
            this.kTableData = !!resp ? resp : []
          } else {
            this.$message.error(res.message || `获取模块【${opts.tableName}】的字段列表失败！`)
          }
        })
      } else {
        this.$message.error('模块【${opts.tableName}】不存在，请重新刷新页面！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.modal-container {
  .form-container {
    .ant-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
