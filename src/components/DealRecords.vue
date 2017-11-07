<template>
  <div class="container" v-if="uid">
    <div class="subscribe">
      <div class="today-consume">
        <div class="description">
          今日消费
        </div>
        <div class="value">
          <span>￥</span><span>{{consume}}</span>
        </div>
      </div>
      <div class="today-recharge">
        <div class="description">
          充值
        </div>
        <div class="value">
          <span>￥</span><span>{{recharge}}</span>
        </div>
      </div>
      <div class="others">
        <div>总共&nbsp;<span style="color: #ff4949">{{tableData.length}}</span>&nbsp;条</div>
      </div>
    </div>
    <el-table :data="tableData"
              style="width: 100%"
              border
              stripe
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="fetchDisabled"
              infinite-scroll-distance="20"
              max-height="450">
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
      fetcher.dealrecord.fetchTodayConsumeAndRecharge(this.uid)
        .then((response) => {
          if (response.data.status === 200) {
            this.consume = response.data.data.consume;
            this.recharge = response.data.data.recharge;
          }
        });
    },
    data () {
      // 数据
      return {
        consume: '-',
        recharge: '-',
        activeTab: 'data',
        uid: null,
        tableData: [],
        fetchDisabled: false,
        start: 1,
        pageSize: 20,
        canFetch: true
      };
    },
    methods: {
      // 方法
      loadMore () {
        this.fetchDisabled = true;
        if (this.canFetch) {
          fetcher.dealrecord.fetchPagination(this.uid, this.start, this.pageSize)
            .then((response) => {
              if (response.data.status === 200) {
                // success
                if (response.data.data.record.length >= this.pageSize) {
                  this.fetchDisabled = false;
                } else {
                  this.canFetch = false;
                }
                this.start++;
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
    }
  };
</script>
<style scoped>
  @import "../assets/global/css/global.css";

  .subscribe {
    position: relative;
    top: -10px;
    display: flex;
    box-sizing: border-box;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 60px;
  }

  .today-consume, .today-recharge {
    display: flex;
    flex-direction: row;
    width: 40%;
    box-sizing: border-box;
    height: 100%;
    padding-left: 10px;
  }

  .today-consume .description, .today-recharge .description {
    color: black;
    font-size: 1.5em;
    display: flex;
    font-family: "Microsoft YaHei", sans-serif;
    justify-content: flex-start;
    align-items: center;
    width: 30%;
    height: 100%;
  }

  .today-consume .value, .today-recharge .value {
    font-size: 1.6em;
    font-family: "Microsoft YaHei", sans-serif;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
  }

  .today-consume .value {
    color: darkorange;
  }

  .today-recharge .value {
    color: green;
  }

  .others {
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
    align-items: flex-end;
    box-sizing: border-box;
    width: 20%;
    height: 100%;
    padding-left: 10px;
    font-size: small;
  }
</style>
