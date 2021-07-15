import Vue from 'vue'
import {
  USER_INFO,
  ENHANCE_PRE
} from "@/store/mutation-types"
const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  username: state => state.user.username,
  welcome: state => state.user.welcome,
  permissionList: state => state.user.permissionList,
  allAuthList: state => state.user.allAuthList,
  addRouters: state => state.permission.addRouters,
  onlAuthFields: state => {
    return state.online.authFields
  },
  avatar: state => {
    state.user.avatar = Vue.ls.get(USER_INFO).avatar;
    return state.user.avatar
  },
  nickname: state => {
    state.user.realname = Vue.ls.get(USER_INFO).realname;
    return state.user.realname
  },
  userInfo: state => {
    state.user.info = Vue.ls.get(USER_INFO);
    return state.user.info
  },
  enhanceJs: (state) => (code) => {
    state.enhance.enhanceJs[code] = Vue.ls.get(ENHANCE_PRE + code);
    return state.enhance.enhanceJs[code]
  },
  sysRolesList: state => state.user.sysRolesList,
  pUserInfo: state => state.user.pUserInfo,
}

export default getters