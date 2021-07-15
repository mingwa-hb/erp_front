<template>
  <a-modal
    :title="title"
    width="30%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleOk"
    class="modal-container"
  >
    <!-- 试题信息 -->
    <a-form-model
      ref="ruleForm"
      class="plan"
      :model="form"
      :rules="rules"
      layout="horizontal"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-model-item label="项目分类" prop="projectType">
        <a-select placeholder="请选择项目分类" v-model="form.projectType">
          <a-select-option
            v-for="item in projectTypeList.slice(1)"
            :key="item.itemValue"
            :disabled="item.itemValue == 3"
            >{{ item.itemText }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="工种类型" prop="workName">
        <j-select-work-type-for-tiku
          placeholder="请选择工种类型"
          :multiple="false"
          v-model.trim="form.workName"
          @change="onChangeWorkType"
        />
      </a-form-model-item>
      <a-form-model-item label="工种等级" prop="workTypeId">
        <a-select placeholder="请选择工种等级" v-model="form.workTypeId">
          <a-select-option v-for="item in worktypeLevelTypeList" :key="item.id">{{ item.workLevel }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="试卷名称" prop="paperName">
        <a-input placeholder="请输入试卷名称" v-model.trim="form.paperName" />
      </a-form-model-item>
      <a-form-model-item label="试题剔除范围" prop="paperScope">
        <a-select placeholder="请选择试题剔除范围" v-model="form.paperScope">
          <a-select-option v-for="item in scopeTypeList.slice(1)" :key="item.code">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>

    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click.stop.prevent="handleOk" :disabled="submitDisabled">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import { tikuApiList } from '@/api/api'
import TYPELIST from '../data/test_paper_type_list'
import mixin_tiku from '../mixins/TikuListMixin'

import JSelectWorkTypeForTiku from '@/components/jeecgbiz/JSelectWorkTypeForTiku'

export default {
  name: 'GenerateTestPaperModal', //组卷弹框-手动组卷和智能组卷
  mixins: [mixin_tiku],
  components: { JSelectWorkTypeForTiku },
  data() {
    let that = this
    return {
      scopeTypeList: TYPELIST.TESTPAPER_SCOPE_TYPE_LIST,
      pageModalType: 'add',
      visible: false,
      confirmLoading: false,
      submitDisabled: false,
      worktypeLevelTypeList: [], //工种等级列
      form: {
        paperMode: undefined, //组卷类型 1为手工 2为智能
        projectType: undefined, //项目类型
        workName: undefined, //工种类型
        workTypeId: undefined, //工种等级
        paperName: undefined, //试卷名称
        paperScope: undefined //试题剔除选择范围
      },
      rules: {
        projectType: [{ required: true, message: '试题项目类型不能为空', trigger: 'change' }],
        workName: [{ required: true, message: '工种类型不能为空', trigger: 'change' }],
        workTypeId: [{ required: true, message: '工种等级不能为空', trigger: 'change' }],
        paperName: [
          { required: true, message: '试卷名称不能为空', trigger: 'blur' },
          { min: 1, max: 30, message: '试卷名称至少1个字，不超过30个字', trigger: 'blur' }
        ],
        paperScope: [{ required: true, message: '试题剔除范围不能为空', trigger: 'change' }]
      }
    }
  },
  created() {},
  computed: {
    title() {
      let res = undefined
      switch (this.pageModalType) {
        case 'manual':
          res = '手动组卷'
          break
        case 'automatic':
          res = '智能组卷'
          break
        default:
          res = '组卷'
          break
      }
      return res
    }
  },
  watch: {
    'form.workName': {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        if (!!newV) {
          this.getWorklevelTypeList(newV)
        }
      }
    },
    pageModalType: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.setPaperMode(newV)
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
      this.doResetForm()
    },
    handleOk() {
      this.doFormSubmit()
    },
    setPaperMode(type) {
      this.form.paperMode = type == 'manual' ? 1 : 2
    },
    add(type) {
      this.pageModalType = type
      this.setPaperMode(this.pageModalType)
      this.showModal()
    },
    doResetForm() {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
        this.$forceUpdate()
      })
    },
    doFormSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.doSendFormDataSubmit()
        }
      })
    },
    goToTqManualSelectPage(id) {
      this.$router.push({ path: '/itiku/TestPaperManualSelect', query: { paperId: id } })
    },
    goToTqAutoSelectPage(id) {
      this.$router.push({ path: '/itiku/TestPaperAutoSelect', query: { paperId: id } })
    },
    goToNextPage(id) {
      if (!!id) {
        if (this.pageModalType == 'manual') {
          this.goToTqManualSelectPage(id)
        } else {
          this.goToTqAutoSelectPage(id)
        }
      } else {
        this.$message.error('试卷ID没不存在，请返回列表页！')
      }
    },
    doSendFormDataSubmit() {
      let opts = {
        ...this.form
      }
      let that = this
      this.submitDisabled = true
      tikuApiList
        .addNewTp(opts)
        .then(res => {
          if (res.code == 200 && !!res.success) {
            that.$message.success(res.message || '新增成功！')
            // console.log(res.result)
            that.submitDisabled = false
            let paperId = !!res.result ? res.result : undefined
            setTimeout(() => {
              this.handleCancel()
              this.goToNextPage(paperId)
            }, 30)
          } else {
            that.submitDisabled = true
            that.$message.error(res.message || '新增失败！')
          }
        })
        .catch(error => {
          console.log(error)
          that.submitDisabled = true
        })
    },
    getWorklevelTypeList(workType) {
      let opts = {
        workType: workType
      }
      tikuApiList.getWorkLevelByWorkType(opts).then(res => {
        if (res.code == 200 && !!res.success) {
          this.worktypeLevelTypeList = res.result
        } else {
          this.$message.error(res.message || '获取工种等级列表失败！')
        }
      })
    },
    onChangeWorkType() {
      this.form.workTypeId = undefined
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped></style>
