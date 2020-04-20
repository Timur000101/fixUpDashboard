import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    meta: {layout: 'empty'},
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    meta: {layout: 'main'},
    component: () => import('../views/Home.vue')
  },
  {
    path: '/specialists',
    name: 'specialists',
    meta: {layout: 'main'},
    component: () => import('../views/Specialists.vue')
  },
  {
    path: '/users',
    name: 'users',
    meta: {layout: 'main'},
    component: () => import('../views/Users.vue')
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
