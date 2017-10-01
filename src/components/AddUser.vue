<template>
  <div class="container">
    <div class="form-title"><span>添加新用户</span></div>
    <el-form label-position="right" ref="form" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input class="w-60" v-model="form.username" autofocus :maxlength="18" :minlength="8"
                  @change="queryUsername"></el-input>
        <label style="margin-left: 20px; font-size: 14px" :style="{color: haveUsername? 'red' : 'green'}">{{form.username
          === ''? '' : haveUsername? '用户名已存在' : ''}}</label>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input class="w-60" v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password2">
        <el-input class="w-60" v-model="form.password2" type="password"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input class="w-60" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.needCard">办理骑行卡</el-checkbox>
      </el-form-item>
      <el-form-item v-if="form.needCard" label="卡号" prop="cardNumber">
        <!--自动搜索完成-->
        <el-input class="w-60" v-model="form.cardNumber">
        </el-input>
      </el-form-item>
      <el-form-item v-if="form.needCard" label="账户金额" prop="balance">
        <el-input class="w-60" v-model="form.balance"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input class="w-60" v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" :loading="submitting" @click="submit">提&nbsp;交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
  import fetcher from '../api/fetcher';

  export default {
    name: 'add-user',
    data () {
      // ajax 查询数据校验
      let checkUsername = (rule, value, callback) => {
        if (value !== '') {
//          callback(new Error(this.form.username));
        }
        callback();
      };
      let checkPass = (rule, value, callback) => {
        if (this.form.password2 !== '') {
          this.$refs.form.validateField('password2');
        }
        callback();
      };
      let checkPass2 = (rule, value, callback) => {
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      let checkCardNumber = (rule, value, callback) => {
        if (value !== '') {
          this.$refs.form.validateField('password2');
        }
        callback();
      };
      let checkPhone = (rule, value, callback) => {
        if (this.form.password2 !== '') {
          this.$refs.form.validateField('password2');
        }
        callback();
      };
      let checkNumber = (rule, value, callback) => {
        if (isNaN(value)) {
          callback(new Error('请输入数字值'));
        }
        callback();
      };
      // 数据
      return {
        haveUsername: null,
        timeout: null,
        submitting: false,
        form: {
          username: '',
          password: '',
          password2: '',
          name: '',
          cardNumber: '',
          phone: '',
          balance: '',
          needCard: true
        },
        rules: {
          username: [
            {required: true, message: '用户名不能为空'},
            {validator: checkUsername, trigger: 'blur'}],
          password: [
            {required: true, message: '密码不能为空'},
            {validator: checkPass, trigger: 'blur'}],
          password2: [
            {required: true, message: '请再次输入密码'},
            {validator: checkPass2, trigger: 'blur'}],
          name: [
            {required: true, message: '姓名不能为空'}],
          cardNumber: [
            {required: true, message: '卡号不能为空'},
            {validator: checkCardNumber, trigger: 'blur'}],
          phone: [
            {required: true, message: '电话不能为空'},
            {validator: checkPhone, trigger: 'blur'}],
          balance: [
            {required: true, message: '账户金额不能为空'},
            {validator: checkNumber, trigger: 'change'}]
        }
      };
    },
    methods: {
      // 方法
      submit () {
        if (this.haveUsername) {
          this.$message.error('请选用可用的用户名');
          return false;
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.submitting = true;
            fetcher.users.add(this.parseData())
              .then((response) => {
                if (response.data.status === 200) {
                  this.$message.success('成功！');
                } else {
                  this.$message.error('失败！');
                }
              })
              .catch(() => {
                this.$message.error('失败！');
              })
              .then(() => {
                this.submitting = false;
              });
          } else {
            return false;
          }
        });
      },
      parseData () {
        let f = this.form;
        return {
          username: f.username,
          password: f.password,
          name: f.name,
          phone: f.phone,
          needCard: f.needCard,
          cardNumber: f.cardNumber,
          balance: f.balance
        };
      },
      queryUsername () {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          fetcher.users.dynamicFetch({
            type: 'exact',
            prefix: this.form.username
          }).then((response) => {
            let val = response.data;
            this.haveUsername = val.data.values.length > 0;
          });
        }, 1000);
      }
    }
  };
</script>
<style scoped>
  @import "../assets/global/css/global.css";

  .el-form {
    width: 55%;
    margin-left: auto;
    margin-right: auto;
  }

  .form-title {
    width: 100%;
    height: 50px;
    line-height: 30px;
    font-size: 1.4em;
    text-align: center;
  }
</style>
