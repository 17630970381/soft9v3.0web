<template>
  <div>
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
        <el-card class="card">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>系统模型信息</span>
          </div>
          <!--            画图容器-->
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="modelid" label="模型id" width="180">
            </el-table-column>
            <el-table-column prop="modelname" label="模型名称" width="180">
            </el-table-column>
            <el-table-column prop="type" label="算法类型"> </el-table-column>
            <el-table-column prop="time" label="模型预测次数">
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <div class="bottomBigDiv">
      <div class="left">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>批量预测结果</span>
          </div>
          <!-- <div
            v-for="(item, index) in diseaseData"
            :key="index"
            style="margin-top: 10px"
          >
            <div style="text-align: center">
              <span>{{ item.name }}</span>
              <el-progress
                :text-inside="true"
                :stroke-width="28"
                :percentage="(item.num * 100) / patientNum"
                style="margin-top: 10px"
              ></el-progress>
            </div>
          </div> -->
          <div class="block">
            <span class="demonstration" style="margin-right:15px">已预测数据</span>
            <el-cascader
              v-model="value1"
              :options="options"
              ></el-cascader>
            <div style="width:500px;height:500px; margin-top:20px">
              <PieChart :data="rateCount" :title="'患病风险统计'"></PieChart>
            </div>
          </div>

          
        </el-card>
      </div>
      <div class="mid">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>待定</span>
          </div>
          <div id="login" style="width: 500px;height:400px;"></div>
        </el-card>
      </div>
      <div class="right">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>现有数据信息</span>
          </div>
          <el-table :data="tableData2" stripe style="width: 100%"   height="400">
            <el-table-column prop="tableName" label="数据表" width="150px">
            </el-table-column>
            <el-table-column prop="diease" label="疾病" width="80px">
            </el-table-column>
            <el-table-column prop="tableSize" label="特征数量"> </el-table-column>
            <el-table-column prop="tableDate" label="创建时间">
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getRequest } from '@/utils/api';
import storage from '@/utils/storage';
import PieChart from '@/components/user/PieChart.vue'
export default {
  name: "index",
  components:{PieChart: PieChart},
  data() {
    return {
      mychart:{},
      
      rateCount:[{
          value: 20,
          name: "高风险"
        },
        {
          value: 86,
          name: "中风险"
        },
        {
          value: 95,
          name: "低风险"
        }
      ],
      options: [{
          value: 'zhinan',
          label: '心脏病',
          children: [{
            value: 'shejiyuanze',
            label: '心脏病数据集（一）'
          }, {
            value: 'daohang',
            label: '心脏病数据集（二）',
          }, {
            value: 'daohang2',
            label: '心脏病数据集（三）',
          }]
        }, {
          value: 'zujian',
          label: '慢性肾病',
          children: [{
            value: 'basic',
            label: '慢性肾病病人集（一）',
          },{
            value: 'basic2',
            label: '慢性肾病病人集（二）',
          } ]
        }],
      tableData: [
        {
          modelid: 1,
          modelname: "KNN",
          type: "分类",
          time: 6,
        },
        {
          modelid: 2,
          modelname: "随机森林",
          type: "分类",
          time: 4,
        },
        {
          modelid: 3,
          modelname: "xgboost",
          type: "分类",
          time: 3,
        },
      ],
      tableData2:[{
          tableName:"心脏病数据集（一）",
          diease:"心脏病",
          tableSize:13,
          tableDate:"2023.6.12 10:18"
        },
        {
          tableName:"心脏病数据集（二）",
          diease:"心脏病",
          tableSize:13,
          tableDate:"2023.6.12 15:32"
        },
        {
          tableName:"心脏病数据集（三）",
          diease:"心脏病",
          tableSize:13,
          tableDate:"2023.6.12 20:15"
        },
        {
          tableName:"现有病例数据",
          diease:"多疾病",
          tableSize:6,
          tableDate:"2023.6.8 16:26"
        }
      ],
      line: null,
      patientNum: 200,
      options_disease: [
        {
          value: "正在上传",
          label: "正在上传",
        },
        {
          value: "上传成功",
          label: "上传成功",
        },
        {
          value: "上传失败",
          label: "上传失败",
        },
      ],
      value1: "",
      quickEntry: [
        {
          title: "单例预测",
          img: require("../../assets/feiai.png"),
          router: "/dataManage",
        },
        {
          title: "批量预测",
          img: require("../../assets/dataManage.png"),
          router: "/userManage",
        },
        // {
        //   title: "多病种关联关系挖掘",
        //   img: require("../../assets/mutipile.png"),
        //   router: "/connectMining",
        // },
        // {
        //   title: "疾病预测",
        //   img: require("../../assets/feiai.png"),
        //   router: "/dangePredict",
        // },
        // { title: "其他功能", img: require("../../assets/other.png") },
      ],
      diseaseData: [
        {
          name: "胃癌",
          num: 30,
        },
        {
          name: "糖尿病",
          num: 23,
        },
        {
          name: "肺癌",
          num: 56,
        },
        {
          name: "乳腺癌",
          num: 12,
        },
        {
          name: "高血压",
          num: 22,
        },
      ],
    };
  },
  methods: {
    quickLink(index) {
      console.log(this.quickEntry[index].router);
      this.$router.push(this.quickEntry[index].router);
    },
    chart1() {
      var chartDom = document.getElementById('login');
      this.mychart = this.$echarts.init(chartDom);

      var option;
      option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
            showBackground: true,
            color:" #75AAF2",
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
          },
        ],
      };

      option && this.mychart.setOption(option);
    },
    // getAllData(){
    //     getRequest("/diabete/getAllData").then((response) => {
    //     console.log(response);
    //     if (response) {
    //       storage.set('allTableData',JSON.stringify(response.data.tableList));
    //       this.$store.commit('setAllTableData',storage.get('allTableData'));
    //     } else {
    //       console.log(response.status);
    //     }
    //     var tempList=JSON.parse(this.$store.getters.getAllTableData)
    //       for (let i = 0; i < tempList.length; i++) {
    //         const obj = {
    //           tableName: tempList[i].tableName,
    //           tableOrigin: tempList[i].tableOrigin,
    //           tableSize: tempList[i].tableSize,
    //           tableDate: tempList[i].startTime,
    //         };
    //         this.tableData2.push(obj);
    //       }
    //   });
      
    // }
  },
  mounted() {
    this.chart1();
    const that=this;
    this.mychart.resize();
    window.addEventListener('resize',()=>{
      that.mychart.resize()
    })
    // this.getAllData();s
  },
};
</script>

<style scoped>
.topBigDiv {
  box-sizing: border-box;
  height: 30vh;
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
  margin-top: 10px;
}
.bottomBigDiv .left {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
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
</style>
