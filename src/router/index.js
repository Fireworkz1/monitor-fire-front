import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/login'},
  {path: '/home', component: HomeView},
  {path: '/login', component: LoginView},
  {path: '/about', component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')}
]

const router = new VueRouter({
  routes
})

export default router
