<template>
  <a-card class="page-conainter" :bordered="false">
    <div class="page-header-container" v-if="isShowHeadUserInfo">
      <a-row :gutter="16">
        <a-col :sm="24" :md="8" :xl="4">
          <HomeHeadUserInfo :loading="userDataLoading" :p-user-info="pUserInfo" />
        </a-col>
        <a-col :sm="24" :md="16" :xl="20">
          <a-row :gutter="16" v-if="pmoStaffData.length > 0">
            <a-col v-for="item in pmoStaffData" :key="item.id" :sm="12" :md="8" :xl="4">
              <analysis-chart-card :loading="loading" :title="item.title" :total="item.num">
                <trend :flag="item.rate > 0 ? 'up' : 'down'" style="margin-right: 16px;">
                  <span slot="term">{{ item.rateDesc }}</span>
                  <span>{{ item.rate }}</span>
                  <span>%</span>
                </trend>
              </analysis-chart-card>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="page-main-container">
      <div class="page-section-container">
        <a-row :gutter="16">
          <a-col :sm="24" :md="12" :xl="16">
            <article-list-card
              title="待办任务"
              :loading="taskLoading"
              more-text="More"
              :total-num="taskTotalNum"
              @goToMorePage="goToTaskListPage"
            >
              <a-list
                style="padding: 0 20px;"
                slot="list"
                size="small"
                item-layout="horizontal"
                :data-source="taskListData"
              >
                <a-list-item class="list-card-item-group" slot="renderItem" slot-scope="item, index">
                  <a-button class="btn-count" size="small" shape="circle" ghost type="primary">
                    {{ index + 1 }}
                  </a-button>
                  <a-list-item-meta>
                    <a slot="title" target="_blank" :href="TaskDetailUrl(item)">
                      {{ item.taskName }}
                      <a-button
                        v-if="item.taskStatus == 1"
                        class="btn-status"
                        size="small"
                        type="danger"
                        shape="circle"
                      >
                        <template v-if="item.taskType == 1">审</template>
                        <template v-else>消</template>
                      </a-button>
                    </a>
                  </a-list-item-meta>
                  <span class="deadtime">任务创建时间：{{ item.createTime }}</span>
                </a-list-item>
              </a-list>
            </article-list-card>
          </a-col>
          <a-col :sm="24" :md="12" :xl="8">
            <article-list-card title="系统公告" :loading="loading">
              <div class="empty-div" slot="action"></div>
              <a-list slot="list" size="small" item-layout="horizontal" :data-source="listData">
                <a-list-item class="list-card-item-group" slot="renderItem" slot-scope="item">
                  <a-list-item-meta>
                    <a slot="title" :href="item.href">{{ item.title }}</a>
                  </a-list-item-meta>
                  <span class="deadtime"><a-icon class="btn-icon" type="clock-circle" />{{ item.deadTime }}</span>
                </a-list-item>
              </a-list>
            </article-list-card>
          </a-col>
        </a-row>
      </div>

      <div class="page-section-container">
        <a-row :gutter="16">
          <a-col :sm="24" :md="12" :xl="16">
            <article-list-card title="业务数据统计" :loading="chartDatalLoading">
              <div class="empty-div" slot="action"></div>
              <div class="card-main-warp" slot="list">
                <div class="date-container">
                  <CardMonthDatePicker :value.sync="monthFormDate" @afterUpdateDateV="afterUpdateDate" />
                </div>
                <LineChartMultid
                  :height="lineChartH"
                  :fields="chartFields"
                  :aliases="chartAliases"
                  :dataSource="chartDataList"
                />
              </div>
            </article-list-card>
          </a-col>
          <a-col :sm="24" :md="12" :xl="8">
            <article-list-card :title="TopTenText" :loading="topTenDataLoading">
              <div class="empty-div" slot="action"></div>
              <div class="table-wrap" slot="list">
                <a-table
                  ref="table1"
                  size="small"
                  :columns="columns"
                  rowKey="id"
                  :dataSource="tableDataList"
                  :pagination="false"
                >
                  <template slot="rowIndex" slot-scope="text, record, index">
                    <span class="order-default" :class="{ 'order-top3': index < 3 }">{{ index + 1 }}</span>
                  </template>
                  <template slot="finishPercent" slot-scope="text, record">
                    <a-progress strokeColor="#409EFF" :percent="!!record.finishPercent ? record.finishPercent : 0" />
                  </template>
                </a-table>
              </div>
            </article-list-card>
          </a-col>
        </a-row>
      </div>
    </div>
  </a-card>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { mapGetters } from 'vuex'

