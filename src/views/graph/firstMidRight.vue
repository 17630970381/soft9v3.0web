<template>
  <div id="firstMidRight" ref="firstMidRight"></div>
</template>

<script >
import * as echarts from 'echarts';
export default {
  name:"firstMidRight",
  data() {
    return {

    }
  },

  props:{
    title_text: {
      type: String,
      default: "柱状图",
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
      var chartDom = document.getElementById('firstMidRight');
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        title: {
          text: '缺失占比',
          textStyle: {
            fontSize: 15, // 设置标题文字的大小
          },

        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']
        },
        series: [
          {
            name: '缺失占比',
            type: 'bar',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          }
        ]
      };

      option && myChart.setOption(option);


    },
  },

}
</script>

<style scoped>
#firstMidRight {
  height: 400px;
  width: 350px;
}
</style>