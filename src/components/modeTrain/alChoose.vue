
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

    <!-- 算法选择 -->
    <div class="alChoose"

         >
    <!--  算法选择框：占20%     -->
      <div class="small-div left">
        <div class="algorithm-switches"
             v-for="(algorithm, index) in unSelectedAlgorithms" :key="index">
          <el-switch v-model="algorithm.selected" :active-text="algorithm.name"
                    class="algorithm-switch"
                     @change="updateSelectedAlgorithms"/>
        </div>
      </div>
    <!--  算法选择详情（所需超参）：占80%     -->
      <div class="small-div right">
        <!--   标签选择     -->
        <div>
          <h1 v-if="selectedAlgorithms.length > 0"
              style="margin-left: 10px;margin-top: 10px">请选择你要输入超参的算法：
            <span style="font-size: 15px">您当前选择的算法是：{{electionAl}}</span></h1>
          <el-tag
              v-for="tag in tags"
              :key="tag.name"
              closable
              :type="tag.type"
              @close="removeTag(tag.name)"
              @click="handleTagClick(tag.name)"
              style="cursor: pointer;margin-right: 10px;margin-top: 20px;margin-right: 10px;margin-left: 10px">
            {{tag.name}}
          </el-tag>
        </div>
        <!--   简介     -->
        <div  style="margin-top: 20px;margin-left: 10px">
          <el-card v-if="isCard"
          style="border-radius: 30px; background: #96d4f3">
            算法简介：{{algorithmDetails.introduction}}
          </el-card>
        </div>
        <!--   参数输入     -->
        <div v-if="isCard"
             element-loading-text="模型正在训练，请稍后"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             v-loading="loading">
          <h1
              style="margin-left: 20px;margin-top: 10px">
           请输入算法所需超参数：
          </h1>
          <div style="margin-top: 10px;margin-left: 20px">
            <el-row v-for="(param, index) in myParameters" :key="index" :gutter="20" style="margin-bottom: 5px">
              <el-col v-for="(value, key) in param" :span="3" :key="key">
                <label>{{ key }}:</label>
              </el-col>
              <el-col v-for="(value, key) in param" :span="8" :key="key">
                <!-- Check if the value is a boolean -->
                <template v-if="param[key] === 'true' || param[key] === 'false'">
                  <el-radio-group v-model="param[key]" :disabled="isPrompt">
                    <el-radio label="true">True</el-radio>
                    <el-radio label="false">False</el-radio>
                  </el-radio-group>
                </template>
                <template v-else>
                  <el-input :disabled="isPrompt" v-model="param[key]" placeholder="请输入" />
                </template>
              </el-col>
              <el-col v-for="(value, key) in myMeaning[index]" :span="8" :key="key">
                <span>{{ value }}</span>
              </el-col>
            </el-row>
            <h1 v-if="isPrompt">所有算法超参以保存，不可再修改参数</h1>
            <div>
              <h1>选择参数<span style="font-size: 15px;color: #868585">（该参数作为后续任务调用的结果展示）</span></h1>
              <h2>人群均值前百分比</h2>
              <div class="block">
                <el-slider
                    v-model="pvalue"
                    show-input
                    :max="50"
                >
                </el-slider>
              </div>
              <h2>人群均值后百分比</h2>
              <div class="block">
                <el-slider
                    v-model="bvalue"
                    show-input
                    :max="50">
                </el-slider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>

    <!--  底部提交  -->

    <div v-if="selectedAlgorithms.length > 0" style="margin-top: 50px">
      <el-button @click="goToFea">上一步</el-button>
      <el-button @click="promptParameters" v-if="isPrompt"  type="primary">提交训练</el-button>
      <el-button @click="saveParameters" v-if="!isPrompt"  type="success">保存当前输入超参</el-button>
<!--      <el-button @click="test">test</el-button>-->
    </div>
  </div>
</template>

<script>

import {getRequest, postRequest} from "@/api/user";