import TYPELIST from '@/views/task/data/modules_type'

import Trend from '@/components/Trend'
import LineChartMultid from '@/components/chart/LineChartMultid'
import HomeHeadUserInfo from './HomeHeadUserInfo'
import AnalysisChartCard from './components/AnalysisChartCard'
import ArticleListCard from './components/ArticleListCard'
import CardMonthDatePicker from './components/CardMonthDatePicker'

import { PmoApiList } from '@/api/api'

export default {
  name: 'AnalysisHome', //首页
  mixins: [],
  components: {
    Trend,
    LineChartMultid,
    HomeHeadUserInfo,
    AnalysisChartCard,
    ArticleListCard,
    CardMonthDatePicker
  },
  props: {},
  data() {
    return {
      indexStyle: 1,
      loading: true,
      userDataLoading: true, //用户月周数据加载的loading
      taskLoading: true, //待办任务数据加载的loading
      chartDatalLoading: true, //业务数据加载的loading
      topTenDataLoading: true, //top10数据加载的loading
      pmoStaffData: [],
      listData: [],
      lineChartH: 392,
      chartFields: ['contractStuNum', 'applyNum', 'learningNum', 'examNum', 'certificateNum'],
      chartAliases: [
        { field: 'contractStuNum', alias: '签订证次' },
        { field: 'applyNum', alias: '报名证次' },
        { field: 'learningNum', alias: '学习证次' },
        { field: 'examNum', alias: '考试证次' },
        { field: 'certificateNum', alias: '发放证次' }
      ],
      taskListData: [],
      taskTotalNum: 0,
      chartDataList: [],
      monthFormDate: [],
      tableDataList: [], //top列表数据
      columnsTitleList: [
        {
          roleCode: 'XZRY',
          columTitleForTimes: '录入证次',
          columTitleForFinishPercent: '合同完成率'
        },
        {
          roleCode: 'YZRY',
          columTitleForTimes: '报名证次',
          columTitleForFinishPercent: '报名完成率'
        },
        {
          roleCode: 'JWRY',
          columTitleForTimes: '制定人次',
          columTitleForFinishPercent: '学习完成率'
        },
        {
          roleCode: 'KWRY',
          columTitleForTimes: '考试人次',
          columTitleForFinishPercent: '考试通过率'
        },
        {
          roleCode: 'CWCN',
          columTitleForTimes: '发放证书',
          columTitleForFinishPercent: '证书发放率'
        },
        {
          roleCode: 'QTRY',
          columTitleForTimes: '签订证次',
          columTitleForFinishPercent: '合同完成率'
        }
      ],
      modules_url_type_list: TYPELIST.TASK_MODULE_TYPE_URL
    }
  },
  computed: {
    ...mapGetters(['sysRolesList', 'pUserInfo']),
    fomatSysRolesList() {
      let arrTemp = _.filter(this.sysRolesList, o => {
        return (
          o.roleCode == 'CWCN' ||
          o.roleCode == 'JWRY' ||
          o.roleCode == 'YZRY' ||
          o.roleCode == 'XZRY' ||
          o.roleCode == 'KWRY'
        )
      })

      arrTemp.push({
        roleCode: 'QTRY',
        roleName: '其他人员'
      })

      return arrTemp
    },
    isShowHeadUserInfo() {
      let res = undefined
      res = _.find(this.fomatSysRolesList, ['roleCode', this.pUserInfo.role])
      return !!res
    },
    userRoleText() {
      let res = undefined
      res = _.find(this.fomatSysRolesList, ['roleCode', this.pUserInfo.role])
      return !!res ? res.roleName.slice(0, 2) : '銷售'
    },
    TopTenText() {
      return `年度${this.userRoleText}TOP10排行榜`
    },
    topTencolumHeadCustom() {
      let res = null
      res = _.find(this.columnsTitleList, ['roleCode', this.pUserInfo.role])
      return !!res ? res : this.columnsTitleList[this.columnsTitleList.length - 1]
    },
    columns() {
      let res = [
        {
          title: '排名',
          align: 'center',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          scopedSlots: { customRender: 'rowIndex' }
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'realname',
          width: 100
        },
        {
          title: this.topTencolumHeadCustom.columTitleForTimes,
          align: 'center',
          dataIndex: 'times',
          width: 100
        },
        {
          title: this.topTencolumHeadCustom.columTitleForFinishPercent,
          dataIndex: 'finishPercent',
          align: 'center',
          scopedSlots: { customRender: 'finishPercent' }
        }
      ]
      return res
    },
    TaskDetailUrl({ getPreviewTaskUrl }) {
      return record => {
        return getPreviewTaskUrl(record)
      }
    }
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)

    //初始化页面
    this.initPage()
  },
  methods: {
    goToTaskListPage() {
      this.$router.push({ path: '/itask/TaskListManage' })
    },
    getPreviewTaskUrl(record) {
      let routeData = this.$router.resolve({ path: '/itask/TaskListManage', query: { taskName: record.taskName } })
      return routeData.href
    },
    initMonthRangeDate() {
      let startT = moment().subtract(1, 'years')
      let endT = moment()
      this.monthFormDate = [startT, endT]
    },
    afterUpdateDate() {
      this.getBusinessChartData()
    },
    formatChartData(data) {
      let res = []
      if (Array.isArray(data) && data.length > 0) {
        res = _.map(data, (ele, index) => {
          return { id: index + 1, type: ele.yyyyMM, ...ele }
        })
      }
      return _.orderBy(res, 'type', 'asc')
    },
    formatTabletData(data) {
      let res = []
      if (Array.isArray(data) && data.length > 0) {
        res = _.map(data, (ele, index) => {
          return { id: index + 1, ...ele }
        })
      }
      return _.orderBy(res, 'id', 'asc')
    },
    getHdUserWorkPercentData() {
      let that = this
      that.userDataLoading = true
      PmoApiList.getHdUserWorkPercent().then(res => {
        if (res.code == 0 || (res.code == 200 && !!res.success)) {
          // console.log(res)
          this.pmoStaffData = res.result
        } else {
          that.$message.warning(res.message)
        }
        that.userDataLoading = false
      })
    },
    getHdTaskListData() {
      let that = this
      that.taskLoading = true
      let opts = {
        pageNo: 1,
        pageSize: 5,
        taskStatus: 1 //1-待办,2-已办
      }
      PmoApiList.getHdTaskListData(opts).then(res => {
        if (res.code == 0 || (res.code == 200 && !!res.success)) {
          // console.log(res)
          this.taskListData = res.result.records
          this.taskTotalNum = res.result.total
        } else {
          that.$message.warning(res.message)
        }
        that.taskLoading = false
      })
    },
    getBusinessChartData() {
      let that = this
      let opts = {
        startMonth: moment(this.monthFormDate[0]).format('YYYY-MM'),
        endMonth: moment(this.monthFormDate[1]).format('YYYY-MM')
      }
      that.chartDatalLoading = true
      if (!!opts.startMonth && !!opts.endMonth) {
        PmoApiList.getHdBusinessChartData(opts)
          .then(res => {
            if (res.code == 0 || (res.code == 200 && !!res.success)) {
              // console.log(res)
              that.chartDataList = that.formatChartData(res.result)
            } else {
              that.$message.warning(res.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            that.chartDatalLoading = false
          })
      } else {
        that.$message.warning('必须选择开始时间和截止时间')
      }
    },
    getHdSaleTopTenData() {
      let that = this
      that.topTenDataLoading = true
      PmoApiList.getHdSaleTopTenChartData()
        .then(res => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            // console.log(res)
            that.tableDataList = that.formatTabletData(res.result)
          } else {
            that.$message.warning(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          that.topTenDataLoading = false
        })
    },
    initPage() {
      this.getHdUserWorkPercentData() //获取用户月周统计数据
      this.getHdTaskListData() //获取待办任务数据
      this.initMonthRangeDate() // 初始化业务统计时间
      this.getBusinessChartData() //获取业务统计数据
      this.getHdSaleTopTenData() //获取销售top10统计数据
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.page-conainter {
  .page-header-container {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
  }

  .page-main-container {
    .page-section-container {
      position: relative;
      margin-top: 20px;
      .empty-div {
        display: none;
      }
      .list-card-item-group {
        > span,
        a {
          font-size: 14px;
        }
        .btn-count {
          width: 20px;
          margin-right: 10px;
          font-size: 12px;
        }
        .btn-status {
          margin-right: 10px;
          font-size: 12px;
        }
        .deadtime {
          .btn-icon {
            margin-right: 10px;
          }
        }
      }
      .date-container {
        position: absolute;
        top: 50px;
        right: 20px;
        z-index: 9;
      }
      .table-wrap {
        /deep/.ant-table-small {
          border: none;
        }
        .order-default {
          display: inline-block;
          width: 30px;
          border-radius: 4px;
          padding: 0px 2px;
          color: #ffffff;
          background-color: #c3bdbd;
        }
        .order-top3 {
          background-color: #ff4d4f;
        }
      }
    }
  }
}
</style>
