import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/Register.vue'),
    meta: { title: '注册', requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue'),
        meta: { title: '系统概览', requiresAuth: true },
      },
      {
        path: 'basic-info',
        name: 'BasicInfo',
        component: () => import('@/pages/BasicInfo.vue'),
        meta: { title: '安全管理基础信息', requiresAuth: true },
      },
      {
        path: 'major-hazard',
        name: 'MajorHazard',
        component: () => import('@/pages/MajorHazard.vue'),
        meta: { title: '重大危险源安全管理', requiresAuth: true },
      },
      {
        path: 'dual-prevention',
        name: 'DualPrevention',
        component: () => import('@/pages/DualPrevention.vue'),
        meta: { title: '双重预防机制', requiresAuth: true },
      },
      {
        path: 'special-work',
        name: 'SpecialWork',
        component: () => import('@/pages/SpecialWork.vue'),
        meta: { title: '特殊作业许可与作业过程管理', requiresAuth: true },
      },
      {
        path: 'intelligent-inspection',
        name: 'IntelligentInspection',
        component: () => import('@/pages/IntelligentInspection.vue'),
        meta: { title: '智能巡检', requiresAuth: true },
      },
      {
        path: 'personnel-location',
        name: 'PersonnelLocation',
        component: () => import('@/pages/PersonnelLocation.vue'),
        meta: { title: '人员定位', requiresAuth: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      // 未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    // 登录和注册页面，如果已登录则跳转到首页
    if ((to.path === '/login' || to.path === '/register') && userStore.isLoggedIn) {
      next('/dashboard')
    } else {
      next()
    }
  }
})

export default router
