<template>
<div>
  <div>
    <el-button @click="toModelMan" type="primary">返回</el-button>
    <el-button @click="result" >模型结果展示</el-button>
    <el-button @click="use" >模型调用</el-button>
  </div>
  <div v-if="isResult">
    <div style="margin-top: 10px">
      <el-table
          :data="tableData1"
          stripe
          :header-cell-style="{background:'#c0c0c0',color:'#fff'}"
          style="width: 100%">
        <el-table-column prop="modelname" label="模型名称"> </el-table-column>
        <el-table-column prop="alName" label="算法名称"> </el-table-column>
        <el-table-column prop="sampleName" label="样本名称"></el-table-column>
        <el-table-column prop="totalSamples" label="总样本量"></el-table-column>
        <el-table-column prop="totalFeatures" label="总特征数"></el-table-column>
        <el-table-column prop="accuracy" label="准确度"></el-table-column>
        <el-table-column prop="precision" label="精确度"></el-table-column>
        <el-table-column prop="recall" label="召回率"></el-table-column>
        <el-table-column prop="f1Score" label="F1分数"></el-table-column>
      </el-table>
    </div>
    <div >
      <!--  结果图  -->
      <div style="text-align: center;">
        <h3 style="margin: 10px;">PR曲线</h3>
        <div class="shuoming" style="margin: 5px 10px;">说明:横轴是召回率，纵轴器精确率;曲线上的一个点代表着在某一阈值下，
          模型将大于该阈值的结果判定为正样本，将低于该阈值的样本判定为负样本，通过阈值的变动而绘制出PR曲线，
          所以PR曲线综合考虑了不同阈值下的召回率与精确率。</div>
        <img :src="require(`@/assets/${dynamicVariable}/precision_recall_curve.png`)" alt="Image">
      </div>

      <div style="text-align: center;">
        <h3 style="margin: 10px;">ROC曲线</h3>
        <div class="shuoming" style="margin: 5px 10px;">说明:
          ROC（Receiver Operating Characteristic）曲线是一种用于评估二元分类器性能的图形工具。
          它显示了在不同阈值下真正例率（True Positive Rate，TPR）与假正例率（False Positive Rate，FPR）之间的关系。</div>
        <img :src="require(`@/assets/${dynamicVariable}/roc_curve.png`)" alt="Image">
      </div>

      <div style="text-align: center;">
        <h3 style="margin: 10px;">混淆矩阵</h3>
        <div class="shuoming" style="margin: 5px 10px;">说明:
          混淆矩阵（Confusion Matrix）是一种用于评估分类模型性能的表格，特别是在监督学习中用于评估分类任务的结果。
          它将模型的预测结果与真实结果进行比较，从而提供了对分类器性能的直观认识。</div>
        <h3 style="margin: 10px; " v-if="this.modelname === '多疾病(慢阻肺&糖尿病)'">慢阻肺</h3>
        <img  :src="require(`@/assets/${dynamicVariable}/confusion_matrix.png`)" alt="Image">
      </div>

      <div v-if="this.modelname !== '多疾病(慢阻肺&糖尿病)'" style="text-align: center;">
        <h3 style="margin: 10px;">特征重要度</h3>
        <div class="shuoming"  style="margin: 5px 10px;">说明:
          特征重要度（Feature Importance）是在机器学习领域中用于衡量模型中各个特征对于预测结果的贡献程度的指标。
          在训练完模型之后，特征重要度可以帮助我们理解模型是如何做出预测决策的，以及哪些特征对于模型的性能起到了关键作用。</div>
        <img :src="require(`@/assets/${dynamicVariable}/feature_importance.png`)" alt="Image">
      </div>
      <div v-else style="text-align: center;">
        <h3 style="margin: 10px;">糖尿病</h3>
        <img :src="require(`@/assets/${dynamicVariable}/confusion_matrix2.png`)" alt="Image">
      </div>

    </div>


  </div>
  <!--  模型调用  -->
  <div v-else class="container"
       element-loading-text="正在调用模型进行预测，请稍后"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       v-loading="loading">
    <div class="left" >
      <div
          style="margin-top: 20px"
      >
        <div style="height: calc(100vh - 300px);overflow-y: scroll">
          <div v-for="(feature, index) in selectedAlgorithmFeatures" :key="index"
               style="margin-bottom: 10px;">
            <label style="display: block">{{ feature.name }}: </label>
            <el-input  @keydown.enter.native="onEnterKey"  @keydown="validateInput($event)" :disabled="disabled" v-model="feature.value"  style="width: 80%" v-validate-number/>
            <span  v-if="!isNumeric(feature.value)" style="color: red;margin-left: 5px">只能输入数字!</span>
          </div>
        </div>
        <div style="margin-top: 20px" v-if="predictionResult1.length <= 0">
          <el-button v-if="!alFlag" @click="saveData" type="primary">保存所输入数值</el-button>
          <el-button v-if="alFlag" @click="promptDta"  type="success">提交数据，开始预测</el-button>
        </div>
      </div>
    </div>
    <div class="right" style="display: flex; justify-content: center; align-items: center; height: calc(100vh - 300px)">
      <div v-if="predictionResult1.length > 0">
        <div v-if="tableData1[0].sampleName === '多疾病' " class="small-div right">
          <el-card style="text-align: center">
            <div style="margin-bottom: 5px">该患者患有慢阻肺的概率为：{{ predictionResult1[0][modelname][0] }}</div>
            <div style="margin-bottom: 5px"> 该患者患有糖尿病的概率为：{{ predictionResult1[0][modelname][1] }}</div>
            <div style="text-align: center" v-if="predictionResult1[0][modelname][0] > 0.8 ||predictionResult1[0][modelname][0] > 0.8 "> 请及时就医</div>
          </el-card>
        </div>
        <div v-else class="small-div right">
          <el-card  v-if="predictionResult[modelname] == '0' " style="text-align: center">
            <div style="text-align: center;background: #00ff92">
              <h1 style="font-size: 30px">低风险</h1>
            </div>
            <div style="text-align: center">
              <h3 style="color: #303133">您患{{ tableData1[0].sampleName }}的风险很低，请保持现有生活习惯。</h3>
            </div>
          </el-card>
          <el-card v-if="predictionResult[modelname] == '1' " style="text-align: center">
            <el-card :body-style="{ height:'260px',padding: '10px'}" id="highRiskCard" style="text-align: center">
              <!-- 卡片头 -->
              <div slot="header" id="cardHead">
                <i class="el-icon-warning"></i>
                <span >高风险</span>
              </div>
              <!-- 卡片内容 -->
              <div style="padding: 14px;text-align: center" id="cardContent"  >
                <div>
                  <h3 style="color: #303133">您患{{ tableData1[0].sampleName }}的风险很高</h3>
                  <h3 style="color: #D80835">请尽快就医</h3>

                </div>
              </div>
            </el-card>
          </el-card>
        </div>
      </div>
      <div v-else>
        <el-card>
          <h3>
            预测结果将在此展示，请先输入左侧各参数的值，以此来进行预测
          </h3>
        </el-card>
      </div>
    </div>
  </div>

