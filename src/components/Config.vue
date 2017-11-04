<template>
  <div class="container">
    <div class="pane">
      <div class="pane-title">参数</div>
      <div class="_div-row">
        <div class="col-title"><span>骑行单价</span></div>
        <div class="col-content"><input v-model="price" :disabled="priceLocked">
          &nbsp;&nbsp;<a href="javascript:void(0)" :style="{color: priceLocked? 'red' : 'green'}" @click="modifyPrice">{{priceLocked?
            '修改' : '提交'}}</a>
        </div>
      </div>
    </div>
    <div class="pane">
      <div class="pane-title">优惠活动</div>
      <el-table :data="tableData">
        <el-table-column label="标题" width="120">
          <template scope="props">
            <span>{{props.row | getTitle}}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述">
          <template scope="props">
            <span>{{props.row | getDescription}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="数值" width="120">
          <template scope="props">
            <input v-model="props.row.value" :disabled="props.row.locked"
                   :class="props.row.locked? 'locked':'editable'">
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template scope="props">
            <a href="javascript:void(0)" :style="{color: props.row.locked? 'red' : 'green'}" size="small"
               @click="modifyTableValue(props.row)">
              {{props.row.locked? '修改' : '提交'}}
            </a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import config from '../api/config';

  export default {
    name: 'config',
    beforeMount () {
      this.loadData();
    },
    data () {
      return {
        priceLocked: true,
        price: 10,
        tableData: [
          {
            type: 'adviceReward',
            locked: true,
            value: 20
          },
          {
            type: 'activityReward',
            locked: true,
            value: 10
          }
        ]
      };
    },
    methods: {
      loadData () {
        config.fetchConfig()
          .then((response) => {
            if (response.data.status === 200) {
              let data = response.data.data;
              this.price = data.price;
              this.tableData[0].value = data.adviceReward;
              this.tableData[1].value = data.activityReward;
            } else {
              this.$message.error('数据获取失败！');
            }
          })
          .catch(() => {
            this.$message.error('数据获取失败！');
          });
      },
      // 方法
      modifyPrice () {
        // true
        if (this.priceLocked) {
          this.priceLocked = false;
        } else {
          config.updateConfig(this.$store.getters.adminId, 'price', this.price)
            .then((response) => {
              console.log(response);
              if (response.data.status === 200) {
                this.$message.success('更新成功！');
              } else {
                this.$message.error('更新失败！');
              }
            })
            .catch(() => {
              this.$message.error('您的网络或服务器网络不稳定！');
            })
            .finally(() => {
              this.loadData();
              this.priceLocked = true;
            });
        }
      },
      modifyTableValue (row) {
        if (row.locked) {
          row.locked = false;
        } else {
          config.updateConfig(this.$store.getters.adminId, row.type, row.value)
            .then((response) => {
              if (response.data.status === 200) {
                this.$message.success('更新成功！');
              } else {
                this.$message.error('更新失败！');
              }
            })
            .catch(() => {
              this.$message.error('您的网络或服务器网络不稳定！');
            })
            .finally(() => {
              this.loadData();
              row.locked = true;
            });
        }
      }
    },
    filters: {
      // 过滤器
      getDescription (row) {
        switch (row.type) {
          case 'adviceReward':
            return `提交的反馈或建议被管理员采纳后，会奖励您${row.value}元的骑行券（可抵余额哦）。但是您必须已经拥有我们的骑行卡哦！:)`;
          case 'activityReward':
            return `发起的活动（50人及以上）被管理员批准，并且成功举行，我们会奖励您${row.value}元的骑行券（可抵余额哦）。但是您必须已经拥有我们的骑行卡哦！:)`;
          default:
            return 'Invalid message';
        }
      },
      getTitle (row) {
        switch (row.type) {
          case 'adviceReward':
            return `采纳反馈有奖`;
          case 'activityReward':
            return `发起活动有奖`;
          default:
            return 'Invalid message';
        }
      }
    }
  };
</script>
<style scoped>

  @import "../assets/global/css/global.css";

  a {
    font-size: small;
    text-decoration: none;
  }

  .pane {
    display: block;
    margin: 0 20px;
    font-size: 14px;
  }

  .pane-title {
    display: flex;
    align-items: center;
    padding-left: 10px;
    height: 40px;
    color: #393939;
    background-color: #ECEFD8;
  }

  ._div-row {
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .col-title {
    width: 10%;
    display: flex;
    font-size: 14px;
    color: #393939;
    padding-left: 10px;
    justify-content: flex-start;
    align-items: center;
  }

  .col-content {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  input {
    outline: none;
    padding: 2px 5px;
  }

  .locked {
    background-color: transparent;
    color: darkgray;
    border: none;
  }

  .editable {
    width: 80px;
    outline: none;
  }
</style>
