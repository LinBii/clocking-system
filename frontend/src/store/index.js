import { createStore } from 'vuex';
import usersAPI from '../apis/users.js';

export default createStore({
  state: {
    currentUser: {
      id: -1,
      name: '',
      email: '',
      role: '',
    },
    isAuthenticated: false,
    token: '',
  },
  getters: {
    userId: (state) => state.currentUser.id,
  },
  mutations: {
    setCurrentUser(state, currentUser) {
      state.currentUser = {
        ...state.currentUser,
        ...currentUser,
      };
      state.isAuthenticated = true;
      state.token = localStorage.getItem('token');
    },
    revokeAuthentication(state) {
      state.currentUser = {};
      state.isAuthenticated = false;
      state.token = '';
      localStorage.removeItem('token');
    },
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        const { data } = await usersAPI.getCurrentUser();

        if (data.status === 'error') {
          throw new Error(data.message);
        }

        const { id, name, email, role } = data;

        commit('setCurrentUser', {
          id,
          name,
          email,
          role,
        });
        return true;
      } catch (error) {
        console.error(error.message);
        commit('revokeAuthentication');
        return false;
      }
    },
  },
  modules: {},
});
