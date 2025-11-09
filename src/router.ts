import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('./app/pages/dashboard/Dashboard.vue')
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
      redirect: '/'
    }
  ]
});
