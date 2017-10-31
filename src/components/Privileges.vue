<template>
  <div class="container" v-if="queryAdmin">
    <el-table
      :data="allPrivileges"
      stripe
      border
      :max-height="tableHeight">
      <el-table-column
        prop="id"
        label="编号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="admin"
        label="管理员"
        align="center"
        width="150">
        <el-table-column align="center" label="查看" width="75">
          <template scope="scope">
            <icon :ok="scope.row.admin.query"></icon>
          </template>
        </el-table-column>
        <el-table-column align="center" label="修改" width="75">
          <template scope="scope">
            <icon :ok="scope.row.admin.update"></icon>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="user"
        label="用户"
        align="center"
        width="150">
        <el-table-column align="center" label="查看" width="75">
          <template scope="scope">
            <icon :ok="scope.row.user.query"></icon>
          </template>
        </el-table-column>
        <el-table-column align="center" label="修改" width="75">
          <template scope="scope">
            <icon :ok="scope.row.user.update"></icon>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="activity"
        label="活动"
        align="center"
        width="150">
        <el-table-column align="center" label="查看" width="75">
          <template scope="scope">
            <icon :ok="scope.row.activity.query"></icon>
          </template>
        </el-table-column>
        <el-table-column align="center" label="修改" width="75">
          <template scope="scope">
            <icon :ok="scope.row.activity.update"></icon>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="advice"
        label="反馈建议"
        align="center"
        width="150">
        <el-table-column align="center" label="查看" width="75">
          <template scope="scope">
            <icon :ok="scope.row.advice.query"></icon>
          </template>
        </el-table-column>
        <el-table-column align="center" label="修改" width="75">
          <template scope="scope">
            <icon :ok="scope.row.advice.update"></icon>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="bicycle"
        label="自行车"
        align="center"
        width="150">
        <el-table-column align="center" label="查看" width="75">
          <template scope="scope">
            <icon :ok="scope.row.bicycle.query"></icon>
          </template>
        </el-table-column>
        <el-table-column align="center" label="修改" width="75">
          <template scope="scope">
            <icon :ok="scope.row.bicycle.update"></icon>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="cyclingrecord"
        label="骑车记录"
        align="center"
        width="150">
        <el-table-column align="center" label="查看" width="75">
          <template scope="scope">
            <icon :ok="scope.row.cyclingrecord.query"></icon>
          </template>
        </el-table-column>
        <el-table-column align="center" label="修改" width="75">
          <template scope="scope">
            <icon :ok="scope.row.cyclingrecord.update"></icon>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="dealrecord"
        label="消费记录"
        align="center"
        width="150">
        <el-table-column align="center" label="查看" width="75">
          <template scope="scope">
            <icon :ok="scope.row.dealrecord.query"></icon>
          </template>
        </el-table-column>
        <el-table-column align="center" label="修改" width="75">
          <template scope="scope">
            <icon :ok="scope.row.dealrecord.update"></icon>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
  <div class="container" v-else>没有权限</div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex';
  import Icon from './Icon';

  export default {
    name: 'privileges',
    components: {Icon},
    props: {
      tableHeight: {
        type: Number,
        default: 500
      }
    },
    computed: {
      // 计算属性
      ...mapGetters(['allPrivileges', 'queryAdmin', 'updateAdmin'])
    }
  };
</script>
<style scoped>
  @import "../assets/global/css/global.css";
</style>
