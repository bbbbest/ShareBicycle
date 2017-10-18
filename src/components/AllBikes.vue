<template>
  <div class="container" v-if="queryPrivilege">
    <el-row :gutter="10" style="margin-bottom: 10px">
      <el-col :span="3">
        <el-select v-model="option" placeholder="请选择">
          <el-option
            v-for="option in options"
            :key="option.value"
            :label="'按 ' + option.label"
            :value="option.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-autocomplete
          v-model="prefix"
          :trigger-on-focus="false"
          :fetch-suggestions="dynamicQuery"
          placeholder="搜索"
          @select="handleSelect"
          icon="search"
        ></el-autocomplete>
      </el-col>
      <el-col :span="13" style="text-align: right">
        <span class="add-button">
          <router-link type="text" to="/bikes/add">添加新车</router-link>
        </span>
        <el-button class="submit" :loading="loading" @click="loadData(pagination.currentPage, pagination.pageSize)">
          {{loading? '加载中':'刷新'}}
        </el-button>
      </el-col>
    </el-row>
    <el-table
      :data="bikes"
      border
      stripe
      max-height="450">
      <el-table-column
        prop="id"
        label="编号"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="from"
        label="贡献者"
        width="160"
        align="center">
        <template scope="scope">
          <el-popover trigger="click" placement="top">
            <p>姓名: {{ clickedUser.name }}</p>
            <p>电话: {{ clickedUser.phone }}</p>
            <div slot="reference">
              <span @click="clickName(scope.row.from)">{{ scope.row.name }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        sortable
        label="贡献时间"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column
        prop="lockId"
        label="锁编号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="location"
        label="现地址"
        align="center">
        <template scope="scope">
          (<span>{{scope.row.location.x}}</span>,<span>{{scope.row.location.y}}</span>)
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="energy"
        label="电池电量"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="130" v-if="updatePrivilege">
        <template scope="props">
          <el-button size="small" type="text" @click="edit(props.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="del(props.row)">删除</el-button>
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
      title="车辆信息"
      :visible.sync="dialogVisible"
      :before-close="handleDialogClose">
      <div style="width: 90%">
        <el-form
          ref="bikeInfo"
          :model="bikeInfo"
          label-width="80px">
          <el-form-item label="编号" prop="id">
            <el-input v-model.number="bikeInfo.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="照片" prop="photo">
            <el-row>
              <el-col :span="10">
                <el-card :body-style="{ padding: '0px'}">
                  <img style="width:100%; display: block;" alt="自行车照片" :src='bikeInfo.photo'>
                </el-card>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="锁编号" prop="lockId">
            <el-input v-model.number="bikeInfo.lockId"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-input v-model.number="bikeInfo.status"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="bikeInfo.loading" class="submit" @click="submit">确认修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
  <div class="container" v-else>没有权限</div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex';
  import * as types from '../store/types';
  import fetcher from '../api/fetcher';

  export default {
    name: 'all-bikes',
    beforeMount () {
      let pagination = this.$store.getters.usersPagination;
      this.loadData(pagination.currentPage, pagination.pageSize);
    },
    data () {
      return {
        dialogVisible: false,
        loading: false,
        option: 0,
        options: [
          {
            label: '编号',
            p: 'id',
            value: 0
          },
          {
            label: '锁编号',
            p: 'lockId',
            value: 1
          }
        ],
        prefix: '',
        advice: [],
        clickedUser: {
          name: '',
          phone: 0
        },
        bikeInfo: {},
        bikes: [],
        timeout: null
      };
    },
    methods: {
      // 方法
      openDialog () {
        this.dialogVisible = true;
      },
      closeDialog () {
        this.dialogVisible = false;
      },
      handleDialogClose () {
        this.closeDialog();
        this.$message({
          message: '取消操作',
          type: 'info',
          duration: 1000
        });
      },
      handleSizeChange (val) {
        this.$store.commit(types.SET_BIKES_PAGINATION_PAGE_SIZE, {pageSize: val});
        let pagination = this.$store.getters.bikesPagination;
        this.loadData(pagination.currentPage, pagination.pageSize);
      },
      handleCurrentChange (val) {
        this.$store.commit(types.SET_BIKES_PAGINATION_CURRENT, {current: val});
        let pagination = this.$store.getters.bikesPagination;
        this.loadData(val, pagination.pageSize);
      },
      loadData (current, size) {
        if (!this.loading) {
          this.loading = true;
          this.$store.dispatch(types.FETCHER_BIKES_TOTAL);
          fetcher.bikes.fetchPagination(current, size)
            .then((response) => {
              this.bikes = response.data.data.values;
            })
            .catch(() => {
              this.$message.error('数据获取失败');
            })
            .then(() => {
              this.loading = false;
            });
        }
      },
      clickName (id) {
        console.log(id);
      },
      edit (row) {
        this.bikeInfo.id = row.id;
        this.bikeInfo.photo = row.photo;
        this.bikeInfo.lockId = row.lockId;
        this.bikeInfo.status = row.status;
        this.openDialog();
      },
      del (row) {
        this.$confirm('您即将删除一辆自行车, 仍要继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetcher.bikes.del(row.id)
            .then((response) => {
              if (response.data.status === 200) {
                this.$message.success('删除成功');
                if (this.bikes.length === 1) {
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
      loadCurrentPage (pageOffset) {
        let pagination = this.$store.getters.bikesPagination;
        this.loadData(pagination.currentPage + pageOffset, pagination.pageSize);
      },
      getPhoto (id) {
        // TODO
        return 'https://upload.wikimedia.org/wikipedia/commons/4/41/Left_side_of_Flying_Pigeon.jpg';
      },
      submit () {
        this.bikeInfo.loading = true;
        fetcher.bikes.update({id: this.bikeInfo.id, lockId: this.bikeInfo.lockId, status: this.bikeInfo.status})
          .then(response => {
            this.$message.success('更新成功');
          })
          .catch(p1 => {
            this.$message({
              type: 'error',
              message: '更新失败'
            });
          })
          .then(() => {
            this.bikeInfo.loading = false;
            this.closeDialog();
            this.loadCurrentPage(0);
          });
      },
      dynamicQuery (queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          fetcher.bikes.dynamicFetch({
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
        fetcher.bikes.query({
          type: this.options[this.option].p,
          value: value
        }).then((response) => {
          this.$store.commit(types.SET_BIKES_PAGINATION_TOTAL, {total: 1});
          this.bikes.splice(0, this.bikes.length, response.data.data.value);
        }).then(() => {
          this.prefix = '';
        });
      }
    },
    computed: {
      ...mapGetters({
        pagination: 'bikesPagination',
        queryPrivilege: 'queryBicycle',
        updatePrivilege: 'updateBicycle'
      })
    },
    beforeDestroy () {
      this.$store.commit(types.SET_BIKES_PAGINATION_CURRENT, {current: 1});
    }
  };
</script>
<style scoped>
  @import "../assets/global/css/global.css";

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
