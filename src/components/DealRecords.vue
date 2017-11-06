<template>
  <div class="container" v-if="uid">
    <el-table :data="tableData"
              style="width: 100%"
              border
              stripe
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="fetching"
              infinite-scroll-distance="20"
              max-height="500">
      <el-table-column
        prop="dealrecordId"
        label="编号"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="time"
        label="交易日期"
        align="center">
      </el-table-column>
      <el-table-column
        prop="action"
        label="交易类型"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="money"
        label="交易金额"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="balance"
        label="余额"
        align="center"
        width="180">
      </el-table-column>
    </el-table>
  </div>
  <div v-else>
    错误的请求，请确认操作！
  </div>
</template>
<script type="text/ecmascript-6">
  import fetcher from '../api/fetcher';

  export default {
    name: 'deal-records',
    created () {
      this.uid = this.$route.query.uid;
    },
    mounted () {
      fetcher.dealrecord.fetchPagination(this.uid, 1, 5)
        .then((response) => {
          this.tableData = response.data.data.record;
        });
    },
    data () {
      // 数据
      return {
        uid: null,
        tableData: [],
        fetching: false,
        start: 1,
        pageSize: 10,
        canFetch: true
      };
    },
    methods: {
      // 方法
      loadMore () {
        if (this.canFetch) {
          fetcher.dealrecord.fetchPagination(this.uid, this.start, this.pageSize)
            .then((response) => {
              if (response.data.status === 200) {
                // success
                if (response.data.data.record.length < this.pageSize) {
                  this.canFetch = false;
                  this.fetching = true;
                }
                this.tableData = this.tableData.concat(response.data.data.record);
              } else {
                // failed
                this.$message.error('数据获取失败');
              }
            })
            .catch(() => {
              // error
              this.$message.error('数据获取失败，请检查网络');
            });
        }
      }
    },
    computed: {
      // 计算属性
    },
    filters: {
      // 过滤器
    },
    watch: {
      // 监听器
    }
  };
</script>
<style scoped>
  @import "../assets/global/css/global.css";
</style>
