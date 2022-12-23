<template>
  <div class="container py-5">
    <form class="w-100" @submit.prevent.stop="handleSubmit">
      <div class="text-center mb-4">
        <h1 class="h3 mb-3 font-weight-normal">Sign In</h1>
      </div>

      <div class="form-label-group mb-2">
        <label for="email">email</label>
        <input
          id="email"
          v-model="email"
          name="email"
          type="email"
          class="form-control"
          placeholder="email"
          autocomplete="username"
          required
          autofocus
        />
      </div>

      <div class="form-label-group mb-3">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          class="form-control"
          placeholder="Password"
          autocomplete="current-password"
          required
        />
      </div>

      <button
        class="btn btn-primary btn-block mb-3"
        type="submit"
        :disabled="isProcessing"
      >
        Submit
      </button>

      <div class="text-center mb-3">
        <p>
          <router-link to="/signup">Sign Up</router-link>
        </p>
      </div>

      <p class="mt-5 mb-3 text-muted text-center">&copy; 2022-</p>
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
    const email = ref('');
    const password = ref('');
    const isProcessing = ref(false);

    async function handleSubmit() {
      if (!this.email || !this.password) {
        Toast.fire({
          icon: 'warning',
          title: '請填寫email及密碼',
        });
        return;
      }

      this.isProcessing = true;

      try {
        const response = await authorizationAPI.signIn({
          email: this.email,
          password: this.password,
        });
        const { data } = response;

        if (data.status === 'error') {
          throw new Error(data.message);
        }

        localStorage.setItem('token', data.token);

        router.push('/home');

        Toast.fire({
          icon: 'success',
          title: '登入成功！',
        });
      } catch (error) {
        this.password = '';
        Toast.fire({
          icon: 'warning',
          title: '請確認您輸入了正確的帳號密碼',
        });
        this.isProcessing = false;
        console.log('error', error);
      }
    }

    return { email, password, handleSubmit, isProcessing };
  },
};
</script>
