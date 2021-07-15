<template>
  <a-card class="chart-card-container" :loading="loading" :bordered="false">
    <div class="chart-card-header">
      <div class="meta">
        <span class="chart-card-title">{{ title }}</span>
        <span class="chart-card-action">
          <slot name="action"></slot>
        </span>
      </div>
      <div class="total">
        <span>{{ total }}</span>
      </div>
    </div>
    <div class="chart-card-content">
      <slot></slot>
    </div>
    <div class="chart-card-footer">
      <div class="field">
        <slot name="footer"></slot>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'AnalysisChartCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    total: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
.chart-card-container {
  .chart-card-header {
    position: relative;
    width: 100%;
    overflow: hidden;

    .meta {
      position: relative;
      width: 100%;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      overflow: hidden;
    }
  }

  .chart-card-action {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }

  .chart-card-footer {
    padding-top: 10px;

    > * {
      position: relative;
    }

    .field {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .chart-card-content {
    width: 100%;
  }

  .total {
    font-size: 30px;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    color: #000;
    overflow: hidden;
  }
}
</style>
