import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      strict: true,
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'menu.dashboard',
      component: () => import('./app/pages/dashboard/Dashboard.vue'),
      children: [
        {
          path: '',
          name: 'dashboard.distribution',
          component: () => import('./app/pages/dashboard/overview/Overview.vue')
        },
        {
          path: 'summary',
          name: 'dashboard.summary',
          component: () => import('./app/pages/dashboard/summary/Summary.vue')
        }
      ]
    },
    {
      path: '/income',
      name: 'menu.income',
      component: () => import('./app/pages/income/Income.vue')
    },
    {
      path: '/expenses',
      name: 'menu.expenses',
      component: () => import('./app/pages/expenses/Expenses.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
});
