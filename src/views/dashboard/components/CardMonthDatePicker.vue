<template>
  <a-range-picker
    size="small"
    :locale="locale"
    :placeholder="['开始月份', '截止月份']"
    format="YYYY-MM"
    :value="value"
    :mode="dateMode"
    :open="dateOpen"
    @panelChange="handlePanelChange"
    @change="handleChange"
    @openChange="handleOpenChange"
  >
    <div class="card-date-btn-group" slot="renderExtraFooter">
      <a-button value="small" type="primary" @click="doConfirm">确定</a-button>
    </div>
  </a-range-picker>
</template>

<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import moment from 'moment'
export default {
  name: 'CardMonthDatePicker', //时间起始截止选择组件
  mixins: [],
  components: {},
  props: {
    value: {
      type: Array,
      default: () => {
        return [moment(), moment()]
      }
    }
  },
  data() {
    return {
      locale,
      dateMode: ['month', 'month'],
      dateOpen: false
    }
  },
  computed: {},
  created() {},
  watch: {
    dateOpen(newV, oldV) {
      if (!newV) {
        this.updateDateVal(this.value)
      }
    }
  },
  methods: {
    updateDateVal(val) {
      this.$emit('update:value', val)
    },
    afterUpdateDateV() {
      this.$emit('afterUpdateDateV')
    },
    handleChange(value) {
      this.updateDateVal(value)
      // this.$emit('setMonthDate', this.value)
    },
    handleOpenChange(status) {
      // console.log(status)
      this.dateOpen = status
      if (!this.dateOpen) {
        this.afterUpdateDateV()
      }
    },
    handlePanelChange(value, mode) {
      // this.value = value
      this.updateDateVal(value)
      this.dateMode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
    },
    doConfirm() {
      this.handleOpenChange(false)
    }
  },
  mounted() {}
}
</script>
