<template>
  <div id="mychart"></div>
</template>
<script>
import * as echarts from "echarts"
import svg from "@/assets/people.svg"
export default {
  name: "",
  components: {},
  mixins: [],
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {
    this.initMyChart();
  },
  methods: {
    initMyChart() {
      //   var ROOT_PATH = "server";
      var chartDom = document.getElementById("mychart");
      var myChart = echarts.init(chartDom, "dark");
      var option;
      console.log(myChart);



      var svglink = svg;

        fetch(svglink)
        .then(response => response.text())
        .then((res) => {
        //   console.log(res);
          echarts.registerMap("organ_diagram", { svg: res});
          option = {
          tooltip: {},
          geo: {
            // left: '-10%',
            // right: "50%",
            top: "5%",

            map: "organ_diagram",
            selectedMode: "multiple",
            emphasis: {
              focus: "self",
              itemStyle: {
                color: null,
              },
              label: {
                position: "bottom",
                distance: 0,
                textBorderColor: "#fff",
                textBorderWidth: 2,
              },
            },
            blur: {},
            select: {
              itemStyle: {
                color: "#b50205",
              },
              label: {
                show: false,
                textBorderColor: "#fff",
                textBorderWidth: 2,
              },
            },
          },
        //   grid: {
        //     left: "60%",
        //     top: "20%",
        //     bottom: "20%",
        //   },
          xAxis: {},
        //   yAxis: {
        //     data: [
        //       "heart",
        //       "large-intestine",
        //       "small-intestine",
        //       "spleen",
        //       "kidney",
        //       "lung",
        //       "liver",
        //     ],
        //   },
        //   series: [
        //     {
        //       type: "bar",
        //       emphasis: {
        //         focus: "self",
        //       },
        //       data: [121, 321, 141, 52, 198, 289, 139],
        //     },
        //   ],
        };
        myChart.setOption(option);
        myChart.on("mouseover", { seriesIndex: 0 }, function (event) {
          myChart.dispatchAction({
            type: "highlight",
            geoIndex: 0,
            name: event.name,
          });
        });
        myChart.on("mouseout", { seriesIndex: 0 }, function (event) {
          myChart.dispatchAction({
            type: "downplay",
            geoIndex: 0,
            name: event.name,
          });
        });
        option && myChart.setOption(option);
      })
    },
  },
};
</script>
<style  scoped>
#mychart{
 width: 100%;
 height: 100%;
}
</style>
