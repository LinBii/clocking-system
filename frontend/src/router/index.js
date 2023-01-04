import { createRouter, createWebHashHistory } from 'vue-router';
import NotFound from '../views/NotFound.vue';
import SignIn from '../views/SignIn.vue';
import SignUp from '../views/SignUp.vue';
import ClockPage from '../views/ClockPage.vue';
import QRPage from '../views/QRPage.vue';
import GPSPage from '../views/GPSPage.vue';
import UserEdit from '../views/UserEdit.vue';
import AdminAttendances from '../views/AdminAttendances.vue';
import AdminUsers from '../views/AdminUsers.vue';
import store from './../store';

const authorizeIsAdmin = (to, from, next) => {
  const currentUser = store.state.currentUser;
  if (currentUser && currentUser.role !== 'admin') {
    next('/not-found');
    return;
  }

  next();
};

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
    path: '/qrclocking/read',
    name: 'read-qrclocking',
    component: QRPage,
  },
  {
    path: '/qrclocking',
    name: 'qrclocking',
    component: QRPage,
  },
  {
    path: '/clocking/gps',
    name: 'clocking-gps',
    component: GPSPage,
  },
  {
    path: '/users/:id/edit',
    name: 'user-edit',
    component: UserEdit,
  },
  {
    path: '/admin',
    exact: true,
    redirect: '/admin/attendances',
  },
  {
    path: '/admin/attendances',
    name: 'admin-attendances',
    component: AdminAttendances,
    beforeEnter: authorizeIsAdmin,
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: AdminUsers,
    beforeEnter: authorizeIsAdmin,
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
    next('/clocking');
    return;
  }
  next();
});

export default router;
