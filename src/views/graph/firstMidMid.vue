<template>
  <div id="firstMidMid" ref="firstMidMid"></div>
</template>

<script >
import * as echarts from 'echarts';
export default {
  name:"firstMidMid",
  data() {
    return {

    }
  },

  props:{
    title_text: {
      type: String,
      default: "饼图",
    },
    data: {
      type: Object,
      default: () => { },
    },
    midMid: {
      type: Array,
      default: [],
    }
  },
  mounted() {
    this.initMyChart();
  },
  methods: {
    initMyChart() {
      var chartDom = document.getElementById('firstMidMid');
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        title: {
          left: 'center',
          textStyle: {
            fontSize: 15, // 设置标题文字的大小
          },
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'top',
          textStyle: {
            fontSize: 8, // 图例文字的大小
          },
        },
        series: this.midMid
        //   {
        //     name: 'Access From',
        //     type: 'pie',
        //     radius: '50%',
        //     data: [
        //       { value: 1048, name: 'Search Engine' },
        //       { value: 735, name: 'Direct' },
        //       { value: 580, name: 'Email' },
        //       { value: 484, name: 'Union Ads' },
        //       { value: 300, name: 'Video Ads' }
        //     ],
        //     emphasis: {
        //       itemStyle: {
        //         shadowBlur: 10,
        //         shadowOffsetX: 0,
        //         shadowColor: 'rgba(0, 0, 0, 0.5)'
        //       }
        //     }
        //   }
        // ]
      };

      option && myChart.setOption(option);

    },
  },

}
</script>

<style scoped>
#firstMidMid {
  height: 400px;
  width: 350px;
}
</style>