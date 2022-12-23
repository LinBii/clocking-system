<template>
  <div>
    <h1>歡迎來到PUNCHIN！</h1>
    <p>現在時間： {{ currentTime }}</p>
    <button :disabled="clockedIn" @click="clockIn">打卡上班</button>
    <button :disabled="!clockedIn" @click="clockOut">打卡下班</button>
    {{ clockInTime }}
    {{ clockOutTime }}
    {{ elapsedTime }}
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  setup() {
    const currentTime = ref(new Date());
    const clockInTime = ref(null);
    const clockOutTime = ref(null);

    // check if the user is clocked in
    const clockedIn = ref(false);

    const elapsedTime = computed(() => {
      if (clockInTime.value && clockOutTime.value) {
        return clockOutTime.value - clockInTime.value;
      }
      return null;
    });

    function clockIn() {
      clockInTime.value = new Date();

      // able the clock-out button, disable the clock-in button
      clockedIn.value = true;
    }

    function clockOut() {
      clockOutTime.value = new Date();

      // Set the clockOutTime ref to the current time, if it is later than the current value
      if (!clockOutTime.value || new Date() > clockOutTime.value) {
        clockOutTime.value = new Date();

        clockedIn.value = true;
      }
    }

    // Update currentTime ref every second
    setInterval(() => {
      currentTime.value = new Date();

      // Check if it is past the day change time (GMT+8 05:00)
      const dayChangeTime = new Date(
        currentTime.value.getFullYear(),
        currentTime.value.getMonth(),
        currentTime.value.getDate() + 1,
        5,
        0,
        0
      );
      if (currentTime.value > dayChangeTime) {
        clockOutTime.value = null;

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
    };
  },
};
</script>
