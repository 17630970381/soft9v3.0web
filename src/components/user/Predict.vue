<template>
  <div>
    <el-header>
      <div id="step">
        <el-steps :active="step" align-center>
          <el-step title="选择模型"></el-step>
          <el-step title="输入参数"></el-step>
          <el-step title="疾病预测"></el-step>
        </el-steps>
      </div>
    </el-header>

    <el-divider></el-divider>

    <!-- -------------------------------------选择模型页面---------------------------------------------- -->
    <el-main v-if="modelPage">
      <div id="modleSelect" style="display: flex,justify-content: center">
        <h2>请选择模型：</h2>
        <el-select v-model="model" placeholder="请选择模型">
          <el-option
            v-for="item in modelOptions"
            :key="item.key"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="next" style="margin-left: 45%;margin-top: 50px;" round>确认模型</el-button>
    </el-main>

    <!-- -------------------------------------心脏病模型输入页面 --------------------------------------------------->
    <el-main v-if="heart.isShow" id="heartForm">
      <!-- keep alive无效果，可删 -->
        <keep-alive>
      <el-form :model="heart" :rules="heart.rules" ref="ruleForm" label-width="180px" class="demo-ruleForm">
        <el-form-item label="年龄" prop="age" required>
          <el-input v-model="heart.age"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" required>
          <el-select v-model="heart.sex" placeholder="请选择性别">
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="胸痛类型" required>
          <el-select v-model="heart.cp" placeholder="请选择胸痛类型">
            <el-option label="典型心绞痛" value="1"></el-option>
            <el-option label="非典型心绞痛" value="2"></el-option>
            <el-option label="非心绞痛" value="3"></el-option>
            <el-option label="渐近心痛" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="静息血压(mmHg)" prop="trestbps" required>
          <el-input v-model="heart.trestbps"></el-input>
        </el-form-item>
        <el-form-item label="血清胆固醇(mg/dl)" prop="chol" required>
          <el-input v-model="heart.chol"></el-input>
        </el-form-item>
        <el-form-item label="空腹血糖(mg/dl)" prop="fbs" required>
          <el-input v-model="heart.fbs"></el-input>
        </el-form-item>
        <el-form-item label="静息心电图" prop="restecg" required>
          <el-select v-model="heart.restecg" placeholder="请选择心电图结果">
            <el-option label="正常" value="0"></el-option>
            <el-option label="有ST-T波异常" value="1"></el-option>
            <el-option label="左心室肥大" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最大心率" prop="thalach" required>
          <el-input v-model="heart.thalach"></el-input>
        </el-form-item>
        <el-form-item label="运动诱发性心绞痛" prop="exang" required>
          <el-select v-model="heart.exang" placeholder="是否有该症状">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运动引起的ST型抑郁" prop="oldpeak" required>
          <el-input v-model="heart.oldpeak" placeholder="请输入整数或小数" ></el-input>
        </el-form-item>
        <el-form-item label="运动时ST段峰值" prop="slope" required>
          <el-select v-model="heart.slope" placeholder="请选择ST段形状">
            <el-option label="向上倾斜" value="1"></el-option>
            <el-option label="平坦" value="2"></el-option>
            <el-option label="下坡" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主要血管数量(0-3)" prop="ca" required>
          <el-input v-model="heart.ca"></el-input>
        </el-form-item>
        <el-form-item label="地中海贫血" prop="thal" required>
          <el-select v-model="heart.thal" placeholder="请选择症状">
            <el-option label="正常" value="3"></el-option>
            <el-option label="固定缺陷" value="6"></el-option>
            <el-option label="可逆缺陷" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="heartSubmit" style="margin-left: 45%;margin-top: 50px;" round>提交预测</el-button>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
        </keep-alive>
      
    
    </el-main>
    <!-- -------------------------------------多病种模型输入参数页面---------------------------------------------- -->
    <el-main v-if="symptom.isShow">
      <el-collapse v-model="symptom.activeNames" id="select">
        <el-collapse-item v-for="(p,index1) of symptom.part" :key="p.code" :name="p.code">
          <template slot="title">
            <span id="part">{{p.name}} {{p.code}}</span>
          </template>
          <span v-for="(symp,index2) of p.symp" :key="symp.code">
            <span class="sympName">{{symp.name}}</span>
            <el-switch v-model="symp.isGet" @change="changeGetted(index1,index2)"></el-switch>
          </span>
        </el-collapse-item>
        <div style="height: 50px;">
          <el-tag
            class="tag"
            v-for="tag in symptom.getted"
            :key="tag.code"
            closable
            @close="delTag(tag.code)"
          >{{tag.name}}</el-tag>
        </div>
      </el-collapse>
      <el-button id="next" type="primary" @click="submitPredict" style="margin-left: 45%;margin-top: 50px;" round>提交预测</el-button>
    </el-main>

    <!-- -------------------------------------疾病预测页面---------------------------------------------- -->
    <el-main id="resultMain" v-loading="loading" v-if="predict.isShow">
      <el-row :gutter="20">
        <!------------------- 人体模型 ----------------->
        <el-col class="left" :span="12" >
          <Body :selectName="predict.selectName" :hoverName="predict.hoverName"></Body>
        </el-col>

        <h1 id="title">预诊结果</h1>
        <el-col class="right" :span="12">

          <!-- -------------------心脏病模型预测结果------------- -->
          <div v-if="model === 1">
            <el-card :body-style="{ height:'260px',padding: '10px'}" id="highRiskCard" v-if="loading === false && heart.rate > 60">
              <!-- 卡片头 -->
              <div slot="header" id="cardHead">
                <i class="el-icon-warning"></i>
                <span>高风险</span>
              </div>
              <!-- 卡片内容 -->
              <div style="padding: 14px;" id="cardContent">
                <div>
                  <h3 style="color: #D80835">推荐采取以下措施：</h3>
                  <p>饮食控制：限制高胆固醇、高脂肪、高盐和高糖的食物摄入。建议增加新鲜水果、蔬菜、全谷物、健康蛋白质（如鱼类）和坚果的摄入。</p>
                  <p>锻炼：每周进行至少150分钟的中等强度有氧运动，如快走、慢跑或游泳。</p>
                  <p>戒烟：如果您是吸烟者，尽量戒烟。寻求医疗专业人士的帮助可以提供更多戒烟的支持。</p>
                  <p>控制血压：定期监测血压，并采取必要的措施来保持正常的血压水平。</p>
                  <p>控制血糖：如果您有糖尿病，密切监测血糖水平，并根据医生的建议进行治疗和药物管理。</p>
                </div>
              </div>
            </el-card>
            <el-card :body-style="{ height:'260px',padding: '10px'}" id="middleRiskCard" v-if="loading === false && heart.rate < 60 && heart.rate > 30">
              <!-- 卡片头 -->
              <div slot="header" id="cardHead">
                <i class="el-icon-warning"></i>
                <span>中风险</span>
              </div>
              <!-- 卡片内容 -->
              <div style="padding: 14px;" id="cardContent">
                <div>
                  <h3 style="color: #f9b800">推荐采取以下措施：</h3>
                  <p>健康生活方式：遵循均衡的饮食，增加蔬菜、水果和全谷物的摄入。进行适量的有氧运动，减少长时间的静坐。</p>
                  <p>保持健康的体重范围，如果需要减重，逐渐减少体重，以每周0.5-1公斤的速度为宜。</p>
                  <p>控制血压和血糖：定期监测血压和血糖水平，并采取必要的措施来保持正常的水平。</p>
                  <p>减少压力：学习有效的应对压力的技巧，如放松训练、冥想或参加支持小组。</p>
                </div>
              </div>
            </el-card>
            <el-card :body-style="{ height:'260px',padding: '10px'}" id="lowRiskCard" v-if="loading === false && heart.rate < 30">
              <!-- 卡片头 -->
              <div slot="header" id="cardHead">
                <i class="el-icon-warning"></i>
                <span>低风险</span>
              </div>
              <!-- 卡片内容 -->
              <div style="padding: 14px;" id="cardContent">
                <div>
                  <h3 style="color: #303133">您患心脏病的风险很低，请保持现有生活习惯。</h3>
                </div>
              </div>
            </el-card>
            <!-- -->
            <div id="board" v-if="loading === false" >
              <Board :rate="heart.rate"></Board>
            </div>
            
          </div>

          <!-- -------------------多疾病模型预测结果-------------- -->
          <div id="cardList" v-if="model === 2">
            <el-row v-for="(disease,index) of predict.disease" :key="index" type="flex" justify="center">
              <el-card :body-style="{ height:'260px',padding: '10px'}" class="card" shadow="hover" @click.native="clickcard(disease.part)" >
                <!-- 卡片头 -->
                <div slot="header" id="cardHead">
                  <i class="el-icon-warning" :style="changeColor(index)"></i>
                  <span>{{disease.name}}</span>
                </div>
                <!-- 卡片内容 -->
                <div style="padding: 14px;" id="cardContent">
                  <div>
                    <span :style="changeColor(index)">推荐就诊科室：</span>
                    <span>{{disease.dptment}}</span>
                  </div>

                  <div>
                    <div :style="changeColor(index)">本疾病或有以下症状：</div>
                    <div>{{disease.symp}}</div>
                  </div>

                  <div>
                    <div :style="changeColor(index)">建议采取下列预防措施：</div>
                    <div>{{disease.prevent}}</div>
                  </div>
                </div>
              </el-card>
            </el-row>
          </div>
        </el-col>
      </el-row>
      
      
      <el-button type="success" @click="done" style="margin-left: 47%;" round>完成</el-button>
    </el-main>
  </div>
