<template>
  <div>
    <div class="header">
      <a @click.prevent="hashChange('app1')">
        <button>app1</button>
      </a>
      <a @click.prevent="hashChange('app2')">
        <button>app2</button>
      </a>
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

<style >
.header {
  text-align: center;
}
.header a {
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-right: 40px;
}
</style>
