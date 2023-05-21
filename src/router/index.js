import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../components/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Stats',
    component: HomeView
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('../views/LeaderboardView.vue')
  },
  {
    path: '/:catchAll(.*)', // Fallback route for unrecognized routes
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/mcsrranked-stats',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory("/"),
  base: "/",
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.name;
  next();
});

export default router
