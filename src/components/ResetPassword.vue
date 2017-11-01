<template>
  <div class='reset-password'>
    <el-form ref='form' :model='form' label-width='140px' :rules="rules">
      <el-form-item label='请输入旧密码' prop="old">
        <el-input type='password' v-model='form.old'></el-input>
      </el-form-item>
      <el-form-item label='请输入新密码' prop="first">
        <el-input type='password' v-model='form.first'></el-input>
      </el-form-item>
      <el-form-item label='请再次输入新密码' prop="second">
        <el-input type='password' v-model='form.second'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" :loading="submitting" @click='submit'>提交修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type='text/ecmascript-6'>
  import * as types from '../store/types';

  export default {
    name: 'reset-password',
    data () {
      let checkNewPassword = (rule, value, callback) => {
        // 检查二次输入密码合格
        if (value !== this.form.first) {
          callback(new Error('两次密码不同'));
        }
        callback();
      };
      return {
        submitting: false,
        form: {
          old: '',
          first: '',
          second: ''
        },
        rules: {
          old: [
            {required: true, message: '旧密码不可为空'}
          ],
          first: [
            {required: true, message: '新密码不可为空'}
          ],
          second: [
            {required: true, message: '不可为空'},
            {validator: checkNewPassword, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      // 方法
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let adminId = this.$store.getters.adminId;
            this.submitting = true;
            this.$store.dispatch(types.RESET_PASSWORD, {
              id: adminId,
              old: this.form.old,
              first: this.form.first,
              second: this.form.second
            }).then(() => {
              this.$message.success('修改成功');
              this.$store.dispatch(types.DO_LOGOUT);
              this.$router.push('/');
            }).catch(() => {
              // 修改失败
              this.$message.error('修改失败');
            }).finally(() => {
              this.submitting = false;
            });
          } else {
            return false;
          }
        });
      }
    }
  };
</script>
<style scoped>
  @import "../assets/global/css/global.css";

  .reset-password {
    width: 50%;
    margin: 80px auto;
  }
</style>
