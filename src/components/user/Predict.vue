<template>
  <div>
    <!-- -------------步骤条----------------- -->
    <el-header>
      <div id="step">
        <el-steps :active="step" align-center>
          <el-step title="选择疾病" icon="el-icon-guide"></el-step>
          <el-step title="输入病人情况" icon="el-icon-edit"></el-step>
          <el-step title="疾病预测" icon="el-icon-view"></el-step>
        </el-steps>
      </div>
    </el-header>

    <el-divider></el-divider>

    <!-- -------------------------------------选择模型页面---------------------------------------------- -->
    <el-main v-if="modelPage">
      <div id="modleSelect">
        <h2>请选择您想预测的疾病：</h2>
        <br>
        <el-radio-group id="disGroup" v-model="model" ref="disGroup">
          <el-radio v-for="dis,index in modelOptions" 
          :key="index"
          :label="dis.value"
          class="disGroup-item"
          border
          :disabled="dis.disable"
          >{{dis.name}}</el-radio>
        </el-radio-group>

      </div>
      <el-button id="btn" type="primary" @click="next()" style="margin-left: 45%;margin-top: 50px;" round>确认</el-button>
      
    </el-main>

    <!-- -------------------------------------心脏病模型输入页面 --------------------------------------------------->
    <el-main v-if="heart.isShow" id="heartForm">
      <el-tabs @tab-click="resetForm('addForm');resetForm('handInputForm')">
        <!-- 从已有病人中选择预测 -->
        <el-tab-pane label="从已有病例选择" @click="getPatient()">
          <el-table
            :data="heart.patientTable"
            style="width: 100%"
            max-height="550px"
            border
            stripe
            row-key="id"
            >
            <el-table-column type="expand">
              <template slot-scope="detail">
                <el-form label-position="left" inline class="detail">
                  <el-form-item label="胸痛类型：">
                    <span>{{ detail.row.cp }}</span>
                  </el-form-item>
                  <el-form-item label="静息血压(mmHg)：">
                    <span>{{ detail.row.trestbps }}</span>
                  </el-form-item>
                  <el-form-item label="血清胆固醇(mg/dl)：">
                    <span>{{ detail.row.chol }}</span>
                  </el-form-item>
                  <el-form-item label="空腹血糖(mg/dl)：">
                    <span>{{ detail.row.fbs }}</span>
                  </el-form-item>
                  <el-form-item label="静息心电图：">
                    <span>{{ detail.row.restecg }}</span>
                  </el-form-item>
                  <el-form-item label="最大心率：">
                    <span>{{ detail.row.thalach }}</span>
                  </el-form-item>
                  <el-form-item label="运动诱发性心绞痛：">
                    <span>{{ detail.row.exang }}</span>
                  </el-form-item>
                  <el-form-item label="运动时ST段下降程度：">
                    <span>{{ detail.row.oldpeak }}</span>
                  </el-form-item>
                  <el-form-item label="运动时ST段峰值：">
                    <span>{{ detail.row.slope }}</span>
                  </el-form-item>
                  <el-form-item label="主要血管数量：">
                    <span>{{ detail.row.ca }}</span>
                  </el-form-item>
                  <el-form-item label="地中海贫血：">
                    <span>{{ detail.row.thal }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="病人ID"
              prop="patientId"
              width="120px">
            </el-table-column>
            <el-table-column
              label="姓名"
              prop="name"
              width="100px">
            </el-table-column>
            <el-table-column
              label="年龄"
              prop="age"
              width="100px">
            </el-table-column>
            <el-table-column
              label="性别"
              prop="sex"
              width="100px">
            </el-table-column>
            <el-table-column
              label="地址"
              prop="address"
              width="300px">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="item">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  round
                  @click="heartSubmit2(item.row)">预测该病人</el-button>
                <el-popconfirm
                  title="删除后无法恢复，请确认删除"
                  confirm-button-type = "danger"
                  @confirm = "patientDel('heart',item.row)"
                >
                  <el-button slot="reference" type="danger" plain round style="margin-left:10px" size="mini">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="medium" round style="margin-left: 68%; margin-top: 25px" 
          @click="heart.patientAddVisible = true">
          添加新病例
          </el-button>
          <el-dialog title="新增病例" :visible.sync="heart.patientAddVisible" @close="resetForm('addForm')">
            <el-form ref="addForm" :model="heart.feature" :rules="heart.feature.rules" label-width="154px" @keyup.native.enter="patientAdd('heart')">
              <el-form-item label="病人ID" prop="patientId" required>
                <el-input v-model="heart.feature.patientId"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name" required>
                <el-input v-model="heart.feature.name"></el-input>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input v-model="heart.feature.address"></el-input>
              </el-form-item>
              <el-form-item label="年龄" prop="age" required>
                <el-input v-model="heart.feature.age"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex" required>
                <el-select v-model="heart.feature.sex" placeholder="请选择性别">
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="胸痛类型" prop="cp" required>
                <el-select v-model="heart.feature.cp" placeholder="请选择胸痛类型" prop="cp">
                  <el-option label="典型心绞痛" value="1"></el-option>
                  <el-option label="非典型心绞痛" value="2"></el-option>
                  <el-option label="非心绞痛" value="3"></el-option>
                  <el-option label="渐近心痛" value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="静息血压(mmHg)" prop="trestbps" required>
                <el-input v-model="heart.feature.trestbps"></el-input>
              </el-form-item>
              <el-form-item label="血清胆固醇(mg/dl)" prop="chol" required>
                <el-input v-model="heart.feature.chol"></el-input>
              </el-form-item>
              <el-form-item label="空腹血糖(mg/dl)" prop="fbs" required>
                <el-input v-model="heart.feature.fbs"></el-input>
              </el-form-item>
              <el-form-item label="静息心电图" prop="restecg" required>
                <el-select v-model="heart.feature.restecg" placeholder="请选择心电图结果">
                  <el-option label="正常" value="0"></el-option>
                  <el-option label="有ST-T波异常" value="1"></el-option>
                  <el-option label="左心室肥大" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="最大心率" prop="thalach" required>
                <el-input v-model="heart.feature.thalach"></el-input>
              </el-form-item>
              <el-form-item label="运动诱发性心绞痛" prop="exang" required>
                <el-select v-model="heart.feature.exang" placeholder="是否有该症状">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运动时ST段下降程度" prop="oldpeak" required>
                <el-input v-model="heart.feature.oldpeak" placeholder="请输入整数或小数" ></el-input>
              </el-form-item>
              <el-form-item label="运动时ST段峰值" prop="slope" required>
                <el-select v-model="heart.feature.slope" placeholder="请选择ST段形状">
                  <el-option label="向上倾斜" value="1"></el-option>
                  <el-option label="平坦" value="2"></el-option>
                  <el-option label="下坡" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主要血管数量(0-3)" prop="ca" required>
                <el-input v-model="heart.feature.ca"></el-input>
              </el-form-item>
              <el-form-item label="地中海贫血" prop="thal" required>
                <el-select v-model="heart.feature.thal" placeholder="请选择症状">
                  <el-option label="正常" value="3"></el-option>
                  <el-option label="固定缺陷" value="6"></el-option>
                  <el-option label="可逆缺陷" value="7"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button round size="medium" @click="heart.patientAddVisible = false;resetForm('addForm')">取 消</el-button>
              <el-button round size="medium" @click="resetForm('addForm')">重置</el-button>
              <el-button type="primary" round size="medium" @click="patientAdd('heart');resetForm('addForm')">确 定</el-button>
            </div>
          </el-dialog>
        </el-tab-pane>

        <!-- 手动输入病人预测 -->
        <el-tab-pane label="手动输入">
          <el-form ref="handInputForm" :model="heart.feature" :rules="heart.feature.rules" label-width="154px" @keyup.native.enter="heartSubmit">
            <el-form-item label="年龄" prop="age" required>
              <el-input v-model="heart.feature.age"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex" required>
              <el-select v-model="heart.feature.sex" placeholder="请选择性别">
                <el-option label="男" value="male"></el-option>
                <el-option label="女" value="female"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="胸痛类型" prop="cp" required>
              <el-select v-model="heart.feature.cp" placeholder="请选择胸痛类型">
                <el-option label="典型心绞痛" value="1"></el-option>
                <el-option label="非典型心绞痛" value="2"></el-option>
                <el-option label="非心绞痛" value="3"></el-option>
                <el-option label="渐近心痛" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="静息血压(mmHg)" prop="trestbps" required>
              <el-input v-model="heart.feature.trestbps"></el-input>
            </el-form-item>
            <el-form-item label="血清胆固醇(mg/dl)" prop="chol" required>
              <el-input v-model="heart.feature.chol"></el-input>
            </el-form-item>
            <el-form-item label="空腹血糖(mg/dl)" prop="fbs" required>
              <el-input v-model="heart.feature.fbs"></el-input>
            </el-form-item>
            <el-form-item label="静息心电图" prop="restecg" required>
              <el-select v-model="heart.feature.restecg" placeholder="请选择心电图结果">
                <el-option label="正常" value="0"></el-option>
                <el-option label="有ST-T波异常" value="1"></el-option>
                <el-option label="左心室肥大" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="最大心率" prop="thalach" required>
              <el-input v-model="heart.feature.thalach"></el-input>
            </el-form-item>
            <el-form-item label="运动诱发性心绞痛" prop="exang" required>
              <el-select v-model="heart.feature.exang" placeholder="是否有该症状">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运动时ST段下降程度" prop="oldpeak" required>
              <el-input v-model="heart.feature.oldpeak" placeholder="请输入整数或小数" ></el-input>
            </el-form-item>
            <el-form-item label="运动时ST段峰值" prop="slope" required>
              <el-select v-model="heart.feature.slope" placeholder="请选择ST段形状">
                <el-option label="向上倾斜" value="1"></el-option>
                <el-option label="平坦" value="2"></el-option>
                <el-option label="下坡" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主要血管数量(0-3)" prop="ca" required>
              <el-input v-model="heart.feature.ca"></el-input>
            </el-form-item>
            <el-form-item label="地中海贫血" prop="thal" required>
              <el-select v-model="heart.feature.thal" placeholder="请选择症状">
                <el-option label="正常" value="3"></el-option>
                <el-option label="固定缺陷" value="6"></el-option>
                <el-option label="可逆缺陷" value="7"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-left: 30%;margin-top: 50px;">
              <el-button @click="resetForm('handInputForm')" round>重置</el-button>
              <el-button type="primary" @click="heartSubmit" round>提交预测</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
      </el-tabs>

    </el-main>

    <!-- -------------------------------------多病种模型输入参数页面---------------------------------------------- -->
    <el-main v-if="symptom.isShow">
      <el-alert
        title="为了预测的准确性，请最少选择5个症状。"
        type="error"
        center
        show-icon
        v-show="symptom.alertVision"
        @close="symptom.alertVision = false">
      </el-alert>
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
    <el-main id="resultMain" v-if="predict.isShow" 
    v-loading="loading" 
    element-loading-text="正在预测中" 
    >
      <el-row :gutter="20">
        <!------------------- 人体模型 ----------------->
        <el-col class="left" :span="12" >
          <Body :selectName="predict.selectName" :hoverName="predict.hoverName"></Body>
        </el-col>

        <h1 class="title" v-if="loading === false">预诊结果:</h1>

        <el-col class="right" :span="12">

          <!-- -------------------心脏病模型预测结果------------- -->
          <div v-if="model === 2">
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
            <!-- <div id="board" v-if="loading === false" >
              <Board :rate="heart.rate"></Board>
            </div> -->

            <h1 class="title" style="margin-left:-13px" v-if="loading === false">危险因素权重:</h1>
            <div id="pie" v-if="loading === false">
              <PieChart :data="heart.contribute"></PieChart>
            </div>
            <div style="margin-top:-142px">
              <h1 class="title" style="margin-left:-13px" v-if="loading === false">异常指标:</h1>
              <p style="font-size:20px; padding-top:15px" v-if="loading === false">{{dangerFeature}}</p>
            </div>
            
          </div>

          <!-- -------------------多疾病模型预测结果-------------- -->
          <div id="cardList" v-if="model === 1">
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
import modelOptions from './js/modelOptions.js'
import {testpost,heartPost,getRequest,heartPost2,patientAddPost,patientDelRequest} from '@/api/user.js'
import Body from './DieaseIntro/components/Body.vue'
import PieChart from './PieChart.vue'
export default {
    name: 'Predict',
    components:{Body: Body, PieChart: PieChart},
    computed:{
      dangerFeature(){
        let result = "";
        if(this.heart.feature.cp != 3){
          switch(this.heart.feature.cp){
            case 1:
              result += "胸痛类型（典型心绞痛） ";
              break;
            case 2:
              result += "胸痛类型（非典型心绞痛） ";
              break;
            case 4:
              result += "胸痛类型（渐进心痛） ";
              break;
            default:
              break;
          }
        }
        if(this.heart.feature.trestbps > 140 || this.heart.feature.trestbps < 90){
          result += `静息血压（${this.heart.feature.trestbps} mmHg）  `;
        }
        if(this.heart.feature.chol > 200 || this.heart.feature.chol < 90){
          result += `血清胆固醇（${this.heart.feature.chol} mg/dl）  `;
        }
        if(this.heart.feature.fbs > 120 || this.heart.feature.fbs < 70){
          result += `空腹血糖（${this.heart.feature.fbs} mg/dl）  `;
        }
        if(this.heart.feature.restecg != 0){
          switch(this.heart.feature.restecg){
            case 1:
              result += "静息心电图（有ST-T波异常） ";
              break;
            case 2:
              result += "静息心电图（左心室肥大） ";
              break;
            default:
              break;
          }
        }
        if(this.heart.feature.thalach > (220-this.heart.feature.age)){
          result += `最大心率过高（${this.heart.feature.thalach}）  `;
        }
        if(this.heart.feature.exang == 1){
          result += "运动诱发心绞痛  ";
        }
        if(this.heart.feature.oldpeak > 0){
          result += "运动时ST段有下降现象  ";
        }
        if(this.heart.feature.slope != 2){
          switch(this.heart.feature.slope){
            case 1:
              result += "运动时ST段峰值（向上倾斜）  ";
              break;
            case 3:
              result += "运动时ST段峰值（下坡）  ";
              break;
            default:
              break;
          }
        }
        if(this.heart.feature.ca != 0 ){
          result += "冠状动脉存在狭窄或堵塞 ";
        }


        return result;
      }
      },
    data(){
        return {
          loading:false,
          step: 1,
          model: 1,
          modelPage: true,
          modelOptions:modelOptions,
          heart: {
            isShow: false,
            patientAddVisible: false,
            // input: false,
            feature:{
              patientId: '',
              name: '',
              address: '',
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
              thal: ''
            },
            rate: 0,
            patientTable: [],
            contribute:[],
          },
          symptom: {
            isShow: false,
            alertVision: false,
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

    mounted() {
         this.init();
         
    },

    methods:{
        init(){
          this.$refs.disGroup.$el.querySelector('input').focus()
          
          // 回车触发按钮只能在选疾病页面使用，暂未解决
          document.addEventListener('keyup',(e)=>{
            if(e.key=='Enter'){
              // if(this.symptom.isShow){
              //   this.submitPredict();
              // }
              if(this.modelPage){
                this.next();
                // console.log(this.symptom.isShow);
              }
            }
          })
        },

        next() {
            switch(this.model){
              case 1:
                this.modelPage = false;
                this.heart.isShow = false;
                this.symptom.isShow = true;
                this.step = 2;
                break;
              case 2:
                getRequest("/PatientHeartAll/patient").then((res)=>{
                  this.processPatientTable(res);
                })
                this.modelPage = false;
                this.symptom.isShow = false;
                this.heart.isShow = true;
                this.step = 2;
                break;
                
              default:
                alert("请选择疾病");
                break;
            }
        },

        // 把权重数据转为饼状图所需格式
        dataToPieChart(obj){
          let pieData = [];
          let sum = 0;
          for(let key in obj){
            let tempobj = {
              value: obj[key],
              name: key
            }
            pieData.push(tempobj);
            sum += +obj[key];
          }
          console.log(sum)
          if(sum < 1){
            let other = {
              value: 1-sum,
              name: "其他"
            }
            pieData.push(other);
          }

          return pieData;
        },

        //处理patientTable
        processPatientTable(res) {
          for (const patient of res) {
            switch(patient.sex){
              case 0:
                patient.sex = "女";
                break;
              case 1:
                patient.sex = "男";
                break;
              default:
                break;
            }
            switch(patient.cp){
              case 1:
                patient.cp = "典型心绞痛";
                break;
              case 2:
                patient.cp = "非典型心绞痛";
                break;
              case 3:
                patient.cp = "非心绞痛";
                break;
              case 4:
                patient.cp = "渐近心痛";
                break;
              default:
                patient.cp = "未知";
                break;
            }
            switch(patient.restecg){
              case 0:
                patient.restecg = "正常";
                break;
              case 1:
                patient.restecg = "有ST-T波异常";
                break;
              case 2:
                patient.restecg = "左心室肥大";
                break;
              default:
                patient.restecg = "未知";
                break;
            }
            switch(patient.exang){
              case 0:
                patient.exang = "否";
                break;
              case 1:
                patient.exang = "是";
                break;
              default:
                patient.exang = "未知";
                break;
            }
            switch(patient.slope){
              case 1:
                patient.slope = "向上倾斜";
                break;
              case 2:
                patient.slope = "平坦";
                break;
              case 3:
                patient.slope = "下坡";
                break;
              default:
                patient.slope = "未知";
                break;
            }
            switch(patient.thal){
              case 3:
                patient.thal = "正常";
                break;
              case 6:
                patient.thal = "固定缺陷";
                break;
              case 7:
                patient.thal = "可逆缺陷";
                break;
              default:
                patient.thal = "未知";
                break;
            }
          }
          this.heart.patientTable = res;
        },

        //心脏病预测结果处理
        processHeartRes(res){
          this.predict.selectName = '心脏';
          let rate = JSON.parse(res[0]).probability;
          this.heart.rate = parseFloat((rate*100).toFixed(2));
          this.heart.contribute = this.dataToPieChart(JSON.parse(res[1]).contributions);

          this.loading = false;
        },

        // 手动提交心脏病预测
        heartSubmit(){
          this.loading = true;
          heartPost(this.heart.feature).then(res=>{
            this.processHeartRes(res);
          })
          .catch(error => {
              console.log(error);
          })
          
          this.heart.isShow = false;
          this.step = 3;
          this.predict.isShow = true;
        },

        //选择病人进行心脏病预测
        heartSubmit2(row) {
          this.loading = true;
          Object.assign(this.heart.feature,row);
          heartPost2(row.patientId).then(res=>{
            this.processHeartRes(res);
          })
          .catch(error => {
              console.log(error);
          })

          this.heart.isShow = false;
          this.step = 3;
          this.predict.isShow = true;
        },

        //新增病例,参数是病种，后期新增病种可复用，当前可选：'heart'
        patientAdd(disease){
          if(disease === 'heart'){
            patientAddPost(this.heart.feature).then((res)=>{
              this.processPatientTable(res);
            }).catch(error =>{
              console.log(error);
            })
            this.heart.patientAddVisible = false;
          }
        },

        // 删除病例，参数1同新增,参数2为整行信息
        patientDel(disease,row){
          if(disease === 'heart'){
            console.log("在删了",row.id)
            patientDelRequest(row.id).then((res)=>{
              console.log(res)
              this.processPatientTable(res);
            })
          }
        },

        //重置表格
        resetForm(formName){
          // 不加if判断会报错找不到resetFields，因为form用的v-if，不显示时找不到DOM结构
          if(this.$refs[formName]){
            this.$refs[formName].resetFields();
          }
          
        },

        //多疾病预测提交
        submitPredict(){
          if(this.symptom.getted.length < 5){
            this.symptom.alertVision = true;
            return;
          }
          let s1 = this.symptom.getted[0].code;
          let s2 = this.symptom.getted[1].code;
          let s3 = this.symptom.getted[2].code;
          let s4 = this.symptom.getted[3].code;
          let s5 = this.symptom.getted[4].code;
          
          this.loading = true
          testpost(s1, s2, s3, s4, s5).then((res)=>{
            this.loading = false
            // console.log(res);
            // const data = res.map(item=>JSON.parse(item).code.trim())
            // console.log(`解析后是${data}`);//['xxx','yyy']
            // this.predict.disease = dis.filter(item=>{
            //   return data.indexOf(item.code)!==-1
            // })
            this.predict.disease = res;
            // console.log(this.predict.disease);
            this.predict.selectName = this.predict.disease[0].part;
          })
          .catch(error => {
            console.log(error);
          });
          this.symptom.isShow = false;
          this.step = 3;
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
  /* why：这里使用flex布局会有问题：每展开一次表格宽度都会增加 */
  /* display: flex; */
  /* flex-flow: column wrap; */
  /* justify-content: center; */
  margin-right: 15%;
  margin-left: 15%;
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

/* .title {
  text-align: center;
  font-size: 25px;
} */

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
  float: left;
}

i {
  font-size: 30px;
}

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

.disGroup-item{
  width: 150px;
  margin-bottom: 10px;
}

#modleSelect{
  display: flex;
  flex-direction: column;
  margin-left: 20%;
}

#pie{
  width: 500px;
  height: 500px;
  margin-left: 10%;
  margin-top: 5%;
}
</style>