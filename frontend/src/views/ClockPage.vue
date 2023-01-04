<template>
  <div class="container py-5">
    <div v-if="isHoliday">今天放假，好好休息！</div>
    <div v-if="!isHoliday">
      <h1>歡迎來到PUNCHIN！</h1>
      <p>現在時間： {{ currentTime }}</p>
      <button v-if="!clockedIn" @click="clockIn">打卡上班</button>
      <button v-else @click="clockOut">打卡下班</button>
      {{ clockInTimeValue }}
      {{ clockOutTimeValue }}
      {{ dayChangeTime }}

      <p v-if="!clockedIn">您今天還沒打卡！</p>
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

    const currentTime = ref('');
    const date = ref(dateValue);
    const clockInTime = ref(clockInTimeValue);
    const clockOutTime = ref(clockOutTimeValue);
    const dayChangeTime = ref(dayChangeTimeValue);

    // Check if the absent message is logged
    let messageLogged = false;

    // check if the user is clocked in
    const clockedIn = ref(clockedInCheck);

    date.value = dayjs.utc().local().format('YYYY-MM-DD 00:00:00');
    store.commit('setDate', date.value);
    localStorage.setItem('date', date.value);

    async function clockIn() {
      clockInTime.value = dayjs.utc().local().format('YYYY-MM-DD HH:mm:ss');

      // date format in database is YYYY-MM-DD 00:00:00
      date.value = dayjs.utc().local().format('YYYY-MM-DD 00:00:00');

      dayChangeTime.value = dayjs(date.value)
        .add(1, 'day')
        .format('YYYY-MM-DD 05:00:00');

      // able the clock-out button, disable the clock-in button
      clockedIn.value = true;
      store.commit('setClockedIn', true);
      localStorage.setItem('clockedIn', true);

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
        console.log(data);
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: error.message,
        });
      }
    }

    async function clockOut() {
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

        clockedIn.value = true;
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
        store.commit('setClockedIn', true);
        localStorage.setItem('clockedIn', true);
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: error.message,
        });
      }
    }

    // Update currentTime ref every second
    setInterval(() => {
      currentTime.value = dayjs.utc().local().format('YYYY-MM-DD HH:mm:ss');

      if (
        dayjs(currentTime.value).isAfter(dayChangeTime.value) &&
        !messageLogged
      ) {
        // TODO: deal with absent
        // if (absent.value === true && clockedIn.value === true) {
        //   console.log('Notify the admin that this user is absent');
        // }

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
      dayChangeTime,
      clockedIn,
      clockIn,
      clockOut,
      isHoliday,
    };
  },
};
</script>
