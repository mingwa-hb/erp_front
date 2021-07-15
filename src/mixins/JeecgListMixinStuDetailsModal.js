/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
 import { filterObj } from '@/utils/util';
 import { deleteAction, getAction, downFile, getFileAccessHttpUrl } from '@/api/manage'
 import Vue from 'vue'
 import { ACCESS_TOKEN } from "@/store/mutation-types"
 import store from '@/store'
 import { Modal } from 'ant-design-vue'
 
 export const JeecgListMixin = {
   data() {
     return {
       time: undefined,
       //token header
       tokenHeader: {
         'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
       },
       /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
       queryParam: {},
       /* 数据源 */
       dataSource: [],
       /* 分页参数 */
       ipagination: {
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
       /* 排序参数 */
       isorter: {
         column: 'createTime',
         order: 'desc',
       },
       /* 筛选参数 */
       filters: {},
       /* table加载状态 */
       loading: false,
       /* table选中keys*/
       selectedRowKeys: [],
       /* table选中records*/
       selectionRows: [],
       /* 查询折叠 */
       toggleSearchStatus: false,
       /* 高级查询条件生效状态 */
       superQueryFlag: false,
       /* 高级查询条件 */
       superQueryParams: '',
       /** 高级查询拼接方式 */
       superQueryMatchType: 'and',
     }
   },
   created() {
     if (!this.disableMixinCreated) {
       this.loadData();
       //初始化字典配置 在自己页面定义
       this.initDictConfig();
     }
     setInterval(() => {
       this.getTime();
     }, 1000);
   },
   computed: {
     scroll: function () {
       var width = window.innerWidth;
       let $antTable = window.document.getElementsByClassName("ant-row");
       if ($antTable[0]) {
         width = $antTable[0].clientWidth;
       }
       return {
         // x:'max-content',
         x: width,
         y: window.innerHeight / 2,
       }
     },
     innerHeight: function () {
       var innerHeight = window.innerHeight;
       return innerHeight;
     },
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
       let refundId=this.refundId
       getAction(this.url.list+'?refundId='+refundId, params).then((res) => {
         if (res.success) {
           //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
           this.dataSource = res.result.records || res.result;
           if (res.result.total) {
             this.ipagination.total = res.result.total;
           }
           //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
         }
         if (res.code === 510) {
           this.$message.warning(res.message)
         }
         this.loading = false;
       })
     },
 
     getTime() {
       let d = new Date();
       let str = '';
       str += d.getFullYear()
       if (d.getMonth() >= 0 && d.getMonth() <= 8) {
         str = str + '0' + (d.getMonth() + 1)
       } else {
         str += d.getMonth() + 1
       }
       if (d.getDate() >= 0 && d.getDate() <= 9) {
         str = str + '0' + d.getDate()
       } else {
         str += d.getDate()
       }
       if (d.getHours() >= 0 && d.getHours() <= 9) {
         str = str + '0' + d.getHours()
       } else {
         str += d.getHours()
       }
       if (d.getMinutes() >= 0 && d.getMinutes() <= 9) {
         str = str + '0' + d.getMinutes()
       } else {
         str += d.getMinutes()
       }
       if (d.getSeconds() >= 0 && d.getSeconds() <= 9) {
         str = str + '0' + d.getSeconds()
       } else {
         str += d.getSeconds()
       }
       this.time = str;
     },
 
     initDictConfig() {},
     handleSuperQuery(params, matchType) {
       //高级查询方法
       if (!params) {
         this.superQueryParams = ''
         this.superQueryFlag = false
       } else {
         this.superQueryFlag = true
         this.superQueryParams = JSON.stringify(params)
         this.superQueryMatchType = matchType
       }
       this.loadData(1)
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
 
     onSelectChange(selectedRowKeys, selectionRows) {
       this.selectedRowKeys = selectedRowKeys;
       this.selectionRows = selectionRows;
     },
     onClearSelected() {
       this.selectedRowKeys = [];
       this.selectionRows = [];
     },
     searchQuery() {
       this.loadData(1);
     },
     superQuery() {
       this.$refs.superQueryModal.show();
     },
     searchReset() {
       this.queryParam = {}
       this.loadData(1);
     },
     batchDel: function () {
       if (!this.url.deleteBatch) {
         this.$message.error("请设置url.deleteBatch属性!")
         return
       }
       if (this.selectedRowKeys.length <= 0) {
         this.$message.warning('请选择一条记录！');
         return;
       } else {
         var ids = "";
         for (var a = 0; a < this.selectedRowKeys.length; a++) {
           ids += this.selectedRowKeys[a] + ",";
         }
         var that = this;
         this.$confirm({
           title: "确认删除",
           content: "是否删除选中数据?",
           onOk: function () {
             that.loading = true;
             deleteAction(that.url.deleteBatch, {
               ids: ids
             }).then((res) => {
               if (res.success) {
                 that.$message.success(res.message);
                 that.loadData();
                 that.onClearSelected();
               } else {
                 that.$message.warning(res.message);
               }
             }).finally(() => {
               that.loading = false;
             });
           }
         });
       }
     },
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
     handleEdit: function (record) {
       this.$refs.modalForm.edit(record);
       this.$refs.modalForm.title = "编辑";
       this.$refs.modalForm.disableSubmit = false;
     },
     handleAdd: function () {
       this.$refs.modalForm.add();
       this.$refs.modalForm.title = "新增";
       this.$refs.modalForm.disableSubmit = false;
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
     handleToggleSearch() {
       this.toggleSearchStatus = !this.toggleSearchStatus;
     },
     // 给popup查询使用(查询区域不支持回填多个字段，限制只返回一个字段)
     getPopupField(fields) {
       return fields.split(',')[0]
     },
     modalFormOk() {
       // 新增/修改 成功时，重载列表
       this.loadData();
     },
     handleDetail: function (record) {
       this.$refs.modalForm.edit(record);
       this.$refs.modalForm.title = "详情";
       this.$refs.modalForm.disableSubmit = true;
     },
     /* 导出 */
     handleExportXls2() {
       let paramsStr = encodeURI(JSON.stringify(this.getQueryParams()));
       let url = `${window._CONFIG['domianURL']}/${this.url.exportXlsUrl}?paramsStr=${paramsStr}`;
       window.location.href = url;
     },

     /* 导入 */
     handleImportExcel(info) {
       if (info.file.status !== 'uploading') {}
       if (info.file.status === 'done') {
         if (info.file.response.success) {
           // this.$message.success(`${info.file.name} 文件上传成功`);
           if (info.file.response.code === 201) {
             let {
               message,
               result: {
                 msg,
                 fileUrl,
                 fileName
               }
             } = info.file.response
             let href = window._CONFIG['domianURL'] + fileUrl
             this.$warning({
               title: message,
               content: (
                 <div>
                   <span> {msg} </span><br />
                   <span > 具体详情请 <a href={href} target="_blank" download={fileName} > 点击下载 </a> </span >
                 </div>
               )
             })
           } else {
             this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
           }
           this.loadData()
         } else {
           this.$message.error(`${info.file.name} ${info.file.response.message}.`);
         }
       } else if (info.file.status === 'error') {
         this.$message.error(`文件上传失败: ${info.file.msg} `);
       }
     },
 
     handleImportExcelOneByOne(info) {
       if (info.file.status !== 'uploading') {}
       this.loading = true;
       if (info.file.status === 'done') {
         this.loading = false;
         if (info.file.response.success) {
           // this.$message.success(`${info.file.name} 文件上传成功`);
           if (info.file.response.code === 201) {
             let {
               message,
               result: {
                 msg,
                 fileUrl,
                 fileName
               }
             } = info.file.response
             let href = window._CONFIG['domianURL'] + fileUrl
             this.$warning({
               title: message,
               content: (
                 <div>
                   <span> {msg} </span><br />
                   <span> 具体详情请 <a href={href} target="_blank" download={fileName} >点击下载</a></span>
                 </div>
               )
             })
           } else {
             //this.$message.success(`${info.file.name} 正在导入，请到日志管理的导入日志模块查看导入记录！`)
           }
           this.loadData()
         } else {
           this.$message.error(`${info.file.name} ${info.file.response.message}`);
         }
       } else if (info.file.status === 'error') {
         this.$message.error(`文件上传失败: ${info.file.msg} `);
       }
     },
     /* 图片预览 */
     getImgView(text) {
       if (text && text.indexOf(",") > 0) {
         text = text.substring(0, text.indexOf(","))
       }
       return getFileAccessHttpUrl(text)
     },
     /* 文件下载 */
     // update--autor:lvdandan-----date:20200630------for：修改下载文件方法名uploadFile改为downloadFile------
     downloadFile(text) {
       if (!text) {
         this.$message.warning("未知的文件")
         return;
       }
       if (text.indexOf(",") > 0) {
         text = text.substring(0, text.indexOf(","))
       }
       let url = getFileAccessHttpUrl(text)
       window.open(url);
     },
   }
 
 }
