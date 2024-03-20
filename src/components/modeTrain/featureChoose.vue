
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
    <div class="container">
      <!--  缺失率展示  -->
      <div class="left">
        <div style="margin-top: 20px">
          <h2>特征中值的缺失率：</h2>
        </div>
        <div v-for="(feature, index) in sortedFeatures" :key="index"

            style="margin-top: 10px">
          <span  v-if="feature.missingRate > 0" >{{ feature.name }}</span>
          <el-progress  :text-inside="true" :stroke-width="26"
                        v-if="feature.missingRate > 0"
                        :percentage="feature.missingRate"
                        :status="getProgressStatus(feature.missingRate)"
                        :format="formatMissingRate">
          </el-progress>
        </div>
      </div>

      <!-- 特征选择 -->
      <div class="right">
        <div style="margin-top: 10px;margin-left: 20px ">
          <div>
            <span class="lineStyle">▍</span>
            <span class="featureTitle">选择作为标签的特征(因变量)：</span>
            <span style="">(请先选择因变量，才可进行自变量的选择)</span>
          </div>
          <div class="left-align" style="margin-top: 20px">
            <label v-for="feature in fea" :key="feature" class="custom-large-radio">
              <input type="radio" v-model="target" :value="feature">
              {{ feature }}
            </label>
          </div>

          <div style="margin-top: 30px">
         <span class="lineStyle">▍</span
         ><span class="featureTitle">参与训练的特征(自变量):</span>
            <input  style="margin-left: 50px"
                    type="checkbox" v-model="selectAll" @change="handleSelectAll" :disabled="target === ''"> 全选
          </div>

          <div class="left-align" style="margin-top: 20px;margin-bottom: 20px">

            <label v-for="feature in availableFeatures" :key="feature" class="custom-large-checkbox">
              <input  type="checkbox" v-model="trainFea" :value="feature"  :disabled="target === ''">
              <span>{{ feature }}</span>
            </label>
          </div>
        </div>

        <div class="center-align">
          <el-button @click="featureToData()" type="primary">
            上一步
          </el-button>
          <el-button @click="toAlChoose()" type="success">
            下一步
          </el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>



export default {
  name: "featureChoose",
  computed: {
    formData() {
      return this.$store.state.formData
    },

    availableFeatures() {
      return this.fea.filter((feature) => feature !== this.target);
    },

    // 根据缺失率高低排序的特征数组
    sortedFeatures() {
      const sorted = [...this.features].sort((a, b) => b.missingRate - a.missingRate);
      const targetFeature = sorted.find(feature => feature.name === this.target);
      if (targetFeature) {
        // 将 targetFeature 移到数组最前面
        const targetIndex = sorted.indexOf(targetFeature);
        sorted.splice(targetIndex, 1);
        sorted.unshift(targetFeature);
      }
      return sorted;
    },

    tableName(){
      return this.$store.state.tableName
    },

  },
  data() {
    return {
      active:3,
      fea: ["age", "tal", "aa", "bb", "cc", "dd"],
      features: [
        { name: 'age', missingRate: 1},
        { name: 'tal', missingRate: 10 },
        { name: 'aa', missingRate: 30 },
        { name: 'bb', missingRate: 40 },
        { name: 'cc', missingRate: 50 },
        { name: 'dd', missingRate: 60 },
        // 添加其他特征
      ],

      target: "",
      trainFea: [],
      selectAll: false, // 全选状态
    }
  },

  watch: {
    trainFea(newValue) {
        // 如果一键全选框被取消选中，且 selectedFeatures 的长度大于 0，则将其置为 false
      this.selectAll = newValue.length === this.fea.length - 1;
    }
  },


  methods: {
    toAlChoose() {
      const dataToUpdate = {
        target: this.target,
        trainFea: this.trainFea,
      };

      // Dispatch the action to update the data in the store
      this.$store.dispatch('updateFeatureChooseData', dataToUpdate);
      this.$router.replace('/alChoose')
    },
    featureToData() {
      this.$router.replace('/dataChoose')
    },

    // 全选按钮点击事件
    handleSelectAll() {
      if (this.selectAll) {
        this.trainFea = this.fea.filter((feature) => feature !== this.target);
      } else {
        // 如果一键全选按钮未选中，则清空已选择数组
        this.trainFea = [];
      }
    },

    formatMissingRate(percentage) {
      return `${percentage}%`; // 定义缺失率格式
    },

    getProgressStatus(missingRate) {
      if (missingRate < 30) {
        return 'success'; // 当缺失率小于30%时，状态为成功
      } else if (missingRate < 60) {
        return 'warning'; // 当缺失率小于60%时，状态为警告
      } else {
        return 'exception'; // 缺失率大于等于60%时，状态为危险
      }

    },
    test(){
      console.log(this.tableName)
    },
  },
}
</script>


<style scoped>

/*页面布局*/
.container {
  display: flex;
  height: calc(100vh - 190px);
}

.left {
  flex: 20%;
  border-right: #868585 1px solid;
}

.right {
  flex: 80%;
}
.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 30px;
}

.featureTitle {
  font-weight: 1000;
  font-size: 30px;
}

.center-align {
  text-align: center;
  margin-bottom: 10px;
}

.left-align {
  text-align: left;
}

.custom-large-radio {
  font-size: 20px; /* 调整字体大小 */
  margin-right: 60px; /* 可选，调整单选框之间的间距 */
  display: inline-block;
  align-items: center;
}

.custom-large-radio input {
  /* 修改单选框的大小 */
  width: 20px;
  height: 15px;
}

.custom-large-checkbox {
  display: inline-block;
  align-items: center;
  font-size: 20px;
  margin-right: 60px;
}

.custom-large-checkbox input {
  width: 20px;
  height: 15px;
  margin-right: 10px; /* 调整多选框和文字之间的间距 */
}



</style>