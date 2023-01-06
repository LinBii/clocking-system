<template>
  <table class="table table-hover table-striped text-center">
    <thead class="table-light">
      <tr>
        <th scope="col">ID</th>
        <th scope="col">名字</th>
        <th scope="col">日期</th>
        <th scope="col">上班時間</th>
        <th scope="col">下班時間</th>
        <th scope="col">缺勤</th>
        <th scope="col">出缺勤調整</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="attendance in attendances" :key="attendance.id">
        <th scope="row">
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
        <td>
          <button
            v-if="attendance.absent"
            class="btn btn-danger btn-sm"
            @click="putAbsence(attendance)"
          >
            清除缺勤
          </button>
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

    async function putAbsence(attendance) {
      try {
        const { data } = await adminAPI.attendances.put(attendance.id);
        if (data.status === 'error') {
          throw new Error(data.message);
        } else if (data.status === 'success') {
          Toast.fire({
            icon: 'success',
            title: data.message,
          });
        }
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: '無法更新出缺勤狀態！',
        });
      }
    }

    fetchAttendances();

    return {
      attendances,
      formattedClockIn,
      formattedClockOut,
      putAbsence,
    };
  },
};
</script>
