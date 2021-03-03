<template>
  <div>
    <div class="header">
      <a @click.prevent="hashChange('app1')">App1</a>
      <a @click.prevent="hashChange('app2')">App2</a>
    </div>
    <div id="subApp"></div>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    hashChange(value) {
      window.history.pushState(null, null, value);
    },
  },
};
</script>

<style>
</style>
