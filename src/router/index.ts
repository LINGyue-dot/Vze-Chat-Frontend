/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 19:46:19
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-07 15:45:51
 * @Description: 
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [

  {
    path: '/',
    redirect: '/home',
    component: () => import('@/layout/base-layout.vue'),
    children: [
      {
        path: '/login',
        component: () => import('@/views/login/index.vue')
      },
      {
        path: '/home',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: '/chat',
        component: () => import('@/views/chat/index.vue')
      },
      {
        path: '/meeting',
        component: () => import('@/views/meeting/index.vue')
      },
      {
        path: '/offer',
        component: () => import('@/views/meeting/offer.vue')
      },
      {
        path: '/answer',
        component: () => import('@/views/meeting/answer.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  next()

})

export default router
