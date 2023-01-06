<template>
  <div class="container py-5">
    <!-- AdminNav -->
    <AdminNav />

    <!-- AdminAttendancesTable -->
    <AdminAttendancesTable />
  </div>
</template>

<script>
import AdminNav from './../components/AdminNav.vue';
import AdminAttendancesTable from './../components/AdminAttendancesTable.vue';

export default {
  components: {
    AdminNav,
    AdminAttendancesTable,
  },
};
</script>

<style scoped>
.container {
  width: 80vh;
}
</style>
