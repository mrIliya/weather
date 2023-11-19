import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
 history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: () => import('../views/FavoritesView.vue')
    }
  ]
})

export default router
