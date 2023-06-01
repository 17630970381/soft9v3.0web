<template>
  <div id="mychart"></div>
</template>
<script>
import * as echarts from 'echarts';
import svg from '@/assets/people.svg';
export default {
  name: '',
  components: {},
  mixins: [],
  props: {selectName:String,hoverName:String,},
  data() {
    return {
      // selectName: '',
      // hoverName: '',
      outName:"",
      myChart:''
    };
  },
  computed: {},
  watch: {
   hoverName(){
     console.log(this.hoverName)
     if(this.outName){
       this.myChart.dispatchAction({
        type: 'downplay',
        geoIndex: 0,
        name: this.outName
      });
     }
     if(this.hoverName){
       this.outName=this.hoverName
        this.myChart.dispatchAction({
        type: 'highlight',
        // seriesIndex:0,
        geoIndex: 0,
        name: this.hoverName
      });
     }
   }
  },
  mounted() {
    this.initMyChart();
  },
  methods: {
    initMyChart() {
      //   var ROOT_PATH = "server";
      var chartDom = document.getElementById('mychart');
      var myChart = echarts.init(chartDom);
      this.myChart=myChart
      var option;
      // console.log(myChart);
      var svglink = svg;

      fetch(svglink)
        .then((response) => response.text())
        .then((res) => {
          //   console.log(res);
          echarts.registerMap('organ_diagram', { svg: res });
          option = {
            // backgroundColor: '#fff', // 设置底色
            tooltip: {},
            geo: {
              // left: '-10%',
              // right: "50%",
              itemStyle: {
                color: null,
              },
              top: '5%',
              map: 'organ_diagram',
              selectedMode: 'multiple',
              emphasis: {
                focus: 'self',
                itemStyle: {
                  color: null,
                },
                label: {
                  position: 'bottom',
                  distance: 0,
                  textBorderColor: '#fff',
                  textBorderWidth: 2,
                },
              },
              blur: {},
              select: {
                itemStyle: {
                  color: '#b50000',
                  opacity: 1, // 设置元素的透明度为 1，保持不变颜色

                },
                label: {
                  show: false,
                  textBorderColor: '#fff',
                  textBorderWidth: 2,
                },
               
              },
            },
          };
          this.myChart.setOption(option);
          this.myChart.on('mouseover',{ seriesIndex: 0 }, event=> {
            this.$emit('hover',event.name)
          });
          this.myChart.on('mouseout',{ seriesIndex: 0 },  event=> {
            this.$emit('hover','')
          });
          this.myChart.on('click', event=> {
            this.$emit('select',event.name)
          });
          option && this.myChart.setOption(option);
        });
    },
  },
};
</script>
<style scoped>
#mychart {
  width: 140%;
  height: 100%;
  transform: translateX(-20%);
  background-color: aliceblue;
}
</style>
