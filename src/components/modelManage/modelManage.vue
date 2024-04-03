<template>
<div>
  <div style="margin-left: 210px">
    <el-select v-model="disease" placeholder="请选择疾病"  style="display: inline-block; margin-right: 10px;">
      <el-option v-for="item in diseaseList" :key="item" :label="item" :value="item"></el-option>
    </el-select>
    <el-input v-model="modelname" placeholder="请输入模型名称"  style="display: inline-block; margin-right: 10px; width: 200px">
    </el-input>
    <el-button type="primary" @click="load">搜索</el-button>
    <el-button @click="clean" type="danger">清空</el-button>
  </div>
<!-- 模型展示 -->
  <div style="margin-left: 180px">
    <div style="margin-top: 15px;display: flex;
  flex-wrap: wrap;" >
      <el-card v-for="(card, index) in cardDataList" :key="index"
               style="width: 500px;height: 300px; margin-left: 30px;
               margin-bottom: 10px;word-wrap: break-word;overflow: auto;">
        <div>模型名称：{{ card.modelname }}</div>
        <div>疾病名称：{{ card.diseasename }}</div>
        <div>创建时间：{{ card.createtime }}</div>
        <div>创建人：{{ card.publisher }}</div>
        <div>所用特征：{{ card.feature }}</div>
        <div style="margin-top: 20px">
          <el-button @click="getDetail(card.modelname,card.diseasename)" type="primary">查看详情</el-button>
          <el-popconfirm
              style="margin-left: 10px"
              title="删除后无法恢复"
              icon="el-icon-warning"
              icon-color="red"
              @confirm="deleteCard(card.modelname)"
          >
            <el-button slot="reference" type="danger"
            >删除</el-button
            >
          </el-popconfirm>
        </div>
      </el-card>
    </div>
  </div>
  <div style="text-align: center;">
    <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="pageSize"
        layout="total,  prev, pager, next"
        :total="total">
    </el-pagination>
  </div>
</div>
</template>

<script >

import {getRequest, putRequest} from "@/utils/api";


export default {
  name: "modelManage",
  data() {
   return{
     disease:'',
     modelname:'',
     cardDataList:[],
     pageNum:1,
     pageSize:9,
     total: 0,
     diseaseList:[],
   }
  },
  created() {
    this.load()
    this.getDisease()
  },
  methods: {
    getModel(){
      getRequest('/Model/getModel').then(res=> {
        if(res){
          this.cardDataList = res
          console.log(this.cardDataList)
        }
      })
    },
    test(){
      this.load()
    },
    deleteCard(modelname) {
      putRequest(`/Model/remove/${modelname}`).then(res => {
        if(res){
          this.load()
          this.$message.success("删除成功");
        }
      })
    },
    getDetail(modelname){
      this.$store.commit("manageModelName",modelname)
      this.$router.replace('/detail')
    },
    clean(){
      this.disease = ''
      this.modelname = ''
      this.load()
    },
    load(){
      getRequest(`/Model/selectByPage/?pageNum=${this.pageNum}&pageSize=${this.pageSize}&disease=${this.disease}&modelname=${this.modelname}`
      ).then(
          res => {
            this.cardDataList = res.data.records
            this.total = res.data.total
            console.log(res)
          }
      )
    },
    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.load()
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

</style>