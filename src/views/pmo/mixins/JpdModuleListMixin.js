/**
 * 获取表格的数据
 *  By DongMM 
 *  Create at 2021/01/28
 */
import _ from 'lodash'
import {
  mapGetters
} from 'vuex'
import {
  filterObj
} from '@/utils/util';
import {
  postAction,
  deleteAction
} from '@/api/manage'

import MixinJpdSelectList from './JpdSelectList'

let mixin = {
  mixins: [MixinJpdSelectList],
  computed: {
    ...mapGetters(['allAuthList']),
    selectedTreeKeyStr() {
      return this.selectedTreeKey[0]
    }
  },
  watch: {
    selectedTreeKeyStr(newV, oldV) {
      if (!!newV) {
        this.setTreeSelectedVal(newV)
      } else {
        this.setTreeSelectedVal(this.selectedTreeKey[0])
      }
      this.initTable()
    }
  },
  data() {
    return {
      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      queryParam: {
        certificateNo: undefined, //证书编号
        companyName: undefined, //公司名称
        contractNo: undefined, //合同编号
        headmaster: undefined, //班主任
        id: undefined, //报名编号
        idCard: undefined, //身份证号
        key: undefined, //证次key
        managerName: undefined, //项目经理
        mobile: undefined, //手机号码
        status: undefined, //状态
        supportName: undefined, //业务支持
        userName: undefined, //学员姓名
        workType: undefined, //工种级别
        dateFrom: undefined, // 开始时间
        dateTo: undefined, //结束时间
      },
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
      /* table加载状态 */
      loading: false,
      /* table选中records*/
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus: true,
      rules: {
        contractNo: [{
          required: false,
          message: '请输入合同编号',
          trigger: 'blur'
        }],
        companyName: [{
          required: false,
          message: '请输入公司名称',
          trigger: 'change'
        }],
        key: [{
          required: false,
          message: '请选择筛选条件',
          trigger: 'change'
        }]
      }
    }
  },
  created() {
    //初始化下筛选值
    this.setTreeSelectedVal(this.selectedTreeKey[0])

    this.loadTableData();
  },
  methods: {
    initTable() {
      this.ipagination.current = 1;
      this.loadTableData()
    },
    loadTableData() {
      if (!this.apiUrlList.list) {
        this.$message.error("请设置apiUrlList.list属性!")
        return false
      }
      let params = this.getQueryParams(); //查询条件
      this.loading = true;
      postAction(this.apiUrlList.list, params).then((res) => {
        if (res.code == 0 || res.code == 200 && !!res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false;
      })
    },
    getActionBtnShowByKey(actionText) {
      /**
       * return res
       * action: "JpdContract:edit"
       * describe: "编辑按钮-工作看板列表"
       * status: "0"   0为无效 1为有效
       * type: "1"  1为可见/可访问(授权后可见/可访问)   2为可编辑(未授权时禁用) 
       */
      let res = null;
      res = _.find(this.allAuthList, {
        action: actionText,
        status: "1",
        type: "1"
      });
      return !!res || false
    },
    getActionBtnEditByKey(actionText) {
      /**
       * return res
       * action: "JpdContract:edit"
       * describe: "编辑按钮-工作看板列表"
       * status: "0"   0为无效 1为有效
       * type: "1"  1为可见/可访问(授权后可见/可访问)   2为可编辑(未授权时禁用) 
       */
      let res = null;
      res = _.find(this.allAuthList, {
        action: actionText,
        status: "1",
        type: "2"
      });
      return !!res || false
    },
    getQueryParams() {
      //获取查询条件
      let param = {
        ...this.queryParam
      };
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      return filterObj(param);
    },
    resetFormFileds() {
      this.$refs.ruleForm.resetFields();
    },
    searchQuery() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.initTable();
        } else {
          return false;
        }
      });
    },
    searchReset() {
      this.resetFormFileds();
      this.updateSeletedTreeKey(this.defaultSelectedTreeKey)
      this.initTable();
    },
    handleDelete(id) {
      let apiUrl = this.url.delete || undefined;
      if (!!apiUrl) {
        let that = this;
        let opts = {
          id: id
        }
        deleteAction(apiUrl, opts).then((res) => {
          if (res.code == 0 || res.code == 200 && !!res.success) {
            that.$message.success(res.message);
            that.loadTableData();
          } else {
            that.$message.warning(res.message);
          }
        });
      } else {
        this.$message.error("请设置apiUrlList.delete属性!")
      }
    },
    handleEdit(record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
    },
    handleTableChange(pagination) {
      this.ipagination = pagination;
      this.loadTableData();
    },
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },
    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadTableData();
    },
    handleDetail: function (record) {
      this.$refs.modalForm.title = "详情";
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.disableSubmit = true;
    },
    setTreeSelectedVal(val) {
      //初始化下拉框的被选中值
      this.queryParam.key = val;
    },
    updateSeletedTreeKey(val) {
      this.$emit('update:selected-tree-key', val)
    },
    handleSelectChange(value) {
      // console.log(value)
      this.updateSeletedTreeKey([value])
    },
  }

}

export default mixin;