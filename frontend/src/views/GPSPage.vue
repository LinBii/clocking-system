<template>
  <div class="container py-5">
    <h2 v-if="isHoliday">今天放假，好好休息！</h2>
    <div v-else><GPSMap /></div>
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
