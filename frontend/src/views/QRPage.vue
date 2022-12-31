<template>
  <main>
    <div class="container py-5">
      <a href="#/qrclocking">QR Generator</a> |
      <a href="#/qrclocking/read">QR Reader</a> |
      <p>必須允許使用相機才能使用QR Code打卡！</p>
      <component :is="currentView" />
    </div>
  </main>
</template>

<script>
import QRGenerator from '../components/QRGenerator.vue';
import QRReader from '../components/QRReader.vue';
import { computed, ref } from 'vue';

export default {
  setup() {
    const routes = {
      '/qrclocking': QRGenerator,
      '/qrclocking/read': QRReader,
    };

    const currentPath = ref(window.location.hash);

    window.addEventListener('hashchange', () => {
      currentPath.value = window.location.hash;
    });

    const currentView = computed(() => {
      return routes[currentPath.value.slice(1) || '/'] || 'NotFound';
    });

    return { currentView };
  },
};
</script>

<style scoped>
main {
  margin: auto;
  width: 75%;
}
</style>
