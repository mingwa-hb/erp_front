<template>
  <a-card class="staff-info-card" :loading="loading" :bordered="false">
    <div class="thumb-box">
      <a-avatar class="avatar user-thumb" :src="getAvatar()"/>
    </div>
    <div class="info-box" v-if="!!pUserInfo">
      <p>
        <label for="">姓名：</label>
        <span>{{ pUserInfo.userName }}</span>
      </p>
      <p>
        <label for="">部门：</label>
        <span>{{ pUserInfo.departName }}</span>
      </p>
      <p>
        <label for="">工号：</label>
        <span>{{ pUserInfo.workNo }}</span>
      </p>
    </div>
  </a-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFileAccessHttpUrl,getAction } from "@/api/manage"

export default {
  name: 'HomeHeadUserInfo', //用户基本信息展示
  mixins: [],
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    pUserInfo: {
      type: Object,
      default: () => {
        return null
      },
    },
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    ...mapGetters(['nickname', 'avatar', 'userInfo']),

    getAvatar() {
      console.log(this.avatar())
      return getFileAccessHttpUrl(this.avatar())
    },
  },
  mounted() {},
}
</script>
<style lang="less" scoped>
.staff-info-card {
  min-width: 240px;
  /deep/.ant-card-body {
    position: relative;
    display: flex;
    padding-left: 10px;
    padding-right: 10px;
    align-items: center;
    > div {
      flex: auto;
    }
    .thumb-box {
      text-align: center;
      .user-thumb {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        color: #ffffff;
      }
    }
  }
  /deep/.ant-card-body::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 60%;
    transform: translate(0, 25%);
    background-color: #c3bdbd;
    clear: both;
    overflow: hidden;
  }
}
</style>
