<template>
  <qr-stream @init="onInit" @decode="onDecode"></qr-stream>
  <br />
  <p>{{ errorText }}</p>
  <p>Result: {{ state.data }}</p>
</template>

<script>
import { ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { QrStream } from 'vue3-qr-reader';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import attendanceAPI from './../apis/attendances';
import { Toast, storeCheck } from './../utils/helpers';
dayjs.extend(utc, timezone);

export default {
  components: {
    QrStream,
  },
  setup() {
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

      // if first scan -> clock-in
      if (!state.hasScanned && clockedIn.value === false) {
        try {
          clockInTime.value = dayjs.utc().local();

          dayChangeTime.value = dayjs(object.date)
            .add(1, 'day')
            .format('YYYY-MM-DD 05:00:00');

          clockedIn.value = true;
          store.commit('setClockedIn', true);
          localStorage.setItem('clockedIn', true);

          const { data } = await attendanceAPI.create({
            userId,
            date: object.date,
            clockIn: clockInTime.value,
          });
          if (data.status === 'error') {
            throw new Error(data.message);
          }
          store.commit('setClockInTime', clockInTime.value);
          localStorage.setItem('clockInTime', clockInTime.value);
          // Store dayChangeTime
          localStorage.setItem('dayChangeTime', dayChangeTime.value);

          state.hasScanned = true;
        } catch (error) {
          Toast.fire({
            icon: 'error',
            title: error.message,
          });
        }
        // clock-out
      } else {
        clockOutTime.value = dayjs.utc().local();

        // Set the clockOutTime ref to the current time, if it is later than the current value
        if (!clockOutTime.value || dayjs.utc().local() > clockOutTime.value) {
          clockOutTime.value = dayjs.utc().local();
          store.commit('setClockOutTime', clockOutTime.value);
          localStorage.setItem('clockOutTime', clockOutTime.value);

          clockedIn.value = true;
          store.commit('setClockedIn', true);
          localStorage.setItem('clockedIn', true);
        }

        try {
          const { data } = await attendanceAPI.update({
            date: object.date,
            userId: store.getters.userId,
            clockOut: clockOutTime.value,
          });
          if (data.status === 'error') {
            throw new Error(data.message);
          }
          store.commit('setClockOutTime', clockOutTime.value);
          localStorage.setItem('clockOutTime', clockOutTime.value);
        } catch (error) {
          Toast.fire({
            icon: 'error',
            title: error.message,
          });
        }
      }
    }

    async function onInit(promise) {
      try {
        const { capabilities } = await promise;
        // successfully initialized
        console.log(capabilities);
      } catch (error) {
        console.log(error);
        if (error.name === 'NotAllowedError') {
          errorText.value = 'Denied! No permission 允許攝影機功能後才能使用！';
        } else if (error.name === 'NotFoundError') {
          errorText.value = 'no suitable camera device installed';
        } else if (error.name === 'NotSupportedError') {
          errorText.value = 'page is not served over HTTPS (or localhost)';
        } else if (error.name === 'NotReadableError') {
          errorText.value = 'maybe camera is already in use';
        } else if (error.name === 'OverconstrainedError') {
          errorText.value =
            'did you requested the front camera although there is none?';
        } else if (error.name === 'StreamApiNotSupportedError') {
          errorText.value = 'browser seems to be lacking features';
        }
      } finally {
        // hide loading indicator
      }
    }

    return { onDecode, onInit, errorText, state };
  },
};
</script>
