<template>
  <div class="container py-5">
    <AdminNav />
    <div class="table-responsive">
      <table class="table table-hover table-striped text-center">
        <thead class="table-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">名字</th>
            <th scope="col">Email</th>
            <th scope="col">權限角色</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <th scope="row" class="id">
              {{ user.id }}
            </th>
            <td class="name">
              {{ user.name }}
            </td>
            <td class="email">
              {{ user.email }}
            </td>
            <td class="role">
              {{ user.role }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
        const { data } = await adminAPI.absentUsers.get();

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

<style scoped>
.button {
  display: inline-block;
  height: 24px;
}
.container {
  width: 80vw;
}
</style>
