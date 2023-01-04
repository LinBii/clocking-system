<template>
  <Navbar />
  <main role="main" class="mt-5 bg-white">
    <router-view />
  </main>
</template>

<script>
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/NavbarComponent.vue';

export default {
  components: { Navbar },
};
</script>

<style>
#app {
  font-family: Arial, 'Noto Sans CJK TC', 'Microsoft JhengHei', Helvetica,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
