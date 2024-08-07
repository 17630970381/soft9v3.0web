
<template>
  <div>
    <div style="border-bottom: #868585 solid 1px; padding-bottom: 10px">
      <el-steps :active="active">
        <el-step title="基本信息" icon="el-icon-edit"></el-step>
        <el-step title="特征选择" icon="el-icon-picture"></el-step>
        <el-step title="算法选择" icon="el-icon-picture"></el-step>
        <el-step title="运算结果" icon="el-icon-picture"></el-step>
      </el-steps>
    </div>
    <div>
      <!-- 特征选择 -->
      <div style="height: 70vh;overflow-y: scroll">
        <div style="text-align: center;margin-top: 10px;background: #c5c5c5;border-radius: 50px;">
          <span style="font-weight: bold">特征下方为该特征在数据集中该特征的完备率</span>
        </div>
        <div style="margin-top: 10px;margin-left: 20px ">
          <div>
            <span class="lineStyle">▍</span>
            <span class="featureTitle">选择作为标签的特征(因变量)：</span>
            <span style="">(请先选择因变量，才可进行自变量的选择)</span>
            <span style="margin-left: 10px;font-weight: bolder;">特征搜索：</span>
            <el-input style="width: 10%;display: inline-block;margin-left: 2px" placeholder="请输入想要搜索的特征名"
            v-model="keyFea"></el-input>
            <el-button type="primary" style="margin-left: 5px" @click="seechFea">搜索</el-button>
            <span style="font-weight: lighter;color: #9d9b9b">(搜索到的特征将被置于第一个特征的位置)</span>
          </div>
          <div class="left-align" style="margin-top: 20px;display: flex; flex-wrap: wrap;">
            <el-radio-group v-model="target" >
              <el-radio v-for="feature in targetFea" :key="feature" :label="feature" style="display: inline-block;" >
                <span style="width: 240px; height: 20px; display: inline-block; line-height: 20px;
 overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" :title="feature">{{ feature }}</span>
                <el-progress :percentage="featuresMissingRate[feature]"
                             :format="format"
                             :color="getProgressStatus(featuresMissingRate[feature])"
                             style="width: 100%;"></el-progress>
              </el-radio>
            </el-radio-group>
          </div>

          <div style="margin-top: 30px">
         <span class="lineStyle">▍</span
         ><span class="featureTitle">参与训练的特征(自变量):</span>
            <el-checkbox style="margin-left: 50px" v-model="selectAll" @change="handleSelectAll" :disabled="target === ''"/> 全选
            <span style="margin-left: 10px;font-weight: bolder;">特征搜索：</span>
            <el-input style="width: 10%;display: inline-block;margin-left: 2px" placeholder="请输入想要搜索的特征名"
                      v-model="searchTF"></el-input>
            <el-button type="primary" style="margin-left: 5px" @click="seechTrainFea">搜索</el-button>
            <span style="font-weight: lighter;color: #9d9b9b">(搜索到的特征将被置于第一个特征的位置)</span>
          </div>

          <div  class="left-align" style="margin-top: 20px;display: flex; flex-wrap: wrap;">
            <el-checkbox-group v-model="trainFea">
              <el-checkbox
                  v-for="feature in availableFeatures"
                  :key="feature"
                  :label="feature"
                  :disabled="target === ''"
                  v-if="featuresMissingRate[feature] >= 50"
                  style="display: inline-block;"
              >
      <span style="width: 240px; height: 20px; display: inline-block; line-height: 20px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" :title="feature">
        {{ feature }}
      </span>
                <el-progress
                    :percentage="featuresMissingRate[feature]"
                    :format="format"
                    :color="getProgressStatus(featuresMissingRate[feature])"
                    style="width: 100%;"
                ></el-progress>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

      </div>
      <div class="center-align" style="margin-top: 30px">
        <el-button @click="featureToData()">
          上一步
        </el-button>
        <el-button @click="toAlChoose()">
          下一步
        </el-button>
      </div>
    </div>

  </div>
