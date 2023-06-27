<template>
  <div id="pie" ref="pie"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "PieChart",
  props: { contribute:Array, rate:Number},
  data(){
    return {
    }  
  },

  mounted(){
    this.initMyChart();
  },

  methods:{
    initMyChart(){
      var chartDom = this.$refs.pie;
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: '危险因素权重',
          subtext: `您的患病风险是${this.rate}%`,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {d}%'
        },
        toolbox: {
          // show: true,
          feature: {
            // mark: { show: true },
            // dataView: { show: true, readOnly: false },
            // restore: { show: true },
            // saveAsImage: { show: true }
          }
        },
        series: [
          {
            // name: '危险因素权重',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            // roseType: 'area',
            itemStyle: {
              borderRadius: 0
            },
            data: this.contribute
          }
        ]
      };

      option && myChart.setOption(option);
    }
  }
}
</script>

<style>
#pie{
  width: 100%;
  height: 100%;
}
</style>