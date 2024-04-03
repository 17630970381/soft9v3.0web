
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

  <!-- 任务信息 -->
  <div  style="margin-top: 200px;"  class="form-container">
    <el-form :model="formData" label-width="80px" style="width: 70%;margin-top: 10px" >
      <div class="form-row">
        <el-form-item label="模型名称:" prop="taskName" >
          <el-input v-model="formData.modelname" style="width: 100%; font-size: 18px;"></el-input>
        </el-form-item>
        <el-form-item label="负责人:" prop="assignee">
          <el-input v-model="formData.assignee" disabled style="width: 100%; font-size: 18px;"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="所属疾病:" prop="disease">
        <!-- 参与人员的表单项，可以根据需求选择合适的输入组件 -->
        <el-select v-model="formData.diseasename" placeholder="请选择疾病" style="width: 100%; font-size: 18px;">
          <el-option v-for="item in tableList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注:" prop="notes">
        <el-input type="textarea" v-model="formData.notes" style="width: 100%; font-size: 18px;"></el-input>
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
  name: "createTask",
  data() {
    return {
      formData: {
        modelname: '',
        assignee: sessionStorage.getItem("user")
            ? sessionStorage.getItem("user")
            : "",
        diseasename: '',
        notes: ''
      },
      active: 1,
      uid: sessionStorage.getItem("uid")
          ? parseInt(sessionStorage.getItem("uid"))
          : 0,
      tableList:[]
    }
  },
  created() {
    this.getDiseaseName()
  },
  methods: {
    toDataC() {
      // 处理表单提交逻辑
      console.log('Form submitted:', this.formData);
      if(this.formData.modelname==''){
        this.$alert("请填写模型名称", "提示", {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'error',
              message: '请填写模型名称'
            });
          }
        })
      }

      if(this.formData.diseasename==''){
        this.$alert("请选择所属疾病", "提示", {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'error',
              message: '请选择所属疾病'
            });
          }
        })
      }

      if (this.formData.modelname !=='' && this.formData.diseasename !==''){
        getRequest(`/Model/isRepeatModel/${this.formData.modelname}`).then(
            res => {
              if(!res){
                this.formData.modelname = ''
                this.$alert("模型名称与已有模型重复，请重新输入", "提示", {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$message({
                      type: 'error',
                      message: '模型名称与已有模型重复，请重新输入'
                    });
                  }
                })

              }else {
                this.$store.commit('taskToDataChoose',this.formData)
                this.$router.replace('/dataChoose')
              }

            }
        )
      }
    },
    getDiseaseName(){
      getRequest('/DataManager/getDiseaseName').then(res => {
        this.tableList = res
      })
    }
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