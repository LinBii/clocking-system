import { createRouter, createWebHashHistory } from 'vue-router';
import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
