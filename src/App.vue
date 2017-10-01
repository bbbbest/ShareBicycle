<template>
  <div id="app">
    <router-view></router-view>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
  export default {
    name: 'app',
    created () {
      this.$Progress.start();
      // 注册路由跳转时进度条
      this.$router.beforeEach((to, from, next) => {
        if (to.meta.progress !== undefined) {
          let meta = to.meta.progress;
          this.$Progress.parseMeta(meta);
        }
        this.$Progress.start();
        next();
      });
      this.$router.afterEach((to, from) => {
        this.$Progress.finish();
      });
    },
    mounted () {
      this.$Progress.finish();
    }
  };
</script>

<style>
  #app {
    width: 100%;
    height: 100%;
  }
</style>
