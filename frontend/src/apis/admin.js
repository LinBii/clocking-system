import { apiHelper } from './../utils/helpers';

export default {
  attendances: {
    get() {
      return apiHelper.get('/admin/attendances');
    },
  },
};
