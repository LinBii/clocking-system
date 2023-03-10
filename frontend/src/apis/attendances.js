import { apiHelper } from './../utils/helpers';

const getToken = () => localStorage.getItem('token');

export default {
  create({ userId, date, clockIn }) {
    return apiHelper.post(
      '/attendances',
      { userId, date, clockIn },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
  },
  update({ userId, date, clockOut }) {
    return apiHelper.put(
      `/attendances/${userId}`,
      { userId, date, clockOut },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
  },
};
