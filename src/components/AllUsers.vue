<template>
  <div class="container" v-if="queryPrivilege">
    <div class="container">
      <el-row :gutter="10" style="margin-bottom: 10px">
        <el-col :span="3" v-if="activeTab == 'all'">
          <el-select v-model="option" placeholder="请选择">
            <el-option
              v-for="option in options"
              :key="option.id"
              :label="'按 ' + option.label"
              :value="option.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8" v-if="activeTab == 'all'">
          <el-autocomplete
            v-model="prefix"
            :trigger-on-focus="false"
            :fetch-suggestions="dynamicQuery"
            placeholder="搜索"
            @select="handleSelect"
            icon="search"
          ></el-autocomplete>
        </el-col>
        <el-col v-if="activeTab != 'all'" :span="11">&nbsp;</el-col>
        <el-col :span="13" style="text-align: right">
          <span class="add-button"><router-link type="text" to="/users/add">添加新用户</router-link></span>
          <el-button class="submit" :loading="loading" @click="loadData(pagination.currentPage, pagination.pageSize)">
            {{loading? '加载中':'刷新'}}
          </el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane name="all">
          <span slot="label"><i class="el-icon-date"></i> 所有用户</span>
          <el-table
            :data="users"
            :loading="loading"
            border
            stripe
            :default-sort="{prop: 'userId', order: 'ascending'}"
            max-height="400">
            <el-table-column
              prop="userId"
              label="编号"
              align="center"
              sortable
              width="80">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="用户名"
              align="center"
              width="120">
              <template scope="scope">
                <el-dropdown trigger="click" @command="clickToRecord">
                  <span class="el-dropdown-link">{{scope.row.userName}}</span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="'cycling?uid=' + scope.row.userId">查看骑行记录</el-dropdown-item>
                    <el-dropdown-item :command="'deal?uid=' + scope.row.userId">查看消费记录</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              prop="cardNumber"
              label="卡编号"
              align="center">
              <template scope="scope">
                <label>{{scope.row.cardNumber | cardFilter}}</label>
              </template>
            </el-table-column>
            <el-table-column
              prop="score"
              label="积分"
              align="center"
              sortable
              width="90">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话"
              align="center">
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              align="center"
              :filters="status"
              :filter-method="filterTag"
              filter-placement="bottom-end"
              width="100">
              <template scope="scope">
                <el-tag :type="tagClass(scope.row.status)" close-transition>
                  {{scope.row.status | statusFilter}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="userInfoId"
              label="认证状态"
              align="center"
              width="100">
              <template scope="scope">
                <i :class="{'ion-checkmark': scope.row.userInfoId != '', 'ion-close': scope.row.userInfoId == ''}"
                   :style="{color: scope.row.userInfoId != ''? 'green' : 'red'}"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="balance"
              label="账户余额"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              v-if="updatePrivilege"
              width="140">
              <template scope="scope">
                <el-button size="small" type="text" @click="edit(scope.row)">编辑</el-button>
                <el-button size="small" type="text" style="color: #ff4949" @click="del(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top: 10px">
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="12" style="text-align: center">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.currentPage"
                :page-sizes="pagination.pageSizes"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
              </el-pagination>
            </el-col>
            <el-col :span="6">&nbsp;</el-col>
          </el-row>
          <el-dialog
            title="个人信息"
            :visible.sync="dialogVisible"
            :before-close="handleDialogClose">
            <!--编辑用户信息-->
            <div>
              <el-form
                ref="userInfo"
                :model="userInfo"
                label-width="80px">
                <el-form-item label="用户名" prop="userName" class="center-block w-80">
                  <el-input v-model="userInfo.userName" disabled></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name" class="center-block w-80">
                  <el-input v-model="userInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="卡号" prop="cardNumber" class="center-block w-80">
                  <el-input v-model="userInfo.cardNumber"></el-input>
                </el-form-item>
                <el-form-item label="积分" prop="score" class="center-block w-80">
                  <el-input v-model="userInfo.score"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone" class="center-block w-80">
                  <el-input v-model="userInfo.phone"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status" class="center-block w-80">
                  <el-select v-model="userInfo.status" placeholder="请选择">
                    <el-option
                      v-for="item in options2"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="余额" prop="balance" class="center-block w-80">
                  <el-input v-model="userInfo.balance" disabled="disabled">
                    <template slot="prepend">￥</template>
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item class="center-block w-80">
                  <el-button class="submit" @click="submit" :loading="userInfo.loading">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane name="un">
          <span slot="label"><i class="el-icon-message"></i> 未处理申请</span>
          <el-table
            :data="application"
            loading="loading"
            border
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="fetching"
            infinite-scroll-distance="20"
            stripe
            max-height="400">
            <el-table-column
              prop="userId"
              label="编号"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              prop="username"
              label="用户名"
              align="center"
              width="130">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话"
              align="center"
              width="130">
            </el-table-column>
            <el-table-column
              prop="school"
              label="学校"
              align="center">
            </el-table-column>
            <el-table-column
              prop="department"
              label="院系"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              prop="major"
              label="专业"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              prop="stuId"
              label="学号"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="120">
              <template scope="scope">
                <el-button size="small" type="success" @click="processApplication(scope, true)">允许
                </el-button>
                <el-button size="small" type="text" style="color: #ff4949"
                           @click="processApplication(scope, false)">拒绝
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <div class="container" v-else>没有权限</div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex';
  import * as types from '../store/types';
  import fetcher from '../api/fetcher';

  const statusValue = ['挂失', '冻结', '正常'];
  export default {
    name: 'all-users',
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (to.query.t === '1') {
          vm.activeTab = 'un';
        } else {
          vm.activeTab = 'all';
          vm.fetching = true;
        }
      });
    },
    beforeRouteUpdate (to, from, next) {
      if (to.query.t === '1') {
        this.activeTab = 'un';
      } else {
        this.activeTab = 'all';
        this.fetching = true;
      }
      next();
    },
    beforeMount () {
      let pagination = this.$store.getters.usersPagination;
      this.loadData(pagination.currentPage, pagination.pageSize);
      this.application = [];
    },
    data () {
      return {
        activeTab: 'all',
        loading: false,
        option: 0,
        options: [
          {
            label: '编号',
            p: 'id',
            value: 0
          },
          {
            label: '用户名',
            p: 'username',
            value: 1
          },
          {
            label: '卡号',
            p: 'cardNumber',
            value: 2
          },
          {
            label: '电话',
            p: 'phone',
            value: 3
          }
        ],
        options2: [{
          value: '-1',
          label: '挂失'
        }, {
          value: '0',
          label: '冻结'
        }, {
          value: '1',
          label: '正常'
        }],
        prefix: '',
        dialogVisible: false,
        // false 为编辑， true 为查看个人信息
        userInfo: {},
        users: [],
        timeout: null,
        status: [
          {text: '挂失', value: '-1'},
          {text: '冻结', value: '0'},
          {text: '正常', value: '1'}
        ],
        fetching: false,
        application: [],
        applicationStart: 1,
        applicationPageSize: 10,
        applicationCanFetch: true
      };
    },
    methods: {
      loadData (current, size) {
        if (!this.loading) {
          this.loading = true;
          this.$store.dispatch(types.FETCHER_USERS_TOTAL);
          fetcher.users.fetchPagination(current, size)
            .then((response) => {
              this.users = response.data.data.values;
            })
            .catch(() => {
              this.$message.error('数据获取失败');
            })
            .then(() => {
              this.loading = false;
            });
        }
      },
      openDialog () {
        this.dialogVisible = true;
      },
      closeDialog () {
        this.dialogVisible = false;
      },
      handleSizeChange (val) {
        this.$store.commit(types.SET_USERS_PAGINATION_PAGE_SIZE, {pageSize: val});
        let pagination = this.$store.getters.usersPagination;
        this.loadData(pagination.currentPage, pagination.pageSize);
      },
      handleCurrentChange (val) {
        this.$store.commit(types.SET_USERS_PAGINATION_CURRENT, {current: val});
        let pagination = this.$store.getters.usersPagination;
        this.loadData(val, pagination.pageSize);
      },
      handleDialogClose () {
        this.closeDialog();
        this.$message.info('取消操作');
      },
      edit (row) {
        this.userInfo.loading = false;
        this.userInfo = row;
        this.userInfo.balance = Number(row.balance);
        this.openDialog();
      },
      del (row) {
        this.$confirm('您即将删除一名可爱的用户, 仍要继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetcher.users.del(row.userId)
            .then((response) => {
              if (response.data.status === 200) {
                this.$message.success('删除成功');
                if (this.users.length === 1) {
                  this.loadCurrentPage(-1);
                } else {
                  this.loadCurrentPage(0);
                }
              } else {
                this.$message.error('删除失败');
              }
            })
            .catch(() => {
              this.$message.error('删除失败');
            });
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      loadCurrentPage (offset) {
        let pagination = this.$store.getters.usersPagination;
        this.loadData(pagination.currentPage + offset, pagination.pageSize);
      },
      processApplication (scope, act) {
        console.log();
        let row = scope.row;
        fetcher.users.updateUnProcess({userInfoId: row.userInfoId, userId: row.userId, action: act})
          .then((response) => {
            if (response.data.status === 200) {
              this.application.splice(scope.$index, 1);
              this.$message.success('更新成功！');
            } else {
              this.$message.error('更新失败！请重试');
            }
          })
          .catch(() => {
            this.$message.error('更新失败！请检查您的网络或刷新重试');
          });
      },
      loadMore () {
        if (this.applicationCanFetch) {
          fetcher.users.fetchUnProcess(this.applicationStart, this.applicationPageSize)
            .then((response) => {
              if (response.data.status === 200) {
                if (response.data.data.values.length < this.applicationPageSize) {
                  this.fetching = true;
                  this.applicationCanFetch = false;
                }
                this.applicationStart++;
                this.application = this.application.concat(response.data.data.values);
              } else {
                this.$message.error('数据获取失败！');
              }
            })
            .catch(() => {
              this.$message.error('数据获取失败！请检查您的网络或刷新重试');
            });
        }
      },
      handleTabClick (tab, event) {
        if (tab.name === 'all') {
          this.fetching = true;
          this.applicationCanFetch = true;
          this.applicationStart = 1;
          this.application = [];
          let pagination = this.$store.getters.usersPagination;
          this.loadData(1, pagination.pageSize);
        } else {
          // 可以无限下滑了
          this.fetching = false;
        }
      },
      dynamicQuery (queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          fetcher.users.dynamicFetch({
            type: this.options[this.option].p,
            prefix: queryString
          }).then((response) => {
            let val = response.data;
            cb(val.data.values.map((val) => {
              return {value: val.value.toString()};
            }));
          });
        }, 1000);
      },
      handleSelect (item) {
        let value = item.value;
        fetcher.users.query({
          type: this.options[this.option].p,
          value: value
        }).then((response) => {
          this.users.splice(0, this.users.length, ...response.data.data.values);
          this.$store.commit(types.SET_USERS_PAGINATION_TOTAL, {total: 1});
        }).then(() => {
          this.prefix = '';
        });
      },
      submit () {
        this.userInfo.loading = true;
        fetcher.users.update(this.userInfo)
          .then((response) => {
            if (response.data.status === 200) {
              this.$message.success('更新成功');
            } else {
              this.$message.error('更新失败');
            }
          })
          .catch(() => {
            this.$message.error('更新失败');
          })
          .then(() => {
            this.userInfo.loading = false;
            this.closeDialog();
            this.loadCurrentPage(0);
          });
      },
      tagClass (status) {
        if (status === '-1') {
          return 'warning';
        }
        if (status === '0') {
          return 'danger';
        }
        if (status === '1') {
          return 'success';
        }
      },
      filterTag (value, row) {
        return row.status === value;
      },
      clickToRecord (command) {
        this.$router.push('/users/' + command);
      }
    },
    computed: {
      // 计算属性
      ...mapGetters({
        pagination: 'usersPagination',
        queryPrivilege: 'queryUser',
        updatePrivilege: 'updateUser'
      })
    },
    filters: {
      statusFilter (status) {
        return statusValue[Number.parseInt(status) + 1];
      },
      cardFilter (card) {
        if (card !== null && card !== '') {
          return card;
        }
        return '未申请';
      }
    },
    beforeDestroy () {
      this.$store.commit(types.SET_USERS_PAGINATION_CURRENT, {current: 1});
    }
  };
</script>
<style scoped>
  @import "../assets/global/css/global.css";

  .el-select .el-input {
    width: 110px;
  }

  .add-button {
    font-size: 14px;
    margin-right: 10px;
  }

  .add-button:before {
    content: " + ";
    font-weight: bold;
  }

  .add-button a {
    color: #324057;
    text-decoration: none;
  }
</style>
