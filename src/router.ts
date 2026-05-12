import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./app/pages/dashboard/Dashboard.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: '',
          name: 'dashboard.overview',
          component: () => import('./app/pages/dashboard/overview/Overview.vue')
        },
        {
          path: 'summary',
          name: 'dashboard.summary',
          component: () => import('./app/pages/dashboard/summary/Summary.vue')
        },
        {
          path: 'all-time',
          name: 'dashboard.allTime',
          component: () => import('./app/pages/dashboard/all-time/AllTime.vue')
        }
      ]
    },
    {
      path: '/income',
      name: 'income',
      component: () => import('./app/pages/income/Income.vue')
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: () => import('./app/pages/expenses/Expenses.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
});
