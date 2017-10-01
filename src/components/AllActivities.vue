<template>
  <div class="container" v-if="queryPrivilege">
    <div class="container">
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
          <el-button class="submit" :loading="loading" @click="loadData(pagination.currentPage, pagination.pageSize)">
            {{loading? '加载中':'刷新'}}
          </el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane name="all">
          <span slot="label"><i class="el-icon-date"></i> 所有活动</span>
        </el-tab-pane>
        <el-tab-pane name="un">
          <span slot="label"><i class="el-icon-message"></i> 未审核 </span>
        </el-tab-pane>
      </el-tabs>
      <el-table
        :data="activities"
        v-loading.body="loading"
        border
        stripe
        max-height="400"
        style="width: 100%">
        <el-table-column type="expand" width="30">
          <template scope="props">
            <div class="content">
              <div class="description">{{ props.row.description }}</div>
              <span class="createTime">{{ props.row.createTime }}</span>
              <div v-if="props.row.status == 0" class="unhandled">
                <el-button type="success" size="small" @click="submit(props.row, 1)">准许</el-button>
                <el-button type="danger" size="small" @click="submit(props.row, -1)">回绝</el-button>
              </div>
              <div v-else-if="props.row.status == 1" class="handled check">
                <i class="ion-checkmark"></i>
              </div>
              <div v-else-if="props.row.status == -1" class="handled uncheck">
                <i class="ion-close"></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="编号"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="userId"
          label="提出人"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="开始时间"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          width="80">
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
    </div>
  </div>
  <div class="container" v-else>没有权限</div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex';
  import * as types from '../store/types';
  import fetcher from '../api/fetcher';

  export default {
    name: 'all-activities',
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (to.query.t === '1') {
          vm.activeTab = 'un';
        } else {
          vm.activeTab = 'all';
        }
      });
    },
    beforeRouteUpdate (to, from, next) {
      if (to.query.t === '1') {
        this.activeTab = 'un';
      } else {
        this.activeTab = 'all';
      }
      next();
    },
    beforeMount () {
      let pagination = this.$store.getters.usersPagination;
      this.loadData(pagination.currentPage, pagination.pageSize);
    },
    data () {
      // 数据
      return {
        activeTab: 'all',
        loading: false,
        option: 0,
        options: [
          {
            label: '编号',
            p: 'id',
            value: 0
          }
        ],
        prefix: '',
        activities: [
          {
            id: '1',
            userId: '1',
            title: 'Activity-1',
            createTime: new Date().toLocaleDateString(),
            startTime: new Date().toLocaleDateString(),
            endTime: new Date().toLocaleDateString(),
            description: '这个活动旨在提倡大家多出去走走',
            status: 0
          }
        ],
        timeout: null,
        reply: ''
      };
    },
    methods: {
      /**
       * 准许（1）或回绝（-1）
       * @param row 所在行
       * @param status
       */
      submit (row, status) {
        if (status === 1) {
          fetcher.activities.update({id: row.id, status: 1, replyContent: ''})
            .then((response) => {
              if (response.data.status === 200) {
                this.$message.success('更新成功');
                row.status = status;
              } else {
                this.$message.error('更新失败');
              }
            })
            .catch(() => {
              this.$message.error('更新失败');
            });
        } else {
          this.$prompt('请输入回绝理由', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({value}) => {
            let len = 10;
            let msg = value.length > len ? value.substring(0, len) + '...' : value;
            fetcher.activities.update({id: row.id, status: -1, replyContent: value})
              .then((response) => {
                if (response.data.status === 200) {
                  this.$message.success('回绝成功，理由：' + msg);
                  row.status = status;
                } else {
                  this.$message.success('回复失败');
                }
              })
              .catch(() => {
                this.$message.success('回复失败');
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        }
      },
      // 刷新按钮
      loadData (current, size) {
        if (!this.loading) {
          this.loading = true;
          let t = this.activeTab === 'all';
          let promise;
          if (t) {
            this.$store.dispatch(types.FETCHER_ACTIVITY_TOTAL);
            promise = fetcher.activities.fetchPagination(current, size);
          } else {
            this.$store.dispatch(types.FETCHER_ACTIVITY_UNPROCESS_TOTAL);
            promise = fetcher.activities.fetchUnProcess(current, size);
          }
          promise.then((response) => {
            this.activities = response.data.data.values;
          })
            .catch(() => {
              this.$message.error('数据获取失败');
            })
            .then(() => {
              this.loading = false;
            });
        }
      },
      // 处理分页
      handleSizeChange (val) {
        this.$store.commit(types.SET_ACTIVITIES_PAGINATION_PAGE_SIZE, {pageSize: val});
        let pagination = this.$store.getters.activitiesPagination;
        this.loadData(pagination.currentPage, pagination.pageSize);
      },
      handleCurrentChange (val) {
        this.$store.commit(types.SET_ACTIVITIES_PAGINATION_CURRENT, {current: val});
        let pagination = this.$store.getters.activitiesPagination;
        this.loadData(val, pagination.pageSize);
      },
      handleTabClick (tab, event) {
        let pagination = this.$store.getters.feedbackPagination;
        this.loadData(1, pagination.pageSize);
      },
      dynamicQuery (queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          fetcher.activities.dynamicFetch({
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
        fetcher.activities.query({
          type: this.options[this.option].p,
          value: value
        }).then((response) => {
          this.activities.splice(0, this.activities.length, response.data.data.value);
        }).then(() => {
          this.prefix = '';
        });
      }
    },
    computed: {
      // 计算属性
      ...mapGetters({
        pagination: 'activitiesPagination',
        queryPrivilege: 'queryActivity',
        updatePrivilege: 'updateActivity'
      })
    }
  };
</script>
<style scoped>
  @import "../assets/global/css/global.css";

  .content {
    line-height: 2;
    width: 100%;
  }

  .content:before {
    content: '活动描述';
    display: block;
    color: #8c939d;
    width: 120px;
    min-height: 40px;
    font-size: 1.2em;
  }

  .createTime {
    display: inline-block;
    color: #8c939d;
    font-size: 12px;
    float: right;
    margin-right: 15px;
  }

  .item {
    position: absolute;
  }

  .handled {
    position: absolute;
    font-size: 2.6em;
    top: 20px;
    right: 80px;
  }

  .check {
    color: #13CE66;
  }

  .uncheck {
    color: #FF4949;
  }

  .unhandled {
    position: relative;
    top: 10px;
  }
</style>
