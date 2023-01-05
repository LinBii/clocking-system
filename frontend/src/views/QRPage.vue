<template>
  <main>
    <div class="container py-5">
      <h2 v-if="isHoliday">今天放假，好好休息！</h2>
      <div v-else class="text-center">
        <h2>QR Code 打卡</h2>
        <div v-if="currentUser.role === 'admin'">
          <a href="#/clocking/qrcode/generate">產生QR Code</a>
          | <a href="#/clocking/qrcode/read">讀取QR Code</a>
          <component :is="currentView" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { computed, ref } from 'vue';
import { mapState, useStore } from 'vuex';
import QRGenerator from '../components/QRGenerator.vue';
import QRReader from '../components/QRReader.vue';
import { isHoliday } from '../utils/helpers';

export default {
  setup() {
    const store = useStore();
    const storeState = mapState(['currentUser']);
    const resultStoreState = {};
    Object.keys(storeState).map((item) => {
      const resFuc = storeState[item];
      resultStoreState[item] = computed(resFuc.bind({ $store: store }));
    });
    const { currentUser } = { ...resultStoreState };

    const routes = {
      '/clocking/qrcode/generate': QRGenerator,
      '/clocking/qrcode/read': QRReader,
    };

    const currentPath = ref(window.location.hash);

    window.addEventListener('hashchange', () => {
      currentPath.value = window.location.hash;
    });

    const currentView = computed(() => {
      return routes[currentPath.value.slice(1) || '/'] || 'NotFound';
    });

    return { currentView, currentUser, isHoliday };
  },
};
</script>

<style scoped>
main {
  margin: auto;
  width: 75%;
}
</style>
