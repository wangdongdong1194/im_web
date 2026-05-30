import { createRouter, createWebHistory } from 'vue-router'
import SocketDemoView from '@/views/SocketDemoView.vue'
import ChatLayoutView from '@/views/ChatLayoutView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'wechat-layout',
      component: ChatLayoutView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/socket-demo',
      name: 'socket-demo',
      component: SocketDemoView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
  ],
})

// 新版守卫：取消 next，用 return 控制跳转
router.beforeEach((to) => {
  const token = localStorage.getItem('auth_token')
  const publicPaths = ['/login', '/register', '/socket-demo']

  // 已登录不能进登录/注册页 → 跳首页
  if (token && ['/login', '/register'].includes(to.path)) {
    return '/'
  }

  // 未登录访问受保护页面 → 跳登录
  if (!token && !publicPaths.includes(to.path)) {
    return '/login'
  }

  // 其余全部放行(return undefined / true 都可以)
})

export default router
