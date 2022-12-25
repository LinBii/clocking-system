import { apiHelper } from './../utils/helpers';
const getToken = () => localStorage.getItem('token');

export default {
  getCurrentUser() {
    return apiHelper.get('/get_current_user', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  },
  update({ userId, formData }) {
    return apiHelper.put(`/users/${userId}`, formData, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  },
};
