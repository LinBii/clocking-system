<template>
  <div class="container py-5">
    <AdminNav />

    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th>ID</th>
          <th>名字</th>
          <th>Email</th>
          <th>權限角色</th>
          <th>是否上鎖</th>
          <th>互動</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <th>
            {{ user.id }}
          </th>
          <td>
            {{ user.name }}
          </td>
          <td>
            {{ user.email }}
          </td>
          <td>
            {{ user.role }}
          </td>
          <td>
            {{ user.isLocked ? '是' : '否' }}
          </td>
          <td>改為出勤</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { mapState, useStore } from 'vuex';
import AdminNav from './../components/AdminNav.vue';
import adminAPI from './../apis/admin';
import { Toast } from './../utils/helpers';

export default {
  components: {
    AdminNav,
  },
  setup() {
    const store = useStore();
    const storeState = mapState(['currentUser', 'isAuthenticated']);
    const resultStoreState = {};
    Object.keys(storeState).map((item) => {
      const resFuc = storeState[item];
      resultStoreState[item] = computed(resFuc.bind({ $store: store }));
    });
    const { currentUser, isAuthenticated } = { ...resultStoreState };
    const users = ref([]);

    async function fetchUsers() {
      try {
        const { data } = await adminAPI.users.get();

        if (data.status === 'error') {
          throw new Error(data.message);
        }

        users.value = data;
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: '無法取得使用者名單！',
        });
      }
    }

    fetchUsers();
    return {
      users,
      currentUser,
      isAuthenticated,
    };
  },
};
</script>
