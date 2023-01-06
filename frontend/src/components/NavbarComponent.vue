<template>
  <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/"> PUNCHIN 乓去映 </router-link>
      <template v-if="isAuthenticated">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link
                v-if="currentUser.role === 'admin'"
                to="/admin"
                class="nav-link text-white mr-3"
                >管理員後台</router-link
              >
            </li>

            <li class="nav-item">
              <router-link to="/" class="nav-link text-white mr-3"
                >{{ currentUser.name || '使用者' }} 您好</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                :to="{ name: 'user-edit', params: { id: currentUser.id } }"
                class="nav-link text-white mr-3"
              >
                修改密碼
              </router-link>
            </li>

            <li class="nav-item">
              <router-link
                to="/clocking/qrcode/read"
                class="nav-link text-white mr-3"
                >QR code打卡</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/clocking/gps" class="nav-link text-white mr-3"
                >GPS 打卡</router-link
              >
            </li>
          </ul>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a href="#" class="btn btn-danger text-white" @click="logout"
                >登出</a
              >
            </li>
          </ul>
        </div>
      </template>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { mapState, useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const storeState = mapState(['currentUser', 'isAuthenticated']);
    const resultStoreState = {};
    Object.keys(storeState).map((item) => {
      const resFuc = storeState[item];
      resultStoreState[item] = computed(resFuc.bind({ $store: store }));
    });
    const { currentUser, isAuthenticated } = { ...resultStoreState };

    function logout() {
      store.commit('revokeAuthentication');
      router.push('/signin');
      localStorage.clear();
    }
    return { logout, currentUser, isAuthenticated };
  },
};
</script>
