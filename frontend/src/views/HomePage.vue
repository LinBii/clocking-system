<template>
  <div>
    <h1>Welcome to the Clock-In App</h1>
    <p>Current time: {{ currentTime }}</p>
    <button @click="clockIn">Clock In</button>
    <button @click="clockOut">Clock Out</button>
    {{ clockInTime }}
    {{ clockOutTime }}
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  setup() {
    const currentTime = ref(new Date());
    const clockInTime = ref(null);
    const clockOutTime = ref(null);

    const elapsedTime = computed(() => {
      if (clockInTime.value && clockOutTime.value) {
        return clockOutTime.value - clockInTime.value;
      }
      return null;
    });

    function clockIn() {
      clockInTime.value = new Date();
    }

    function clockOut() {
      clockOutTime.value = new Date();
    }

    setInterval(() => {
      currentTime.value = new Date();
    }, 1000);

    return {
      currentTime,
      clockInTime,
      clockOutTime,
      elapsedTime,
      clockIn,
      clockOut,
    };
  },
};
</script>
