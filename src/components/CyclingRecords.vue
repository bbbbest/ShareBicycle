<template>
  <div class="container" v-if="uid">
    <baidu-map class="bm-view"
               :center="{lng: (startPoint.lng + endPoint.lng)/2, lat: (startPoint.lat + endPoint.lat)/2}"
               :zoom="15" :scroll-wheel-zoom="true"
               ak="7tsGIRdUFBhrjldCcDTLXXYzWWWUu29N">
      <bm-marker
        :position="startPoint"
        :dragging="true">
      </bm-marker>
      <bm-marker
        :position="endPoint"
        animation="BMAP_ANIMATION_BOUNCE"
        :dragging="true">
      </bm-marker>
      <bm-polyline :path="[startPoint, endPoint]" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2"
                   :editing="true"></bm-polyline>
    </baidu-map>
    <el-table :data="tableData"
              style="width: 100%"
              border
              stripe
              @row-dblclick="showMap"
              max-height="200">
      <el-table-column
        prop="cyclingRecordId"
        label="编号"
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
        label="起始地点"
        align="center">
        <template scope="scope">
          <label>{{scope.row.startLocX}}, {{scope.row.startLocY}}</label>
        </template>
      </el-table-column>
      <el-table-column
        label="结束地点"
        align="center">
        <template scope="scope">
          <label>{{scope.row.endLocX}}, {{scope.row.endLocY}}</label>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div v-else>
    错误的请求，请确认操作！
  </div>
</template>
<script type="text/ecmascript-6">
  import fetcher from '../api/fetcher';
  import {BaiduMap, BmMarker, BmPolyline} from 'vue-baidu-map';

  export default {
    name: 'cycling-record',
    components: {
      BaiduMap,
      BmMarker,
      BmPolyline
    },
    created () {
      this.uid = this.$route.query.uid;
    },
    mounted () {
      fetcher.cyclingrecord.fetchPagination(this.uid, 1, 5)
        .then((response) => {
          this.tableData = response.data.data.allBrand;
        });
    },
    data () {
      // 数据
      return {
        uid: null,
        tableData: [],
        startPoint: {
          lng: 116.4071701000,
          lat: 39.9045900000
        },
        endPoint: {
          lng: 116.4071700100,
          lat: 39.9047900000
        }
      };
    },
    methods: {
      showMap (row, event) {
        this.startPoint.lng = row.startLocX;
        this.startPoint.lat = row.startLocY;
        this.endPoint.lng = row.endLocX;
        this.endPoint.lat = row.endLocY;
      }
    }
  };
</script>
<style scoped>
  @import "../assets/global/css/global.css";

  .bm-view {
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
  }
</style>
