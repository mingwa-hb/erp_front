<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="工种" labelAlign="right">
              <j-select-work-type-for-tiku
                placeholder="请选择工种类型"
                :multiple="false"
                v-model.trim="queryParam.gongzhong"
                @change="workTypeChange"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="等级">
              <a-select placeholder="请选择等级" v-model="queryParam.Level" @select="onSelect" @change="levelChange">
                <a-select-option v-for="(item, index) in workLevelList" :key="index" :value="item">{{
                  item
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <span class="table-page-search-submitButtons">
              <!-- <a-button type="primary" @click="searchQuery" icon="search">查询</a-button> -->
              <!-- <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd(id)" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="downLoadTemplate()">下载模板</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('知识点_' + time)">导出知识点</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        :data="objData"
        accept=".xls,.xlsx"
        @change="handleImportExcelOneByOne"
      >
        <a-button type="primary" icon="import" @click="toLead">导入知识点</a-button>
      </a-upload>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        bordered
        rowKey="id"
        ref="table"
        size="middle"
        :columns="columns"
        :loading="loading"
        :pagination="false"
        :dataSource="dataSource"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record, index">
          <a @click="changePosition(record, index)" v-bind:class="{ active: index == isActive }">交换</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="doDelete(record.id)">删除</a>
          <!-- <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => doDelete(record.id)">
            <a>删除</a>
          </a-popconfirm> -->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <KnowledgeAdmModal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import JSelectKnowledge from './components/JSelectKnowledge'
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from './mixins/JeecgListMixinKnowledge'
import KnowledgeAdmModal from './modules/KnowledgeAdmModal'
import { postAction, getAction } from '@/api/manage'
import JSelectWorkTypeForTiku from './components/JSelectWorkTypeForTiku'

export default {
  name: 'KnowledgeAdm', //知识点管理
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    KnowledgeAdmModal,
    JSelectKnowledge,
    JSelectWorkTypeForTiku,
  },
  data() {
    return {
      WorkTypeList: [],
      getWorkTypeIdList: [],
      workLevelList: [],
      firstList: [],
      twoList: [],
      threeList: [],
      knowledgeIdList: [],
      id: undefined,
      isshow: undefined,
      //   formLayout: 'horizontal',
      //   form: this.$form.createForm(this, { name: 'coordinated' }),
      // 表头
      columns: [
        {
          title: '知识点',
          align: '',
          dataIndex: 'content',
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 300,
        },
      ],

      url: {
        listPage: '/mw-exam/erp/exam/mwExamKnowledge/queryKnowledgeTreePage',
        list: '/mw-exam/erp/exam/mwExamKnowledge/queryKnowledgeTree',
        exportXlsUrl: '/mw-exam/erp/exam/mwExamKnowledge/exportXls',
        importExcelUrl: 'erp/exam/mwExamKnowledge/importExcel',
        workTypeList: '/erp/stuWorkType/workTypeList',
        getSelectedWorkType: '/erp/stuWorkType/getSelectedWorkType',
        getWorkLevelByWorkType: '/erp/stuWorkType/getWorkLevelByWorkType',
        delete: '/mw-exam/erp/exam/mwExamKnowledge/delete',
        exchangeOrder: '/mw-exam/erp/exam/mwExamKnowledge/exchangeOrder',
        getFirstWorkTypeName: '/erp/stuWorkType/getFirstWorkTypeName',
        searchKnowledgesByKeyword: '/mw-exam/erp/exam/mwExamKnowledge/searchKnowledgesByKeyword',
        queryKnowledge: '/mw-exam/erp/exam/mwExamKnowledge/queryKnowledge',
      },
      objData: {
        workTypeId: undefined,
      },
      isdisabled: true,
      isActive: -1,
    }
  },
  created() {
    this.getFirstWorkType()
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['examServiceURL']}/${this.url.importExcelUrl}`
      //return `${this.url.importExcelUrl}`
    },
  },
  watch: {
    id: function (newVul, oldVul) {
      this.id = newVul
    },
  },
  methods: {
    getVal(val) {
      console.log(val)
    },

    downLoadTemplate() {
      var newFileUrl = encodeURI(
        'https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/upload/知识点导入模板.xls',
        'utf-8'
      )
      window.location.href = newFileUrl
    },

    workTypeChange() {
      this.getLevel(this.queryParam.gongzhong)
    },

    levelChange() {
      this.$forceUpdate()
      for (let i = 0; i < this.getWorkTypeIdList.length; i++) {
        if (this.queryParam.Level == this.getWorkTypeIdList[i].workLevel) {
          this.id = this.getWorkTypeIdList[i].id
        }
      }
      this.getTree()
    },

    onSelect(e) {
      //  this.$forceUpdate();
    },

    // 获取第一个工种
    getFirstWorkType() {
      getAction(this.url.getFirstWorkTypeName).then((res) => {
        if (res.code == 200 && !!res.message) {
          this.queryParam.gongzhong = res.result
        }
        this.getLevel(this.queryParam.gongzhong)
      })
    },

    // 根据工种获得等级
    getLevel(value) {
      this.workLevelList = []
      getAction(this.url.getWorkLevelByWorkType + '?workType=' + value).then((res) => {
        if (res.code == 200 && !!res.success) {
          this.getWorkTypeIdList = res.result
          if (this.getWorkTypeIdList.length > 0) {
            for (let i = 0; i < this.getWorkTypeIdList.length; i++) {
              this.workLevelList.push(this.getWorkTypeIdList[i].workLevel)
            }
            this.queryParam.Level = this.getWorkTypeIdList[0].workLevel
            this.id = this.getWorkTypeIdList[0].id
            this.getTree()
          }
        }
      })
    },

    // 第一级知识点
    getTree(arg) {
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() //查询条件
      this.loading = true
      let id = this.id
      this.dataSource = []
      getAction(this.url.list + '/0/' + id, params).then((res) => {
        if (res.success) {
          //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          this.firstList = res.result.records || res.result
          for (let i = 0; i < this.firstList.length; i++) {
            let obj = {}
            if (!this.firstList[i].hasChild) {
              delete this.firstList[i].children
            } else {
              obj.children = this.firstList[i].children
            }
            obj.content = this.firstList[i].content
            obj.id = this.firstList[i].id
            obj.level = this.firstList[i].level
            this.dataSource.push(obj)
          }
          this.getTwoLevel()

          if (res.result.total) {
            this.ipagination.total = res.result.total
          }
          //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },

    // 第二级知识点
    getTwoLevel() {
      let workTypeId = this.id
      for (let i = 0; i < this.dataSource.length; i++) {
        if (!!this.dataSource[i].children) {
          let id = this.dataSource[i].id
          getAction(this.url.list + '/' + id + '/' + workTypeId).then((res) => {
            if (res.code == 200 && !!res.success) {
              this.twoList = res.result
            }
            for (let j = 0; j < this.twoList.length; j++) {
              let obj = {}
              if (!this.twoList[j].hasChild) {
                delete this.twoList[j].children
              } else {
                obj.children = this.twoList[j].children
              }
              obj.content = this.twoList[j].content
              obj.level = this.twoList[j].level
              obj.id = this.twoList[j].id
              this.dataSource[i].children.push(obj)
              if (!!obj.children) {
                this.getThreeLevel(obj)
              }
            }
          })
        }
      }
    },

    // 第三级知识点
    getThreeLevel(obj) {
      let workTypeId = this.id
      let id = obj.id
      getAction(this.url.list + '/' + id + '/' + workTypeId).then((res) => {
        if (res.code == 200 && !!res.success) {
          this.threeList = res.result
        }
        for (let i = 0; i < this.threeList.length; i++) {
          let obj1 = {}
          if (!this.threeList[i].hasChild) {
            delete this.threeList[i].children
          } else {
            obj1.children = this.threeList[i].children
          }
          obj1.content = this.threeList[i].content
          obj1.level = this.threeList[i].level
          obj1.id = this.threeList[i].id
          obj.children.push(obj1)
        }
      })
    },

    startSelectWork() {
      this.$refs.WorkTypeModal.detail(this.queryParam.gongzhong)
      this.$refs.WorkTypeModal.title = ''
      this.$refs.WorkTypeModal.disableSubmit = true
    },

    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.getTree()
    },

    doDelete(id) {
      let that = this
      this.$confirm({
        title: '重要警告！',
        content: '确认删除？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          that.handleDelete(id)
        },
      })
    },

    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      let data = 'id=' + id
      postAction(this.url.delete, data).then((res) => {
        if (res.success) {
          this.$message.success(res.result)
          this.getTree()
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    handleImportExcelOneByOne(info) {
      if (info.file.status !== 'uploading') {
      }
      this.loading = true
      if (info.file.status === 'done') {
        this.loading = false
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} 文件上传成功`);
          if (info.file.response.code === 201) {
            let {
              message,
              result: { msg, fileUrl, fileName },
            } = info.file.response
            let href = window._CONFIG['examServiceURL'] + fileUrl
            this.$warning({
              title: message,
              content: (
                <div>
                  <span> {msg} </span>
                  <br />
                  <span>
                    {' '}
                    具体详情请{' '}
                    <a href={href} target="_blank" download={fileName}>
                      点击下载
                    </a>
                  </span>
                </div>
              ),
            })
          } else {
            //this.$message.success(`${info.file.name} 正在导入，请到日志管理的导入日志模块查看导入记录！`)
          }
          this.getTree()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.msg} `)
      }
    },

    changePosition(record, index) {
      this.isActive = index
      if (this.knowledgeIdList.indexOf(record.id) == -1) {
        this.knowledgeIdList.push(record.id)
      }
      if (this.knowledgeIdList.length == 2) {
        this.isActive = -1
        if (this.knowledgeIdList[0] != this.knowledgeIdList[1]) {
          this.changeOrder()
        } else {
          this.knowledgeIdList = []
        }
      }
    },

    changeOrder() {
      let data = {
        knowledgeId: this.knowledgeIdList[0],
        knowledgeId1: this.knowledgeIdList[1],
      }
      getAction(this.url.exchangeOrder, data).then((res) => {
        if (res.code == 200 && !!res.message) {
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
        this.getTree()
      })
      this.knowledgeIdList = []
    },

    toLead() {
      this.objData.workTypeId = this.id
    },
  },
  mounted() {},
}
</script>
<style scoped>
@import '~@assets/less/common.less';
.active {
  color: #999;
}
</style>
