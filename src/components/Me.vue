<template>
  <div class="me">
    <el-card>
      <div slot="header" class="header">
        <span style="line-height: 36px;">个人信息</span>
      </div>
      <div class="content">
        <el-row :span="24">
          <el-col :span="10">工号：</el-col>
          <el-col :span="14">{{contents['adminId']}}</el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="10">账号：</el-col>
          <el-col :span="14">{{contents['username']}}</el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="10">姓名：</el-col>
          <el-col :span="14">{{contents['name']}}</el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="10">权限：</el-col>
          <el-col :span="14">{{contents['privilegeId']}}&nbsp;&nbsp;&nbsp;<router-link style="text-decoration: none; color: #ff6d6d" to="/privileges/all">(查看权限表)</router-link></el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'me',
    props: {
      // 参数
    },
    components: {
      // 组件
    },
    data () {
      // 数据
      return {
      };
    },
    methods: {
      // 方法
    },
    computed: {
      // 计算属性
      contents () {
        return this.$store.getters.adminInfo;
      }
    },
    filters: {
      // 过滤器
    },
    watch: {
      // 监听器
    }
  };
</script>
<style scoped>
  .me {
    width: 80%;
    margin: 80px auto;
  }
  .el-row{
    padding-left: 20px;
    padding-top: 20px;
  }
  .el-row :first-child{
    text-align: right;
  }
</style>
