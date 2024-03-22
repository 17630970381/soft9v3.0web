
<template>
  <div>
    <div style="border-bottom: #868585 solid 1px; padding-bottom: 10px">
      <el-steps :active="active">
        <el-step title="任务信息" icon="el-icon-edit"></el-step>
        <el-step title="选择数据" icon="el-icon-upload"></el-step>
        <el-step title="特征选择" icon="el-icon-picture"></el-step>
        <el-step title="算法选择" icon="el-icon-picture"></el-step>
        <el-step title="运算结果" icon="el-icon-picture"></el-step>
      </el-steps>
    </div>

    <div class="resultShow">
    <!--  三个选择按钮    -->
      <div class="small-div left">
        <el-button style="margin-top: 30px;margin-left: 9px;width: 130px"
                   type="primary"
                    @click="modelEvaluation">
          模型评估
        </el-button>
        <el-button style="margin-top: 20px;width: 130px"  type="primary"
                    @click="modelShow">
          模型演示
        </el-button>
        <el-button style="margin-top: 20px;width: 130px"  type="primary"  @click="saveModel">保存模型</el-button>
        <el-button style="margin-top: 20px;width: 130px"  type="primary"  @click="test">test</el-button>
      </div>
    <!--  主体展示     -->
      <div class="small-div right">
    <!--    模型评估    -->
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item v-for="(item, index) in selectedAlgorithms" :key="index" :index="item">{{ item }}</el-menu-item>
        </el-menu>
        <div v-if="sequence === 1" id="downloadArea"
             element-loading-text="模型正在训练，请稍后"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             v-loading="loading">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h1 style="margin: 20px 20px 20px 20px; font-size: 25px;display: inline-block">模型效果评价</h1>
              <div>
                <el-button style="margin-top: 20px;margin-right: 10px; width: 100px"  @click="downloadPDF" type="primary">下载报告</el-button>
              </div>
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
                <el-table-column prop="positiveSamples" label="正样本量"></el-table-column>
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
                <el-tag style="margin: 5px 10px;">说明:横轴是召回率，纵轴器精确率;曲线上的一个点代表着在某一阈值下，
                  模型将大于该阈值的结果判定为正样本，将低于该阈值的样本判定为负样本，通过阈值的变动而绘制出PR曲线，
                  所以PR曲线综合考虑了不同阈值下的召回率与精确率。</el-tag>
                <img :src="require('@/assets/20240322201734_RF/precision_recall_curve.png')" alt="Image">
              </div>

              <div style="text-align: center;">
                <h3 style="margin: 10px;">ROC曲线</h3>
                <el-tag style="margin: 5px 10px;">说明:
                  ROC（Receiver Operating Characteristic）曲线是一种用于评估二元分类器性能的图形工具。
                  它显示了在不同阈值下真正例率（True Positive Rate，TPR）与假正例率（False Positive Rate，FPR）之间的关系。</el-tag>
                <img :src="require('@/assets/20240322201734_RF/roc_curve.png')" alt="Image">
              </div>

              <div style="text-align: center;">
                <h3 style="margin: 10px;">混淆矩阵</h3>
                <el-tag style="margin: 5px 10px;">说明:
                  混淆矩阵（Confusion Matrix）是一种用于评估分类模型性能的表格，特别是在监督学习中用于评估分类任务的结果。
                  它将模型的预测结果与真实结果进行比较，从而提供了对分类器性能的直观认识。</el-tag>
                <img :src="require('@/assets/20240322201734_RF/confusion_matrix.png')" alt="Image">
              </div>

              <div style="text-align: center;">
                <h3 style="margin: 10px;">特征重要度</h3>
                <el-tag style="margin: 5px 10px;">说明:
                  特征重要度（Feature Importance）是在机器学习领域中用于衡量模型中各个特征对于预测结果的贡献程度的指标。
                  在训练完模型之后，特征重要度可以帮助我们理解模型是如何做出预测决策的，以及哪些特征对于模型的性能起到了关键作用。</el-tag>
                <img :src="require('@/assets/20240322201734_RF/feature_importance.png')" alt="Image">
              </div>
            </div>
        </div>
        <!--    模型演示    -->
        <div v-if="sequence === 2" element-loading-text="正在进行预测，请稍后"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             v-loading="loading2">
          <div style="margin-left: 20px;margin-top: 20px">
            <span style="display: block;margin-bottom: 5px;font-size: 30px;">当前所选算法： {{electionAl}}</span>
            <div v-for="(feature, index) in selectedAlgorithmFeatures" :key="index"
                 style="margin-bottom: 10px;display: flex; flex-direction: column;">
              <label>{{ feature.name }}: </label>
              <el-input v-model="feature.value"  v-validate-number style="width: 50%"/>
            </div>
            <el-button @click="promptTest" type="success">提交数据，开始预测</el-button>
          </div>
          <div>
            <el-card  v-if="predictionResult === '0'"
                style="margin-top: 20px;margin-left: 20px;width: 50%;
                background-color: #3cadad; border-radius: 30px">
              <p style="font-size: 20px;">该数据患有{{ diseasename }}的概率较低</p>
            </el-card>
            <el-card v-if="predictionResult === '1'"
                     style="margin-top: 20px;margin-left: 20px;width: 50%;
                      background-color: #ce1f1f; border-radius: 30px">
              <p style="font-size: 20px;font-weight: bold">该数据患有{{ diseasename }}的概率较高，请及时就医!!</p>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import {postRequest} from "@/api/user";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {mapState} from "vuex";

