<template>
  <a-modal
    :title="title"
    width="40%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属节点" v-if="isShow">
          <a-tree-select
            v-model="id"
            allowClear
            tree-data-simple-mode
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="请选择"
            :load-data="onLoadData"
            :replace-fields="{ title: 'content' }"
            @select="onSelect"
            @change="onChange"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="知识点名称">
          <a-input placeholder="请输入知识点名称" v-model="content" :maxLength="36" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, postAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
// import { getAction } from '@/api/manage'
import JDate from '@/components/jeecg/JDate'
import JEditor from '@/components/jeecg/JEditor'
import JFileUpload from '@/components/jeecg/JFileUpload'
// import moment from 'moment'
// import { addContract, editContract } from '@/api/api'
import ACol from 'ant-design-vue/es/grid/Col'
import JSelectCompany from '@/components/jeecgbiz/JSelectCompany'
import JSelectUserByDep from '../../pmo/components/JSelectUserByDep'
import JUpload from '@/components/jeecg/JUpload'

export default {
  components: { ACol, JEditor, JDate, JSelectCompany, JFileUpload, JSelectUserByDep, JUpload },
  name: 'StuContractModal',
  data() {
    return {
      name: 'KnowledgeAdmModal', //知识点管理新增编辑弹框
      value: undefined,
      treeData: [],
      workTypeId: undefined, //1334813893131653124
      id: undefined,
      title: '操作',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        list: '/mw-exam/erp/exam/mwExamKnowledge/queryKnowledgeTree',
        add: '/mw-exam/erp/exam/mwExamKnowledge/add',
        edit: '/mw-exam/erp/exam/mwExamKnowledge/edit',
      },
      treeNodeList: [],
      parent: undefined,
      content: undefined,
      isShow: true,
    }
  },
  watch: {
    value(value) {
      // console.log(value)
    },
  },
  created() {},
  methods: {
    onLoadData(treeNode) {
      const _this = this
      return new Promise((resolve) => {
        if (treeNode.dataRef.hasChild) {
          if (treeNode.dataRef.level != '2') {
            // 有值了直接渲染
            let workTypeId = this.workTypeId
            let parentId = treeNode.dataRef.id
            getAction(this.url.list +'/'+parentId+'/'+workTypeId).then((res) => {
              if (res.code == 200 && !!res.success) {
                for (let i = 0; i < res.result.length; i++) {
                  res.result[i].isLeaf = !res.result[i].hasChild
                  res.result[i].value = res.result[i].id
                }
                let treeNodeChildrenList = res.result
                treeNode.dataRef.children = treeNodeChildrenList
                _this.treeData = [..._this.treeData]
                // console.log(_this.treeData)
              }
              resolve()
            })
          } else {
            resolve()
          }
        }
      })
    },

    onSelect(value, node, extra) {
      // this.parent = node.dataRef.id
    },

    onChange(value, label, extra){
      this.parent = value
    },

    reSetFormVal() {
      this.$nextTick(() => {
        this.form.resetFields()
      })
    },

    add(workTypeId) {
      this.visible = true
      this.isShow = true
      this.treeData = []
      this.parent = undefined
      this.content = ''
      this.id = undefined
      if (!this.id) {
        this.id = '无'
      }
      this.workTypeId = workTypeId
      this.getSelectTree()
    },

    edit(record) {
      this.visible = true
      this.isShow = false
      console.log(record)
      this.content = record.content
      this.id = record.id
      //   this.model = Object.assign({}, record)
    },

    getSelectTree() {
      let workTypeId = this.workTypeId
      getAction(this.url.list +'/0/'+workTypeId).then((res) => {
        if (res.code == 200 && !!res.success) {
          this.treeData = res.result
          for (let i = 0; i < this.treeData.length; i++) {
            this.treeData[i].isLeaf = !this.treeData[i].hasChild
            this.treeData[i].value = this.treeData[i].id
          }
          console.log(this.treeData);
        }
      })
    },

    close() {
      this.$emit('close')
      this.visible = false
    },

    handleOk() {
      if (!this.content || this.content.trim() === '') {
        this.$message.warning('请输入知识点名称')
        return
      }
      this.visible = false
      // 新增
      if (this.isShow == true) {
        let data = {
          workTypeId: this.workTypeId,
          parent: this.parent,
          content: this.content,
        }
        postAction(this.url.add, data).then((res) => {
          console.log(res)
          if (res.code == 200 && !!res.message) {
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
          this.$emit('ok')
        })
      }
      // 编辑
      if (this.isShow == false) {
        let data = {
          id: this.id,
          content: this.content,
        }
        postAction(this.url.edit, data).then((res) => {
          console.log(res)
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.result)
          } else {
            this.$message.warning(res.message)
          }
          this.$emit('ok')
        })
      }
    },
    handleCancel() {
      this.visible = false
      this.$emit('close')
    },
  },
}
</script>

<style scoped></style>
