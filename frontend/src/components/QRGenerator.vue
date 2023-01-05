<template>
  <div class="qrcode py-5">
    <qrcode-vue :value="value" :size="size"></qrcode-vue>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
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
    const dateValue = localStorage.getItem('date');

    const date = ref(dateValue);
    let data = reactive({
      date: null,
    });

    let value = ref('hr:defaultdata.random');
    let size = ref(300);

    date.value = dayjs.utc().local().format('YYYY-MM-DD 00:00:00');
    localStorage.setItem('date', date.value);

    data = {
      date: date.value,
    };

    const encodedString = btoa(JSON.stringify(data));
    const urlEncodedString = encodeURIComponent(encodedString);

    value.value = urlEncodedString;
    return { value, size };
  },
};
</script>

<style scoped>
#qrcode {
  margin: auto;
}
</style>
