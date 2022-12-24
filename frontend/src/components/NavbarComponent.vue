<template>
  <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/"> PUNCHIN 乓去映 </router-link>

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
            <router-link to="#" class="nav-link text-white mr-3"
              >管理員後台</router-link
            >
          </li>
          <template v-if="isAuthenticaed">
            <li class="nav-item">
              <router-link to="#" class="nav-link text-white mr-3"
                >使用者 您好</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="#" class="nav-link text-white mr-3"
                >QR code打卡</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="#" class="nav-link text-white mr-3"
                >GPS 打卡</router-link
              >
            </li>
          </template>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a href="#" class="btn btn-sm btn-outline-success text-white"
              >登出</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  setup() {
    const computed = mapState(['currentUser', 'isAuthenticaed']);
    return {
      ...computed,
    };
  },
};
</script>
