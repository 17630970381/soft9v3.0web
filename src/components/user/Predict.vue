<template>
  <div>
    <el-header>
      <div id="step">
        <el-steps :active="step" align-center>
          <el-step title="选择症状"></el-step>
          <el-step title="疾病预测"></el-step>
        </el-steps>
      </div>
    </el-header>

    <el-divider></el-divider>

    <!-- -------------------------------------症状选择页面---------------------------------------------- -->
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
          <div id="cardList" >
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
import dis from './js/disease.js'
import {testget,testpost} from '@/api/user.js'
import Body from './DieaseIntro/components/Body.vue'
export default {
    name: 'Predict',
    components:{Body: Body},
    data(){
        return {
            loading:false,
            step: 1,
            symptom: {
                isShow: true,
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
        submitPredict(){
            let s1 = this.symptom.getted[0].code;
            let s2 = this.symptom.getted[1].code;
            let s3 = this.symptom.getted[2].code;
            let s4 = this.symptom.getted[3].code;
            let s5 = this.symptom.getted[4].code;
            console.log(s1,s2,s3,s4,s5);
            
            this.loading = true
            testpost(s1, s2, s3, s4, s5).then(res=>{
              this.loading = false

              console.log(`联通啦！！！！！！！！收到的是${res}`);
              const data = res.map(item=>JSON.parse(item).code.trim())
              console.log(`解析后是${data}`);//['xxx','yyy']
              this.predict.disease = dis.filter(item=>{
                return data.indexOf(item.code)!==-1
              })
              console.log(this.predict.disease);
              this.predict.selectName = this.predict.disease[0].part;
            });
            this.symptom.isShow = false;
            this.step = 2;
            this.predict.isShow = true;
        },

        mounted() {
          this.init();
          testget(1,2)
          testpost(3,4)
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
            this.symptom.isShow = true;
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
</style>