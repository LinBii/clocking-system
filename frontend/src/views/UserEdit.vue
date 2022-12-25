<template>
  <div class="container py-5">
    <form @submit.prevent.stop="handleSubmit">
      <div class="text-center mb-4">
        <h1 class="h3 mb-3 font-weight-normal">修改密碼</h1>
      </div>

      <div class="mb-3">
        <label for="new-password">新密碼</label>
        <input
          id="new-password"
          v-model="newPassword"
          name="newPassword"
          type="password"
          class="form-control"
          placeholder="新密碼"
          autocomplete="new-password"
        />
      </div>

      <div class="mb-3">
        <label for="password-check">確認新密碼</label>
        <input
          id="password-check"
          v-model="passwordCheck"
          name="passwordCheck"
          type="password"
          class="form-control"
          placeholder="確認新密碼"
          autocomplete="new-password"
        />
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { mapState, useStore } from 'vuex';
import usersAPI from './../apis/users';
import { Toast } from './../utils/helpers';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const newPassword = ref('');
    const passwordCheck = ref('');
    const isProcessing = ref(false);

    const storeState = mapState(['currentUser']);
    const resultStoreState = {};
    Object.keys(storeState).map((item) => {
      const resFuc = storeState[item];
      resultStoreState[item] = computed(resFuc.bind({ $store: store }));
    });
    const { currentUser } = { ...resultStoreState };

    async function handleSubmit(e) {
      if (!this.newPassword) {
        Toast.fire({
          icon: 'warning',
          title: '您尚未填寫密碼',
        });
        return;
      } else if (this.newPassword !== this.passwordCheck) {
        Toast.fire({
          icon: 'warning',
          title: '兩次輸入的密碼不同',
        });
        this.newPassword = '';
        this.passwordCheck = '';
        return;
      }

      try {
        const form = e.target;
        const formData = new FormData(form);

        this.isProcessing = true;
        const { data } = await usersAPI.update({
          userId: route.params.id,
          formData,
        });

        if (data.status === 'error') {
          throw new Error(data.message);
        }

        router.push({ name: 'clocking' });
      } catch (error) {
        console.error(error.message);
        this.isProcessing = false;
        Toast.fire({
          icon: 'error',
          title: '無法更新使用者資料，請稍後再試',
        });
      }
    }

    return {
      newPassword,
      passwordCheck,
      isProcessing,
      currentUser,
      handleSubmit,
    };
  },
};
</script>
