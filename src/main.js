import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
Vue.config.errorHandler = function (err, vm, info) {
  console.error(`全局错误处理：${err.toString()}\n信息：${info}`);
};
