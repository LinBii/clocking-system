import { apiHelper } from './../utils/helpers';

const getToken = () => localStorage.getItem('token');

export default {
  attendances: {
    get() {
      return apiHelper.get('/admin/attendances', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    },
  },
  users: {
    get() {
      return apiHelper.get('/admin/users', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    },
  },
  absentUsers: {
    get() {
      return apiHelper.get('/admin/users/absent', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    },
  },
};
