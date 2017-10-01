<template>
  <i :class="[ok? 'el-icon-check' : 'el-icon-close']"></i>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'icon',
    props: {
      // 参数
      ok: {
        type: Boolean,
        default: false
      }
    }
  };
</script>
<style scoped>
  .el-icon-close {
    color: red;
  }

  .el-icon-check {
    color: green;
  }
</style>
