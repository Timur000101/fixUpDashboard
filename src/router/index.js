import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const isAuth = (to, from, next) => {
  if(localStorage.getItem('token')) next()
  else next('/')
}

const routes = [
  {
    path: '/',
    name: 'login',
    meta: {layout: 'empty'},
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/home',
    name: 'home',
    meta: {layout: 'main'},
    component: () => import('../views/Home.vue'),
    beforeEnter: isAuth
  },
  {
    path: '/specialists',
    name: 'specialists',
    meta: {layout: 'main'},
    component: () => import('../views/Specialists.vue'),
    beforeEnter: isAuth
  },
  {
    path: '/users',
    name: 'users',
    meta: {layout: 'main'},
    component: () => import('../views/Users.vue'),
    beforeEnter: isAuth
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
