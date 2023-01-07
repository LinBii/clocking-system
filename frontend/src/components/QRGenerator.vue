<template>
  <div class="qrcode py-5">
    <qrcode-vue :value="qrCodeValue" :size="size"></qrcode-vue>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import QrcodeVue from 'qrcode.vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc, timezone);

export default {
  components: {
    QrcodeVue,
  },
  setup() {
    const date = ref(getDateFromLocalStorage());

    const qrCodeValue = computed(() => {
      const data = {
        date: date.value,
      };
      const encodedString = btoa(JSON.stringify(data));
      return encodeURIComponent(encodedString);
    });

    const size = ref(250);

    return { qrCodeValue, size };
  },
};

function getDateFromLocalStorage() {
  const dateString = localStorage.getItem('date');
  if (dateString) {
    return dateString;
  }

  const date = dayjs.utc().local().format('YYYY-MM-DD 00:00:00');
  localStorage.setItem('date', date);
  return date;
}
</script>

<style scoped>
#qrcode {
  margin: auto;
}
</style>
