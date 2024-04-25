<template>
  <div>
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
    graphdata: {
      type: Array,
      default: [],
    },
    diseaseName:  String,
    diagName: Array,


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
          textStyle: {
            fontSize: 10, // 设置标题文字的大小
          },
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.diagName
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
          data: ['0','10', '20', '30', '40', '50', '60', '70', '80', '90', '100']
        },
        yAxis: {
          type: 'value'
        },
        series: this.graphdata
            // [
        //   {
        //     name: '心脏病',
        //     type: 'line',
        //     stack: 'Total',
        //     data: [120, 132, 101, 134, 90, 230, 210]
        //   },
        //   {
        //     name: '肺癌',
        //     type: 'line',
        //     stack: 'Total',
        //     data: [220, 182, 191, 234, 290, 330, 310]
        //   },
        //   {
        //     name: '胃癌',
        //     type: 'line',
        //     stack: 'Total',
        //     data: [150, 232, 201, 154, 190, 330, 410]
        //   }
        // ]
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
  height: 400px;
  width: 350px;
}
</style>