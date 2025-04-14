import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ResourceRegisterView from "@/views/ResourceRegisterView.vue";
import ResourceManageView from "@/views/ResourceManageView.vue";
import resourceAutoView from "@/views/ResourceAutoView.vue";
import monitorDetailsView from "@/views/MonitorDetailsView.vue";
import monitorManageView from "@/views/MonitorManageView.vue";
import PermissionUserView from "@/views/PermissionUserView.vue";
import PermissionGroupView from "@/views/PermissionGroupView.vue";
import PermissionLevelView from "@/views/PermissionLevelView.vue";
import WarnSearchView from "@/views/WarnSearchView.vue";
import WarnManageView from "@/views/WarnManageView.vue";
import MonitorDataView from "@/views/MonitorDataView.vue";
import WarnHandleView from "@/views/WarnHandleView.vue";
import AutoConsoleView from "@/views/AutoConsoleView.vue";
import AutoPolicyView from "@/views/AutoPolicyView.vue";
import DockerConsoleView from "@/views/DockerConsoleView.vue";
import DataPredictionView from "@/views/DataPredictionView.vue";
import DataAnalyzeView from "@/views/DataAnalyzeView.vue";
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
  {path: '/permission/user', component: PermissionUserView},
  {path: '/permission/group', component: PermissionGroupView},
  {path: '/permission/level', component: PermissionLevelView},
  {path: '/warn/manage', component: WarnManageView},
  {path: '/warn/search', component: WarnSearchView},
  {path: '/warn/handle', component: WarnHandleView},
  {path: '/auto/console', component: AutoConsoleView},
  {path: '/auto/policy', component: AutoPolicyView},
  { path: '/monitor/data',name: 'MonitorDataView', component: MonitorDataView},
  { path: '/docker/console',name: 'DockerConsoleView', component: DockerConsoleView},
  { path: '/data/predict', component: DataPredictionView},
  { path: '/data/analyze', component: DataAnalyzeView},

  {path: '/about', component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')}
]

const router = new VueRouter({
  routes
})

export default router
