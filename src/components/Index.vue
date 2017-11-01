<template>
  <div class="index">
    <!--顶部导航-->
    <header class="header">
      <div class="brand"><span class="name">{{app.name}}</span><span class="version">V {{app.version}}</span></div>
      <div class="greeting">您好！&nbsp;&nbsp;&nbsp;&nbsp;<router-link to="/me" style="text-decoration: none"><span class="user" style="color: springgreen">{{adminName}}</span>
      </router-link>
      </div>
      <div style="display: inline-block">
        <el-dropdown
          @command="quickMenu" trigger="click"
          style="color: lightgoldenrodyellow;
          font-size: 1em;
          cursor: pointer">
          <span class="el-dropdown-link">
            <el-badge class="item" v-if="feedbackMSG || activityMSG || userMSG" is-dot/>
            快速信息
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="quickMenus[0]">充值
            </el-dropdown-item>
            <el-dropdown-item divided :command="quickMenus[1]">未处理反馈
              <el-badge v-if="feedbackMSG" is-dot/>
            </el-dropdown-item>
            <el-dropdown-item :command="quickMenus[2]">未处理审核
              <el-badge v-if="activityMSG" is-dot/>
            </el-dropdown-item>
            <el-dropdown-item :command="quickMenus[3]">未处理申请
              <el-badge v-if="userMSG" is-dot/>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="exit">
        <el-tooltip placement="bottom"
                    :offset="-10"
                    :enterable="false"
                    content="退出登录">
          <el-button type="text" @click="exit"><i class="ion-android-exit"></i></el-button>
        </el-tooltip>
      </div>
    </header>
    <div class="menu">
      <!--菜单伸展按钮-->
      <div class="collapse-button">
        <el-button type="text" @click="collapse = !collapse">
          <span v-if="collapse">&nbsp;展开<i style="min-width: 20px;margin-right: -5px;"
                                           class="el-icon-d-arrow-right"></i></span>
          <span v-else><i style="min-width: 20px" class="el-icon-d-arrow-left"></i>收起</span>
        </el-button>

      </div>
      <!--菜单-->
      <el-menu theme="dark" class="el-menu-vertical" unique-opened :collapse="collapse"
               @select="jumpTo">
        <el-submenu v-for="(menu, index) in menus" :index="index" :key="index">
          <template slot="title">
            <i :class="menu.icon"></i>
            <span slot="title" class="menu-name">{{menu.name}}</span>
          </template>
          <el-menu-item v-for="submenu in allSubmenus[index]" :key="index+ '-' + submenu.index"
                        :index="index+ '/' + submenu.index">
            {{submenu.name}}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <!--充值-->
    <div class="main-content">
      <div class="body">
        <router-view></router-view>
      </div>
    </div>
    <el-dialog
      @close="closeDialog"
      :modal-append-to-body="true"
      title="充值"
      :visible.sync="dialogVisible">
      <el-form
        :inline="true"
        label-width="80px">
        <el-form-item>
          <el-autocomplete
            v-model="prefix"
            :trigger-on-focus="false"
            :fetch-suggestions="dynamicQuery"
            placeholder="搜索"
            @select="handleSelect"
            icon="search"
          >
            <el-select style="width: 5.5rem;" slot="prepend" v-model="rechargeUser.type" placeholder="请选择">
              <el-option label="用户名" value="username"></el-option>
              <el-option label="电话" value="phone"></el-option>
            </el-select>
          </el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-input class="w-80" v-model="rechargeUser.rechargeValue">
            <span slot="append">元</span>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="submit" @click="submit">提交</el-button>
        </el-form-item>
        <el-form-item class="w-100" v-if="rechargeUser.selected">
          <div style="color: crimson; line-height: 24px">
            <p>姓名：{{rechargeUser.name}}</p>
            <p>电话：{{rechargeUser.phone}}</p>
            <p>余额：{{rechargeUser.balance}}</p>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import app from '../store/app';
  import * as types from '../store/types';
  import fetcher from '../api/fetcher';

  export default {
    name: 'index',
    data () {
      // 数据
      return {
        app: app,
        prefix: '',
        collapse: false,
        dialogVisible: false,
        rechargeUser: {
          rechargeValue: null,
          type: 'username',
          selecting: false,
          selected: false,
          name: '123',
          phone: '123',
          balance: '123'
        },
        menus: {
          'bikes': {icon: 'ion-android-bicycle', name: '车辆管理'},
          'users': {icon: 'ion-android-contacts', name: '用户管理'},
          'feedback': {icon: 'ion-ios-information-outline', name: '反馈管理'},
          'activities': {icon: 'ion-ios-infinite', name: '活动管理'},
          'privileges': {icon: 'ion-ios-locked', name: '权限管理'},
          'me': {icon: 'ion-android-person', name: '个人中心'}
        },
        allSubmenus: {
          'bikes': [
            {index: 'all', name: '全部车辆'},
            {index: 'add', name: '增加车辆'}
          ],
          'users': [
            {index: 'all', name: '全部用户'},
            {index: 'add', name: '添加用户'}
          ],
          'feedback': [
//            {index: 'statistics', name: '反馈统计'},
            {index: 'all', name: '全部反馈'}
          ],
          'activities': [
//            {index: 'statistics', name: '活动统计'},
            {index: 'all', name: '全部活动'}
          ],
          'privileges': [
            {index: 'all', name: '权限一览'},
            {index: 'modify', name: '修改权限'}
          ],
          'me': [
            {index: 'info', name: '我的信息'},
            {index: 'resetpwd', name: '修改密码'}
          ]
        },
        quickMenus: [
          'recharge', 'unProcessFeedback', 'unProcessAudit', 'unProcessRequest'
        ]
      };
    },
    beforeRouteEnter (to, from, next) {
      next();
    },
    mounted () {
      if (this.$store.getters.userMSG) {
        this.$notify.info({
          title: '待办',
          message: '新的用户请求'
        });
      }
      if (this.$store.getters.activityMSG) {
        this.$notify.info({
          title: '待办',
          message: '新的活动请求'
        });
      }
      if (this.$store.getters.feedbackMSG) {
        this.$notify.info({
          title: '待办',
          message: '新的反馈信息'
        });
      }
    },
    methods: {
      // 方法
      exit () {
        this.$store.dispatch(types.DO_LOGOUT);
        this.$router.push('/');
      },
      jumpTo (index, path) {
        this.$router.push('/' + index);
      },
      quickMenu (command) {
        if (command === this.quickMenus[0]) {
          this.openDialog();
        } else if (command === this.quickMenus[1]) {
          if (this.feedbackMSG) {
            this.$store.commit(types.RESET_QUICK_FEEDBACK);
          }
          this.$router.push('/feedback/all?t=1');
        } else if (command === this.quickMenus[2]) {
          if (this.activityMSG) {
            this.$store.commit(types.RESET_QUICK_ACTIVITY);
          }
          this.$router.push('/activities/all?t=1');
        } else if (command === this.quickMenus[3]) {
          if (this.userMSG) {
            this.$store.commit(types.RESET_QUICK_USER);
          }
          this.$router.push('/users/all?t=1');
        }
      },
      openDialog () {
        this.dialogVisible = true;
      },
      closeDialog () {
        this.dialogVisible = false;
        this.prefix = '';
        this.rechargeUser.selected = false;
        this.rechargeUser.rechargeValue = null;
      },
      dynamicQuery (queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          fetcher.users.dynamicFetch({
            type: this.rechargeUser.type,
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
      handleSelect (item) {
        fetcher.users.query({type: this.rechargeUser.type, value: item.value})
          .then((response) => {
            if (response.data.status === 200) {
              let obj = response.data.data.values[0];
              this.rechargeUser.name = obj.name;
              this.rechargeUser.phone = obj.phone;
              this.rechargeUser.balance = obj.balance;
              this.rechargeUser.selected = true;
            }
          });
      },
      submit () {
        this.$confirm(`将为用户 [${this.rechargeUser.name}] 充值 [${this.rechargeUser.rechargeValue}] 元, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetcher.users.recharge({
            type: this.rechargeUser.type,
            typeValue: this.prefix,
            money: this.rechargeUser.rechargeValue
          }).then((response) => {
            if (response.data.status === 200) {
              this.$message({
                type: 'success',
                message: '充值成功！'
              });
              window.location.reload();
            } else {
              this.$message({
                type: 'error',
                message: '充值失败！'
              });
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '充值失败！'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作！'
          });
        }).finally(() => {
          this.closeDialog();
        });
      }
    },
    computed: {
      adminName () {
        return this.$store.getters.name;
      },
      userMSG () {
        return this.$store.getters.userMSG;
      },
      feedbackMSG () {
        return this.$store.getters.feedbackMSG;
      },
      activityMSG () {
        return this.$store.getters.activityMSG;
      }
    }
  }
  ;
</script>
<style scoped>
  @import "../assets/global/css/global.css";

  .index {
    width: 100%;
    height: 100%;
  }

  .header {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    color: #F9FAFC;
    background-color: #324057;
  }

  .header div {
    height: 70px;
    line-height: 70px;
  }

  .header .brand {
    float: left;
  }

  .header .brand .name {
    margin-left: 20px;
    display: inline-block;
    width: 210px;
    font-size: 1.8em;
  }

  .header .brand .version {
    display: inline-block;
    margin-left: 10px;
    width: 80px;
  }

  .header .exit {
    text-align: center;
    height: 70px;
    width: 70px;
    float: right;
  }

  .header .exit button {
    height: 100%;
  }

  .header .exit i {
    font-size: 32px;
    color: #F9FAFC;
  }

  .header .greeting {
    position: absolute;
    right: 160px;
    display: inline-block;
  }

  .header .quick-message {
    position: absolute;
    height: 70px;
    right: 70px;
    display: inline-block;
  }

  .header .quick-message span {
    cursor: pointer;
    font-size: 16px;
    color: #fff;
  }

  .header .user {
    color: #EFF2F7;
    text-decoration: none;
  }

  .menu {
    position: fixed;
    top: 20%;
    z-index: 3;
  }

  .collapse-button {
    width: 64px;
    text-align: center;
    position: relative;
    top: 15%;
    z-index: 3;
  }

  .collapse-button .el-button--text {
    color: #212121;
  }

  .el-menu-vertical, .el-menu--collapse {
    position: relative;
    top: 20%;
  }

  .el-menu-vertical:not(.el-menu--collapse) li {
    min-width: 150px;
  }

  .el-menu-vertical .el-submenu i {
    position: relative;
    top: 3px;
    width: 2em;
    font-size: 1.8em;
  }

  .menu-name {
    float: right;
    margin-right: 20px;
  }

  .main-content {
    position: relative;
    top: 10px;
    left: 160px;
    width: 85%;
    min-height: 500px;
  }

  .main-content .body {
    min-height: inherit;
    width: 100%;
  }
</style>
