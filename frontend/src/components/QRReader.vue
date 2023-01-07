<template>
  <p>{{ errorText }}</p>
  <div class="stream">
    <h2 v-if="isProcessing" class="fw-bold mt-5">讀取中...</h2>
    <qrcode-stream @init="onInit" @decode="onDecode"> </qrcode-stream>
  </div>
  <br />
</template>

<script>
import { ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { QrcodeStream } from 'vue-qrcode-reader';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import attendanceAPI from './../apis/attendances';
import { Toast, storeCheck } from './../utils/helpers';
dayjs.extend(utc, timezone);

export default {
  components: {
    QrcodeStream,
  },
  setup() {
    const isProcessing = ref(false);

    const store = useStore();

    const clockedInValue = localStorage.getItem('clockedIn');
    const clockInTimeValue = localStorage.getItem('clockInTime');
    const clockOutTimeValue = localStorage.getItem('clockOutTime');
    const dayChangeTimeValue = localStorage.getItem('dayChangeTime');

    const clockedInCheck = storeCheck(clockedInValue, store.state.clockedIn);

    // check if the user is clocked in
    const clockedIn = ref(clockedInCheck);
    const clockInTime = ref(clockInTimeValue);
    const clockOutTime = ref(clockOutTimeValue);
    const dayChangeTime = ref(dayChangeTimeValue);

    let errorText = ref('');
    const state = reactive({ data: null, hasScanned: false });

    const userId = store.getters.userId;

    async function onDecode(data) {
      state.data = data;
      const object = JSON.parse(atob(decodeURIComponent(data)));

      // if first scan and first clock-in -> clock-in
      if (!state.hasScanned && clockedIn.value === false) {
        try {
          isProcessing.value = true;

          clockInTime.value = dayjs.utc().local();
          dayChangeTime.value = dayjs(object.date)
            .add(1, 'day')
            .format('YYYY-MM-DD 05:00:00');

          const hour = dayjs().hour();

          // When the clock in time is between 00:00 ~ 05:00, the date value would be considered as the day before
          if (hour >= 0 && hour < 5) {
            object.date = dayjs
              .utc()
              .local()
              .subtract(1, 'day')
              .format('YYYY-MM-DD 00:00:00');
          } else {
            object.date = dayjs.utc().local().format('YYYY-MM-DD 00:00:00');
          }

          const { data } = await attendanceAPI.create({
            userId,
            date: object.date,
            clockIn: clockInTime.value,
          });
          if (data.status === 'error') {
            throw new Error(data.message);
          } else if (data.status === 'success') {
            Toast.fire({
              icon: 'success',
              title: data.message,
            });
          }
          store.commit('setClockInTime', clockInTime.value);
          localStorage.setItem('clockInTime', clockInTime.value);
          // Store dayChangeTime
          localStorage.setItem('dayChangeTime', dayChangeTime.value);

          clockedIn.value = true;
          store.commit('setClockedIn', true);
          localStorage.setItem('clockedIn', true);

          state.hasScanned = true;

          isProcessing.value = false;
        } catch (error) {
          if (error.message === '今天已經打卡上班了！') {
            clockedIn.value = true;
            store.commit('setClockedIn', true);
            localStorage.setItem('clockedIn', true);
          }
          if (error.message === 'Network Error') {
            Toast.fire({
              icon: 'warning',
              title: '無法連線到伺服器！',
            });
          } else {
            Toast.fire({
              icon: 'error',
              title: error.message,
            });
          }
          isProcessing.value = false;
        }
        // clock-out
      } else {
        isProcessing.value = true;

        clockOutTime.value = dayjs.utc().local();

        const hour = dayjs().hour();

        // When the clock out time is between 00:00 ~ 05:00, the date value would be considered as the day before
        if (hour >= 0 && hour < 5) {
          object.date = dayjs
            .utc()
            .local()
            .subtract(1, 'day')
            .format('YYYY-MM-DD 00:00:00');
        } else {
          object.date = dayjs.utc().local().format('YYYY-MM-DD 00:00:00');
        }

        // Set the clockOutTime ref to the current time, if it is later than the current value
        if (!clockOutTime.value || dayjs.utc().local() > clockOutTime.value) {
          clockOutTime.value = dayjs.utc().local();
        }

        try {
          const { data } = await attendanceAPI.update({
            date: object.date,
            userId: store.getters.userId,
            clockOut: clockOutTime.value,
          });
          if (data.status === 'error') {
            throw new Error(data.message);
          } else if (data.status === 'success') {
            Toast.fire({
              icon: 'success',
              title: data.message,
            });
          }
          store.commit('setClockOutTime', clockOutTime.value);
          localStorage.setItem('clockOutTime', clockOutTime.value);

          clockedIn.value = true;
          store.commit('setClockedIn', true);
          localStorage.setItem('clockedIn', true);

          isProcessing.value = false;
        } catch (error) {
          if (error.message === 'Network Error') {
            Toast.fire({
              icon: 'warning',
              title: '無法連線到伺服器！',
            });
          } else {
            Toast.fire({
              icon: 'error',
              title: error.message,
            });
          }
        }
        isProcessing.value = false;
      }
    }

    async function onInit(promise) {
      try {
        await promise;
        // successfully initialized
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          errorText.value = '請允許使用攝影機功能！';
        } else if (error.name === 'NotFoundError') {
          errorText.value = 'no suitable camera device installed';
        } else if (error.name === 'NotSupportedError') {
          errorText.value = 'page is not served over HTTPS (or localhost)';
        } else if (error.name === 'NotReadableError') {
          errorText.value = '攝影機可能正被占用！';
        } else if (error.name === 'OverconstrainedError') {
          errorText.value =
            'did you requested the front camera although there is none?';
        } else if (error.name === 'StreamApiNotSupportedError') {
          errorText.value = 'browser seems to be lacking features';
        } else {
          errorText.value = `ERROR: Camera error (${error.name})`;
        }
      } finally {
        // hide loading indicator
      }
    }

    return { onDecode, onInit, errorText, isProcessing };
  },
};
</script>

<style scoped>
.stream {
  max-height: 500px;
  max-width: 500px;
  margin: auto;
}
</style>
