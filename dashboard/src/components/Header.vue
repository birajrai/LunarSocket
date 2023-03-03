<template>
  <div id="container">
    <h1>Dashboard</h1>
    <h2>Information about your instance of Lunar Socket</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header',
});
</script>

<style scoped>
div#container {
  margin: 40px 0 0 60px;
}

h1 {
  font-size: 40px;
  line-height: 47px;
    color: var(--color-light-gray);
}

h2 {
  font-size: 18px;
  line-height: 21px;
  color: var(--color-gray);
  font-weight: normal;
}
</style>