Vue.directive('validate-number', {
  bind(el) {
    el.addEventListener('input', function(event) {
      let inputValue = event.target.value;

      // 移除非数字和非小数点的字符
      inputValue = inputValue.replace(/[^0-9.]/g, '');

      // 处理多个小数点的情况，只保留第一个
      const dotIndex = inputValue.indexOf('.');
      if (dotIndex !== -1) {
        inputValue = inputValue.slice(0, dotIndex + 1) + inputValue.slice(dotIndex).replace(/\./g, '');
      }

      // 更新输入框的值
      event.target.value = inputValue;
    });
  }
});

export default {
  name: "resultShow",
  ...mapState(['resultData']),
  computed: {
    formData() {
      return this.$store.state.formData
    },

    resultData(){
      return this.$store.state.resultData
    },

    selectedAlgorithms() {
      return this.$store.state.selectedAlgorithms
    },
    // 特征选择里的特征
    // featureChooseData: {
    //   target: "",
    //   trainFea: [],
    // },
    featureChooseData() {
      return this.$store.getters.getFeatureChooseData;
    },

    tableName(){
      return this.$store.state.tableName
    },

    completeParameter(){
      return this.$store.state.completeParameter
    }


  },
  data() {
    return {
      diseasename:"",
      uid:516005890,
      active:5,
      sequence: 1,
      tableData1: [{
        modelname: '测试',
        alName:'',
        sampleName: '胃癌',
        totalSamples: '431',
        positiveSamples: '188',
        accuracy:'',
        precision:'',
        recall:'',
        f1Score:'',
      }],
      // 所选的特征，用于模型演示
      //图片
      pictureUrl:"",
      // 测试死数据
      selectedAlgorithms:[],
      resultData:{
        //  "RF":[{"uid": 516005890 ,"modelname":"test1",
        //    "evaluate": "{'accuracy': 0.71696, 'precision': 0.71780, 'recall': 0.71395, 'f1': 0.76285}",
        //    "picture": "'@\\assets\\20240319195319_RF'",
        //    "pkl":"E:\\soft\\software9-3\\software9\\src\\main\\resources\\Algorithm\\PKL\\20240319195319_RF.pkl"
        //  }],
        // "DT":[{"uid": 516005890 ,"modelname":"test2",
        //   "evaluate": "{'accuracy': 0.81696, 'precision': 0.81780, 'recall': 0.81395, 'f1': 0.8628}",
        //   "picture": "@\\assets\\20240319195314_DT",
        //   "pkl":"E:\\soft\\software9-3\\software9\\src\\main\\resources\\Algorithm\\PKL\\20240319195319_RF.pkl"
        // }]
      },
      activeIndex: 'RF',
      electionAl: 'RF',

      //模型演示
      selectedAlgorithmFeatures: [],
      //   所有算法特征值输入完毕
      alFlag: false,

      // 模型调用结果
      predictionResult: '',
      isResultDataEmpty: true,
      selectedData: [],
      loading: true,
      loading2: false

    }
  },
  created() {
    this.predictionResult = ''
    this.load()

  },
  mounted() {




  },
  watch: {
    electionAl(newAlgorithm, oldAlgorithm) {
      // electionAl 变化时更新 selectedAlgorithmFeatures
      this.updateSelectedAlgorithmFeatures();
    },


  },
  methods: {
    load(){
      let trainAl= {}
      let target =  this.featureChooseData.target
      let fea = this.featureChooseData.trainFea
      let tableName = this.tableName
      let completeParameter = this.completeParameter
      trainAl = {
        target,fea,tableName,completeParameter
      }
      postRequest("/Model/trainAl",trainAl).then(res => {
        this.resultData = res
        console.log(this.resultData)
        this.selectedData = this.resultData[this.electionAl] || []
        console.log(this.selectedData)
        this.tableData1[0].alName = this.electionAl
        const str = this.selectedData[0].evaluate
        const jsonObj = JSON.parse(str.replace(/'/g, '"'));
        const resultMap = new Map();
        for (const key in jsonObj) {
          resultMap.set(key, jsonObj[key]);
        }
        this.tableData1[0].accuracy = resultMap.get('accuracy')
        this.tableData1[0].precision = resultMap.get('precision')
        this.tableData1[0].recall = resultMap.get('recall')
        this.tableData1[0].f1Score = resultMap.get('f1')
        this.pictureUrl = this.selectedData[0].picture
        this.updateSelectedAlgorithmFeatures()
        this.loading = false
      })
    },
    toFeatureChoose(){
      this.$router.replace('/featureChoose')
    },
    toAlChoose(){
      this.$router.replace('/alChoose')
    },
    modelEvaluation(){
      this.sequence = 1
    },
    modelShow() {
      this.sequence = 2
    },
    test(){
      console.log(this.selectedAlgorithmFeatures)
    },
    handleSelect(key){
      this.electionAl = key
      this.tableData1[0].alName = key
      const str = this.selectedData[0].evaluate
      const jsonObj = JSON.parse(str.replace(/'/g, '"'));
      const resultMap = new Map();
      for (const key in jsonObj) {
        resultMap.set(key, jsonObj[key]);
      }
      this.tableData1[0].accuracy = resultMap.get('accuracy')
      this.tableData1[0].precision = resultMap.get('precision')
      this.tableData1[0].recall = resultMap.get('recall')
      this.tableData1[0].f1Score = resultMap.get('f1')
      this.pictureUrl = this.selectedData[0].picture

    },

    getPictureUrl(imageName) {
      // 手动拼接文件夹路径和图片名称
      let path = this.pictureUrl + '\\' + imageName
      let cleanPath = path.replace(/'/g, ''); // 去掉所有单引
      return require(cleanPath)
    },

    // 模型演示
    // 获取特征
    updateSelectedAlgorithmFeatures(){
      this.selectedAlgorithmFeatures = this.featureChooseData.trainFea
          ? this.featureChooseData.trainFea.map(name => ({ name, value: '' }))
          : [];
    },
    // 提交测试
    promptTest(){
      this.loading2 = true
      let path = this.selectedData[0].pkl
      // let path = "E:\\soft\\software9-3\\software9\\src\\main\\resources\\Algorithm\\PKL\\20240319195319_RF.pkl"
      let fea = this.selectedAlgorithmFeatures.map(item => item.value)
      // let fea = ['2', '1', '1', '1', '1', '15', '5', '0', '0', '0', '0', '1', '2', '0', '0', '0', '0', '0', '0', '1', '1']
      // let fea = ['2', '1', '1', '1', '1', '15', '5', '0', '0', '0', '0', '4', '2', '0', '0', '0', '0', '1', '1', '1', '1']
      // 发送请求
      let onlineUse = {
          path, fea
      }
      console.log(onlineUse)
      postRequest('/OnlineUse/use',onlineUse).then(res => {
        this.predictionResult = res.res[0]
        this.loading2 = false
      })
    },
    // 保存模型
    saveModel(){
      this.$alert('模型已保存', '', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'success',
            message: `模型保存成功`
          });
        }
      });
      this.$router.replace('/modelTrain')
    },

    downloadPDF() {
      // 获取要下载的元素
      const element = document.getElementById('downloadArea');

      // 使用 html2canvas 将元素转换为 Canvas
      html2canvas(element).then(canvas => {
        // 获取 Canvas 对象的图像数据
        const imgData = canvas.toDataURL('image/png');

        // 设置 PDF 尺寸（A4）
        const pdf = new jsPDF('p', 'mm', 'a4');

        // 添加 Canvas 图像数据到 PDF
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

        // 下载 PDF 文件
        pdf.save('download.pdf');
      });
    },

  },

}
</script>

<style scoped>
.resultShow {
  display: flex;
  width: 100%;
}

.small-div {
  height: 100vh; /* 或者适应你的实际高度需求 */

}

.left {
  flex: 10%;
  border-right: #000000 solid 1px;
}

.right {
  flex: 90%;
}
</style>