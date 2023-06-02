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
    <el-main v-show="symptom.isShow">
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
    <el-main v-show="predict.isShow">
      <h1 id="title">预诊结果</h1>
      <el-row id="cardList" :gutter="30" type="flex" justify="center">
        <el-col :span="6" v-for="(disease,index) of predict.disease" :key="index">
          <el-card :body-style="{ padding: '10px'}" class="card">
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
        </el-col>
      </el-row>
      <el-button type="success" @click="done" style="margin-left: 47%;margin-top: 50px;" round>完成</el-button>
    </el-main>
  </div>
</template>

<script>
import parts from './js/predict'
export default {
    name: 'Predict',
    data(){
        return {
            step: 1,
            symptom: {
                isShow: true,
                activeNames:[],
                part:JSON.parse(JSON.stringify(parts)),
                getted:[]
            },
            predict: {
                isShow: false,
                disease:[{
                    code:'jaundice',
                    name:'黄疸',
                    symp:'皮肤和眼睛呈现黄色，尿液变深，粪便变浅，可能伴有乏力、恶心、食欲不振等。',
                    dptment:'消化内科、肝胆外科。',
                    prevent:'保持良好的个人卫生，避免接触传染性黄疸的病人，注射乙肝疫苗，避免酗酒和不安全的性行为，定期进行肝功能检查。'

                },{
                    code:'Hypoglycemia',
                    name:'低血糖',
                    symp:'头晕、出汗、心悸、颤抖、饥饿感、混乱、疲劳、焦虑等。',
                    dptment:'内分泌科、内科。',
                    prevent:'定期监测血糖水平，保持规律的饮食，避免过度剧烈的运动，遵医嘱使用胰岛素或口服药物治疗糖尿病。'
                },{
                    code:'Arthritis',
                    name:'关节炎',
                    symp:'关节疼痛、肿胀、僵硬，可能伴有关节红肿、运动障碍、疲劳等。',
                    dptment:'风湿免疫科、骨科。',
                    prevent:'保持适度的体重，进行适度的锻炼，避免过度使用关节，保持良好的姿势和体位，避免受伤，定期进行健康检查。'
                }]
            }
        }
    },

    methods:{
        submitPredict(){
            this.symptom.isShow = false;
            this.step = 2;
            this.predict.isShow = true;
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
        }
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

#cardList {
  margin-top: 50px;
}

.card {
  width: 100%;
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

h3 {
  text-align: center;
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