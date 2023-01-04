<template>
  <main>
    <div class="container py-5">
      <div v-if="currentUser.role === 'admin'">
        <a href="#/clocking/qrcode/generate">產生QR Code</a>
        | <a href="#/clocking/qrcode/read">讀取QR Code</a>
      </div>
      <component :is="currentView" />
    </div>
  </main>
</template>

<script>
import QRGenerator from '../components/QRGenerator.vue';
import QRReader from '../components/QRReader.vue';
import { computed, ref } from 'vue';
import { mapState, useStore } from 'vuex';

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

    console.log(currentUser);

    const routes = {
      '/clocking/qrcode/generate': QRGenerator,
      '/clocking/qrcode/read': QRReader,
    };

    const currentPath = ref(window.location.hash);

    window.addEventListener('hashchange', () => {
      currentPath.value = window.location.hash;
    });

    const currentView = computed(() => {
      console.log(currentPath.value.slice(1));
      return routes[currentPath.value.slice(1) || '/'] || 'NotFound';
    });

    return { currentView, currentUser };
  },
};
</script>

<style scoped>
main {
  margin: auto;
  width: 75%;
}
</style>
