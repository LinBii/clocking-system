<template>
  <div class="container py-5 text-center">
    <h1 class="fw-bold">GPS 打卡</h1>

    <div v-if="isHoliday" class="mt-3">
      <h3>今天放假，好好休息！</h3>
    </div>
    <div v-else>
      <GPSMap />
    </div>
  </div>
</template>

<script>
import GPSMap from './../components/GPSMap.vue';
import { isHoliday } from './../utils/helpers.js';
export default {
  components: {
    GPSMap,
  },
  setup() {
    return { isHoliday };
  },
};
</script>
