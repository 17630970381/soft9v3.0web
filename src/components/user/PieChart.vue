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
          text: 'Nightingale Chart',
          subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
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
            name: 'Area Mode',
            type: 'pie',
            radius: [20, 140],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 5
            },
            data: [
              { value: 0.559, name: '运动引起的ST型抑郁' },
              { value: 0.314, name: 'rose 2' },
              { value: 0.211, name: 'rose 3' },
              { value: 0.638, name: 'rose 4' },
              { value: 0.511, name: 'rose 5' },
              { value: 0.038, name: 'rose 6' }
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