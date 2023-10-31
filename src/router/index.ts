import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/UserStore'
import { useAuthStore } from '@/stores/AuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/SignInView.vue'),
      meta: { requiresGuest: true }
    },
    // @ts-ignore
    {
      path: '/logout',
      name: 'SignOut',
      // redirect: { name: '' },
      // component: () => import('../views/LoyaltyView.vue'),
      beforeEnter: async () => {
        await useAuthStore().signOutUser()
        return { name: 'home' }
      }
    },
    {
      path: '/loyalties',
      name: 'loyalty',
      component: () => import('../views/LoyaltyView.vue'),
      meta: { requiresAuth: true },
      props: true
      // async beforeEnter(to, from, next) {
      // await store.dispatch('fetchThread', { id: to.params.id })
      // // check if thread exists
      // const threadExists = findById(store.state.threads, to.params.id)
      // // if exists continue
      // if (threadExists) {
      //   return next()
      // } else {
      //   next({
      //     name: 'NotFound',
      //     params: { pathMatch: to.path.substring(1).split('/') },
      //     // preserve existing query and hash
      //     query: to.query,
      //     hash: to.hash
      //   })
      // }
      // if doesnt exist redirect to not found
      // }
    },
    {
      path: '/cards',
      name: 'card',
      component: () => import('../views/CardView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue')
    }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    return (
      savedPosition ||
      new Promise((resolve) => {
        setTimeout(() => resolve({ top: 0 }), 300)
      })
    )
  }
})

router.beforeEach(async (to, _from, next) => {
  await useAuthStore().initAuthentication()
  useUserStore().clearUnsubcribes()
  if (to.meta.requiresAuth && !useAuthStore().authUser) {
    next({ name: 'signin', query: { redirectTo: to.path } })
  }
  if (to.meta.requiresGuest && useAuthStore().authUser) {
    next({ name: 'home' })
  }
  next()
})

export default router
