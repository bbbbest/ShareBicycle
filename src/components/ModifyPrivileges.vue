<template>
  <div class="container" v-if="queryAdmin">
    <el-row :gutter="10" style="margin-bottom: 10px">
      <el-col :span="11">&nbsp;
      </el-col>
      <el-col :span="13" style="text-align: right">
        <span class="add-button"><a href="javascript:void(0)" @click="add">添加管理员</a></span>
        <el-button class="submit" :loading="loading" @click="loadData(pagination.currentPage, pagination.pageSize)">
          {{loading? '加载中':'刷新'}}
        </el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      stripe
      max-height="480">
      <el-table-column
        prop="adminId"
        label="工号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        prop="auth"
        label="当前权限"
        header-align="center"
        width="800">
        <template scope="scope">
          <div class="checkbox-group" v-for="i in Object.keys(scope.row.auth)">
            <span>{{i | aliasFilter}}</span>
            <el-checkbox :key="i + '-query'" disabled :checked="scope.row.auth[i].query">读</el-checkbox>
            <el-checkbox :key="i + '-update'" disabled :checked="scope.row.auth[i].update">写</el-checkbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        v-if="updateAdmin"
        width="130">
        <template scope="scope">
          <el-button size="small" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :modal-append-to-body="false"
      :title="form.adminId !== ''? '提示' : '管理员信息'"
      :visible.sync="dialogVisible"
      size="large"
      :before-close="handleClose">
      <el-form :inline="true" ref="form" :model="form" label-width="80px">
        <el-form-item label="工号" v-if="form.adminId !== ''">
          <el-input v-model="form.adminId" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" v-if="form.adminId === ''">
          <el-input v-model="form.username" size="small" :disabled="form.adminId !== ''"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" size="small" :disabled="form.adminId !== ''"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="form.roleId" size="small" :placeholder="form.roleId">
            <el-option
              v-for="privilege in allPrivileges"
              :key="privilege.id"
              :label="privilege.id"
              :value="privilege.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限表">
          <privileges :tableHeight="200"></privileges>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="handleClose">取&nbsp;消</el-button>
        <el-button class="submit" @click="submit">提&nbsp;交</el-button>
      </span>
    </el-dialog>
  </div>
  <div class="container" v-else>没有权限</div>
</template>
<script type="text/ecmascript-6">
  const map = {
    admin: '管理员',
    user: '用户',
    activity: '活动',
    advice: '反馈建议',
    bicycle: '自行车',
    cyclingrecord: '骑行记录',
    dealrecord: '消费记录'
  };

  import {mapGetters} from 'vuex';
  import fetcher from '../api/fetcher';

  export default {
    name: 'modify-authority',
    components: {privileges: require('./Privileges')},
    beforeMount () {
      this.loadData();
    },
    data () {
      // 数据
      return {
        loading: false,
        dialogVisible: false,
        option: 1,
        options: [
          {
            label: '工号',
            value: 1
          },
          {
            label: '姓名',
            value: 2
          }
        ],
        prefix: '',
        admins: [
          {
            adminId: '1',
            name: 'Tom',
            roleId: '1',
            auth: {
              admin: {
                query: true,
                update: false
              },
              user: {
                query: true,
                update: true
              },
              activity: {
                query: true,
                update: false
              },
              advice: {
                query: true,
                update: false
              },
              bicycle: {
                query: true,
                update: false
              },
              cyclingrecord: {
                query: true,
                update: false
              },
              dealrecord: {
                query: true,
                update: false
              }
            }
          }
        ],
        pagination: {
          total: 100,
          pageSizes: [20, 30, 40],
          pageSize: 20,
          currentPage: 1
        },
        form: {
          adminId: '',
          name: '',
          roleId: 1,
          username: ''
        },
        timeout: null
      };
    },
    methods: {
      loadData () {
        if (!this.loading) {
          this.loading = true;
          this.admins = [];
          fetcher.privilege.fetchAllAdminPrivileges()
            .then((response) => {
              if (response.data.status === 200) {
                this.admins.splice(0, this.admins.length, ...response.data.data.admins);
                console.log(this.admins);
              }
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`);
      },
      reload () {
        this.loadData();
      },
      openDialog () {
        this.dialogVisible = true;
      },
      closeDialog () {
        this.dialogVisible = false;
        this.loadData();
      },
      // 方法
      add () {
        this.form.adminId = '';
        this.form.name = '';
        this.form.username = '';
        this.form.roleId = '';
        this.openDialog();
      },
      edit (row) {
        this.form.adminId = row.adminId;
        this.form.name = row.name;
        this.form.roleId = row.roleId;
        this.openDialog();
      },
      del (row) {
        this.$confirm('您即将删除一名管理员, 仍要继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetcher.privilege.del(row.adminId).then((response) => {
            if (response.data.status === 200) {
              this.error('删除成功!');
            } else {
              this.error('删除失败!');
            }
          }).catch(() => {
            this.error('删除失败!');
          }).finally(() => {
            this.closeDialog();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleClose (event) {
        this.closeDialog();
        this.$message({
          type: 'info',
          message: '取消操作！',
          duration: 1000
        });
      },
      submit () {
        if (this.form.adminId === '') {
          fetcher.privilege.add({
            t: 'add',
            username: this.form.username,
            name: this.form.name,
            roleId: this.form.roleId
          }).then((response) => {
            if (response.data.status === 200) {
              this.error('添加成功!');
            } else {
              this.error('添加失败!');
            }
          }).catch(() => {
            this.error('添加失败!');
          }).finally(() => {
            this.closeDialog();
          });
        } else {
          console.log({
            t: 'upt',
            id: this.form.adminId,
            roleId: this.form.roleId
          });
          fetcher.privilege.update({
            t: 'upt',
            id: this.form.adminId,
            roleId: this.form.roleId
          }).then((response) => {
            if (response.data.status === 200) {
              this.error('修改成功!');
            } else {
              this.error('修改失败!');
            }
          }).catch(() => {
            this.error('修改失败!');
          }).finally(() => {
            this.closeDialog();
          });
        }
      },
      resetForm () {
        this.form.adminId = '';
        this.form.name = '';
        this.form.roleId = '';
        this.form.username = '';
        this.form.password = '';
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
          }).catch((error) => {
            console.log(error);
          });
        }, 1000);
      },
      handleSelect (item) {
        // id or lockId
        let value = item.value;
        fetcher.users.query({
          type: this.options[this.option].p,
          value: value
        }).then((response) => {
          this.users.splice(0, this.users.length, response.data.data.value);
        }).then(() => {
          this.prefix = '';
        });
      }
    },
    computed: {
      // 计算属性
      tableData () {
        return this.admins;
      },
      ...mapGetters(['allPrivileges', 'queryAdmin', 'updateAdmin'])
    },
    filters: {
      aliasFilter: (val) => map[val]
    }
  };
</script>
<style scoped>
  @import '../assets/global/css/global.css';

  .checkbox-group {
    width: 160px;
    margin-left: 20px;
    line-height: 30px;
    display: inline-block;
  }

  .checkbox-group > span {
    display: inline-block;
    width: 4em;
    margin-right: 5px;
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
