import {
  filterObj
} from '@/utils/util';
import {
  deleteAction,
  getAction,
  downFile,
  downloadFile,
} from '@/api/manage'
import Vue from 'vue'
import {
  ACCESS_TOKEN
} from "@/store/mutation-types"

export const JeecgListMixin = {
  data() {
    return {
      time: undefined,
      tokenHeader: { //token header
        'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
      },
      queryParam: {}, //查询条件-请不要在queryParam中声明非字符串值的属性
      dataSource: [], //数据源
      ipagination: { //分页参数
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '100'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      isorter: { //排序参数
        column: 'createTime',
        order: 'desc',
      },
      filters: {}, //筛选参数
      loading: false, //table加载状态
      selectedRowKeys: [], //table选中keys
      selectionRows: [], //table选中records
      toggleSearchStatus: false, //查询折叠
      superQueryParams: '', //高级查询条件
      superQueryMatchType: 'and', //高级查询拼接方式
    }
  },
  created() {
    if (!this.disableMixinCreated) {
      // console.log(' -- mixin created -- ')
      this.loadData();
      //初始化字典配置 在自己页面定义
    }
    setInterval(() => {
      this.getTime();
    }, 1000);
  },
  methods: {
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error("请设置url.list属性!")
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams(); //查询条件
      this.loading = true;
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
        } else {
          this.$message.warning(res.message)
        }
        // if(res.code===510){
        //   this.$message.warning(res.message)
        // }
        this.loading = false;
      })
    },

    getTime() {
      let d = new Date();
      let str = '';
      str += d.getFullYear()
      str += d.getMonth() + 1
      str += d.getDate()
      str += d.getHours()
      str += d.getMinutes()
      str += d.getSeconds()
      this.time = str;
    },

    // 删除
    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error("请设置url.delete属性!")
        return
      }
      var that = this;
      deleteAction(that.url.delete, {
        id: id
      }).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },

    // 编辑
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
    },
    searchQuery() {
      this.loadData(1);
    },
    getQueryParams() {
      //获取查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      return filterObj(param);
    },
    getQueryField() {
      //TODO 字段权限控制
      var str = "id,";
      this.columns.forEach(function (value) {
        str += "," + value.dataIndex;
      });
      return str;
    },

    // 重置
    searchReset() {
      this.queryParam = {}
      this.loadData(1);
    },
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },
    // 导出
    handleExportXls(fileName) {
      this.loading = true
      if (!fileName || typeof fileName != "string") {
        fileName = "导出文件"
      }
      let param = {
        ...this.queryParam
      };
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param['selections'] = this.selectedRowKeys.join(",")
      }
      console.log("导出参数", param)
      downFile(this.url.exportXlsUrl, param).then((data) => {
        if (!data) {
          this.loading = false
          this.$message.warning("文件下载失败")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          this.loading = false
          window.navigator.msSaveBlob(new Blob([data], {
            type: 'application/vnd.ms-excel'
          }), fileName + '.xls')
        } else {
          let url = window.URL.createObjectURL(new Blob([data], {
            type: 'application/vnd.ms-excel'
          }))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
          this.loading = false
        }
      })
    },

    //导出附件
    downLoadAccessory(fileName) {
      if (!this.url.exportFilesUrl) {
        this.$message.error("请设置url.exportFilesUrl属性!")
        return
      }
      // let that = this;
      let allFileName = fileName + '.zip';
      if (!!this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        let ids = this.selectedRowKeys.join(',')
        let opts = {
          ids: ids
        }
        downloadFile(this.url.exportFilesUrl, allFileName, opts).then((res) => {
          if (!!res) {
            if ((res.code == 0 || res.code == 200) && res.success) {
              this.$message.success(res.message);
            } else {
              this.$message.warning(res.message);
            }
          }
        });
      } else {
        this.$message.error('请至少选择一条数据')
      }
    },

    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData();
    },

    // 清空
    onClearSelected() {
      this.selectedRowKeys = [];
      this.selectionRows = [];
    },

    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
    },

    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
      this.loadData();
    },
  },
  mounted() {},
}