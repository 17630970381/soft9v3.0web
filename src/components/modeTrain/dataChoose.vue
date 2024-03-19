
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
    <!--  选择数据  -->
    <div>
      <DataManage />
    </div>

    <!-- 数据选择 -->
    <el-button @click="toFeatureChoose()">
      选择该数据
    </el-button>
    <el-button @click="test">test</el-button>
    <el-button @click="dataToCreate()">
      上一步
    </el-button>

  </div>
</template>

<script>
import DataManage from "@/components/tab/dataManage.vue";

export default {
  name: "dataChoose",
  components: {DataManage},
  computed: {
    formData() {
      return this.$store.state.formData
    }
  },
  data() {
    return {
      active:2,
      tableName:"testdata",
    }
  },

  methods: {
    toFeatureChoose(){
      this.$store.commit('dataChooseToFeatureChoose',this.tableName)
      console.log(this.formData)
      this.$router.replace('/featureChoose')
    },
    dataToCreate(){
      this.$router.replace('/modelTrain')
    },
    test(){
      console.log("dc")
      console.log(this.formData)
    }
  },

}
</script>


<style scoped>

</style>