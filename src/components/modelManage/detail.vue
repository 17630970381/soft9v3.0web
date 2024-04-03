<template>
<div>
  <div>
    <el-button @click="toModelMan" type="primary">返回</el-button>
  </div>
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
  <div>
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
</template>

<script >


import {getRequest} from "@/utils/api";

export default {
  name:'detail',
  computed:{
    modelname(){
      return this.$store.state.modelname
    }
  },
  data(){
    return{
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
    }
  },
  created() {
    this.getModelDetail()
  },
  methods:{

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
  }
}
</script>
<style scoped>
.shuoming{
  background-color: rgb(236,245,255);
  color: rgb(64,158,255);
  border-radius: 20px;
}
</style>