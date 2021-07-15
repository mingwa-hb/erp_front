<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input-number
        style="width: 100%;"
        :min="0"
        :max="500"
        :value="value"
        @change="onChange"
        @pressEnter="onCheck"
      />
      <a-icon type="check" class="editable-cell-icon-check" @click="onCheck" />
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value || 0 }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditableCell',
  props: {
    text: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      value: this.text,
      editable: false
    }
  },
  methods: {
    onChange(value) {
      this.value = value
      this.$emit('change', this.value)
    },
    onCheck() {
      this.editable = false
      this.$emit('change', this.value)
    },
    edit() {
      this.editable = true
    }
  },
  mounted() {},
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>

<style lang="less" scoped>
.editable-cell {
  position: relative;

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;

    .editable-cell-icon,
    .editable-cell-icon-check {
      position: absolute;
      right: 0;
      width: 20px;
      cursor: pointer;
    }

    .editable-cell-icon {
      line-height: 18px;
      display: none;
    }

    .editable-cell-icon-check {
      line-height: 28px;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
      color: #108ee9;
    }
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }
}

.editable-cell:hover {
  .editable-cell-icon {
    display: inline-block;
  }
}
</style>
