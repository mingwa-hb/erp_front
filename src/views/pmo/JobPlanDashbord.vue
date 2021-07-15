<template>
  <a-card class="page-conainter" :bordered="false">
    <div class="page-header-tabs">
      <!-- @keyup.enter.native="searchQuery" -->
      <a-form layout="inline" style="padding-bottom: 20px">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="合同编号">
              <!-- v-model.trim="queryParam.isFinishStudy" -->
              <a-select style="width: 300px" placeholder="全部" allow-clear @change="changeVal">
                <a-select-option v-for="(item, index) in contractNoArr" :key="index" :value="item">{{
                  item
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="8" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col> -->
        </a-row>
      </a-form>
      <a-row :gutter="24" :loading="treeNodeLoading">
        <a-col
          v-for="(item, index) in treeNodeDataList"
          :key="index"
          :xs="24"
          :sm="12"
          :lg="8"
          :xl="index % 2 == 1 ? 4 : 5"
        >
          <tabs-panel-item
            :loading="treeNodeLoading"
            :module-title="item.title"
            :module-type="item.type"
            :class="curSelectModuleData.moduleType == item.type ? 'current' : ''"
            :init-tree-data="item.list"
            :default-selected-node.sync="selectedTreeNodeKey"
            @onSelectedModule="getSelectedModuleInfo"
          ></tabs-panel-item>
        </a-col>
      </a-row>
    </div>

    <template v-if="curSelectModuleData.moduleType == 'hetong'">
      <JpdContractModule
        v-if="treeNodeDataList.length > 0"
        ref="JpdContractTableList"
        :init-tree-data="treeNodeDataList[0].list"
        :selected-tree-key.sync="selectedTreeNodeKey"
      />
    </template>
    <template v-if="curSelectModuleData.moduleType == 'baoming'">
      <JpdSignupModule
        v-if="treeNodeDataList.length > 0"
        ref="JpdSignupTableList"
        :init-tree-data="treeNodeDataList[1].list"
        :selected-tree-key.sync="selectedTreeNodeKey"
      />
    </template>
    <template v-if="curSelectModuleData.moduleType == 'xuexi'">
      <JpdLearnModule
        v-if="treeNodeDataList.length > 0"
        ref="JpdLearnTableList"
        :init-tree-data="treeNodeDataList[2].list"
        :selected-tree-key.sync="selectedTreeNodeKey"
      />
    </template>
    <template v-if="curSelectModuleData.moduleType == 'kaoshi'">
      <JpdExamModule
        ref="JpdExamTableList"
        v-if="treeNodeDataList.length > 0"
        :init-tree-data="treeNodeDataList[3].list"
        :selected-tree-key.sync="selectedTreeNodeKey"
      />
    </template>
    <template v-if="curSelectModuleData.moduleType == 'fafang'">
      <JpdLicenseModule
        ref="JpdLicenseTableList"
        v-if="treeNodeDataList.length > 0"
        :init-tree-data="treeNodeDataList[4].list"
        :selected-tree-key.sync="selectedTreeNodeKey"
      />
    </template>
  </a-card>
</template>

<script>
import { PmoApiList } from '@/api/api'
import TabsPanelItem from './components/TabsPanelItem' //tree-node组件，用于显示合同证次、报名证次等头部tab模块
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JpdContractModule from './modules/JpdContractModule' //查询和表格模块-合同证次
import JpdSignupModule from './modules/JpdSignupModule' //查询和表格模块-报名证次
import JpdLearnModule from './modules/JpdLearnModule' //查询和表格模块-学习证次
import JpdExamModule from './modules/JpdExamModule' //查询和表格模块-考试证次
import JpdLicenseModule from './modules/JpdLicenseModule' //查询和表格模块-领证证次
import { getAction } from '../../api/manage'
export default {
  name: 'JobPlanDashbord', //工作计划看板页面
  mixins: [],
  components: {
    TabsPanelItem,
    JpdContractModule,
    JpdSignupModule,
    JpdLearnModule,
    JpdExamModule,
    JpdLicenseModule,
  },
  props: {},
  data() {
    return {
      showLine: false, //是否显示tree的线
      treeNodeLoading: false,
      treeNodeDataList: [],
      curSelectModuleData: {
        moduleTitle: '合同证次',
        moduleType: 'hetong',
      }, //当前选中的证次模块
      selectedTreeNodeKey: ['1-2'], //被选中的tree的key值
      contractNoArr: [],
      // contractNo:undefined,
      url: {
        User: '/erp/workPlanShow/getContractByLoginUser',
        Tree: '/erp/workPlanShow/getKanBanInfoTree',
      },
    }
  },
  computed: {},
  created() {
    this.initPage()
    this.getUser()
  },
  methods: {
    getSelectedModuleInfo(data) {
      this.curSelectModuleData = { ...data }
    },
    getTreeNodeListData(value) {
      let that = this
      that.treeNodeLoading = true
      if (!!value) {
        getAction(this.url.Tree + '?contractNo=' + value).then((res) => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            that.treeNodeDataList = res.result
          } else {
            that.$message.warning(res.message)
          }
          that.treeNodeLoading = false
        })
      } else {
        PmoApiList.getJdTreeNodeList().then((res) => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            that.treeNodeDataList = res.result
          } else {
            that.$message.warning(res.message)
          }
          that.treeNodeLoading = false
        })
      }
    },
    initPage() {
      this.getTreeNodeListData() //获取树状列表数据
    },

    changeVal(value) {
      console.log(value)
      this.getTreeNodeListData(value)
    },

    getUser() {
      this.contractNoArr = []
      getAction(this.url.User).then((res) => {
        if (res.code == 200 && !!res.message) {
          if (res.result.length > 0) {
            this.contractNoArr = res.result
          } else {
            this.$message.warning('暂无合同编号数据')
          }
        }
      })
    },
  },
  mounted() {},
}
</script>
<style lang="less" scoped>
.page-conainter {
  .page-header-tabs {
    /deep/.tabs-panel-item {
      min-height: 285px;
    }
    .current {
      background-color: rgba(24, 144, 255, 0.1);
    }
  }
}
</style>
