<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent } from "vue";
</script>
<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  padding: 10vh 20vw;
}
</style>