</template>

<script>



import {getRequest} from "@/utils/api";
import {percent} from "@antv/g2plot/lib/utils/transform/percent";

export default {
  name: "featureChoose",
  computed: {
    formData() {
      return this.$store.state.formData
    },

    availableFeatures() {
      return this.fea.filter((feature) => feature !== this.target);
    },


    tableName(){
      return this.$store.state.tableName
    },

    // fea() {
    //   return this.$store.state.fea
    // }

  },
  data() {
    return {
      active:2,
      featuresMissingRate: {},
      target: "",
      trainFea: [],
      selectAll: false, // 全选状态
      fea:[],
      targetFea:[],
      keyFea:'',
      searchTF:''
    }
  },

  watch: {
    trainFea(newValue) {
        // 如果一键全选框被取消选中，且 selectedFeatures 的长度大于 0，则将其置为 false
      this.selectAll = newValue.length === this.fea.length - 1;
    }
  },

  created() {
    this.getFea(this.tableName)
    this.getTarget(this.tableName)
  },
  methods: {
    getFea(tableName){
      getRequest(`/Model/getFeaByTableName/${tableName}`).then(res => {
        this.fea = res
      })
      this.getMissingRates(this.tableName)

    },
    getTarget(tableName){
      getRequest(`/Model/getTargetByTableNam/${tableName}`).then(res => {
        this.targetFea = res
      })
    },
    toAlChoose() {
      const dataToUpdate = {
        target: this.target,
        trainFea: this.trainFea,
      };

      // Dispatch the action to update the data in the store
      if(this.target === '' && this.trainFea.length === 0){
        this.$message.error('请选择目标特征和训练特征');
      }
      else if(this.trainFea.length === 0){
        this.$message.error('请选择训练特征');
      }
      else if(this.target === ''){
        this.$message.error('请选择目标特征');
      }else if(this.trainFea.length < 5){
        this.$message.error('训练特征至少需要5个');
      }
      else {
        this.$store.dispatch('updateFeatureChooseData', dataToUpdate);
        this.$router.replace('/alChoose')
      }

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

    getMissingRates(){
      getRequest(`/Model/getMissingRates/${this.tableName}`).then(res =>{
        this.featuresMissingRate = res
      })
    },

    getProgressStatus(missingRate) {
      if (missingRate < 30) {
        return '#ff0000';
      } else if (missingRate < 80) {
        return '#e6a23c';
      } else {
        return '#21da8b';
      }

    },

    format(percentage) {
      return percentage === 100 ? `${percentage}%` : `${percentage}%`;
    },

    test(){
      console.log(this.featuresMissingRate['PCT'])
    },

    seechFea(){
      let index = this.fea.indexOf(this.keyFea);

// 如果关键字存在于数组中，则将其移动到数组的第一个位置
      if (index !== -1) {
        this.fea.unshift(this.fea.splice(index, 1)[0]);
      }else {
        this.$message('没有找到此特征');
      }
    },
    seechTrainFea(){
      console.log(this.availableFeatures)
      let index = this.fea.indexOf(this.searchTF);
      console.log(index)
      if(this.searchTF === this.target){
        this.$message('没有找到此特征');
      }else if (index !== -1) {
        this.fea.unshift(this.fea.splice(index, 1)[0]);
      }else {
        this.$message('没有找到此特征');
      }
    }

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
  margin-right: 20px; /* 可选，调整单选框之间的间距 */
  margin-bottom: 10px;

}

.custom-large-radio input {
  /* 修改单选框的大小 */
  width: 20px;
  height: 15px;
}

.custom-large-checkbox {
  font-size: 20px; /* 调整字体大小 */
  margin-right: 20px; /* 可选，调整单选框之间的间距 */
  margin-bottom: 10px;
}

.custom-large-checkbox input {
  width: 20px;
  height: 15px;
  margin-right: 10px; /* 调整多选框和文字之间的间距 */
}



</style>