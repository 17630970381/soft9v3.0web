<template>
  <div>
    <el-select v-model="selectedDisease" placeholder="请选择疾病" @change="updateChart">
      <el-option label="心脏病" value="heartDisease"></el-option>
      <el-option label="肾癌" value="kidneyCancer"></el-option>
      <el-option label="肺癌" value="lungCancer"></el-option>
      <el-option label="全部" value="all"></el-option>
    </el-select>
    <div id="firstGraph" ref="firstGraph"></div>
  </div>

</template>

<script >
import * as echarts from 'echarts';
export default {
  name:"firstGraph",
  data() {
    return {

    }
  },

  props:{
    title_text: {
      type: String,
      default: "折线图",
    },
    data: {
      type: Object,
      default: () => { },
    },
  },
  mounted() {
    this.initMyChart();
  },
  methods: {
    initMyChart() {
      var chartDom = document.getElementById('firstGraph');;
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        title: {
          text: '年龄-疾病趋势发展图',
          textStyle: {
            fontSize: 10, // 设置标题文字的大小
          },
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['心脏病', '肺癌', '胃癌']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['10', '20', '30', '40', '50', '60', '70']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '心脏病',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '肺癌',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '胃癌',
            type: 'line',
            stack: 'Total',
            data: [150, 232, 201, 154, 190, 330, 410]
          }
        ]
      };

      option && myChart.setOption(option);
    },
    updateChart() {
      console.log("updateChart")
    }
  },


}
</script>

<style scoped>
#firstGraph {
  width: 400px;
  height: 280px;
}
</style>