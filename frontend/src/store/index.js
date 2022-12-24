import { createStore } from 'vuex';
import usersAPI from '../apis/users.js';

export default createStore({
  state: {
    currentUser: {
      id: -1,
      name: '',
      email: '',
      isAdmin: false,
    },
    isAuthenticated: false,
  },
  getters: {},
  mutations: {
    setCurrentUser(state, currentUser) {
      state.currentUser = {
        ...state.currentUser,
        ...currentUser,
      };
      state.isAuthenticated = true;
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
      } catch (error) {
        console.error(error.message);
      }
    },
  },
  modules: {},
});
