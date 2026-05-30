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

// Route guard: redirect logged-in users away from auth pages,
// and redirect unauthenticated users to /login for protected routes.
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const publicPaths = ['/login', '/register', '/socket-demo']

  // If already logged in, don't allow visiting login/register
  if (token && (to.path === '/login' || to.path === '/register')) {
    return next('/')
  }

  // If not logged in and trying to access a protected route, redirect to /login
  if (!token && !publicPaths.includes(to.path)) {
    return next('/login')
  }

  next()
})

export default router
