<template>
  <div class="container py-5">
    <form class="w-100" @submit.prevent="handleSubmit">
      <div class="text-center mb-4">
        <h1 class="h3 mb-3 fw-bold">註冊</h1>
      </div>

      <div class="mb-2">
        <label for="name">姓名</label>
        <input
          id="name"
          v-model="name"
          name="name"
          type="text"
          class="form-control"
          autocomplete="username"
          required
          autofocus
        />
      </div>

      <div class="mb-2">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          name="email"
          type="email"
          class="form-control"
          autocomplete="email"
          required
        />
      </div>

      <div class="mb-3">
        <label for="password">密碼</label>
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          class="form-control"
          autocomplete="new-password"
          required
        />
      </div>

      <div class="mb-3">
        <label for="password-check">確認密碼</label>
        <input
          id="password-check"
          v-model="passwordCheck"
          name="passwordCheck"
          type="password"
          class="form-control"
          autocomplete="new-password"
          required
        />
      </div>

      <div class="d-grid gap-2">
        <button class="btn btn-primary btn-block my-3" type="submit">
          註冊
        </button>
      </div>

      <div class="text-center mb-3">
        <p>
          已有帳號？
          <router-link to="/signin" class="text-decoration-none">
            登入
          </router-link>
        </p>
      </div>

      <p class="mt-5 mb-3 text-muted text-center">&copy; 2023-</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authorizationAPI from './../apis/authorization';
import { Toast } from './../utils/helpers';

export default {
  setup() {
    const router = useRouter();
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const passwordCheck = ref('');

    async function handleSubmit() {
      try {
        if (
          !this.name ||
          !this.email ||
          !this.password ||
          !this.passwordCheck
        ) {
          Toast.fire({
            icon: 'warning',
            title: '請確認已填寫所有欄位',
          });
          return;
        }
        if (this.password !== this.passwordCheck) {
          Toast.fire({
            icon: 'warning',
            title: '兩次輸入的密碼不同',
          });
          this.passwordCheck = '';
          return;
        }
        const { data } = await authorizationAPI.signUp({
          name: this.name,
          email: this.email,
          password: this.password,
          passwordCheck: this.passwordCheck,
        });
        if (data.status === 'error') {
          throw new Error(data.message);
        }
        Toast.fire({
          icon: 'success',
          title: data.message,
        });

        router.push('/signin');
      } catch (error) {
        Toast.fire({
          icon: 'warning',
          title: `無法註冊 - ${error.message}`,
        });
      }
    }

    return { name, email, password, passwordCheck, handleSubmit };
  },
};
</script>

<style scoped>
.container {
  width: 50vh;
}
</style>
