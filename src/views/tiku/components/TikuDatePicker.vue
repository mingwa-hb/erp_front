<template>
  <div v-if="!!domain.workTypeId">
    <a-date-picker
      v-model="startTime"
      :disabled-date="disabledStartDate"
      show-time
      format="YYYY-MM-DD HH:mm:ss"
      placeholder="请输入考试开始时间"
      @openChange="handleStartOpenChange"
    />
    <a-date-picker
      v-model="endTime"
      :disabled-date="disabledEndDate"
      show-time
      format="YYYY-MM-DD HH:mm:ss"
      placeholder="请输入考试结束时间"
      :open="endOpen"
      @openChange="handleEndOpenChange"
    />
  </div>
</template>

<script>
    export default {
      name: 'TikuDatePicker',
      props:{
        domain:{
          type:Object,
          required:false,
          default: () => {
            return null
          }
        },
      },
      data() {
        return {
          startTime: null,
          endTime: null,
          endOpen: false,
        }
      },
      watch: {
        domain: {
          deep: true,
          immediate: true,
          handler(newV, oldV) {
            if(!!newV){
              this.startTime = newV.startTime;
              this.endTime = newV.endTime;
            }
          }
        },

        startTime(val) {
          console.log('startTime', val);
          this.domain.startTime=val;
        },
        endTime(val) {
          console.log('end', val);
          this.domain.endTime=val;
        },
      },
      methods: {
        disabledStartDate(startTime) {
          const endTime = this.endTime;
          if (!startTime || !endTime) {
            return false;
          }
          return startTime.valueOf() > endTime.valueOf();
        },
        disabledEndDate(endTime) {
          const startTime = this.startTime;
          if (!endTime || !startTime) {
            return false;
          }
          return startTime.valueOf() >= endTime.valueOf();
        },
        handleStartOpenChange(open) {
          if (!open) {
            this.endOpen = true;
          }
        },
        handleEndOpenChange(open) {
          this.endOpen = open;
        }

      },
    }
</script>

<style scoped>
  .ant-form-item-children .ant-calendar-picker{
    float: left;
    padding-top:4px;
    padding-left:4px;
    margin-right: 4px;
  }
</style>