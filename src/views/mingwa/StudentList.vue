<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="公司名称">
              <a-input placeholder="请输入公司名称进行查询" v-model.trim="queryParam.companyName" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入学员姓名进行查询" v-model.trim="queryParam.userName" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="手机号码">
              <a-input placeholder="请输入手机号码进行查询" v-model.trim="queryParam.mobile" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="身份证号码">
              <a-input placeholder="请输入身份证号码进行查询" v-model.trim="queryParam.idCard" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-modal v-model="downErrorZipVisible" title="部分导入失败,确定要下载失败包吗？" @ok="downErrorZip">
      <p>失败详情：</p>
      <div v-for="item in downErrorInfo" :key="item.id">
        <p>{{ item }}</p>
      </div>
    </a-modal>

    <!-- 操作按钮区域 -->
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('学员基础信息管理_'+time)">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcelOneByOne"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importZIPUrl"
        @change="handleChange"
      >
        <a-button type="primary" icon="import" id="zipUrlButton">导入压缩文件</a-button>
      </a-upload>
      <a-button type="primary" icon="download" @click="downLoadTemplate()">下载模板</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1">
            <a href="javascript:;" @click="showImgTypesSelection">学员图片信息资料导出</a>
          </a-menu-item>
          <a-menu-item key="2" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
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
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <student-modal ref="modalForm" @ok="modalFormOk" />
    <stu-img-type-selection-modal ref="stuImgTypeSelectionModal" @ok="modalFormOk"></stu-img-type-selection-modal>
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import StudentModal from './modules/StudentModal'
import { getAction, downFile } from '@/api/manage'
import StuImgTypeSelectionModal from './modules/StuImgTypeSelectionModal'

export default {
  name: 'Student',
  mixins: [JeecgListMixin],
  components: { StuImgTypeSelectionModal, JEllipsis, StudentModal },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      handleChangeMsg: true,
      downErrorZipVisible: false,
      downErrorInfo: [],
      downErrorPath: '',
      description: '学员基础信息管理',
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
          title: '姓名',
          align: 'center',
          dataIndex: 'userName'
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'mobile'
        },
        {
          title: '学习账号',
          align: 'center',
          dataIndex: 'account'
        },
        {
          title: '身份证号码',
          align: 'center',
          dataIndex: 'idCard'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'showSex'
        },
        {
          title: '公司名称',
          align: 'center',
          dataIndex: 'companyName'
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
        list: '/erp/student/list',
        delete: '/erp/student/delete',
        deleteBatch: '/erp/student/deleteBatch',
        exportXlsUrl: 'erp/student/exportXls',
        importExcelUrl: 'erp/student/importExcel',
        importExcelUrl: 'erp/student/importExcel',
        importZIPUrl: 'erp/student/uplodLoadPics'
      }
    }
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    importZIPUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importZIPUrl}`
    }
  },

  methods: {
    downLoadTemplate() {
      var newFileUrl = encodeURI(
        'https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/upload/学员管理模板.xls',
        'utf-8'
      )
      window.location.href = newFileUrl
    },
    showImgTypesSelection() {
      var ids = ''
      for (var a = 0; a < this.selectedRowKeys.length; a++) {
        ids += this.selectedRowKeys[a] + ','
      }
      this.$refs.stuImgTypeSelectionModal.show(ids)
    },
    handleChange(data) {
      if (this.handleChangeMsg) {
        this.$message.info('数据正在导入中，请稍后前往“日志管理-->导入日志”页面查看详情"')
        this.handleChangeMsg = false
      }
      this.loading = true
      if (data.file.status === 'done') {
        this.handleChangeMsg = true
        this.loading = false
        if (data.file.response.code == 200 || data.file.response.code == 0) {
          //全部成功
          this.loadData(1)
        } else {
          data.file.response && data.file.response.message && this.$message.warning(data.file.response.message)
        }
      }
    },

    downErrorZip() {
      downFile('/erp/student/downLoadErrorPics', { errorPicPath: this.downErrorPath }).then(data => {
        if (!data || data.size == 0) {
          this.$message.warning('文件下载失败, 或者选择的学员没有照片可以导出!')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data], { type: 'application/zip' }), 'errorPic.zip')
        } else {
          let url = window.URL.createObjectURL(new Blob([data], { type: 'application/zip' }))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', 'errorPic.zip')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
        }
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
