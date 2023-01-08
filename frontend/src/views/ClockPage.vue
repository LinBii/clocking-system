<template>
  <div class="container py-5">
    <div class="text-center d-flex flex-column align-items-center">
      <h1 class="fw-bold">歡迎來到PUNCHIN考勤系統</h1>
      <h3 v-if="isHoliday" class="my-3">今天放假，好好休息！</h3>
      <div v-if="!isHoliday" class="my-3">
        <button
          v-if="!clockedIn"
          @click="clockIn"
          class="btn btn-danger btn-circle"
          :disable="isProcessing"
        >
          <p class="mb-0">打卡上班</p>
        </button>
        <button
          v-else
          @click="clockOut"
          class="btn btn-success btn-circle"
          :disabled="isProcessing"
        >
          <p class="mb-0">打卡下班</p>
        </button>
      </div>
      <h3 v-if="isLoading" class="loading my-3">Is loading</h3>
      <h3 v-else class="my-3">{{ currentTime }}</h3>
      <div class="my-3">
        <p v-if="clockInTime">上班時間：{{ clockInTime }}</p>
        <p v-if="clockOutTime">下班時間：{{ clockOutTime }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import attendanceAPI from './../apis/attendances';
import { Toast, storeCheck, isHoliday } from './../utils/helpers';

dayjs.extend(utc, timezone);

export default {
  setup() {
    const store = useStore();

    const clockedInValue = localStorage.getItem('clockedIn');
    const clockInTimeValue = localStorage.getItem('clockInTime');
    const clockOutTimeValue = localStorage.getItem('clockOutTime');
    const dayChangeTimeValue = localStorage.getItem('dayChangeTime');
    const dateValue = localStorage.getItem('date');

    const clockedInCheck = storeCheck(clockedInValue, store.state.clockedIn);

    const isLoading = ref(true);
    const isProcessing = ref(false);
    const currentTime = ref('');
    const date = ref(dateValue);
    const clockInTime = ref(clockInTimeValue);
    const clockOutTime = ref(clockOutTimeValue);
    const dayChangeTime = ref(dayChangeTimeValue);

    // check if the user is clocked in
    const clockedIn = ref(clockedInCheck);

    date.value = dayjs.utc().local().format('YYYY-MM-DD 00:00:00');
    store.commit('setDate', date.value);
    localStorage.setItem('date', date.value);

    async function clockIn() {
      isProcessing.value = true;

      clockInTime.value = dayjs.utc().local().format('YYYY-MM-DD HH:mm:ss');

      dayChangeTime.value = dayjs(date.value)
        .add(1, 'day')
        .format('YYYY-MM-DD 05:00:00');

      const hour = dayjs().hour();

      // When the clock in time is between 00:00 ~ 05:00, the date value would be considered as the day before
      if (hour >= 0 && hour < 5) {
        date.value = dayjs
          .utc()
          .local()
          .subtract(1, 'day')
          .format('YYYY-MM-DD 00:00:00');
      } else {
        // date format in database is YYYY-MM-DD 00:00:00
        date.value = dayjs.utc().local().format('YYYY-MM-DD 00:00:00');
      }

      try {
        const { data } = await attendanceAPI.create({
          userId: store.getters.userId,
          date: date.value,
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
        store.commit('setDate', date.value);
        localStorage.setItem('date', date.value);
        store.commit('setClockInTime', clockInTime.value);
        localStorage.setItem('clockInTime', clockInTime.value);
        localStorage.setItem('dayChangeTime', dayChangeTime.value);

        // Enable the clock-out button, disable the clock-in button
        clockedIn.value = true;
        store.commit('setClockedIn', true);
        localStorage.setItem('clockedIn', true);

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
        clockInTime.value = '';
        isProcessing.value = false;
      }
    }

    async function clockOut() {
      isProcessing.value = true;

      clockOutTime.value = dayjs.utc().local().format('YYYY-MM-DD HH:mm:ss');

      const hour = dayjs().hour();

      // When the clock out time is between 00:00 ~ 05:00, the date value would be considered as the day before
      if (hour >= 0 && hour < 5) {
        date.value = dayjs
          .utc()
          .local()
          .subtract(1, 'day')
          .format('YYYY-MM-DD 00:00:00');
      } else {
        date.value = dayjs.utc().local().format('YYYY-MM-DD 00:00:00');
      }

      // Set the clockOutTime ref to the current time, if it is later than the current value
      if (!clockOutTime.value || dayjs.utc().local() > clockOutTime.value) {
        clockOutTime.value = dayjs.utc().local().format('YYYY-MM-DD HH:mm:ss');
        store.commit('setClockOutTime', clockOutTime.value);
        localStorage.setItem('clockOutTime', clockOutTime.value);
      }

      try {
        const { data } = await attendanceAPI.update({
          date: date.value,
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
        store.commit('setDate', date.value);
        localStorage.setItem('date', date.value);
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
    }

    // Update currentTime ref every second
    setInterval(() => {
      currentTime.value = dayjs.utc().local().format('YYYY-MM-DD HH:mm:ss');

      isLoading.value = false;

      if (dayjs(currentTime.value).isAfter(dayChangeTime.value)) {
        clockOutTime.value = '';
        clockedIn.value = false;
        store.commit('setClockedIn', false);

        // Clean up localStorage after dayChangeTime
        localStorage.removeItem('clockedIn');
        localStorage.removeItem('clockInTime');
        localStorage.removeItem('clockOutTime');
        localStorage.removeItem('dayChangeTime');
        localStorage.removeItem('date');
      }
    }, 1000);

    return {
      currentTime,
      clockInTimeValue,
      clockOutTimeValue,
      clockInTime,
      clockOutTime,
      dayChangeTime,
      clockedIn,
      clockIn,
      clockOut,
      isHoliday,
      isLoading,
      isProcessing,
    };
  },
};
</script>

<style scoped>
.btn-circle {
  width: 140px;
  height: 140px;
  border-radius: 70px;
  font-size: 1.5em;
  line-height: 1.33;
}
.loading {
  color: #fff;
}
.container {
  width: 80vw;
}
</style>
