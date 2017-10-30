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
          <span slot="label"><i class="el-icon-date"></i> 所有反馈</span>
        </el-tab-pane>
        <el-tab-pane name="un">
          <span slot="label"><i class="el-icon-message"></i> 未回复</span>
        </el-tab-pane>
      </el-tabs>
      <el-table
        :data="feedback"
        border
        stripe
        max-height="400"
        style="width: 100%">
        <el-table-column type="expand" width="30">
          <template scope="props">
            <div class="feedback-content">
              <div class="content">{{ props.row.content }}</div>
              <span class="createTime">{{ props.row.createTime }}</span>
            </div>
            <div v-if="props.row.status == 0 || props.row.status == 1" class="reply">
              <el-input type="textarea" autosize v-model="reply"></el-input>
              <el-button class="submit" size="small" @click="submitReply(props.row, reply)">提交</el-button>
            </div>
            <div v-else class="reply-content">
              <div class="content">{{ props.row.replyContent }}</div>
              <span class="createTime">{{ props.row.replyTime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="adviseId"
          label="编号"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="creator"
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
    name: 'all-feedback',
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
        dialogVisible: false,
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
        feedback: [],
        timeout: null,
        reply: ''
      };
    },
    methods: {
      // 刷新按钮
      loadData (current, size) {
        if (!this.loading) {
          this.loading = true;
          let t = this.activeTab === 'all';
          let promise;
          if (t) {
            this.$store.dispatch(types.FETCHER_FEEDBACK_TOTAL);
            promise = fetcher.feedback.fetchPagination(current, size);
          } else {
            this.$store.dispatch(types.FETCHER_FEEDBACK_UNPROCESS_TOTAL);
            promise = fetcher.feedback.fetchUnProcess(current, size);
          }
          promise.then((response) => {
            this.feedback = response.data.data.values;
          })
            .catch(() => {
              this.$message.error('数据获取失败');
            })
            .then(() => {
              this.loading = false;
            });
        }
      },
      // 对话框开关
      openDialog () {
        this.dialogVisible = true;
      },
      closeDialog () {
        this.dialogVisible = false;
      },
      // 对话框关闭处理
      handleDialogClose () {
        this.closeDialog();
        this.$message({
          message: '取消操作',
          type: 'info',
          duration: 1000
        });
      },
      submitReply (row, content) {
        this.reply = '';
        fetcher.feedback.update({id: row.adviseId, replyContent: content})
          .then((response) => {
            if (response.data.status === 200) {
              row.status = 2;
              row.replyContent = content;
              this.$message.success('回复成功');
            } else {
              this.$message.error('回复失败');
            }
          })
          .catch(() => {
            this.$message.error('回复失败');
          });
      },
      // 处理分页
      handleSizeChange (val) {
        this.$store.commit(types.SET_FEEDBACK_PAGINATION_PAGE_SIZE, {pageSize: val});
        let pagination = this.$store.getters.feedbackPagination;
        this.loadData(pagination.currentPage, pagination.pageSize);
      },
      handleCurrentChange (val) {
        this.$store.commit(types.SET_FEEDBACK_PAGINATION_CURRENT, {current: val});
        let pagination = this.$store.getters.feedbackPagination;
        this.loadData(val, pagination.pageSize);
      },
      handleTabClick (tab, event) {
        let pagination = this.$store.getters.feedbackPagination;
        this.loadData(1, pagination.pageSize);
      },
      dynamicQuery (queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          fetcher.feedback.dynamicFetch({
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
        fetcher.feedback.query({
          type: this.options[this.option].p,
          value: value
        }).then((response) => {
          this.feedback.splice(0, this.feedback.length, response.data.data.value);
        }).then(() => {
          this.prefix = '';
        });
      }
    },
    computed: {
      ...mapGetters({
        pagination: 'feedbackPagination',
        queryPrivilege: 'queryAdvice',
        updatePrivilege: 'updateAdvice'
      })
    }
  };
</script>
<style scoped>
  @import "../assets/global/css/global.css";

  .feedback-content, .reply, .reply-content {
    margin-top: 15px !important;
    line-height: 2;
    width: 100%;
  }

  .feedback-content:before {
    content: '反馈内容';
  }

  .reply-content:before {
    content: '回复内容';
  }

  .reply:before {
    content: '回复';
  }

  .feedback-content:before, .reply:before, .reply-content:before {
    margin-top: 10px;
    display: block;
    color: #8c939d;
    width: 120px;
    min-height: 40px;
    font-size: 1.2em;
  }

  .content {
    display: inline-block;
  }

  .createTime {
    display: inline-block;
    color: #8c939d;
    font-size: 12px;
    float: right;
    margin-right: 15px;
  }


</style>
