<template>
  <a-card class="page-conainter" :bordered="false">
    <div class="page-header-container">
      <a-button-group class="clearfix">
        <a-button :type="activeFormDate == 'month' ? 'primary' : ''" @click="setFormDate('month')"> 按月 </a-button>
        <a-button :type="activeFormDate == 'year' ? 'primary' : ''" @click="setFormDate('year')"> 按年 </a-button>
      </a-button-group>
    </div>
    <div class="page-main-container">
      <div v-if="activeFormDate == 'month'" class="page-section-container">
        <a-row :gutter="16">
          <a-col v-for="item in monthDataList" :key="item.id" :sm="24" :md="16" :xl="12">
            <DsaCardChartItem :title="item.title" :data-type="item.type" :date-type="item.tabType" />
          </a-col>
        </a-row>
      </div>

      <div v-if="activeFormDate == 'year'" class="page-section-container">
        <a-row :gutter="16">
          <a-col v-for="item in yearDataList" :key="item.id" :sm="24" :md="16" :xl="12">
            <DsaCardChartItem :title="item.title" :data-type="item.type" :date-type="item.tabType" />
          </a-col>
        </a-row>
      </div>
    </div>
  </a-card>
</template>

<script>
import _ from 'lodash'
import ArticleListCard from '@/views/dashboard/components/ArticleListCard'
import BarMultid from '@/components/chart/BarMultid'
import DsaCardChartItem from './components/DsaCardChartItem'

export default {
  name: 'DataStaticAnalysis', //数据统计分析页面
  mixins: [],
  components: {
    BarMultid,
    ArticleListCard,
    DsaCardChartItem
  },
  props: {},
  data() {
    return {
      activeFormDate: 'month', //按年|按月 默认按月
      /**
       * id    用于渲染for循环的key值，用于前端页面的排序渲染
       * title 用于显示模块的title
       * type  用于给后端传type 与后端接口一一对应
       * tabType 用于归属前端页面的tab值
       */
      dataList: [
        {
          id: 1, //
          title: '合同证次统计',
          type: 9,
          tabType: 'month'
        },
        {
          id: 2,
          title: '合同证次统计',
          type: 10,
          tabType: 'year'
        },
        {
          id: 3,
          title: '计划证次统计',
          type: 11,
          tabType: 'month'
        },
        {
          id: 4,
          title: '计划证次统计',
          type: 12,
          tabType: 'year'
        },
        {
          id: 5,
          title: '完成计划证次统计',
          type: 1,
          tabType: 'month'
        },
        {
          id: 6,
          title: '完成计划证次统计',
          type: 2,
          tabType: 'year'
        },
        {
          id: 7,
          title: '实际完成证次统计',
          type: 3,
          tabType: 'month'
        },
        {
          id: 8,
          title: '实际完成证次统计',
          type: 4,
          tabType: 'year'
        },
        {
          id: 9,
          title: '剩余计划证次统计',
          type: 5,
          tabType: 'month'
        },
        {
          id: 10,
          title: '剩余计划证次统计',
          type: 6,
          tabType: 'year'
        },
        {
          id: 11,
          title: '累计剩余证次统计',
          type: 7,
          tabType: 'month'
        },
        {
          id: 12,
          title: '累计剩余证次统计',
          type: 8,
          tabType: 'year'
        }
      ]
    }
  },
  computed: {
    monthDataList() {
      let res = []
      let data = this.dataList
      res = _.filter(data, val => {
        return val.type % 2 == 1 && val.tabType == 'month'
      })
      return res
    },
    yearDataList() {
      let res = []
      let data = this.dataList
      res = _.filter(data, val => {
        return val.type % 2 == 0 && val.tabType == 'year'
      })
      return res
    }
  },
  created() {},
  methods: {
    setFormDate(status) {
      this.activeFormDate = status
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.page-conainter {
  .page-header-container {
    overflow: hidden;
    .clearfix {
      float: right;
    }
    .clearfix::after {
      content: '';
      position: absolute;
      height: 0;
      clear: both;
      overflow: hidden;
      visibility: hidden;
    }
  }

  .page-main-container {
    .page-section-container {
      position: relative;
      margin-top: 20px;
      .ant-row {
        /deep/.ant-col {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