export default {
  name: "alChoose",
  data() {
    return {
      active:3,
      algorithms: [],
      selectedAlgorithms: [],
      unSelectedAlgorithms: [],
      electionAl: "",
      saveAlgorithmData:[],
      selectedAlgorithmData: {}, // 保存选中算法的特征及特征值
      myParameters: [],
      myMeaning: [],
      completeParameter:[],
      comFea:[],
      isPrompt: false,
      isCard: false,
      resultData:{ },
      loading:false,
      /*滑块*/
      pvalue: 0,
      bvalue: 0,
    }
  },
  computed: {
    formData() {
      return this.$store.state.formData
    },

    tableName(){
      return this.$store.state.tableName
    },

    featureChooseData() {
      return this.$store.getters.getFeatureChooseData;
    },

    tags() {
      const tagsFromSelected = this.selectedAlgorithms.map(name => ({ name, type: 'success' }));
      return [...tagsFromSelected];
    },

    algorithmDetails() {
      // 根据 electionAl 的值从 algorithms 数组中取出相应的 algorithm 对象
      const selectedAlgorithm = this.algorithms.find(algorithm => algorithm.name === this.electionAl);

      // 如果找到了选中的算法，则返回该算法的 introduction 和 parameters
      if (selectedAlgorithm) {
        const parsedData = JSON.parse(selectedAlgorithm.myparameter);
        return {
          introduction: selectedAlgorithm.introduction,
          parameters: parsedData
        };
      } else {
        // 如果未找到选中的算法，则返回默认值或者你认为合适的值
        return {
          introduction: "",
          parameters: {}
        };
      }
    },


  },
  created() {
    this.getPublicAlgorithm();
  },

  watch: {
    algorithmDetails: 'updateMyParameters',
  },

  methods: {
    // 获取公共算法信息
    async getPublicAlgorithm(){
      try {
        await getRequest("/Model/getAlgorithm").then(res=>{
          if(res){
            let i = 0
            for(i = 0; i< res.length;i++){
              this.algorithms.push(res[i])
            }
          }
        })
        // 初始化 selectedAlgorithms 数组
        this.unSelectedAlgorithms = this.algorithms.map((algorithm, index) => ({
          name: algorithm.name,
          selected: index === 0, // 如果是数组中的第一个元素，则设置为 true，否则为 false
        }));
        this.updateSelectedAlgorithms()

      }catch (error) {
        console.error("Failed to get algorithms:", error);
      }
    },

    updateSelectedAlgorithms() {
      this.selectedAlgorithms = this.unSelectedAlgorithms.filter(algorithm => algorithm.selected).map(algorithm => algorithm.name);
      this.electionAl = this.selectedAlgorithms[0]
      this.isCard = true
      console.log(this.selectedAlgorithms)
    },

    removeTag(tagName) {
      // 公共算法
      this.selectedAlgorithms = this.selectedAlgorithms.filter(name => name !== tagName);
      // Find the corresponding el-switch and set its state to false
      const algorithm = this.unSelectedAlgorithms.find(algorithm => algorithm.name === tagName);
      if (algorithm) {
        algorithm.selected = false;
      }
      if (this.tags.length <= 0) {
        this.selectedAlgorithms = []
        this.isCard = false
      }
    },

    handleTagClick(tagName) {
      // Handle the tag click event, you can perform any action here
      console.log('Tag Clicked:', tagName);
      this.electionAl = tagName

    },

    updateMyParameters() {
      // 初始化 myParameters 数组
      this.myParameters = [];
      this.myMeaning = [];
      // 遍历 algorithmDetails 中的 parameter 对象
      for (const paramName in this.algorithmDetails.parameters) {
        if (this.algorithmDetails.parameters.hasOwnProperty(paramName)) {
          const paramValue = this.algorithmDetails.parameters[paramName].value;
          // 将属性名和值组成对象，然后添加到 myParameters 数组中
          this.myParameters.push({ [paramName]: paramValue });
        }
      }

      for (const paramName in this.algorithmDetails.parameters) {
        if (this.algorithmDetails.parameters.hasOwnProperty(paramName)) {
          const paramMean = this.algorithmDetails.parameters[paramName].meaning;
          // 将属性名和值组成对象，然后添加到 myParameters 数组中
          this.myMeaning.push({ [paramName]: paramMean });
        }
      }
    },

    saveParameters(){
      let algorithmObject = {};
      algorithmObject[this.electionAl] = Object.assign({}, ...this.myParameters);
      // 在写入前检查数组中是否已经存在相同的 electionAl
      let existingIndex = -1;
      this.completeParameter.forEach((item, index) => {
        if (Object.keys(item)[0] === this.electionAl) {
          existingIndex = index;
        }
      });

      // 如果存在相同的 electionAl，则删除对应的数据
      if (existingIndex !== -1) {
        this.completeParameter.splice(existingIndex, 1);
      }

      // 将构建的对象存入 completeParameter 数组
      this.completeParameter.push(algorithmObject);
      this.comFea.push(this.electionAl)


      if(this.comFea.length + 1 === this.selectedAlgorithms.length){
        let newAlgorithm = this.selectedAlgorithms.find(algorithm => !this.comFea.includes(algorithm));
        if(newAlgorithm !== ""){
          this.electionAl = newAlgorithm
        }
      }


      if(this.completeParameter.length === this.selectedAlgorithms.length){
        this.isPrompt = true
      }else {this.isPrompt = false}

      // 输出结果
      console.log(this.completeParameter);


    },

    promptParameters(){
      this.$store.commit('selectedAlgorithms',this.selectedAlgorithms)
      this.$store.commit('completeParameter',this.completeParameter)
      let trainAl= {}
      let target =  this.featureChooseData.target
      let fea = this.featureChooseData.trainFea
      let tableName = this.tableName
      let completeParameter = this.completeParameter
      trainAl = {
        target,fea,tableName,completeParameter
      }
      this.loading = true
      postRequest("/Model/trainAl",trainAl).then(

          res => {

            this.resultData = res
            this.$store.commit('setResultData',this.resultData)
            this.$store.commit('pvalue',this.pvalue)
            this.$store.commit('bvalue',this.bvalue)
            this.loading = false
            this.$router.replace('resultShow');
          })


      console.log(this.selectedAlgorithms)


    },

    goToFea(){
      this.$router.replace('featureChoose')
    },

    //格式化滑块值


    test() {
      console.log(this.pvalue)
      console.log(this.bvalue)
    },
  },

}
</script>


<style scoped>
.alChoose {
  display: flex;
  width: 100%;

}

.small-div {
  height: 60vh; /* 或者适应你的实际高度需求 */

}

.left {
  flex: 20%;
  border-right: #000000 solid 1px;
}

.right {
  flex: 80%;
}

.algorithm-switches {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 设置垂直对齐方式为靠右 */
  margin-top: 20px;
}

.algorithm-switch {
  margin-bottom: 10px;
}

.item {
  white-space: nowrap;
}
</style>