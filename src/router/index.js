import Vue from 'vue'
import Router from 'vue-router'
import {
  constantRouterMap
} from '@/config/router.config'

//update-begin-author:taoyan date:20191011 for:TASK #3214 【优化】访问online功能测试 浏览器控制台抛出异常
try {
  const originalPush = Router.prototype.push
  Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
  }
} catch (e) {}
//update-end-author:taoyan date:20191011 for:TASK #3214 【优化】访问online功能测试 浏览器控制台抛出异常

Vue.use(Router)

//创建方法
const createRouter = () => new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // the relevant part
}

export default router

// export default new Router({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   scrollBehavior: () => ({
//     y: 0
//   }),
//   routes: constantRouterMap
// })