</div>
</template>

<script >
import Vue from "vue";

Vue.directive('validate-number', {
  bind(el) {
    el.addEventListener('input', function(event) {
      let inputValue = event.target.value;

      // 移除非数字和非小数点的字符
      inputValue = inputValue.replace(/[^0-9.]/g, '');

      // 处理多个小数点的情况，只保留第一个
      const dotIndex = inputValue.indexOf('.');
      if (dotIndex !== -1 && dotIndex !== 0 && inputValue[dotIndex - 1] === '.') {
        // 如果点号不是第一个字符且它前面已经有一个点号，则移除这个点号
        inputValue = inputValue.slice(0, dotIndex) + inputValue.slice(dotIndex + 1);
      } else if (dotIndex === 0) {
        // 如果点号是第一个字符，则移除它
        inputValue = inputValue.slice(1);
      }

      // 如果用户尝试输入的点号前没有数字，则删除这个点号
      if (dotIndex > 0 && isNaN(inputValue.slice(0, dotIndex))) {
        inputValue = inputValue.slice(0, dotIndex) + inputValue.slice(dotIndex + 1);
      }

      // 更新输入框的值
      event.target.value = inputValue;
    });
  }
});

import {getRequest} from "@/utils/api";
import resultShow from "@/components/modeTrain/resultShow.vue";
import Reuse from "@/components/modelManage/reuse.vue";
import {postRequest} from "@/api/user";

