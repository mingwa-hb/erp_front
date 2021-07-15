<template>
  <article-list-card :title="title" :loading="loading">
    <div class="empty-div" slot="action"></div>
    <div class="card-main-warp" slot="list">
      <div v-if="dateType == 'month'" class="date-container">
        <CardMonthDatePicker :value.sync="monthFormDate" @afterUpdateDateV="afterUpdateDate" />
      </div>
      <LineChartMultid :height="lineChartH" :fields="chartFields" :aliases="chartAliases" :dataSource="chartData" />
    </div>
  </article-list-card>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import FieldsList from '../data/chartFiledsList'
import { PmoApiList } from '@/api/api'

import ArticleListCard from '@/views/dashboard/components/ArticleListCard'
import LineChartMultid from '@/components/chart/LineChartMultid'
import CardMonthDatePicker from '@/views/dashboard/components/CardMonthDatePicker'

export default {
  name: 'DsaCardChartItem', //数据统计分析-按月tab-子组件
  mixins: [],
  components: {
    LineChartMultid,
    ArticleListCard,
    CardMonthDatePicker
  },
  props: {
    title: {
      type: String,
      default: '未知模块',
      required: true
    },
    dataType: {
      type: Number,
      default: 0,
      required: true
    },
    dateType: {
      type: String,
      default: () => {
        return 'month'
      }
    },
    defaultFields: {
      type: Array,
      default: () => {
        return ['applyNum', 'contractStuNum', 'learningNum', 'examNum', 'certificateNum']
      }
    }
  },
  data() {
    return {
      loading: false,
      lineChartH: 392, //折线图的高度
      monthFormDate: [], //时间筛选
      chartData: [] //按月-折现图的DATA
    }
  },
  computed: {
    chartFields() {
      //按月-折现图的fields-完成计划证次
      let type = this.dataType
      let res = FieldsList.getChartFields(type) || this.defaultFields
      return res
    },
    chartAliases() {
      //按月-折现图的chartAliases 别名
      let type = this.dataType
      let res = FieldsList.getFieldsChartAliases(type) || this.defaultFields
      return res
    }
  },
  watch: {
    dateType(newV, oldV) {
      this.initPage()
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    initMonthRangeDate() {
      let startT = moment().subtract(1, 'years')
      let endT = moment()
      this.monthFormDate = [startT, endT]
    },
    afterUpdateDate() {
      // this.$emit('afterClosedDatePicker', this.monthFormDate)
      this.getChartData()
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
    getChartData() {
      let that = this
      let opts = {
        dataType: this.dataType,
        startStr:
          this.dateType == 'month'
            ? moment(this.monthFormDate[0]).format('YYYY-MM')
            : moment()
                .subtract(5, 'years')
                .format('YYYY'),
        endStr: this.dateType == 'month' ? moment(this.monthFormDate[1]).format('YYYY-MM') : moment().format('YYYY')
      }
      if (!!opts.dataType) {
        if (!!opts.startStr && !!opts.endStr) {
          that.loading = true
          PmoApiList.getDsaChartData(opts).then(res => {
            that.loading = false
            if (res.code == 0 || (res.code == 200 && !!res.success)) {
              that.chartData = that.formatChartData(res.result)
            } else {
              that.$message.warning(res.message)
            }
          })
        } else {
          that.$message.warning('必须选择开始时间和截止时间')
        }
      } else {
        that.$message.warning('dataType缺失')
      }
    },
    initPage() {
      // 初始化业务统计时间
      this.initMonthRangeDate()

      //获取chart的data数据
      this.getChartData()
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.date-container {
  position: absolute;
  top: 50px;
  right: 20px;
  z-index: 9;
}
</style>
