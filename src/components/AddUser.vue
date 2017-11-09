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
      <div v-if="form.needCard">
        <el-form-item label="学校" prop="school">
          <el-select v-model="form.school" placeholder="请选择" @change="loadSchools" disabled="disabled">
            <el-option v-for="school in schools" :label="school.name" :value="school.id" :key="school.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="院系" prop="department">
          <el-select v-model="form.department" placeholder="请选择" @change="loadMajors()">
            <el-option v-for="dept in departments" :label="dept.name" :value="dept.id" :key="dept.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-select v-model="form.major" placeholder="请选择">
            <el-option v-for="major in majors" :label="major.name" :value="major.id" :key="major.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学号" prop="stuId">
          <!--自动搜索完成-->
          <el-input class="w-60" v-model="form.stuId">
          </el-input>
        </el-form-item>
        <el-form-item label="卡号" prop="cardNumber">
          <!--自动搜索完成-->
          <el-input class="w-60" v-model="form.cardNumber">
          </el-input>
        </el-form-item>
        <el-form-item label="账户金额" prop="balance">
          <el-input class="w-60" v-model="form.balance"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="电话" prop="phone">
        <el-input class="w-60" :maxlength="11" v-model.number="form.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" :loading="submitting" @click="submit">提&nbsp;交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
  import fetcher from '../api/fetcher';
  import utils from '../store/utils';

  export default {
    name: 'add-user',
    data () {
      // ajax 查询数据校验
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
      let checkPhoneNumber = (rule, value, callback) => {
        if (value < 10000000000) {
          callback(new Error('电话长度不能小于 11 位'));
        } else if (!utils.isPhone(String(value))) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.$axios.get('/phones', {
              params: {
                p: value
              }
            }).then((response) => {
              callback();
            }).catch(() => {
              callback(new Error('该手机号已被使用'));
            });
          }, 500);
        }
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
        schools: [
          {
            id: '1',
            name: '郑州大学'
          }
        ],
        departments: [],
        majors: [],
        form: {
          username: '',
          password: '',
          password2: '',
          name: '',
          school: '1',
          department: '',
          major: '',
          cardNumber: '',
          stuId: '',
          phone: '',
          balance: '',
          needCard: true
        },
        rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}],
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
            {required: true, message: '电话也不可为空'},
            {type: 'number', message: '电话必须为数字值'},
            {validator: checkPhoneNumber, trigger: 'change'}],
          balance: [
            {required: true, message: '账户金额不能为空'},
            {validator: checkNumber, trigger: 'change'}]
        }
      };
    },
    created () {
      this.loadDepartments();
    },
    methods: {
      loadSchools () {
        console.log(this.form.school);
      },
      loadDepartments () {
        fetcher.deptmajor.fetchDepartments()
          .then((response) => {
            if (response.data.status === 200) {
              this.departments = response.data.data.depts;
            }
          });
      },
      loadMajors () {
        this.form.major = '';
        fetcher.deptmajor.fetchMajors(this.form.department)
          .then((response) => {
            if (response.data.status === 200) {
              this.majors = response.data.data.majors;
            }
          });
      },
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
          school: f.school,
          department: f.department,
          major: f.major,
          stuId: f.stuId,
          cardNumber: f.cardNumber,
          balance: f.balance
        };
      },
      queryUsername () {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          fetcher.users.query({type: 'username', value: this.form.username})
            .then((response) => {
              if (response.data.status === 200) {
                this.haveUsername = response.data.data.values.length > 0;
              }
            });
        }, 1000);
      }
    },
    watch: {
      'form.major' (val) {
        console.log(val);
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
