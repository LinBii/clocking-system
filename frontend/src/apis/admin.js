import { apiHelper } from './../utils/helpers';

export default {
  attendances: {
    get() {
      return apiHelper.get('/admin/attendances');
    },
  },
  users: {
    get() {
      return apiHelper.get('/admin/users');
    },
  },
};
