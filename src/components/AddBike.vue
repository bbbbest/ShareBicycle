<template>
  <div class="container">
    <div class="form-title"><span>添加新车辆</span></div>
    <el-form label-position="right" label-width="180px">
      <el-form-item label="贡献人">
        <el-radio-group v-model="form.option"
                        @change="changeExist">
          <el-radio-button :label="0">已注册</el-radio-button>
          <el-radio-button :label="1">未注册</el-radio-button>
          <el-radio-button :label="2">公司内购</el-radio-button>
        </el-radio-group>
        <span class="m-l-10px extra-msg" v-if="form.option == 1">将自动注册一个简单账户</span>
      </el-form-item>
    </el-form>
    <el-form ref="form" :model="form" label-position="right" label-width="180px">
      <!--已注册-->
      <div v-if="form.option == 0">
        <el-form-item
          :rules="[
          {required: true, message: '不可为空', trigger: 'blur'}
          ]"
          prop="username"
          label="用户名">
          <el-autocomplete
            v-model="form.username"
            :trigger-on-focus="false"
            :fetch-suggestions="dynamicQuery"
            placeholder="请输入用户名"
            icon="search"
          ></el-autocomplete>
          <el-popover
            ref="popover"
            placement="right"
            trigger="click">
            <div style="line-height: 150%">
              <span style="color: gray">个人信息简介</span>
              <p>姓名：{{form.selectedUser.name}}</p>
              <p>电话：{{form.selectedUser.phone}}</p>
              <p>卡编号：{{form.selectedUser.cardNumber}}</p>
            </div>
          </el-popover>
          <el-button v-if="form.selected" type="text" v-popover:popover class="m-l-10px">查看个人信息</el-button>
        </el-form-item>
      </div>
      <!--未注册-->
      <div v-else-if="form.option == 1">
        <el-form-item
          prop="name"
          label="姓名"
          :rules="[{required: true, message: '姓名不可为空', trigger: 'blur'}]">
          <el-input class="w-40" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item
          prop="phone"
          label="电话"
          :rules="[{required: true, message: '电话也不可为空', trigger: 'blur'}]">
          <el-input class="w-40" v-model="form.phone"></el-input>
          <span class="m-l-10px extra-msg">将留作用户名</span>
        </el-form-item>
      </div>
      <!--车辆信息-->
      <!--1.用户贡献-->
      <div v-if="form.option !== 2">
        <el-form-item
          label="照片">
          <el-upload
            ref="upload"
            :action="form.uploadUrl"
            accept="image/*"
            :data="form.extraUploadData"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="form.fileList"
            :before-upload="beforeUpload"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2Mb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="锁编号" prop="lockId"
                      :rules="[{required: true, message: '锁编号不可为空', trigger: 'blur'}]">
          <el-input class="w-40" v-model="form.lockId"></el-input>
        </el-form-item>
      </div>
      <!--1. end-->
      <!--2.公司内购-->
      <div v-else>
        <el-form-item v-if="form.bikes.length > 0"
                      style="height: 30px; line-height: 16px !important; margin-top: -10px;margin-bottom: 10px">
          <span class="m-l-10px extra-msg">请输入锁编号</span>
        </el-form-item>
        <el-form-item v-for="(bike, index) in form.bikes"
                      :label="'车辆 ' + (index + 1)" :key="bike.key" :prop="'bikes.' + index +'.lockId'"
                      :rules="{required: true, message: '锁编号不可为空', trigger: 'blur'}">
          <el-input class="w-40" v-model="bike.lockId"></el-input>
          <el-button type="text" @click.prevent="removeBike(bike)">删除</el-button>
        </el-form-item>
      </div>
      <!--2. end-->
      <el-form-item>
        <el-button :loading="submitting" class="submit" @click="submit">{{submitting? '请稍侯...' : '提交'}}</el-button>
        <el-button v-if="form.option === 2" type="plain" @click="addBike">新增一辆</el-button>
        <el-button type="plain" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
  import fetcher from '../api/fetcher';

  export default {
    name: 'add-bike',
    data () {
      return {
        timeout: null,
        // <提交按钮> 的状态
        submitting: false,
        form: {
          // 顶部选项
          option: 0,
          // 上传图片
          fileList: [],
          uploadUrl: 'http://whomi.cn',
          extraUploadData: {},
          // 已注册用户校验
          selected: false,
          username: '',
          selectedUser: {
            name: '杨洁',
            phone: '15555555555',
            cardNumber: '123456'
          },
          // 未注册
          name: '',
          phone: '',
          lockId: '',
          // 公司内部采购的车辆
          bikes: [
            {
              key: Date.now(),
              lockId: ''
            }
          ]
        }
      };
    },
    methods: {
      // 上传图片
      submitUpload () {
        this.$refs.upload.submit();
      },
      handleRemove (file, fileList) {
        // 移除照片
      },
      handlePreview (file) {
        // 预览照片
      },
      beforeUpload (file) {
        // 上传前检测
        const isJPG = file.type === 'image/jpeg' || 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传照片只能是 JPG或PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传照片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      changeExist (value) {
        // 切换顶部选项卡时重置表单数据
        this.resetForm();
      },
      addBike () {
        this.form.bikes.push({
          lockId: '',
          key: Date.now()
        });
      },
      removeBike (bike) {
        if (this.form.bikes.length === 1) {
          this.$message.warning('最少需要一辆');
          return;
        }
        let index = this.form.bikes.indexOf(bike);
        if (index !== -1) {
          this.form.bikes.splice(index, 1);
        }
      },
      // 提交表单
      submit () {
        this.submitting = true;
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // 符合规则，准许提交
            fetcher.bikes.add(this.parseData())
              .then((response) => {
                if (response.data.status === 200) {
                  this.$message.success('成功！');
                } else {
                  this.$message.error('失败！');
                }
              })
              .catch(() => {
                this.$message.error('失败！');
              });
          } else {
            return false;
          }
        });
        this.submitting = false;
      },
      dynamicQuery (queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          fetcher.users.dynamicFetch({
            type: 'username',
            prefix: queryString
          }).then((response) => {
            let val = response.data;
            cb(val.data.values.map((val) => {
              return {value: val.value.toString()};
            }));
          }).catch((error) => {
            console.log(error);
          });
        }, 1000);
      },
      resetForm () {
        this.$refs['form'].resetFields();
      },
      parseData () {
        if (this.form.option === 0) {
          // 已注册
          return {
            role: 1,
            value: {
              username: this.form.username,
              lockId: this.form.lockId
            }
          };
        } else if (this.form.option === 1) {
          // 未注册
          return {
            role: -1,
            value: {
              name: this.form.name,
              phone: this.form.phone,
              lockId: this.form.lockId
            }
          };
        } else {
          // 公司内购
          let values = [];
          for (let obj of this.form.bikes) {
            values.push({lockId: obj.lockId});
          }
          return {
            role: 666,
            values: values
          };
        }
      }
    },
    filters: {}
  };
</script>
<style scoped>
  @import "../assets/global/css/global.css";

  .el-form {
    width: 65%;
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
