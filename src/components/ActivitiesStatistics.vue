<template>
  <div class="container">
    <el-select v-model="currentType" placeholder="请选择类型">
      <el-option v-for="type in types" :key="type.val" :label="type.name" :value="type.val"></el-option>
    </el-select>
    <ve-chart :data="chartData" :settings="chartSettings"></ve-chart>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'activities-statistics',
    data () {
      return {
        chartData: {},
        currentType: '',
        types: [
          {
            name: '线性图',
            val: 'line'
          },
          {
            name: '柱状图',
            val: 'histogram'
          },
          {
            name: '饼图',
            val: 'pie'
          }
        ],
        chartSettings: {}
      };
    },
    watch: {
      // 监听器
      currentType: function (nval, oval) {
        console.log(nval);
        this.chartSettings = {type: nval};
      }
    },
    methods: {
    },
    created: function () {
      this.chartData = {
        columns: ['日期', '销售额-1季度'],
        rows: [
          {'日期': '1月1日', '销售额-1季度': 1523},
          {'日期': '1月2日', '销售额-1季度': 1223},
          {'日期': '1月3日', '销售额-1季度': 2123},
          {'日期': '1月4日', '销售额-1季度': 4123},
          {'日期': '1月5日', '销售额-1季度': 3123},
          {'日期': '1月6日', '销售额-1季度': 7123}
        ]
      };
      this.chartSettings = {type: this.types[0].val};
    }
  };
</script>
<style scoped>
  @import "../assets/global/css/global.css";
</style>
