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

    <el-main id="select">
        <el-collapse v-model="symptom.activeNames" >
            <el-collapse-item v-for="(p) of symptom.part" :key="p.index" :title="`${p.name} ${p.index}`">
                <span v-for="(symp) of p.symp" :key="symp.index">
                    <span class="partName">{{symp.name}}</span>
                    <el-switch 
                    v-model="symp.isGet" 
                    ></el-switch>
                </span>
            </el-collapse-item>
        </el-collapse>
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
                activeNames: ['1'],
                part:[{
                        index:'face',
                        name:'五官',
                        symp:[{
                            index:'puffy_face_and_eyes',
                            name:'脸和眼睛浮肿',
                            isGet:false,
                        },{
                            index:'drying_and_tingling_lips',
                            name:'嘴唇干燥',
                            isGet:false,
                        },{
                            index:'sinus_pressure',
                            name:'鼻窦炎',
                            isGet:false,
                        },{
                            index:'runny_nose',
                            name:'流鼻涕',
                            isGet:false,
                        },{
                            index:'visual_disturbances',
                            name:'视觉障碍',
                            isGet:false,
                        }]
                    },{
                        index:'back',
                        name:'背部',
                        symp:[{
                            index:'back_pain',
                            name:'背痛',
                            isGet:false,
                        },{
                            index:'scurring',
                            name:'脱皮',
                            isGet:false,
                        },{
                            index:'red_spots_over_body',
                            name:'小疹子',
                            isGet:false,
                        },{
                            index:'muscle_weakness',
                            name:'肌肉无力',
                            isGet:false,
                        }]
                    },{
                        index:'arms',
                        name:'四肢',
                        symp:[{
                            index:'weakness_in_limbs',
                            name:'四肢无力',
                            isGet:false,
                        },{
                            index:'swollen_extremeties',
                            name:'四肢肿胀',
                            isGet:false,
                        },{
                            index:'knee_pain',
                            name:'膝盖疼痛',
                            isGet:false,
                        },{
                            index:'prominent_veins_on_calf',
                            name:'小腿静脉突出',
                            isGet:false,
                        },{
                            index:'hip_joint_pain',
                            name:'髋关节疼痛',
                            isGet:false,
                        }]
                    },{
                        index:'belly',
                        name:'腹部',
                        symp:[{
                            index:'abdominal_pain',
                            name:'腹痛',
                            isGet:false,
                        },{
                            index:'diarrhoea',
                            name:'腹泻',
                            isGet:false,
                        },{
                            index:'swelling_of_stomach',
                            name:'胃部肿胀',
                            isGet:false,
                        },{
                            index:'palpitations',
                            name:'心悸',
                            isGet:false,
                        }]
                    },{
                        index:'head',
                        name:'头部',
                        symp:[{
                            index:'dizziness',
                            name:'头晕',
                            isGet:false,
                        },{
                            index:'depression',
                            name:'抑郁',
                            isGet:false,
                        }]
                    }
                ],
                
            }
        }
    },

    methods:{
        swtch(index){
            for(var i = 0;i<this.symptom.part.length;i++){
                if(this.symptom.part[i].index != index){
                    this.symptom.part[i].active = false;
                }
            }
        },
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
        width: 50%;
        margin-left: auto;
        margin-right: auto;
    }
</style>