
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
        <el-form-item label="任务名称:" prop="taskName" >
          <el-input v-model="formData.taskName" style="width: 100%; font-size: 18px;"></el-input>
        </el-form-item>
        <el-form-item label="负责人:" prop="assignee">
          <el-input v-model="formData.assignee" style="width: 100%; font-size: 18px;"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="参与人员:" prop="participants">
        <!-- 参与人员的表单项，可以根据需求选择合适的输入组件 -->
        <el-input v-model="formData.participants" style="width: 100%; font-size: 18px;"></el-input>
      </el-form-item>
      <el-form-item label="备注:" prop="notes">
        <el-input type="textarea" v-model="formData.notes" style="width: 100%; font-size: 18px;"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button style="margin-top: 50px;" type="primary" @click="toDataC">下一步</el-button>
        <el-button @click="test">test</el-button>
      </el-form-item>
    </el-form>
  </div>


  <!-- 选择任务  -->
  <div>

  </div>
</div>
</template>

<script>

export default {
  name: "createTask",
  data() {
    return {
      formData: {
        taskName: '',
        assignee: '',
        participants: '',
        notes: ''
      },
      active: 1,

    }
  },

  methods: {
    toDataC() {
      // 处理表单提交逻辑
      console.log('Form submitted:', this.formData);
      this.$store.commit('taskToDataChoose',this.formData)
      this.$router.replace('/dataChoose')
    },
    test(){
      console.log("ct")
      console.log(this.formData)
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