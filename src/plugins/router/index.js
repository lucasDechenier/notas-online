import { createRouter, createWebHashHistory } from 'vue-router'

const Students = () => import('@/views/Students.vue')
const Disciplines = () => import('@/views/Disciplines.vue')
const Config = () => import('@/views/Config.vue')

const routes = [
  { path: '/students', component: Students },
  { path: '/disciplines', component: Disciplines },
  { path: '/config', component: Config },
  { path: '/:pathMatch(.*)', redirect: '/students' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router