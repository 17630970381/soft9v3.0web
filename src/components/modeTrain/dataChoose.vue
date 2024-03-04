
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

    <!-- 数据选择 -->
    <el-button @click="toFeatureChoose()">
      选择该数据
    </el-button>

    <el-button @click="dataToCreate()">
      上一步
    </el-button>

  </div>
</template>

<script>

export default {
  name: "dataChoose",
  computed: {
    formData() {
      return this.$store.state.formData
    }
  },
  data() {
    return {
      active:2
    }
  },

  methods: {
    toFeatureChoose(){
      this.$router.replace('/featureChoose')
    },
    dataToCreate(){
      this.$router.replace('/modelTrain')
    },
  },

}
</script>


<style scoped>

</style>