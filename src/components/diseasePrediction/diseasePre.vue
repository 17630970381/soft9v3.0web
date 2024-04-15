<template>
<div>
  <div>
    <div style="border-bottom: #868585 solid 1px; padding-bottom: 10px">
      <el-steps :active="active">
        <el-step title="选择基本信息" icon="el-icon-edit"></el-step>
        <el-step title="输入预测数值" icon="el-icon-upload"></el-step>
        <el-step title="结果展示" icon="el-icon-picture"></el-step>
      </el-steps>
    </div>

      <el-card class="right_head" style="margin-top: 20px">
<!--        <el-button style="margin-left: 50px;margin-top: 20px;border-radius: 30px"-->
<!--                   type="primary">选择算法</el-button>-->
<!--        <h4 style="margin-left: 55px;margin-top: 10px">公共算法:</h4>-->
<!--        <div class="publicAl">-->
<!--          <div v-for="(algorithm, index) in publicAlgorithms" :key="index"-->
<!--               class="algorithm-switch">-->
<!--            <el-switch v-model="algorithm.selected" :active-text="algorithm.name"-->
<!--                       @change="updatePublicSelectedAlgorithms"-->
<!--                       style="margin-right: 10px;"/>-->
<!--          </div>-->
<!--        </div>-->
        <h4 style="margin-left: 55px;margin-top: 10px">已训练算法:</h4>
        <div class="privateAl">
          <div v-for="(algorithm, index) in trainedAlgorithms" :key="index"
               class="algorithm-switch">
            <el-switch v-model="algorithm.selected" :active-text="algorithm.name"
                       @change="updateSelectedAlgorithms(index)"/>
          </div>
        </div>
      </el-card>
<!--      <div class="right_body1">-->
<!--        <el-tag-->
<!--            v-for="tag in tags"-->
<!--            :key="tag.name"-->
<!--            closable-->
<!--            :type="tag.type"-->
<!--            @close="removeTag(tag.name)"-->
<!--            @click="handleTagClick(tag.name)"-->
<!--            style="cursor: pointer;margin-right: 10px">-->
<!--          {{tag.name}}-->
<!--        </el-tag>-->
<!--      </div>-->
<!--      <div class="right_body2" v-if="tags.length > 0">-->
<!--&lt;!&ndash;        <el-button type="primary"  @click="parameterShow">输入参数</el-button>&ndash;&gt;-->

<!--      </div>-->
<!--      <div style="margin-left: 20px;margin-top: 10px">-->
<!--        <Parameter v-if="tags.length > 0 && parameterShow1 "-->
<!--                      :selectedAlgorithms = "selectedAlgorithms"-->
<!--                      :publicSelectedAlgorithms = "publicSelectedAlgorithms"-->
<!--                      :electionAl = "electionAl"-->
<!--                      />-->
<!--    </div>-->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item v-for="(item, index) in selectedAlgorithms" :key="index" :index="item">{{ item }}</el-menu-item>
    </el-menu>
    <div
        element-loading-text="正在调用模型进行预测，请稍后"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          v-loading="loading">

      <div  v-if="selectedAlgorithms.length > 0"
          v-for="(feature, index) in selectedAlgorithmFeatures" :key="index"
           style="margin-bottom: 10px">
        <label>{{ feature.name }}: </label>
        <el-input :disabled="disabled" v-model="feature.value"  v-validate-number/>
      </div>
      <div style="margin-top: 50px">
        <el-button v-if="!alFlag" @click="saveData" type="success">保存</el-button>
        <el-button v-if="alFlag" @click="promptDta" type="success">提交数据，开始预测</el-button>
        <el-button @click="toInfo">上一页</el-button>
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
      if (dotIndex !== -1) {
        inputValue = inputValue.slice(0, dotIndex + 1) + inputValue.slice(dotIndex).replace(/\./g, '');
      }

      // 更新输入框的值
      event.target.value = inputValue;
    });
  }
});