</template>

<script>
import parts from './js/predict'
// import dis from './js/disease.js'
import {testget,testpost,heartPost} from '@/api/user.js'
import Body from './DieaseIntro/components/Body.vue'
import Board from './Board.vue'
export default {
    name: 'Predict',
    components:{Body: Body,Board: Board},
    data(){
        return {
            loading:false,
            step: 1,
            model: '',
            modelPage: true,
            modelOptions:[{
                value: 1,
                label: '心脏病预测模型',
                key: 'heart'
              },
              {
                value: 2,
                label: '多疾病预测模型',
                key: 'multiDis'
              }],
            heart: {
                isShow: false,
                age: '',
                sex: '',
                cp: '',
                trestbps: '',
                chol: '',
                fbs: '',
                restecg: '',
                thalach: '',
                exang: '',
                oldpeak: '',
                slope: '',
                ca: '',
                thal: '',
                rate: 0,
            },
            symptom: {
                isShow: false,
                activeNames:[],
                part:JSON.parse(JSON.stringify(parts)),
                getted:[]
            },
            predict: {
                isShow: false,
                disease:[],
                selectName:'',
                hoverName:'',
            }
        }
    },

    methods:{
      
        next() {
            switch(this.model){
              case 1:
                this.modelPage = false;
                this.symptom.isShow = false;
                this.heart.isShow = true;
                this.step = 2;
                break;
              case 2:
                this.modelPage = false;
                this.heart.isShow = false;
                this.symptom.isShow = true;
                this.step = 2;
                break;
              default:
                alert("请选择模型");
                break;
            }
        },

        heartSubmit(){
          let p1 = this.heart.age;
          let p2 = this.heart.sex;
          let p3 = this.heart.cp;
          let p4 = this.heart.trestbps;
          let p5 = this.heart.chol;
          let p6 = this.heart.fbs;
          let p7 = this.heart.restecg;
          let p8 = this.heart.thalach;
          let p9 = this.heart.exang;
          let p10 = this.heart.oldpeak;
          let p11 = this.heart.slope;
          let p12 = this.heart.ca;
          let p13 = this.heart.thal;
          console.log(p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13);

          this.loading = true;
          heartPost(p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13).then(res=>{
            this.predict.selectName = '心脏';
            let resres = res.res;
            let result = JSON.parse(resres[0]);
            let rate = JSON.parse(resres[1]);
            this.heart.rate = parseFloat((rate.probability*100).toFixed(2));

            this.loading = false;
            console.log(this.heart.rate)
            console.log(result.result);
            console.log(rate.probability);
          })
          .catch(error => {
              console.log(error);
          })
          this.heart.isShow = false;
          this.step = 3;
          this.predict.isShow = true;
        },

        submitPredict(){
            let s1 = this.symptom.getted[0].code;
            let s2 = this.symptom.getted[1].code;
            let s3 = this.symptom.getted[2].code;
            let s4 = this.symptom.getted[3].code;
            let s5 = this.symptom.getted[4].code;
            console.log(s1,s2,s3,s4,s5);
            
            this.loading = true
            testpost(s1, s2, s3, s4, s5).then((res)=>{
              this.loading = false
              console.log(res);
              // const data = res.map(item=>JSON.parse(item).code.trim())
              // console.log(`解析后是${data}`);//['xxx','yyy']
              // this.predict.disease = dis.filter(item=>{
              //   return data.indexOf(item.code)!==-1
              // })
              this.predict.disease = res;
              console.log(this.predict.disease);
              this.predict.selectName = this.predict.disease[0].part;
            })
            .catch(error => {
              console.log(error);
            });
            this.symptom.isShow = false;
            this.step = 3;
            this.predict.isShow = true;
        },

        mounted() {
          this.init();
          testget(1,2);
          testpost(3,4);

        },

        changeColor(index){
        switch (index) {
          case 0:
            return 'color:#cb2f2f';
          case 1:
            return 'color:#f57710';
          default:
            return 'color:#2fcbb6';
        }
      },

        // 选项变化时同步更改tag
        changeGetted(pindex,sindex){
            if(this.symptom.part[pindex].symp[sindex].isGet){
                let newGet = {
                    name: this.symptom.part[pindex].symp[sindex].name,
                    code: this.symptom.part[pindex].symp[sindex].code,
                    p_index: pindex,
                    s_index: sindex,
                };
                this.symptom.getted.push(newGet);
            }else{
                for(let g_index in this.symptom.getted){
                    let g = this.symptom.getted[g_index];
                    if(g.code == this.symptom.part[pindex].symp[sindex].code){
                        this.symptom.getted.splice(g_index,1); 
                    }
                }
            }
        },

        // 删除tag时同步去除选项
        delTag(t_code){
            for(let g_index in this.symptom.getted){
                let g = this.symptom.getted[g_index];
                if(g.code == t_code){
                    let pindex = g.p_index;
                    let sindex = g.s_index;
                    this.symptom.part[pindex].symp[sindex].isGet = false;
                    this.symptom.getted.splice(g_index,1);
                }
            }
        },

        done(){
            this.symptom.getted=[]
            this.symptom.part=JSON.parse(JSON.stringify(parts))
            this.symptom.getted = [];
            this.symptom.activeNames = [];
            this.predict.isShow = false;//切换页面
            this.symptom.isShow = false;
            this.modelPage = true;
            this.step = 1;
        },

        clickcard(hoverName){
          this.predict.hoverName = hoverName;
          console.log(this.predict.hoverName)
        },

    }
}

