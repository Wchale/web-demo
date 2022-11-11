<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import router from "@/router";

export default {
  name: 'App',
  created() {
    // router.replace('/manager')
  },
}
</script>

<style lang="scss">
  #app {
    font-family: "Microsoft YaHei", "微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
  }
</style>
