<template>
  <table class="table">
    <thead class="thead-dark">
      <tr>
        <th>ID</th>
        <th>名字</th>
        <th>日期</th>
        <th>上班時間</th>
        <th>下班時間</th>
        <th>缺勤</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="attendance in attendances" :key="attendance.id">
        <th>
          {{ attendance.id }}
        </th>
        <td>
          {{ attendance.User.name }}
        </td>
        <td>
          {{ attendance.date }}
        </td>
        <td>
          {{ attendance.clockIn }}
        </td>
        <td>
          {{ attendance.clockOut }}
        </td>
        <td>
          {{ attendance.absent ? '是' : '否' }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import adminAPI from './../apis/admin';
import { Toast } from './../utils/helpers';

dayjs.extend(utc, timezone);

export default {
  setup() {
    const attendances = ref([]);

    async function fetchAttendances() {
      try {
        const { data } = await adminAPI.attendances.get();

        if (data.status === 'error') {
          throw new Error(data.message);
        }

        for (let i = 0; i < data.length; i++) {
          data[i].clockIn = dayjs(data[i].clockIn).format(
            'YYYY-MM-DD HH:mm:ss'
          );
          data[i].clockOut = dayjs(data[i].clockOut).format(
            'YYYY-MM-DD HH:mm:ss'
          );
          if (data[i].clockOut === 'Invalid Date') {
            data[i].clockOut = '無';
          }
        }

        attendances.value = data;
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: '無法取得打卡清單！',
        });
      }
    }

    function formattedClockIn(clockIn) {
      return dayjs.tz(clockIn, 'Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
    }

    function formattedClockOut(clockOut) {
      return dayjs.tz(clockOut, 'Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
    }

    fetchAttendances();

    return {
      attendances,
      formattedClockIn,
      formattedClockOut,
    };
  },
};
</script>