export default {
  name:'detail',
  components: {Reuse},
  computed:{
    resultShow() {
      return resultShow
    },
    modelname(){
      return this.$store.state.modelname

    },

  },
  data(){
    return{
      selectedAlgorithmFeatures:[],
      loading:false,
      disabled:false,
      dynamicVariable:"",
      tableData1: [{
        modelname: '',
        alName:'',
        sampleName: '',
        totalSamples: '',
        totalFeatures: '',
        accuracy:'',
        precision:'',
        recall:'',
        f1Score:'',
      }],
      resultData:{},
      pictureUrl:"",
      isResult: true,
      alFlag: false,
      predictionResult1:[],
      predictionResult:{},
      prevent:'',
    }
  },
  created() {
    this.getModelDetail()
  },
  methods:{
    onEnterKey(event) {
      if (event.key === 'Enter') {
        if (this.alFlag) {
          this.promptDta();
        } else {
          this.saveData();
        }
      }
    },
    getModelDetail(){
      getRequest(`/Model/getModelDetail/${this.modelname}`).then(res =>{
        this.tableData1[0].modelname = this.modelname

        const str = res[0].evaluate
        const jsonObj = JSON.parse(str.replace(/'/g, '"'));
        const resultMap = new Map();
        for (const key in jsonObj) {
          resultMap.set(key, jsonObj[key]);
        }
        console.log(resultMap)
        this.tableData1[0].accuracy = resultMap.get('accuracy')
        this.tableData1[0].precision = resultMap.get('precision')
        this.tableData1[0].recall = resultMap.get('recall')
        this.tableData1[0].f1Score = resultMap.get('f1')
        this.tableData1[0].alName = res[0].al
        this.tableData1[0].sampleName = res[0].diseasename
        this.pictureUrl = res[0].picture
        const match = this.pictureUrl.match(/(\d+_\w+)/);
        this.dynamicVariable = match ? match[1] : null;

        let tablename = res[0].tablename
        this.getNumber(tablename)
      })
    },
    test(){
      console.log(this.dynamicVariable)
    },
    toModelMan(){
      this.$router.replace('/modelManage')
    },
    getNumber(tablename){
      getRequest(`/Model/getNumber/${tablename}`).then(
          res => {
            this.tableData1[0].totalSamples = res[0]
            this.tableData1[0].totalFeatures = res[1]
          }
      )
    },
    getPictureUrl(imageName) {
      // 手动拼接文件夹路径和图片名称
      let path = this.pictureUrl + '\\' + imageName
      let cleanPath = path.replace(/'/g, ''); // 去掉所有单引
      return cleanPath
    },
    result(){
      this.isResult = true
    },
    use(){
      this.isResult = false
      this.getFea2()
    },
    getFea2(){
      getRequest(`/Model/getFea/${this.modelname}`).then(res => {
        console.log(res)
        const fieldArray = res.split(",");
        this.selectedAlgorithmFeatures = fieldArray.map(field => ({ name: field, value: '' }))
        console.log(this.selectedAlgorithmFeatures)
      })
    },
    saveData(){
      for (let i = 0; i < this.selectedAlgorithmFeatures.length; i++) {
        if (!this.selectedAlgorithmFeatures[i].value) {
          // 如果任何一个特征值为空，显示错误消息并返回
          this.$message.error(`${this.selectedAlgorithmFeatures[i].name} 不能为空`);
          return;
        }
      }
      this.alFlag = true
      this.disabled = true
    },
    promptDta(){
      this.loading = true
      const values = this.selectedAlgorithmFeatures.map(feature => feature.value);
      getRequest(`/Patient/getModelPathByModelName/${this.modelname}`).then(res => {
        let path = res;
        let fea = values
        let onlineUse = {
          path, fea
        }
        if(this.tableData1[0].sampleName === '多疾病'){
          postRequest('/OnlineUse/useMulti',onlineUse).then(res => {
            const obj = {}
            console.log(res)
            obj[this.modelname] = res.res
            this.predictionResult1.push(obj);
            this.predictionResult = this.predictionResult1.reduce((acc, cur) => {
              return { ...acc, ...cur };
            }, {});

            this.loading = false
            console.log("this.predictionResult1")
            console.log(this.predictionResult1)
            console.log("this.predictionResult")
            console.log(this.predictionResult)
            console.log(this.predictionResult[0])
          })
        }else {
          postRequest('/OnlineUse/use',onlineUse).then(res => {
            const obj = {}
            obj[this.modelname] = res.res[0]
            this.predictionResult1.push(obj);
            this.predictionResult = this.predictionResult1.reduce((acc, cur) => {
              return { ...acc, ...cur };
            }, {});
            this.loading = false
            console.log("this.predictionResult1")
            console.log(this.predictionResult1)
            console.log("this.predictionResult")
            console.log(this.predictionResult)
            console.log(this.predictionResult[this.modelname])

          })
        }
      })
    },
    validateInput(event) {
      // 允许输入的字符：数字、小数点、退格键、删除键
      const allowedCharacters = /[0-9\.]|Backspace|Delete/;
      if (!allowedCharacters.test(event.key)) {
        event.preventDefault();
      }
    },
    isNumeric(value) {
      return /^-?\d*\.?\d*$/.test(value);
    },



  }
}
</script>
<style scoped>
.shuoming{
  background-color: rgb(236,245,255);
  color: rgb(64,158,255);
  border-radius: 20px;
}
.container {
  display: flex;

}

.left {
  flex: 50%;
  border-right: #868585 1px solid;

}

.right {
  flex: 50%;
}
</style>