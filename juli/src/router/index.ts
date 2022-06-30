import { isDev } from '@pork-buns/core/compositions/useEnv';
import BaseLayoutVue from '@/layouts/BaseLayout.vue';
import Home from '@/components/page/Home.vue';
import Promo from '@/components/page/Promo.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BaseLayoutVue,
      redirect: () => {
        // the function receives the target route as the argument
        // we return a redirect path/location here.
        return { path: '/home' };
      },
      children: [
        {
          path: 'home',
          component: Home
        },
        {
          path: 'promo',
          component: Promo
        }
      ]
    }
  ]
});

// mock login view
if (isDev()){
  router.addRoute({
    path: '/',
    component: BaseLayoutVue,
    children: [
      {
        path: '/dev-login',
        component: () => import('@/views/DevLoginView.vue')
      }
    ]
  });
}

export default router;
