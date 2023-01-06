<template>
  <div class="container py-5">
    <div v-if="isHoliday">
      <h1>今天放假，好好休息！</h1>
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
