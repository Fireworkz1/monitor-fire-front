import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
Vue.config.errorHandler = function (err, vm, info) {
  console.error(`全局错误处理：${err.toString()}\n信息：${info}`);
};
