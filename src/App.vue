<template>
  <div id="app">
    <side-menu @menu-clicked="navigate"></side-menu>
    <router-view></router-view>
  </div>
</template>

<script>
import SideMenu from './components/SideMenu.vue';

export default {
  components: {
    SideMenu
  },
  methods: {
    navigate(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style>
body {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  width: 100%;
  height: 100vh;
}

.side-menu {
  width: 20%;
  border-right: 1px solid #ccc;
  padding: 10px;
}

.router-view {
  width: 80%;
  padding: 10px;
}
</style>
