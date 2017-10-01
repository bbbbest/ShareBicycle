<template>
  <div class="login">
    <div class="form center-block">
      <p class="form-title text-center">{{system.name}}</p>
      <p class="form-version text-right">V{{system.version}}</p>
      <el-input v-model.trim="username" placeholder="请输入用户名"></el-input>
      <el-input type="password" v-model.trim="password" placeholder="请输入密码"></el-input>
      <el-button class="login-button" @click="handleLogin">登&nbsp;&nbsp;录</el-button>
    </div>
  </div>
</template>

<script>
  import * as types from '../store/types';
  import util from '../store/utils';

  export default {
    name: 'login',
    data () {
      return {
        system: {
          name: '郑在行后台系统',
          version: '1.0.0'
        },
        username: '',
        password: ''
      };
    },
    methods: {
      handleLogin () {
        if (this.username !== '' && this.password !== '') {
          this.$store.dispatch(types.DO_LOGIN, {username: this.username, password: this.password})
            .then(() => {
              util.greet(this.$store.getters.name);
              this.$message.success(`您好，管理员：${this.$store.getters.name}`);
              this.$router.push('/bikes');
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: 'Error!',
                duration: 2000
              });
            });
        } else {
          this.$message.error('不可为空');
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../assets/global/css/global.css';

  .login {
    height: 100%;
    background-color: #EFF2F7;
    padding-top: 100px;
  }

  .form {
    width: 30%;
    min-width: 20%;
    line-height: 60px;
  }

  .form-title {
    font-size: 2.5em;
    font-family: "Microsoft JhengHei", serif;
    font-weight: bold;
  }

  .form-version {
    font-style: italic;
    font-family: Roboto, sans-serif;
    color: #8c939d;
  }

  .login-button {
    width: 100%;
    background-color: #212121;
    color: white;
    font-size: 1.2em;
    transition: background-color 0.5s;
  }

  .login-button:hover, .login-button:focus {
    background-color: #304040;
  }
</style>
