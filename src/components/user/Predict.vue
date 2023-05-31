<template>
  <div>
    <el-header>
      <div id="step">
        <el-steps :active="step" align-center>
          <el-step title="选择症状"></el-step>
          <el-step title="多疾病预测"></el-step>
        </el-steps>
      </div>
      <el-divider></el-divider>
    </el-header>

    <el-container >
        <el-aside>
            我是侧边栏
        </el-aside>
    </el-container>
  </div>
</template>

<script>
export default {
    name: 'Predict',
    data(){
        return {
            step: 1,
        }
    }
}
</script>

<style>
    el-header{
        margin-top: 200px;
    }
</style>