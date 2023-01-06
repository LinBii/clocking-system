<template>
  <div class="text-center">
    <h2>GPS 打卡</h2>
    <div v-if="isLoading">允許取得位置後，才能進行GPS打卡！</div>
    <div v-else>
      <button
        v-if="!clockedIn"
        :disabled="!withinRange || isHoliday"
        @click="clockIn"
        class="mt-3 btn btn-outline-danger btn-circle"
      >
        <p class="mb-0">打卡上班</p>
      </button>
      <button
        v-else-if="clockedIn"
        :disabled="!withinRange || isHoliday"
        @click="clockOut"
        class="mt-3 btn btn-outline-success btn-circle"
      >
        <p class="mb-0">打卡下班</p>
      </button>
      <p class="mt-3">距離公司{{ distance }}公尺</p>
      <p v-if="!withinRange">超出範圍，無法打卡！</p>
    </div>
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import attendanceAPI from './../apis/attendances';
import { Toast, storeCheck, isHoliday } from './../utils/helpers';

dayjs.extend(utc, timezone);

export default {
  setup() {
    const mapContainer = ref('map');
    const currentPosition = ref({ lat: '', long: '' });
    const distance = ref('?');
    const withinRange = ref(false);
    const isLoading = ref(true);

    onMounted(async () => {
      await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((position) => {
          currentPosition.value.lat = position.coords.latitude;
          currentPosition.value.long = position.coords.longitude;
          resolve();
        });
      });
      const companyPosition = {
        lat: 25.039754,
        long: 121.565205,
      };
      const map = L.map(mapContainer.value, {
        center: [currentPosition.value.lat, currentPosition.value.long],
        zoom: 16,
      });

      // show map
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const redIcon = new L.Icon({
        iconUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const blueIcon = new L.Icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // mark company position (red)
      L.marker([companyPosition.lat, companyPosition.long], {
        icon: redIcon,
      }).addTo(map);

      // mark current position (blue)
      L.marker([currentPosition.value.lat, currentPosition.value.long], {
        icon: blueIcon,
      }).addTo(map);

      let latlong1 = L.latLng(
        currentPosition.value.lat,
        currentPosition.value.long
      );
      let latlong2 = L.latLng(companyPosition.lat, companyPosition.long);

      distance.value = latlong1.distanceTo(latlong2).toFixed();

      withinRange.value = distance.value < 400;

      isLoading.value = false;
      return {
        currentPosition,
        distance,
        isLoading,
      };
    });

    const store = useStore();

    const clockedInValue = localStorage.getItem('clockedIn');
    const clockInTimeValue = localStorage.getItem('clockInTime');
    const clockOutTimeValue = localStorage.getItem('clockOutTime');
    const dayChangeTimeValue = localStorage.getItem('dayChangeTime');
    const dateValue = localStorage.getItem('date');

    const clockedInCheck = storeCheck(clockedInValue, store.state.clockedIn);

    const date = ref(dateValue);
    const clockInTime = ref(clockInTimeValue);
    const clockOutTime = ref(clockOutTimeValue);
    const dayChangeTime = ref(dayChangeTimeValue);

    // check if the user is clocked in
    const clockedIn = ref(clockedInCheck);

    // update date when entering the page
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

      const hour = dayjs().hour();

      // When the clock in time is between 00:00 ~ 05:00, the date value would be considered as the day before
      if (hour >= 0 && hour < 5) {
        date.value = dayjs
          .utc()
          .local()
          .subtract(1, 'day')
          .format('YYYY-MM-DD 00:00:00');
      } else {
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
        // update date and clockInTime only after success
        store.commit('setDate', date.value);
        localStorage.setItem('date', date.value);
        store.commit('setClockInTime', clockInTime.value);
        localStorage.setItem('clockInTime', clockInTime.value);
        localStorage.setItem('dayChangeTime', dayChangeTime.value);

        // Enable the clock-out button, disable the clock-in button
        clockedIn.value = true;
        store.commit('setClockedIn', true);
        localStorage.setItem('clockedIn', true);
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

    return {
      distance,
      withinRange,
      isLoading,
      isHoliday,
      clockIn,
      clockOut,
      clockedIn,
    };
  },
};
</script>

<style scoped>
#map {
  height: 50vh;
  width: 50vh;
  margin: auto;
}
.btn-circle {
  width: 140px;
  height: 140px;
  border-radius: 70px;
  font-size: 5vh;
  line-height: 1.33;
}
</style>