import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { treeData } from "@/components/tab/treeTargetData.js";
import Parameter from "@/components/diseasePrediction/Parameter.vue";
import HistoryData from "@/components/diseasePrediction/historyData.vue";
import {getRequest} from "@/utils/api";
import {postRequest} from "@/api/user";
export default {
  name: "diseasePre",
  components: {
    HistoryData,
    Parameter,
  },
  computed: {

    formPreData(){
      return this.$store.state.formPreData
    },

    // tags() {
    //   const tagsFromSelected = this.selectedAlgorithms.map(name => ({ name, type: 'success' }));
    //   const tagsFromPublic = this.publicSelectedAlgorithms.map(name => ({ name, type: 'info' }));
    //   return [...tagsFromSelected, ...tagsFromPublic];
    // },
  },
  data() {
    return {
      disabled: false,
      // 原parameter
      modelFeatureArray: [],
      publicModelFeatureArray: [],
      algorithmData: [], // 存储算法和特征值的数组
      selectedAlgorithmFeatures: [],
      //   所有算法特征值输入完毕
      alFlag: false,
      predictionResult1:[],
      predictionResult:{},
      selectedModelName:[],
      loading: false,
      activeIndex: '',
      // 原parameter
      active:2,
      // 公共算法选择
      publicAlgorithms: [
        { name: 'SVM', selected: false },
        { name: 'RF', selected: false },
        { name: 'XGbost', selected: false },
        { name: 'DT', selected: false },
      ],
      // 已训练算法选择
      trainedAlgorithms: [],
      selectedAlgorithms: [],
      publicSelectedAlgorithms: [],
      // 组件渲染
      parameterShow1: true,
      historyShow1:false,
      electionAl: "",
      uid:sessionStorage.getItem("uid")
          ? parseInt(sessionStorage.getItem("uid"))
          : 0,
      publisher: sessionStorage.getItem("user")
          ? sessionStorage.getItem("user")
          : "",
    }
  },
  watch: {
    selectedAlgorithms(oldValue,newValue) {
      if(oldValue.length !== newValue.length){
        this.getModelList()
      }
    },
    // electionAl(newAlgorithm, oldAlgorithm) {
    //       // electionAl 变化时更新 selectedAlgorithmFeatures
    //     this.updateSelectedAlgorithmFeatures();
    //   },

  },
  created() {

    this.getAllMode()

  },
  methods: {

    // 算法选择
    updateSelectedAlgorithms(index) {
      this.selectedAlgorithms = this.trainedAlgorithms.filter(algorithm => algorithm.selected).map(algorithm => algorithm.name);
      console.log(this.selectedAlgorithms)
      this.electionAl = this.selectedAlgorithms[0]
    },

    // // 不同算法的特征选择
    // removeTag(tagName) {
    //   // 公共算法
    //
    //   this.publicSelectedAlgorithms = this.publicSelectedAlgorithms.filter(name => name !== tagName);
    //   // Find the corresponding el-switch and set its state to false
    //   const algorithm = this.publicAlgorithms.find(algorithm => algorithm.name === tagName);
    //   if (algorithm) {
    //     algorithm.selected = false;
    //   }
    //   // 训练的算法
    //   this.selectedAlgorithms = this.selectedAlgorithms.filter(name => name !== tagName);
    //   // Find the corresponding el-switch and set its state to false
    //   const algorithm1 = this.trainedAlgorithms.find(algorithm => algorithm.name === tagName);
    //   if (algorithm1) {
    //     algorithm1.selected = false;
    //   }
    //
    //   console.log(this.electionAl)
    //   console.log(this.publicSelectedAlgorithms)
    //   console.log(this.selectedAlgorithms)
    //
    //
    //   if(this.tags.length <= 0)
    //   {
    //     this.parameterData.selectedAlgorithms = []
    //     this.parameterData.publicSelectedAlgorithms = []
    //     this.electionAl = ""
    //   }
    //
    // },

    handleTagClick(tagName) {
      // Handle the tag click event, you can perform any action here
      console.log('Tag Clicked:', tagName);
      this.electionAl = tagName
    },

    changeData(node) {
      this.disease = node.label;
    },

    test(){
      this.getAllMode()
    },
    // 通过用户名和用户id获取已训练好的模型信息
    getAllMode(){
      getRequest(`/Patient/getAllModelByPublisherAndUid/${this.publisher}/${this.uid}/${this.formPreData.diseasename}`).then(
        res => {
          this.trainedAlgorithms = res.map(item => {
            return { name: item, selected: false }
          })

        }
      )

    },
    toInfo(){
      this.$router.replace('/predictionInfo')
    },
    handleSelect(key){

      this.electionAl = key
      this.updateSelectedAlgorithmFeatures()
    },
    updateSelectedAlgorithmFeatures() {
      // 使用 find 方法查找选定算法的特征
      const selectedAlgorithm = this.modelFeatureArray.find(
          modelFeatureObject => modelFeatureObject.algorithm === this.electionAl
      );
      // 如果找到了对应算法，更新 selectedAlgorithmFeatures
      this.selectedAlgorithmFeatures = selectedAlgorithm
          ? selectedAlgorithm.features.map(name => ({ name, value: '' }))
          : [];
      console.log(this.selectedAlgorithmFeatures)
    },

    //原parameter
    getModelList(){
      this.modelFeatureArray = []
      let featuresArray = []
      let modelFeatureObject = {}
      let i = 0
      for (i=0;i<this.selectedAlgorithms.length;i++){
        getRequest(`/Model/getModelFeatureByUidAndModelName/${this.uid}/${this.selectedAlgorithms[i]}`)
            .then(res => {
              featuresArray = res[0].feature.split(',');
              modelFeatureObject = {
                algorithm: res[0].modelname,
                features: featuresArray
              }
              this.modelFeatureArray.push(modelFeatureObject);

              this.electionAl = this.modelFeatureArray[0].algorithm
              this.activeIndex = this.modelFeatureArray[0].algorithm
              this.selectedAlgorithmFeatures = this.modelFeatureArray[0]
                  ? this.modelFeatureArray[0].features.map(name => ({ name, value: '' }))
                  : [];
            })


      }
    },


    saveData() {

      // 保存数据的逻辑，可以将 selectedAlgorithmFeatures 数组传递给后端或进行其他操作
      // 点击保存按钮时，遍历特征，为每个特征添加值，并保存到数组中
      for (let i = 0; i < this.selectedAlgorithmFeatures.length; i++) {
        if (!this.selectedAlgorithmFeatures[i].value) {
          // 如果任何一个特征值为空，显示错误消息并返回
          this.$message.error(`${this.selectedAlgorithmFeatures[i].name} 不能为空`);
          return;
        }
      }
      const algorithmObject = {
        algorithm: this.electionAl, // 你可以根据实际情况设置算法名
        features: {},
      };

      // 遍历特征
      this.selectedAlgorithmFeatures.forEach(feature => {
        // 将特征和对应的值保存到 algorithmObject 中
        algorithmObject.features[feature.name] = +feature.value;
      });

      // 将算法和特征值的对象保存到数组中
      this.algorithmData.push(algorithmObject);

      // 输出保存的数据，你可以根据需要进行其他处理
      console.log(this.algorithmData);

      // 切换到下一个未设置特征值的算法
      this.switchToNextAlgorithm();
    },

    switchToNextAlgorithm() {
      // 查找下一个未设置特征值的算法
      const nextAlgorithm = this.modelFeatureArray.find(
          modelFeatureObject => !this.algorithmData.some(data => data.algorithm === modelFeatureObject.algorithm)
      );

      if (nextAlgorithm) {
        // 设置 electionAl 为下一个未设置特征值的算法
        this.electionAl = nextAlgorithm.algorithm;
        this.activeIndex = this.electionAl

        // 更新 selectedAlgorithmFeatures
        this.updateSelectedAlgorithmFeatures();
      } else {
        // 所有算法都有特征值了，可以进行其他操作
        this.$message.success("所有算法特征值均已保存")
        this.alFlag = true
        if(this.alFlag == true){
          this.disabled = true
        }
      }
    },
    promptDta(){
      this.loading = true
      for(let i=0;i<this.algorithmData.length;i++){
        console.log(`这是第${i}循环`)
        let modelname = this.algorithmData[i].algorithm
        this.selectedModelName.push(modelname)
        console.log(modelname)
        getRequest(`/Patient/getModelPathByModelName/${modelname}`).then(res => {
          let path = res;
          let features = this.algorithmData[i].features
          console.log(features)
          const valuesArray = Object.values(features); // 获取对象中所有属性的值，保存在数组中

// 如果您想按照对象属性的名称顺序排列数组，可以先获取对象的属性名称，然后按照属性名称顺序访问值
          const propertyNames = Object.keys(features); // 获取对象中所有属性的名称
          const fea = propertyNames.map(propertyName => features[propertyName]); // 按照属性名称顺序访问值
          let onlineUse = {
            path, fea
          }
          console.log(onlineUse)
          if(this.formPreData.diseasename === '多疾病'){
            postRequest('/OnlineUse/useMulti',onlineUse).then(res => {
              const obj = {}
              console.log(res)
              obj[modelname] = res.res
              this.predictionResult1.push(obj);
              this.predictionResult = this.predictionResult1.reduce((acc, cur) => {
                return { ...acc, ...cur };
              }, {});
              this.$store.commit('predictionResult',this.predictionResult)
              this.$store.commit('selectedModelName',this.selectedModelName)
              this.loading = false
              this.$router.replace('/predictionResult')
            })
          }else {
            postRequest('/OnlineUse/use',onlineUse).then(res => {
              const obj = {}
              obj[modelname] = res.res[0]
              this.predictionResult1.push(obj);
              this.predictionResult = this.predictionResult1.reduce((acc, cur) => {
                return { ...acc, ...cur };
              }, {});
              this.$store.commit('predictionResult',this.predictionResult)
              this.$store.commit('selectedModelName',this.selectedModelName)
              this.loading = false
              this.$router.replace('/predictionResult')
            })
          }

        })
      }

    },

  },

}
</script>


<style>

.right_head {
  width: 100%;

  border: 2px  #333; /* 边框 */
  border-radius: 30px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3); /* 阴影 */
}


.publicAl {
  margin-left: 55px;
  margin-top: 10px;
}

.privateAl {
  margin-left: 55px;
  margin-top: 10px;
}

.algorithm-switch {
  display: inline-block;
  margin-right: 15px;
}

.right_body1 {
  margin-left: 20px;
  margin-top: 20px;
}

.right_body2 {
  margin-left: 20px;
  margin-top: 10px;
}
</style>