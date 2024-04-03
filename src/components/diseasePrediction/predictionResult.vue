<template>
<div>
  <div style="border-bottom: #868585 solid 1px; padding-bottom: 10px">
    <el-steps :active="active">
      <el-step title="选择基本信息" icon="el-icon-edit"></el-step>
      <el-step title="输入预测数值" icon="el-icon-upload"></el-step>
      <el-step title="结果展示" icon="el-icon-picture"></el-step>
    </el-steps>
  </div>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item v-for="(item, index) in selectedModelName" :key="index" :index="item">{{ item }}</el-menu-item>
  </el-menu>

  <div class="resultShow">
<!--  左侧 -->
    <div class="small-div left" >
    <!--  身体图  -->
      <el-col class="left2" :span="12" >
        <Body :selectName="predict.selectName" :hoverName="predict.hoverName"></Body>
      </el-col>
    </div>
<!--  右侧 -->
    <div v-if="formPreData.diseasename === '多疾病' " class="small-div right">
        <el-card>
          <div style="margin-bottom: 5px">该患者患有慢阻肺的概率为：{{ predictionResult[electionAl][0] }}</div>
          <div style="margin-bottom: 5px"> 该患者患有糖尿病的概率为：{{ predictionResult[electionAl][1] }}</div>
          <div style="text-align: center" v-if="predictionResult[electionAl][0] > 0.8 ||predictionResult[electionAl][0] > 0.8 "> 请及时就医</div>
        </el-card>
    </div>
    <div v-else class="small-div right">
      <el-card  v-if="predictionResult[electionAl] == '0' " >
        <div style="text-align: center;background: #00ff92">
          <h1 style="font-size: 30px">低风险</h1>
        </div>
        <div style="text-align: center">
          <h3 style="color: #303133">您患{{ diseasename }}的风险很低，请保持现有生活习惯。</h3>
        </div>
      </el-card>
      <el-card v-if="predictionResult[electionAl] == '1' " >
        <el-card :body-style="{ height:'260px',padding: '10px'}" id="highRiskCard">
          <!-- 卡片头 -->
          <div slot="header" id="cardHead">
            <i class="el-icon-warning"></i>
            <span >高风险</span>
          </div>
          <!-- 卡片内容 -->
          <div style="padding: 14px;" id="cardContent">
            <div>
              <h3 style="color: #D80835">推荐采取以下措施：</h3>
              <p>{{prevent}}</p>

            </div>
          </div>
        </el-card>
      </el-card>
    </div>
  </div>
  <div >
    <el-button @click="toDiseasePre" type="primary">返回疾病预测首页</el-button>
  </div>
</div>
</template>

<script>
import disease from "@/components/user/js/disease";
import Body from "@/components/user/DieaseIntro/components/Body.vue";
import {getRequest} from "@/utils/api";

export default {
  name:'predictionResult',
  components: {Body},
  computed:{
    predictionResult(){
      return this.$store.state.predictionResult
    },
    selectedModelName(){
      return this.$store.state.selectedModelName
    },
    formPreData() {
      return this.$store.state.formPreData
    }
  },
  data(){
    return{
      activeIndex:'',
      active: 3,
      electionAl:'',
      diseasename:'',
      predict: {
        selectName:'',
        hoverName:'',
      },
      prevent:"",

    }
  },
  created() {
    this.init()
    this.getPrevent()
  },
  methods:{
    init(){
      console.log(this.predictionResult)
      this.activeIndex = this.selectedModelName[0]
      this.electionAl = this.selectedModelName[0]
      this.diseasename = this.formPreData.diseasename
      if(this.diseasename !== '多疾病'){
        getRequest(`Patient/getPartByDisease/${this.diseasename}`).then(res =>{
          this.predict.hoverName = res
          this.predict.selectName = res
        })
      }

    },
    handleSelect(key){
      this.electionAl = key
      this.activeIndex =key
    },
    test(){
      console.log(this.predictionResult)
    },
    toDiseasePre(){
      this.$router.push('/predictionInfo')
    },
    getPrevent(){
      getRequest(`Patient/getPrevent/${this.diseasename}`).then(res => {
        this.prevent = res
      })
    }
  }
}
</script>

<style scoped>
.resultShow {
  display: flex;
  width: 100%;
}

.small-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 300px); /* 或者适应你的实际高度需求 */

}

.left {
  flex: 50%;
  border-right: #000000 solid 1px;
}

.right {
  flex: 50%;
}

.left2{
  /* background-color: #cb7a2f; */
  height: 100%;
  width: 100%;
  flex: 1;
}

/*复制1.0*/
#cardHead > span {
  text-align: center;
  font-size: 25px;
  font-weight: bold;
  position: relative;
  top: -1px;
  margin-left: 5px;
}

#dptment {
  color: #cb7a2f;
}

#board{
  width: 800px;
  height: 800px;
  display: flex;
  justify-content: center;
  margin-right: 5%;
  /* background-color: red; */
}

#highRiskCard ::v-deep .el-card__header{
  background-color: #D80835;
}
#highRiskCard ::v-deep .el-card__body{
  background-color: #EDA01F;
}

#middleRiskCard ::v-deep .el-card__header{
  background-color: #f9b800;
}
#middleRiskCard ::v-deep .el-card__body{
  background-color: #37a2da;
}

#lowRiskCard ::v-deep .el-card__header{
  background-color: #6CA984;
}
#lowRiskCard ::v-deep .el-card__body{
  background-color: #8abcd1;
}

#disGroup{
  width: 60%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}

.detail {
  font-size: 0;
}
.detail .el-form-item__label {
  width: 160px;
  color: #99a9bf;
}
.detail .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 15px;
  width: 45%;
}

</style>