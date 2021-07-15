<template>
  <div class="img">
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelImg()">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  export default {
    name: 'JImagePewview',
    data(){
      return {
        previewVisible:false,
        previewImage:"",
      }
    },
    props:{

    },
    watch:{

    },
    created(){
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
    },
    methods:{
      showImg(imgPath){
        this.previewVisible=true;
        this.previewImage = imgPath;
      },
      handleCancelImg() {
        this.previewVisible=false;
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>
