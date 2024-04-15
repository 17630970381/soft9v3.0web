<template>
  <div
      element-loading-text="正在调用模型进行预测，请稍后"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      v-loading="loading">

    <div v-for="(feature, index) in selectedAlgorithmFeatures" :key="index"
         style="margin-bottom: 10px">
      <label>{{ feature.name }}: </label>
      <el-input :disabled="disabled" v-model="feature.value"  v-validate-number/>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import {getRequest} from "@/utils/api";

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
  name:'reuse',
  props: {
    modelname: String
  },
  created() {
    this.getFea()
  },
  data(){
    return{
      selectedAlgorithmFeatures:[],
      loading:false,
      disabled:false,
    }
  },
  methods:{
    getFea(){
      getRequest(`/Model/getFea/${this.modelname}`).then(res => {
        console.log(res)
        const fieldArray = res.split(",");
        this.selectedAlgorithmFeatures = fieldArray.map(field => ({ name: field, value: '' }))
        console.log(this.selectedAlgorithmFeatures)
      })
    },
  }
}
</script>



<style scoped>

</style>