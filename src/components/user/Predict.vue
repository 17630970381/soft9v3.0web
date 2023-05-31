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
    <el-main  v-show="symptom.isShow">
        <el-collapse v-model="symptom.activeNames" id="select">
            <el-collapse-item v-for="(p,index1) of symptom.part" :key="p.code" :title="`${p.name} ${p.code}`">
                <span v-for="(symp,index2) of p.symp" :key="symp.code">
                    <span class="partName">{{symp.name}}</span>
                    <el-switch 
                    v-model="symp.isGet"
                    @change="changeGetted(index1,index2)" 
                    ></el-switch>
                </span>
            </el-collapse-item>
            <div style="height: 50px;">
                <el-tag
                    class="tag"
                    v-for="tag in symptom.getted"
                    :key="tag.code"
                    closable
                    @close="delTag(tag.code)"
                    >
                    {{tag.name}}
                </el-tag>
            </div>
        </el-collapse>
        <el-button id="next" type="primary" @click="submitPredict" style="margin-left: 45%;margin-top: 50px;">
            提交预测
        </el-button>
    </el-main>

    <!-- -------------------------------------疾病预测页面---------------------------------------------- -->
    <el-main v-show="predict.isShow">

    </el-main>
    
  </div>
</template>

<script>
export default {
    name: 'Predict',
    data(){
        return {
            step: 1,
            symptom: {
                isShow: true,
                part:[{
                        code:'face',
                        name:'五官',
                        symp:[{
                            code:'puffy_face_and_eyes',
                            name:'脸和眼睛浮肿',
                            isGet:false,
                        },{
                            code:'drying_and_tingling_lips',
                            name:'嘴唇干燥',
                            isGet:false,
                        },{
                            code:'sinus_pressure',
                            name:'鼻窦炎',
                            isGet:false,
                        },{
                            code:'runny_nose',
                            name:'流鼻涕',
                            isGet:false,
                        },{
                            code:'visual_disturbances',
                            name:'视觉障碍',
                            isGet:false,
                        }]
                    },{
                        code:'back',
                        name:'背部',
                        symp:[{
                            code:'back_pain',
                            name:'背痛',
                            isGet:false,
                        },{
                            code:'scurring',
                            name:'脱皮',
                            isGet:false,
                        },{
                            code:'red_spots_over_body',
                            name:'小疹子',
                            isGet:false,
                        },{
                            code:'muscle_weakness',
                            name:'肌肉无力',
                            isGet:false,
                        }]
                    },{
                        code:'arms',
                        name:'四肢',
                        symp:[{
                            code:'weakness_in_limbs',
                            name:'四肢无力',
                            isGet:false,
                        },{
                            code:'swollen_extremeties',
                            name:'四肢肿胀',
                            isGet:false,
                        },{
                            code:'knee_pain',
                            name:'膝盖疼痛',
                            isGet:false,
                        },{
                            code:'prominent_veins_on_calf',
                            name:'小腿静脉突出',
                            isGet:false,
                        },{
                            code:'hip_joint_pain',
                            name:'髋关节疼痛',
                            isGet:false,
                        }]
                    },{
                        code:'belly',
                        name:'腹部',
                        symp:[{
                            code:'abdominal_pain',
                            name:'腹痛',
                            isGet:false,
                        },{
                            code:'diarrhoea',
                            name:'腹泻',
                            isGet:false,
                        },{
                            code:'swelling_of_stomach',
                            name:'胃部肿胀',
                            isGet:false,
                        },{
                            code:'palpitations',
                            name:'心悸',
                            isGet:false,
                        }]
                    },{
                        code:'head',
                        name:'头部',
                        symp:[{
                            code:'dizziness',
                            name:'头晕',
                            isGet:false,
                        },{
                            code:'depression',
                            name:'抑郁',
                            isGet:false,
                        }]
                    }
                ],
                getted:[
                ]
            },
            predict: {
                isShow: false,
            }
        }
    },

    methods:{
        submitPredict(){
            this.symptom.isShow = false;
            this.step = 2;
            this.predict.isShow = true;
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
        }
    }
}

</script>

<style>
    #step{
        margin-top: 20px;
    }

    .partName{
        display: inline-block;
        width: 90px;
        text-align: center;
    }

    #select{
        width: 70%;
        margin-left: auto;
        margin-right: auto;
    }
    
    #next{
        margin-left: auto;
        margin-right: auto;
    }

    .tag{
        margin-top: 5px;
        margin-bottom: 5px;
        margin-left: 8px;
    }
</style>