<template>
<div  element-loading-text="正在调用模型进行预测，请稍后"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      v-loading="loading">
  <span v-if ="electionAl ===''" style="display: block;margin-bottom: 5px">请选择要输入特征值的算法标签</span>
  <span v-else style="display: block;margin-bottom: 5px">当前所选算法： {{electionAl}}</span>
  <div v-for="(feature, index) in selectedAlgorithmFeatures" :key="index"
    style="margin-bottom: 10px">
    <label>{{ feature.name }}: </label>
    <el-input v-model="feature.value"  v-validate-number/>
  </div>
  <el-button v-if="!alFlag" @click="saveData" type="success">保存</el-button>
  <el-button v-if="alFlag" @click="promptDta" type="success">提交数据，开始预测</el-button>

  <el-button @click="toInfo">上一页</el-button>
</div>
</template>


<script>
import {getRequest,postRequest} from "@/api/user";
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
  name: "Parameter",
  props: {
    selectedAlgorithms: Array,
    publicSelectedAlgorithms: Array,
    electionAl: String
  },
  data() {
    return {
      uid: sessionStorage.getItem("uid")
          ? parseInt(sessionStorage.getItem("uid"))
          : 0,
      modelFeatureArray: [],
      publicModelFeatureArray: [],
      algorithmData: [], // 存储算法和特征值的数组
      selectedAlgorithmFeatures: [],
    //   所有算法特征值输入完毕
      alFlag: false,
      predictionResult1:[],
      predictionResult:{},
      loading: false,
      selectedModelName:[],
    }
  },
  created() {
    this.getPublicList()
    this.getModelList()

  },
  computed: {
    allModelFeatureArray() {
      // 使用扩展运算符合并两个数组
      return [...this.modelFeatureArray, ...this.publicModelFeatureArray];
    },


  },
  watch: {
    selectedAlgorithms: {
      handler(newAlgorithms, oldAlgorithms) {
        // 监听算法变化
        if (newAlgorithms.length !== oldAlgorithms.length) {
          // 算法变化时执行重新请求后台数据的操作
          this.getModelList();
        }else {
          const differenceArray1 = newAlgorithms.filter(value => !oldAlgorithms.includes(value));
          if(differenceArray1.length > 0){
            this.getModelList()
          }
        }
      }
    },

    publicSelectedAlgorithms: {
      handler(newAlgorithms, oldAlgorithms) {
        // 监听算法变化
        if (newAlgorithms.length !== oldAlgorithms.length) {
          // 算法变化时执行重新请求后台数据的操作
          this.getPublicList();
        }else {
          const differenceArray = newAlgorithms.filter(value => !oldAlgorithms.includes(value));
          if(differenceArray.length > 0){
            this.getPublicList()
          }
        }
      }
    },

    // electionAl(newAlgorithm, oldAlgorithm) {
    //     // electionAl 变化时更新 selectedAlgorithmFeatures
    //   this.updateSelectedAlgorithmFeatures();
    // },
    electionAl:{

      handler(newAlgorithm, oldAlgorithm){
        if(newAlgorithm !== oldAlgorithm){
          console.log("watch ele")
          this.updateSelectedAlgorithmFeatures()
        }else {
          console.log("Wat else")
          this.updateSelectedAlgorithmFeatures()
        }

      }
    }

  },

  methods :{
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

         })

     }
      this.updateSelectedAlgorithmFeatures()
    },
    getPublicList(){
      this.publicModelFeatureArray = []
      let featuresArray = []
      let modelFeatureObject = {}
      let i = 0
      for (i=0;i<this.publicSelectedAlgorithms.length;i++){
        getRequest(`/Model/getModelFeatureByUidAndModelName/${this.uid}/${this.publicSelectedAlgorithms[i]}`)
            .then(res => {
              featuresArray = res[0].feature.split(',');
              modelFeatureObject = {
                algorithm: res[0].modelname,
                features: featuresArray
              }
              this.publicModelFeatureArray.push(modelFeatureObject);
            })
      }

    },

    updateSelectedAlgorithmFeatures() {
        // 使用 find 方法查找选定算法的特征
        const selectedAlgorithm = this.allModelFeatureArray.find(
            modelFeatureObject => modelFeatureObject.algorithm === this.electionAl
        );
        // 如果找到了对应算法，更新 selectedAlgorithmFeatures
        this.selectedAlgorithmFeatures = selectedAlgorithm
            ? selectedAlgorithm.features.map(name => ({ name, value: '' }))
            : [];
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
      const nextAlgorithm = this.allModelFeatureArray.find(
          modelFeatureObject => !this.algorithmData.some(data => data.algorithm === modelFeatureObject.algorithm)
      );

      if (nextAlgorithm) {
        // 设置 electionAl 为下一个未设置特征值的算法
        this.electionAl = nextAlgorithm.algorithm;

        // 更新 selectedAlgorithmFeatures
        this.updateSelectedAlgorithmFeatures();
      } else {
        // 所有算法都有特征值了，可以进行其他操作
        this.$message.success("所有算法特征值均已保存")
        this.alFlag = true
     }
    },

    handleInput(value, feature){
      // 将用户输入的字符串转换为浮点数
      const parsedValue = parseFloat(value);

      // 检查是否是有效的数字
      if (!isNaN(parsedValue)) {
        // 更新特征的值为转换后的数字
        feature.value = parsedValue;
      } else {
        // 输入不是有效的数字，可以进行适当的处理，例如清空输入框
        feature.value = '';
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
        })
      }

    },

    toInfo(){
      this.$router.replace('/predictionInfo')
    }
  },
}
</script>


<style>

</style>