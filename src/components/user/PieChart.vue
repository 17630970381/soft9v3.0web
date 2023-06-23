<template>
  <div id="pie" ref="pie"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "PieChart",
  props: { rate:Number },
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
          subtext: '仅供参考',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: [
            'rose1',
            'rose2',
            'rose3',
            'rose4',
            'rose5',
            'rose6',
            'rose7',
            'rose8'
          ]
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            // restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '危险因素权重',
            type: 'pie',
            radius: [20, 140],
            center: ['50%', '45%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            data: [
              { value: 0.359, name: '血清胆固醇' },
              { value: 0.314, name: '静息血压' },
              { value: 0.261, name: '最大心率' },
              { value: 0.114, name: '静息心电图' },
              { value: 0.051, name: '地中海贫血' },
              { value: 0.038, name: '运动时ST段峰值' }
            ]
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