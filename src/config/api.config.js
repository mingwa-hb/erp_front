/*
 * 存放本项目使用到的所有url
 * */

/*
 * 开发环境
 */
const apiUrl_dev = {
  baseUrl: '//10.7.196.27:8080', //开发环境
  // baseUrl: '//192.168.110.189:8080', //朱兵
  // baseUrl: '//192.168.110.187:8080', //广彪
  // baseUrl: '//192.168.110.54:8080', //何冰
}

/*
 * 测试环境
 */
const apiUrl_test = {
  baseUrl: '//10.7.196.27:8080', //开发环境
}

/*
 * 正式环境
 */
const apiUrl_pro = {
  baseUrl: '//10.7.196.27:8080',
};

/**
 * ==============特别重要！！！！特别重要！！！！！特别重要！！！！！=================
 * 说明：
 * 1，开发环境： process.env.NODE_ENV == 'development' 对应的是————apiUrl_dev
 * 2，生产环境：
 *  （1）测试阶段对应的是————apiUrl_test 
 *  （2）上线阶段对应的是————apiUrl_pro
 * 3，public/index.html里的文件也需要做相应的修改————domainIp.target
 */
const apiUrl = process.env.NODE_ENV == 'development' ? apiUrl_dev : apiUrl_test;

//修改引入/暴露模块的方式，node的使用require、exports、module.exports;ES6使用import、export、export default...
module.exports = {
  ...apiUrl
}