
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
        <el-button style="margin-top: 20px;width: 130px"  type="primary"  @click="test">测试</el-button>
      </div>
    <!--  主体展示     -->
      <div class="small-div right">
    <!--    模型评估    -->
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item v-for="(item, index) in selectedAlgorithms" :key="index" :index="item">{{ item }}</el-menu-item>
        </el-menu>
        <div v-if="sequence === 1">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h1 style="margin: 20px 20px 20px 20px; font-size: 25px;display: inline-block">模型效果评价</h1>
              <div>
                <el-button style="margin-top: 20px;margin-right: 10px; width: 100px"  type="primary">下载报告</el-button>
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
                <img :src="require('@/assets/20240319195319_RF/precision_recall_curve.png')" alt="Image">
              </div>

              <div style="text-align: center;">
                <h3 style="margin: 10px;">ROC曲线</h3>
                <el-tag style="margin: 5px 10px;">说明:
                  ROC（Receiver Operating Characteristic）曲线是一种用于评估二元分类器性能的图形工具。
                  它显示了在不同阈值下真正例率（True Positive Rate，TPR）与假正例率（False Positive Rate，FPR）之间的关系。</el-tag>
                <img :src="require('@/assets/20240319195319_RF/roc_curve.png')" alt="Image">
              </div>

              <div style="text-align: center;">
                <h3 style="margin: 10px;">混淆矩阵</h3>
                <el-tag style="margin: 5px 10px;">说明:
                  混淆矩阵（Confusion Matrix）是一种用于评估分类模型性能的表格，特别是在监督学习中用于评估分类任务的结果。
                  它将模型的预测结果与真实结果进行比较，从而提供了对分类器性能的直观认识。</el-tag>
                <img :src="require('@/assets/20240319195319_RF/confusion_matrix.png')" alt="Image">
              </div>

              <div style="text-align: center;">
                <h3 style="margin: 10px;">特征重要度</h3>
                <el-tag style="margin: 5px 10px;">说明:
                  特征重要度（Feature Importance）是在机器学习领域中用于衡量模型中各个特征对于预测结果的贡献程度的指标。
                  在训练完模型之后，特征重要度可以帮助我们理解模型是如何做出预测决策的，以及哪些特征对于模型的性能起到了关键作用。</el-tag>
                <img :src="require('@/assets/20240319195319_RF/feature_importance.png')" alt="Image">
              </div>

            </div>
        </div>
        <!--    模型演示    -->
        <div v-if="sequence === 2">
          <span v-if ="electionAl ===''" style="display: block;margin-bottom: 5px">请选择要输入特征值的算法标签</span>
          <span v-else style="display: block;margin-bottom: 5px">当前所选算法： {{electionAl}}</span>
          <div v-for="(feature, index) in selectedAlgorithmFeatures" :key="index"
               style="margin-bottom: 10px">
            <label>{{ feature.name }}: </label>
            <el-input v-model="feature.value"  v-validate-number/>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

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
  computed: {
    formData() {
      return this.$store.state.formData
    },

    // resultData() {
    //   return this.$store.state.resultData
    // },
    // selectedAlgorithms() {
    //   return this.$store.state.selectedAlgorithms
    // },

    selectedData() {
      return this.resultData[this.electionAl] || [];
    }
  },
  data() {
    return {
      uid:516005890,
      active:5,
      sequence: 1,
      tableData1: [{
        modelname: '测试',
        alName:'',
        sampleName: '肾病',
        totalSamples: '431',
        positiveSamples: '188',
        accuracy:'',
        precision:'',
        recall:'',
        f1Score:'',
      }],
      //图片
      pictureUrl:"",
      // 测试死数据
      selectedAlgorithms:['RF','DT'],
      resultData:{
         "RF":[{"uid": 516005890 ,"modelname":"test1",
           "evaluate": "{'accuracy': 0.71696, 'precision': 0.71780, 'recall': 0.71395, 'f1': 0.76285}",
           "picture": "@\\assets\\20240319195319_RF",
           "pkl":"E:\\soft\\software9-3\\software9\\src\\main\\resources\\Algorithm\\PKL\\20240319195319_RF.pkl"
         }],
        "DT":[{"uid": 516005890 ,"modelname":"test2",
          "evaluate": "{'accuracy': 0.81696, 'precision': 0.81780, 'recall': 0.81395, 'f1': 0.8628}",
          "picture": "@\\assets\\20240319195314_DT",
          "pkl":"E:\\soft\\software9-3\\software9\\src\\main\\resources\\Algorithm\\PKL\\20240319195319_RF.pkl"
        }]
      },
      activeIndex: 'RF',
      electionAl: 'RF',

      //模型演示
      selectedAlgorithmFeatures: [],
      //   所有算法特征值输入完毕
      alFlag: false,
    }
  },
  mounted() {
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
  },
  methods: {
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
    saveModel(){

    },
    test(){

      console.log(this.pictureUrl)
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
      return this.pictureUrl + '/' + imageName;
    },

    // 模型演示
    // 获取特征

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