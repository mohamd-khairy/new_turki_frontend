import isUserLoggedIn from "@/router/utils"
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})

router.beforeEach(async (to, from) => {
  const isAuthenticated = isUserLoggedIn()

  if (!isAuthenticated && to.name !== 'login') {
    return { name: 'login' }
  }
})

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
