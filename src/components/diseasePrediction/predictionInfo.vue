
<template>
<div>
  <div style="border-bottom: #868585 solid 1px; padding-bottom: 10px">
    <el-steps :active="active">
      <el-step title="选择基本信息" icon="el-icon-edit"></el-step>
      <el-step title="输入预测数值" icon="el-icon-upload"></el-step>
      <el-step title="结果展示" icon="el-icon-picture"></el-step>
    </el-steps>
  </div>

  <!-- 任务信息 -->
  <div  style="margin-top: 200px;"  class="form-container">
    <el-form :model="formPreData" label-width="80px" style="width: 70%;margin-top: 10px" >
      <div class="form-row">
        <el-form-item label="负责人:" prop="publisher">
          <el-input v-model="formPreData.publisher" disabled style="width: 100%; font-size: 18px;"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="所属疾病:" prop="disease">
        <!-- 参与人员的表单项，可以根据需求选择合适的输入组件 -->
        <el-select v-model="formPreData.diseasename" placeholder="请选择疾病" style="width: 100%; font-size: 18px;">
          <el-option v-for="item in diseaseList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="uid:" prop="uid">
        <el-input  v-model="formPreData.uid" disabled style="width: 100%; font-size: 18px;"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button style="margin-top: 50px;" type="primary" @click="toDataC">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div>

  </div>
</div>
</template>

<script>

import {getRequest} from "@/utils/api";

export default {
  name: "predictionInfo",
  data() {
    return {
      formPreData: {
        publisher: sessionStorage.getItem("user")
            ? sessionStorage.getItem("user")
            : "",
        diseasename: '',
        uid: sessionStorage.getItem("uid")
            ? parseInt(sessionStorage.getItem("uid"))
            : 0,
      },
      active: 1,
      diseaseList:[],

    }
  },
  created() {
    this.getDisease()
  },
  methods: {
    toDataC() {
      // 处理表单提交逻辑
      console.log('Form submitted:', this.formPreData);
      if (this.formPreData.diseasename == '') {
        this.$alert("请选择所属疾病", "提示", {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'error',
              message: '请选择所属疾病'
            });
          }
        })
      }else {
        this.$store.commit('toDiseasePre',this.formPreData)
        this.$router.replace('/diseasePre')
      }
    },
    getDisease(){
      getRequest('/Model/getDisease').then(
          res =>{
            this.diseaseList = res
            console.log(this.diseaseList)
          }
      )
    },
  }





}
</script>


<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-row {
  display: flex;
}

.form-row .el-form-item {
  flex: 1;
  margin-right: 20px; /* 间隔可根据需要调整 */
}
</style>