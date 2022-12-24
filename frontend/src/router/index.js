import { createRouter, createWebHashHistory } from 'vue-router';
import NotFound from '../views/NotFound.vue';
import SignIn from '../views/SignIn.vue';
import SignUp from '../views/SignUp.vue';
import ClockPage from '../views/ClockPage.vue';
import store from './../store';

const routes = [
  {
    path: '/signin',
    name: 'sign-in',
    component: SignIn,
  },
  {
    path: '/signup',
    name: 'sign-up',
    component: SignUp,
  },
  {
    path: '/clocking',
    name: 'clocking',
    component: ClockPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
  {
    path: '/',
    name: 'root',
    redirect: '/signin',
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  const tokenInStore = store.state.token;

  let isAuthenticated = store.state.isAuthenticated;

  if (token && token !== tokenInStore) {
    isAuthenticated = await store.dispatch('fetchCurrentUser');
  }

  const pathsWithoutAuthentication = ['sign-in', 'sign-up'];

  if (!isAuthenticated && !pathsWithoutAuthentication.includes(to.name)) {
    next('/signin');
    return;
  }

  if (isAuthenticated && pathsWithoutAuthentication.includes(to.name)) {
    next('/home');
    return;
  }
  next();
});

export default router;
