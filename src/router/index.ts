/**
 * Vue Router 設定
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('@/views/OverviewView.vue'),
  },
  {
    path: '/cross-check',
    name: 'cross-check',
    component: () => import('@/views/CrossCheckView.vue'),
  },
  {
    path: '/advisor',
    name: 'advisor',
    component: () => import('@/views/AdvisorView.vue'),
  },
  {
    path: '/guide',
    name: 'guide',
    component: () => import('@/views/GuideView.vue'),
  },
  // 旧URL互換リダイレクト
  {
    path: '/index.html',
    redirect: '/',
  },
  {
    path: '/overview.html',
    redirect: '/overview',
  },
  {
    path: '/zukan-overview.html',
    redirect: '/overview',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