</script>

<style scoped>
#step {
  margin-top: 20px;
}

#heartForm{
  display: flex;
  justify-content: center;
  margin-right: 20%;
}

#modleSelect{
  margin-top: 80px;
  display: flex;
  justify-content: center;
}

.sympName {
  font-size: 15px;
  display: inline-block;
  margin-right: 8px;
  margin-left: 25px;
  text-align: center;
  position: relative;
  top: 2px;
}

#select {
  width: 70%;
  margin-left: auto;
  margin-right: auto;
}

#resultMain{
  padding-top: 0px;
}

.tag {
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 8px;
}

#part {
  font-size: 18px;
  font-weight: bold;
}

#symp {
  font-size: 15px;
}

#title {
  text-align: center;
  font-size: 25px;
}

.right {
  margin-top: 10px;
}

.left{
  /* background-color: #cb7a2f; */
  height: 900px;
  width: 50%;
  flex: 1;
}

.card {
  width: 50%;
  margin-bottom: 20px;
}

#cardList {
  display: flex;
  flex-direction: column;
  transform: translateX(-10%);
}

#cardHead {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

#cardContent > div {
  margin-bottom: 10px;
}

.titleImg {
  max-width: 30%;
}

h1 {
  text-align: center;
  margin-right: 10%;
}

i {
  font-size: 30px;
}

/* .changecolor {
  color: #f57710;
} */

/* 文字与icon对齐 */
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
</style>