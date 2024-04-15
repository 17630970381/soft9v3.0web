<template>
<div>
  <!-- 统计总数  -->
  <div class="topStatistic">
    <div class="topBigDiv">
      <div class="left">
        <el-card class="card">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>快捷入口</span>
          </div>
          <div class="quickEntryBox">
            <div v-for="(item, index) in quickEntry" :key="index">
              <div class="singleBox" @click="quickLink(index)">
                <img
                    :src="item.img"
                    class="imgStyle"
                    style="border-radius: 15px"
                />
                <div style="text-align: center">{{ item.title }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="right">
        <el-card class="card" :body-style="{ padding: '0px', paddingLeft: '20px', paddingRight: '20px', display: 'flex', flexWrap: 'wrap' }">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>统计信息</span>
          </div>

          <div class="cardGroup">
            <el-card class="statistic_item">
              <div class="text_place">
                <i class="el-icon-s-grid"></i> 专病集个数:{{ topData.specialityCount }}
              </div>
            </el-card>
            <el-card class="statistic_item">
              <div class="text_place">
                <i class="el-icon-s-data"></i> 样本总量:{{ topData.sampleCount }}
              </div>
            </el-card>

            <el-card class="statistic_item">
              <div class="text_place">
                <i class="el-icon-s-claim"></i> 模型总数:{{ topData.modelCount }}
              </div>
            </el-card>
          </div>
        </el-card>

      </div>
    </div>
<!--    <el-card class="top_statistic_card">-->
<!--      -->
<!--    </el-card>-->
  </div>
  <!-- 三个表 -->
  <div class="midStatistic">
    <el-card class="mid_statistic_card">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>疾病趋势发展图</span>
<!--          <el-select class="chartSelect" placeholder="请选择" style="width: 300px" v-model="diseaseName">-->
<!--            <el-option v-for="item in diagName" :key="item" :label="item" :value="item"></el-option>-->
<!--          </el-select>-->
        </div>
        <div id="chartBox" style="height: 400px;width: 500px;" v-if="charBoxVisiable">
          <firstGraph style="margin-left: 50px" :diseaName="diseaseName" :diagName="diagName" :graphdata="series"></firstGraph>
        </div>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>疾病占比</span>
        </div>
        <div id="chartBox" style="height: 400px;width: 500px;" v-if="charBoxVisiable2">
          <firstMidMid style="margin-left: 80px" :midMid="midMid">
          </firstMidMid>
        </div>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>缺失占比</span>
          <el-select class="BarchartSelect" v-model="table_value" placeholder="请选择数据集" size="mini" @change="table_val_change">
            <el-option v-for="item in table_value_options" :key="item" :label="item" :value="item" size="mini">
            </el-option>
          </el-select>
        </div>
          <div id="chartBox" style="height: 400px;width: 550px;" v-loading="fill_rate_loading" element-loading-text="后台加载中">
            <Sprit  style="margin-left: 90px" v-if="this.sprit_names.length !==0" :sprit_names="sprit_names" :sprit_values="sprit_values" :height="400" :width="550" :title="table_value">
            </Sprit>
        </div>
      </el-card>
    </el-card>
  </div>

<!--  <div class="bottomStatistic">-->
<!--    <el-card class="bottom_statistic_card">-->
<!--      <div slot="header" class="clearfix">-->
<!--        <span class="lineStyle">▍</span><span>正负样本占比</span>-->
<!--      </div>-->
<!--      <div id="chartBox">-->
<!--        <firstBottom></firstBottom>-->
<!--      </div>-->
<!--    </el-card>-->
<!--  </div>-->
  <div class="bottomStatistic">
    <el-card class="bottom_statistic_card">
      <div slot="header" class="clearfix">
        <span class="lineStyle">▍</span><span>正负样本占比</span>
      </div>
      <div id="chartBox">
        <Bar   v-if="this.bar_x.length !==0 && this.bar_pos.length!==0 && this.bar_neg.length!=0" style="height: 400px;width: 1400px;margin-left: 350px" :bar_x="bar_x" :bar_neg="bar_neg" :bar_pos="bar_pos">
        </Bar>
      </div>
    </el-card>
  </div>

</div>
</template>

<script >

import firstGraph from "@/views/graph/firstGraph.vue";
import firstMidMid from "@/views/graph/firstMidMid.vue";
import firstMidRight from "@/views/graph/firstMidRight.vue";
import firstBottom from "@/views/graph/firstBottom.vue";
import {getRequest} from "@/utils/api";
import Sprit from "@/components/tab/subcomponents/Sprit.vue";
import Bar from "@/components/tab/subcomponents/Bar.vue";

export default {
  name:"index2",
  components: {Bar, firstGraph,firstMidMid,firstMidRight,firstBottom,Sprit},
  data() {
    return{
      quickEntry: [
        {
          title: "健康资讯",
          img: require("../../assets/JKZX.png"),
          router: "/DieaseIntro",
        },
        {
          title: "数据管理",
          img: require("../../assets/lianxi.png"),
          router: "/dataManage",
        },

        {
          title: "模型训练",
          img: require("../../assets/modelTrain.png"),
          router: "/modelTrain",
        },
        {
          title: "任务管理",
          img: require("../../assets/singlePredict.png"),
          router: "/modelManage",
        },
        {
          title: "疾病预测",
          img: require("../../assets/batchPredict.png"),
          router: "/diseasePre_new",
        },
      ],
      topData: {
        specialityCount: '',
        sampleCount: '',
        startTime: '',
        modelCount: ''
      },
      diagName:[],
      diseaseName:"",
      series:[],
      charBoxVisiable: false,
      charBoxVisiable2: false,
      midMid:[],
      // 缺失值占比
      table_value_options: [],
      table_value: '',
      pieObject: [],
      sprit_names:[],
      sprit_values:[],
      fill_rate_loading:false,
      userbuilt_table_list:[],
      // 柱状图
      bar_x:[],
      bar_neg:[],
      bar_pos:[]
    }
  },
  created() {
    this.getTopData()
    this.getDiagName()
    this.getSeries()
    this.getSeries2()
    this.getInitInfo()
  },

  methods:{
    getTopData(){
      getRequest('merge/getTopData').then(res => {
         this.topData.specialityCount = res.data.specialityCount
         this.topData.sampleCount = res.data.sampleCount
         this.topData.startTime = res.data.startTime
         this.topData.modelCount = res.data.modelCount
      })
    },
    getDiagName(){
      getRequest('merge/getDiagName').then(res => {
        this.diagName = res.data
      })
    },
    getSeries(){
      getRequest('/merge/mergedata').then(res => {
        // console.log(res.data)
        let graphData = []
        for (const resKey in res.data) {
          let tempObject = {
            name: resKey,
            type: 'line',
            stack: 'Total',
            data: []
          }
          for (const key in res.data[resKey]) {
            tempObject.data.push(res.data[resKey][key])
          }
          // console.log(tempObject)
          graphData.push(tempObject)
        }
        this.series = graphData;
        this.charBoxVisiable = true;
      })
    },
    getSeries2(){
      getRequest('merge/getDiseaseRates').then(res => {
        let midTem = {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
        for (let key in res.data) {
          if (res.data.hasOwnProperty(key)) {
            // 将每个键值对转换成目标格式的对象，并添加到转换后的数据数组中
            midTem.data.push({
              value: res.data[key],
              name: key
            });
          }
        }
        this.midMid = midTem
        this.charBoxVisiable2 = true;
      })
    },
    table_val_change(){
      this.fill_rate_loading=true;
      this.sprit_names = [];
      this.sprit_values = [];
      getRequest(`scripts/get_fill_rate?tablename=${this.table_value}`).then(
          (res) => {
            this.sprit_names = res.column_name;
            this.sprit_values = res.miss_rate;
            this.fill_rate_loading=false;
          }
      );
    },
    getInitInfo() {
      getRequest("/DataManager/getTableName").then(
          (res) => {
            if (res) {
              this.table_value_options = res.data;
              this.table_value = this.table_value_options[0];
              this.table_val_change();
            } else {
              this.$message.error("获取数据失败");
            }
          }
      );

      getRequest("merge/get_pos_neg").then(
          (res) => {
            if (res.code == 200) {
              this.bar_x=Object.keys(res.data);
              let array = Object.values(res.data);
              for (let index = 0; index < array.length; index++) {
                const element = array[index];
                this.bar_neg.push(element.neg);
                this.bar_pos.push(element.pos);
                console.log(element.pos)
              }
            }
            else {
              this.$message.error("获取数据失败");
            }
          }
      )
    },
    quickLink(index) {
      this.$router.push(this.quickEntry[index].router);
    },
  },
}
</script>



<style scoped>
.topBigDiv {
  box-sizing: border-box;
  height: 20vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topBigDiv .left {
  box-sizing: border-box;
  width: 49%;
  height: 100%;
}

.topBigDiv .right {
  box-sizing: border-box;
  width: 49%;
  height: 100%;
}

.topBigDiv .left .quickEntryBox {
  /*border: 1px red solid;*/
  /*box-sizing: border-box;*/
  margin-top: 38px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.topBigDiv .left .quickEntryBox .singleBox {
  /*border: 1px red solid;*/
  /*box-sizing: border-box;*/
  width: 80px;
  height: 80px;
  border-radius: 20%;
}

.topBigDiv .left .quickEntryBox .imgStyle {
  width: 90%;
  height: 90%;
}

.bottomBigDiv {
  box-sizing: border-box;
  height: 55vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.bottomBigDiv .left {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
  overflow: hidden;
}

.bottomBigDiv .mid {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
}

.bottomBigDiv .right {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 40;
}

.card {
  padding: 0;
  height: 100%;
}

#chartBox {
  width: 100%;
  height: 100%;
}

.chartSelect {
  width: 100px;
  margin-left: 25px;
}

.BarchartSelect {
  width: 200px;
  margin-left: 25px;
}

.top_statistic_card {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: 33%;

  .el-card {
    display: inline-block;
    width: 15%;
    height: 100px;
    margin: 1%;
    padding: 10px;
    border: 1px solid #fff;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);

  }
}

.midStatistic {
  width: 100%;
}

.mid_statistic_card {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: 100%;

  .el-card {
    display: inline-block;
    width: 31%;
    height: 100%;
    margin: 0.5% 1.3% 0.5% 0.1%;
    border: 1px solid #fff;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);

  }
}

.bottomStatistic {
  width: 100%;
}

.bottom_statistic_card {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: 100%;
}

#taskChart {
  width: 100%;
  height: 100%;
}

.statistic_item {
  height:120px;
  //position: relative;
  //width: 300px;
}

.cardGroup{
  width: 100%;
  height: 15vh;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  column-gap: 30px;
  justify-content: space-evenly;
  align-content: center;
}

.statistic_item .text_place {
  //position: absolute;
  //top: 20px;
  //left: 50%;
  //transform: translate(-50%, -50%);
  //position: relative;
  line-height: 100px;
  font-size: 20px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

</style>