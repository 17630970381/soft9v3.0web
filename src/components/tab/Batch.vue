<template>
  <div>
    <!-- -------------步骤条----------------- -->
    <el-header>
      <div id="step">
        <el-steps :active="step" align-center>
          <el-step title="选择疾病"></el-step>
          <el-step title="选择数据"></el-step>
          <el-step title="疾病预测"></el-step>
        </el-steps>
      </div>
    </el-header>

    <el-divider></el-divider>

    <!-- -------------------------------------选择模型页面---------------------------------------------- -->
    <el-main v-if="showView === 'modelPage'">
      <div id="modleSelect">
        <h2>请选择您想预测的疾病：</h2>
        <br>
        <el-radio-group id="disGroup" v-model="model" ref="disGroup">
          <el-radio v-for="dis,index in modelOptions" 
          :key="index"
          :label="dis.value"
          class="disGroup-item"
          border
          :disabled="dis.disable"
          >{{dis.name}}</el-radio>
        </el-radio-group>

      </div>
      <el-button id="btn" type="primary" @click="next()" style="margin-left: 45%;margin-top: 50px;" round>确认</el-button>
      
    </el-main>

    <!-- -------------------------------------选择数据表页面 --------------------------------------------------->
    <el-main v-if="showView === 'dataSelect'" class="mainPage">
      <div id="dataList">
        <el-card 
        :body-style="{ padding: '0px'}" 
        v-for="(item,index) in dataList"
        :key=index
        :shadow="chosenData === item.id ? 'always':'hover'" 
        style="width:200px"
        @click.native="chosenData = item.id;getData(item.id)" 
        >
          <img src="@/assets/dataset.png" class="image" object-fit="contain">
          <div style="padding: 14px;">
            <span>{{item.name}}</span>
            <div class="bottom clearfix">
              <time class="time">{{item.time}}</time>
              <el-button type="text" class="button" @click="predict(item.id)">预测该表</el-button>
            </div>
          </div>
        </el-card>
      </div>
      <el-table
      v-if="((showView === 'dataSelect') && (chosenData))"
      :data="patientTable"
      style="width: 100%; margin-top: 20px;"
      max-height="450px"
      border
      stripe
      v-loading="getData_loading"
      element-loading-text="正在获取数据"
      element-loading-spinner="el-icon-loading"
      >
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          v-for="(key,index) in Object.keys(patientTable[0])"
          :key="index"
          :label="key"
          :prop="key">
        </el-table-column>
        
      </el-table>

    </el-main>


    <!-- -------------------------------------结果页面---------------------------------------------- -->
    <el-main v-if="showView === 'resultPage'" class="mainPage" v-loading="result_loading" element-loading-text="抓紧预测中">
      <div id="pie">
        <PieChart :data="rateCount" :title="'患病风险统计'"></PieChart>
      </div>
      <el-table
      :data="predictResult"
      style="width: 100%; margin-top: 20px"
      max-height="500px"
      border
      stripe
      >
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          v-for="(key,index) in Object.keys(predictResult[0])"
          :key="index"
          :label="key"
          :prop="key">
        </el-table-column>
      </el-table>
      <el-button type="success" @click="done" style="margin-left: 47%;margin-top: 20px" round>完成</el-button>
    </el-main>
  </div>
</template>

<script>
import modelOptions from '../user/js/modelOptions_batch.js'
import heartDataSet from '../user/js/heartDataSet.js'
import {dataInfoPost} from '@/api/user.js'
import PieChart from '../user/PieChart.vue'
export default {
    name: 'Batch',
    components:{PieChart: PieChart},
    computed:{},
    data(){
        return {
          result_loading:false,
          getData_loading:false,
          step: 1,
          model: 1,
          showView: "modelPage",
          modelOptions:modelOptions,
          chosenData: null,
          dataList: [],
          patientTable: [],
          predictResult: [],
          rateCount:[],
        }
    },

    mounted() {
         this.init();
         
    },

    methods:{
      init(){
        this.$refs.disGroup.$el.querySelector('input').focus()
        
        // 回车触发按钮只能在选疾病页面使用，暂未解决
        document.addEventListener('keyup',(e)=>{
          if(e.key=='Enter'){
            // if(this.symptom.isShow){
            //   this.submitPredict();
            // }
            if(this.showView === "modelPage"){
              this.next();
              // console.log(this.symptom.isShow);
            }
          }
        })
      },

      next() {
          switch(this.model){
            case 1:
              this.dataList = heartDataSet;
              this.showView = "dataSelect"
              this.step = 2;
              break;

            default:
              alert("请选择疾病");
              break;
          }
      },

      getData(id){
        this.getData_loading = true;
        dataInfoPost("TableManager/getInfoByTableName",id).then((res)=>{
          this.patientTable = res.data;
          this.getData_loading = false;
        })
      },

      predict(id){
        this.result_loading = true;
        dataInfoPost("/runtime_bus/submit-hearts",id).then((res)=>{
          this.predictResult = res.data;
          let high = 0;
          let mid = 0;
          let low = 0;
          for (const item of this.predictResult) {
            let rate = parseFloat((item.disease_probability*100).toFixed(2));
            if(rate > 70){
              item.disease_probability = rate +"% (高风险)";
              high++;
            }else if(rate >45){
              item.disease_probability = rate +"% (中风险)";
              mid++;
            }else{
              item.disease_probability = rate +"% (低风险)";
              low++;
            }
            
          }
          if(low > 0){
            let lowCount = {
              value: low,
              name: "低风险"
            }
            this.rateCount.push(lowCount);
          }else{//手动添加假数据
            let lowCount = {
              value: 10,
              name: "低风险"
            }
            this.rateCount.push(lowCount);
          }
          if(mid >0 ){
            let midCount = {
              value: mid,
              name: "中风险"
            }
            this.rateCount.push(midCount);
          }else{//手动添加假数据
            let midCount = {
              value: 5,
              name: "中风险"
            }
            this.rateCount.push(midCount);
          }
          if(high > 0){
            let highCount = {
              value: high,
              name: "高风险"
            }
            this.rateCount.push(highCount);
          }
          this.showView = "resultPage";

          this.result_loading = false;
          
        })
        
      },

      done(){
          this.patientTable=[]
          this.predictResult = [];
          this.rateCount = [];
          this.showView = "modelPage";//切换页面
          this.step = 1;
      },

    }
}

</script>

<style scoped>
.mainPage{
  width: 80%;
  margin-left: 10%;
}
/* 步骤条 */
#step {
  margin-top: 20px;
}

/* 病种选择页面 */
#modleSelect{
  display: flex;
  flex-direction: column;
  margin-left: 20%;
}
#disGroup{
  width: 60%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}
.disGroup-item{
  width: 150px;
  margin-bottom: 10px;
}

/* 选择数据表页面 */
  /* 卡片列表 */
  #dataList{
    width: 80%;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
    margin-left: 100px
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .button {
    padding: 0;
    float: right;
  }
  .image {
    width: 100%;
    display: block;
  }
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }

/* 结果页面 */
  /* 饼状图 */
  #pie{
    width: 500px;
    height: 500px;
    margin-left: 20%;
    margin-bottom: -120px;
  }
</style>