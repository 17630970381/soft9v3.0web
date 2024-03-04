
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
        <el-button style="margin-top: 20px;width: 130px"  type="primary" >保存模型</el-button>
      </div>
    <!--  主体展示     -->
      <div class="small-div right">
    <!--    模型评估    -->
        <div v-if="sequence === 1">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h1 style="margin: 20px 20px 20px 20px; font-size: 25px;display: inline-block">模型效果评价</h1>
              <div>
                <el-button style="margin-top: 20px;margin-right: 10px; width: 100px"  type="primary">下载数据</el-button>
                <el-button style="margin-top: 20px;width: 100px"  type="primary">下载报告</el-button>
              </div>
            </div>
            <div style="margin-top: 10px">
              <el-table
                  :data="tableData1"
                  stripe
                  :header-cell-style="{background:'#c0c0c0',color:'#fff'}"
                  style="width: 100%">
                <el-table-column prop="alName" label="算法名称"></el-table-column>
                <el-table-column prop="sampleName" label="样本名称"></el-table-column>
                <el-table-column prop="totalSamples" label="总样本量"></el-table-column>
                <el-table-column prop="positiveSamples" label="正样本量"></el-table-column>
                <el-table-column prop="auc" label="AUC"></el-table-column>
                <el-table-column prop="accuracy" label="准确度"></el-table-column>
                <el-table-column prop="precision" label="精确度"></el-table-column>
                <el-table-column prop="recall" label="召回率"></el-table-column>
                <el-table-column prop="f1Score" label="F1分数"></el-table-column>
                <el-table-column prop="sensitivity" label="敏感性"></el-table-column>
                <el-table-column prop="specificity" label="特异性"></el-table-column>
                <el-table-column prop="ppv" label="PPV"></el-table-column>
                <el-table-column prop="npv" label="NPV"></el-table-column>
                <el-table-column prop="aucci" label="AUC_CI"></el-table-column>
              </el-table>
            </div>
            <div>
            <!--  结果图  -->
              <div>
                <h3 style="margin: 10px;">PR曲线</h3>
                <el-tag style="margin: 5px 10px;">说明:横轴是召回率，纵轴器精确率;曲线上的一个点代表着在某一阈值下，
                  模型将大于该阈值的结果判定为正样本，将低于该阈值的样本判定为负样本，通过阈值的变动而绘制出PR曲线，
                  所以PR曲线综合考虑了不同阈值下的召回率与精确率。</el-tag>
              </div>

            </div>
        </div>
        <!--    模型演示    -->
        <div v-if="sequence === 2">

        </div>
      </div>
    </div>


  </div>
</template>

<script>

export default {
  name: "resultShow",
  computed: {
    formData() {
      return this.$store.state.formData
    }
  },
  data() {
    return {
      active:5,
      sequence: 1,
      tableData1: [{
        alName:'RF',
        sampleName: '肾病',
        totalSamples: '431',
        positiveSamples: '188',
        auc:'0.9996',
        accuracy:'0.9884',
        precision:'0.9841',
        recall:'0.9894',
        f1Score:'0.9867',
        sensitivity:'0.9894',
        specificity:'0.9877',
        ppv:'0.9841',
        npv:'0.9917',
        aucci:'1.00[0.991-1]'
      }]
    }
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
    }
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