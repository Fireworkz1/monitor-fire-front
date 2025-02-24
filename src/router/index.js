import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ResourceRegisterView from "@/views/ResourceRegisterView.vue";
import ResourceManageView from "@/views/ResourceManageView.vue";
import resourceAutoView from "@/views/ResourceAutoView.vue";
import monitorDetailsView from "@/views/MonitorDetailsView.vue";
import monitorManageView from "@/views/MonitorManageView.vue";
Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/login'},
  {path: '/home', component: HomeView},
  {path: '/login', component: LoginView},
  {path: '/form/register', component: ResourceRegisterView},
  {path: '/form/manage', component: ResourceManageView},
  {path: '/form/auto', component: resourceAutoView},
  {path: '/monitor/details', component: monitorDetailsView},
  {path: '/monitor/manage', component: monitorManageView},


  {path: '/about', component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')}
]

const router = new VueRouter({
  routes
})

export default router
