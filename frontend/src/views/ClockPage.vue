<template>
  <div class="container py-5">
    <h1>歡迎來到PUNCHIN！</h1>
    <p>現在時間： {{ currentTime }}</p>
    <button :disabled="clockedIn" @click="clockIn">打卡上班</button>
    <button :disabled="!clockedIn" @click="clockOut">打卡下班</button>
    {{ clockInTime }}
    {{ clockOutTime }}
    {{ elapsedTime }}
    <p v-if="!clockedIn">您今天還沒打卡！</p>
    <p v-if="clockedIn && absent">您今天的出勤狀況為缺勤！</p>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import attendanceAPI from './../apis/attendances';
import { Toast } from './../utils/helpers';

export default {
  setup() {
    const store = useStore();

    const currentTime = ref(new Date());
    const date = ref('');
    const clockInTime = ref('');
    const clockOutTime = ref('');
    const dayChangeTime = ref('');

    // check if the user is clocked in
    const clockedIn = ref(false);

    const elapsedTime = computed(() => {
      if (clockInTime.value && clockOutTime.value) {
        return clockOutTime.value - clockInTime.value;
      }
      return null;
    });

    const absent = computed(() => {
      return elapsedTime.value < 28800000;
    });

    async function clockIn() {
      clockInTime.value = new Date();

      // date format in database is YYYY-MM-DD 00:00:00
      date.value = dayjs().format('YYYY-MM-DD 00:00:00');

      // Check if it is past the day change time (GMT+8 05:00)
      dayChangeTime.value = new Date(
        currentTime.value.getFullYear(),
        currentTime.value.getMonth(),
        currentTime.value.getDate() + 1,
        5,
        0,
        0
      );

      // able the clock-out button, disable the clock-in button
      clockedIn.value = true;

      try {
        const { data } = await attendanceAPI.create({
          date: date.value,
          clockIn: clockInTime.value,
        });
        if (data.status === 'error') {
          throw new Error(data.message);
        }
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: error.message,
        });
      }
    }

    async function clockOut() {
      clockOutTime.value = new Date();

      date.value = dayjs().format('YYYY-MM-DD 00:00:00');

      // Set the clockOutTime ref to the current time, if it is later than the current value
      if (!clockOutTime.value || new Date() > clockOutTime.value) {
        clockOutTime.value = new Date();

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
        }
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: error.message,
        });
      }
    }

    // Update currentTime ref every second
    setInterval(() => {
      currentTime.value = new Date();

      if (currentTime.value > dayChangeTime.value) {
        if (absent.value === true && clockedIn.value === true) {
          console.log('Notify the admin that this user is absent');
        }

        clockOutTime.value = '';

        clockedIn.value = false;
      }
    }, 1000);

    return {
      currentTime,
      clockInTime,
      clockOutTime,
      elapsedTime,
      clockedIn,
      clockIn,
      clockOut,
      absent,
    };
  },
};
</script>
