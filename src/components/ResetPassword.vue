<template>
  <div class='reset-password'>
    <el-form ref='form' :model='form' label-width='80px' :rules="rules">
      <el-form-item label='旧密码' prop="oldPassword">
        <el-input type='password' v-model='form.oldPassword'></el-input>
      </el-form-item>
      <el-form-item label='新密码' prop="newPassword">
        <el-input type='password' v-model='form.newPassword'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" :loading="submitting" @click='submit'>提交修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type='text/ecmascript-6'>
  export default {
    name: 'reset-password',
    beforeCreate () {
      console.log('reset before create');
    },
    data () {
      // 数据
      let checkOldPassword = (rule, value, callback) => {
        // 检查密码是否合格
        callback();
      };

      let checkNewPassword = (rule, value, callback) => {
        // 检查二次输入密码合格
        if (value === this.form.oldPassword) {
          callback(new Error('不能与旧密码相同'));
        }
        callback();
      };
      return {
        submitting: false,
        form: {
          oldPassword: '',
          newPassword: ''
        },
        rules: {
          oldPassword: [
            {required: true, message: '旧密码不可为空'},
            {validator: checkOldPassword, trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '新密码不可为空'},
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
            console.log(valid);
            this.submitting = true;
            this.$store.dispatch('RESET_PASSWORD', {old: this.form.oldPassword, n: this.form.newPassword})
              .then(() => {
                // 修改成功
                this.$message.success('Success');
              })
              .catch(() => {
                // 修改失败
                this.$message.error('Error');
              })
              .finally(() => {
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
