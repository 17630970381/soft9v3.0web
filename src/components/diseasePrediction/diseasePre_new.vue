<template>
<div>
<div class="container">
  <div class="left">
    <div style="margin-bottom: 10px">
      <el-card style="text-align: center;font-size: 20px;
                        border-bottom: #868585 dashed 1px;font-weight: bold;background: #e7e7e7;">模型列表</el-card>
    </div>
    <div style="margin-left: 5px;border-bottom: #868585 dashed 1px">
      <h3>模型总数：{{modelNum}}</h3>
    </div>
    <div style="text-align: center;margin: 20px 0;border-bottom: #868585 dashed 1px"">
      <h3>选择下方模型名称可进行疾病预测</h3>
    </div>
    <el-tree :data="treeData"
             :props="defaultProps"
             @node-click="handleNodeClick">
      <template slot-scope="{ node, data }">
          <span class="custom-node">{{ data.label }} <template v-if="node.childNodes && node.childNodes.length">
          (模型数量：{{ node.childNodes.length }})
          </template>
          </span>
      </template>
    </el-tree>
  </div>
  <div class="right">
    <div style="margin-left: 20px; " v-if="modelSelected !== ''">
      <el-button @click="Handle" >手动输入</el-button>
      <el-button @click="Histories" :disabled="!isHaveHis">历史数据</el-button>
      <span v-if="!isHaveHis" style="color: #868585;font-size: 15px">(该任务所用参数不可调用历史数据)</span>
    </div>
    <div v-else style="display: flex;justify-content: center; align-items: center;">
      <el-card style="text-align: center;border-radius: 20px;background: #76c9ee">
        <h3>
            请现在左侧任务列表中选择模型，以此来进行疾病的预测
        </h3>
      </el-card>
    </div>
    <!-- 手动输入  -->
    <div style="width: 100%" v-if="modelSelected !== '' && isHand">
      <el-card style="margin-left: 20px;margin-top: 20px">
        <div style="font-weight: bold;margin-bottom: 5px;font-size: 25px">模型详情</div>
        <div style="font-size: 20px">当前选择模型：<span>{{modelSelected }}</span></div>
        <div style="font-size: 20px">模型创建人：<span>{{modelDetail[0].publisher }}</span></div>
        <div style="font-size: 20px">模型创建时间：<span>{{modelDetail[0].createtime }}</span></div>
        <div style="font-size: 20px">模型所用算法：<span>{{modelDetail[0].al }}</span></div>
        <div style="font-size: 20px">模型所用数据集：<span>{{modelDetail[0].tablename }}</span></div>
      </el-card>

      <div style="margin-top: 10px;margin-left: 20px;">
        <div style="font-weight: bold;margin-bottom: 5px;font-size: 25px">该模型指标：</div>
        <el-table
            :data="tableData"
            stripe
            :header-cell-style="{background:'#c0c0c0',color:'#fff'}"
            style="width: 100%">
          <el-table-column prop="accuracy" label="准确度(acc)"></el-table-column>
          <el-table-column prop="precision" label="精确度(precision)"></el-table-column>
          <el-table-column prop="recall" label="召回率(recall)"></el-table-column>
          <el-table-column prop="f1Score" label="F1分数(F1-Score)"></el-table-column>
        </el-table>
      </div>

      <div  class="container"
            element-loading-text="正在调用模型进行预测，请稍后"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            v-loading="loading"
            style="margin-left: 20px">
        <div class="smallLft" >

          <div
              style="margin-top: 20px"
          >
            <div v-if="isHaveHis" style="height: calc(100vh - 620px);overflow-y: scroll">
              <div v-for="(feature, index) in selectedAlgorithmFeatures" :key="index"
                   style="margin-bottom: 10px;">
                <label style="display: block">{{  getChName(feature.name) }}: </label>
                <template v-if="getRangeByFeature(feature.name) == '{1,2}'">
                  <el-radio-group v-model="feature.value">
                    <el-radio label="1">男</el-radio>
                    <el-radio label="2">女</el-radio>
                  </el-radio-group>
                </template>
                <template v-else>
                  <el-input @blur="checkRange(feature)" @keydown.enter.native="onEnterKey"  @keydown="validateInput($event)" :disabled="disabled" v-model="feature.value"  style="width: 70%" v-validate-number/>
                  <span>{{getRangeByFeature(feature.name)}}</span>
                </template>
                <span  v-if="!isNumeric(feature.value)" style="color: red;margin-left: 5px">只能输入数字!</span>
              </div>
            </div>
            <div v-else style="height: calc(100vh - 620px);overflow-y: scroll">
              <div v-for="(feature, index) in selectedAlgorithmFeatures" :key="index"
                   style="margin-bottom: 10px;">
                <label style="display: block">{{feature.name }}:</label>
                  <el-input @blur="checkRange(feature)" @keydown.enter.native="onEnterKey"  @keydown="validateInput($event)" :disabled="disabled" v-model="feature.value"  style="width: 70%" v-validate-number/>
                <span  v-if="!isNumeric(feature.value)" style="color: red;margin-left: 5px">只能输入数字!</span>
              </div>
            </div>
            <div style="margin-top: 10px" v-if="predictionResult1.length <= 0">
              <el-button v-if="!alFlag" @click="saveData" type="primary">保存所输入数值</el-button>
              <el-button v-if="alFlag" @click="promptDta"  type="success">提交数据，开始预测</el-button>
            </div>
            <div>
              <el-button v-if="predictionResult1.length > 0" @click="reuse" type="success">再次调用</el-button>
            </div>
          </div>
        </div>
        <div class="smallRight" style="display: flex; justify-content: center; align-items: center; height: calc(100vh - 620px)">
          <div v-if="predictionResult1.length > 0">
            <div v-if="modelDetail[0].diseasename === '多疾病' " class="smallRight">
              <el-card style="text-align: center">
                <div style="margin-bottom: 5px">该患者患有慢阻肺的概率为：{{ predictionResult1[0][modelSelected][0] }}</div>
                <div style="margin-bottom: 5px"> 该患者患有糖尿病的概率为：{{ predictionResult1[0][modelSelected][1] }}</div>
                <div style="text-align: center" v-if="predictionResult1[0][modelSelected][0] > 0.8 ||predictionResult1[0][modelSelected][0] > 0.8 "> 请及时就医</div>
              </el-card>
            </div>
            <div v-else class="smallRight">
              <el-card  v-if="predictionResult[modelSelected] == '0' " style="text-align: center">
                <div style="text-align: center;background: #00ff92">
                  <h1 style="font-size: 30px">低风险</h1>
                </div>
                <div style="text-align: center">
                  <h3 style="color: #303133">您患{{ modelDetail[0].diseasename }}的风险很低，请保持现有生活习惯。</h3>
                </div>
              </el-card>
              <el-card v-if="predictionResult[modelSelected] == '1' " style="text-align: center">
                <el-card :body-style="{ height:'260px',padding: '10px'}" id="highRiskCard" style="text-align: center">
                  <!-- 卡片头 -->
                  <div slot="header" id="cardHead">
                    <i class="el-icon-warning"></i>
                    <span >高风险</span>
                  </div>
                  <!-- 卡片内容 -->
                  <div style="padding: 14px;text-align: center" id="cardContent"  >
                    <div>
                      <h3 style="color: #303133">您患{{ modelDetail[0].diseasename }}的风险很高</h3>
                      <h3 style="color: #D80835">请尽快就医</h3>

                    </div>
                  </div>
                </el-card>
              </el-card>
            </div>
          </div>
          <div v-else>
            <el-card>
              <h3>
                预测结果将在此展示，请先输入左侧各参数的值，以此来进行预测
              </h3>
            </el-card>
          </div>
        </div>
      </div>
    </div>

    <!--  历史数据  -->
    <el-button :disabled="multipleSelection.length <= 0"
        style="margin-left: 20px;margin-top: 20px" v-if="modelSelected !== '' && isAuto && historyData.length >0" type="warning"
       @click="batchPrediction">批量预测</el-button>
    <el-button style="margin-left: 18px;margin-top: 20px" v-if="Result.length > 0"
               @click="resultShow">结果展示</el-button>
    <div style="width: 98%;margin-left: 20px;margin-top: 5px;height: calc(100vh - 250px);overflow: auto" v-if="modelSelected !== '' && isAuto"
         element-loading-text="正在获取数据，请稍后"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)"
         v-loading="loading2">
      <div
          element-loading-text="正在进行预测，请稍后"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          v-loading="predictionLoding"
      >
       <div style="margin-bottom: 10px">
         <el-input v-model="searchKeyword" style="width: 30%" placeholder="请输入患者ID进行搜索"></el-input>
         <el-button style="margin-left: 10px" @click="searchTable">搜索</el-button>
         <el-button @click="resetTable">重置</el-button>
         <span style="font-weight: lighter;color: #9d9b9b">(搜索到的结果将展示在第一行)</span>
       </div>
       <div style="width: 100%;height: calc(100vh - 310px);overflow: auto">
         <el-table :data="historyData"
                   ref="multipleTable"
                   tooltip-effect="dark"
                   @selection-change="handleSelectionChange"
                   :row-class-name="highlightRow"
                   :header-cell-style="{ backgroundColor: '#cecece', color: 'black', fontWeight: 'bold' }">
           <el-table-column type="selection">
           </el-table-column>
           <el-table-column prop="patientId" label="患者ID">
           </el-table-column>
           <el-table-column prop="name" label="姓名"></el-table-column>
           <el-table-column prop="sexname" label="性别"></el-table-column>
           <el-table-column prop="birthdate" label="出生日期"></el-table-column>
           <el-table-column prop="nationname" label="民族"></el-table-column>
           <el-table-column prop="maritalstatusname" label="婚姻状况"></el-table-column>
           <el-table-column fixed="right" label="操作" >
             <template slot-scope="scope">
               <!-- 使用函数判断是否应该禁用按钮 -->
               <el-button
                   type="primary"
                   size="medium"
                   :disabled="isButtonDisabled(scope.row.patientId)"
                   v-if="!isButtonDisabled(scope.row.patientId)"
                   @click="predictPatient(scope.row.patientId)"
               >
                 预测此患者
               </el-button>
               <el-button
                   type="success"
                   size="medium"
                   :disabled="true"
                   v-if="isButtonDisabled(scope.row.patientId)"
               >
                 此患者已完成预测
               </el-button>
             </template>
           </el-table-column>
         </el-table>
       </div>
      </div>

    </div>

      <el-dialog title="结果展示" :visible.sync="dialogTableVisible" >
        <el-button type="primary" style="margin-bottom: 10px" @click="downloadExcel">下载为csv</el-button>
        <div style="height: calc(100vh - 500px);overflow-y: auto">
          <el-table :data="mergeData"
                    :header-cell-style="{ backgroundColor: '#cecece', color: 'black', fontWeight: 'bold' }">
            <el-table-column prop="patientId" label="患者ID"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="sexname" label="性别"></el-table-column>
            <el-table-column :label="tag1">
              <template slot-scope="scope">{{ scope.row.values[0] }}</template>
            </el-table-column>
            <el-table-column :label="tag2">
              <template slot-scope="scope">{{ scope.row.values[1] }}</template>
            </el-table-column>
          </el-table>
        </div>
        <div style="text-align: center">
          <el-button  @click="conPre" type="success">继续预测</el-button>
        </div>
      </el-dialog>
  </div>
</div>

</div>

</template>

<script >
import Vue from "vue";

Vue.directive('validate-number', {
  bind(el) {
    el.addEventListener('input', function(event) {
      let inputValue = event.target.value;

      // 移除非数字和非小数点的字符
      inputValue = inputValue.replace(/[^0-9.]/g, '');

      // 处理多个小数点的情况，只保留第一个
      const dotIndex = inputValue.indexOf('.');
      if (dotIndex !== -1) {
        inputValue = inputValue.slice(0, dotIndex + 1) + inputValue.slice(dotIndex).replace(/\./g, '');
      }

      // 更新输入框的值
      event.target.value = inputValue;
    });
  }
});

import {getRequest} from "@/utils/api";
import {postRequest} from "@/api/user";

export default {
  name: "diseasePre_new",
  created() {
    this.getTree()
    this.getModelNum()
  },
  data() {
    return {
      /*树形控件*/
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      modelNum: 0,
      /*模型调用 手动输入*/
      isHand:true,
      selectedAlgorithmFeatures:[],
      loading:false,
      disabled:false,
      alFlag: false,
      predictionResult1:[],
      predictionResult:{},
      modelSelected:"",
      modelDetail:[],
      tableData:[{
        accuracy:'',
        precision:'',
        recall:'',
        f1Score:'',
        feature:'',
      }],
      /*模型调用，历史数据*/
      isAuto:false,
      isHaveHis: false,
      /*历史数据列表*/
      historyData:[],
      loading2:false,
      multipleSelection:[],
      batchResult:[],
      soloResult:[],
      Result:[],
      patientsPredicted:[],
      /*结果展示*/
      dialogTableVisible:false,
      tag1:'',
      tag2:'',
      mergeData:[],
      predictionLoding: false,
      searchKeyword: '',
      highlightedRowIndex: -1,// 用于标识高亮行的索引
      fileManage:[],
    }
  },
  watch: {
    isAuto(newVal) {
      if (newVal) {
        this.getAllMerge(); // Call getAllMerge function when isAuto becomes true
      }
    },
    Result: {
      handler(newVal, oldVal) {
        // 在 result 数组变化时，更新按钮的禁用状态和取消选中状态
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection(); // 清除表格的选中状态
          this.$refs.multipleTable.$children.forEach(row => {
            // 通过 row.patientId 获取每一行的患者 ID
            const patientId = row.row.patientId;
            // 调用 isButtonDisabled 方法更新按钮的禁用状态
            row.$el.querySelector('.el-button').disabled = this.isButtonDisabled(patientId);
          });
        });
      },
      deep: true // 深度监听 result 数组的变化
    }
  },
  computed: {
    isButtonDisabled() {
      return (patientId) => {
        // 遍历 Result 数组，判断是否存在与当前患者 ID 匹配的对象
        for (let item of this.Result) {
          if (item.hasOwnProperty(patientId)) {
            return true; // 如果存在匹配的对象，返回 true，表示禁用按钮和选择框
          }
        }
        return false; // 如果没有匹配的对象，返回 false，表示不禁用按钮和选择框
      };
    },


  },
  methods: {

    /*范围限制*/
    getChName(featureName) {
      const feature = this.fileManage.find(item => item.featureName === featureName);
      return feature ? `${feature.chName}(${feature.unit})` : '';
    },
    getMinMaxFromString(rangeString) {

      console.log("rangeString")
      console.log(rangeString)
      // const trimmedString = rangeString.replace(/[{}]/g, ''); // 去除大括号
      const regex = /(\d+(\.\d+)?)/g;
      const rangeArray = rangeString.match(regex);

      if (rangeArray.length >= 2) {
        const min = parseFloat(rangeArray[0]);
        const max = parseFloat(rangeArray[1]);
        console.log(min); // 输出: 2.95
        console.log(max); // 输出: 21.79
        return { min, max };
      }else {
        return null
      }


      // const [min, max] = trimmedString.split(',').map(parseFloat); // 分割字符串并转换为数字

    },
    getRangeByFeature(featureName) {
      const feature = this.fileManage.find(item => item.featureName === featureName);
      if (feature) {
        return `取值范围: ${feature.range}`;
      } else {
        return ''; // 如果找不到对应的特征，返回空字符串
      }
    },

    validateInput(event) {
      console.log("validateInput")
      // 允许输入的字符：数字、小数点、退格键、删除键
      const allowedCharacters = /[0-9\.]|Backspace|Delete/;
      if (!allowedCharacters.test(event.key)) {
        event.preventDefault();
      }
      const featureName = event.target.name;
      const feature = this.fileManage.find(item => item.featureName === featureName);
      if (feature){
        const { min, max } = this.getMinMaxFromString(feature.range);
        console.log("min, max")
        console.log(min, max)
        const value = parseFloat(event.target.value);
        if (value < min || value > max) {
          // 超出范围的处理
          this.$message(`值超出范围：${min} - ${max}`);
        }
      }
    },
    isNumeric(value) {
      return /^-?\d*\.?\d*$/.test(value);
    },
    checkRange(feature){
      console.log(feature)

      const range = this.getRangeByFeature(feature.name);
      const { min, max } = this.getMinMaxFromString(range);
      console.log("min, max")
      console.log(min, max)

      if (feature.value < min || feature.value > max) {
        // 超出范围的处理
        this.$message.error(`值超出范围：${min} - ${max}`);
      }

    },
    onEnterKey(event) {

      if (event.key === 'Enter') {
        if (this.alFlag) {
          this.promptDta();
        } else {
          this.saveData();
        }
      }
    },
    /*获取字段管理*/

    toTags(){
      console.log(this.modelSelected)
// 使用正则表达式匹配括号内的内容，然后再根据 & 符号拆分成疾病列表
      let disease_list = this.modelSelected.match(/\(([^)]+)\)/)[1].split('&');

// 假设第一个疾病是慢阻肺，第二个疾病是糖尿病
// 如果您无法确定顺序，可以根据具体情况调整索引
      this.tag1 = "患有" + disease_list[0] + "的概率";
      this.tag2 = "患有" + disease_list[1] + "的概率";
    },
    /*树形控件*/
    getTree(){
      getRequest('/modelResult/getTableName').then(res=> {
        if(res){
          this.transformToTree(res)
        }
      })
    },
    transformToTree(rawData){
      const diseaseMap = {};
      rawData.forEach(item => {
        if (!diseaseMap[item.diseasename]) {
          diseaseMap[item.diseasename] = [];
        }
        diseaseMap[item.diseasename].push({ label: item.modelname });
      });

      // 创建树形结构
      const treeData = [];
      for (const diseasename in diseaseMap) {
        treeData.push({
          label: diseasename,
          children: diseaseMap[diseasename]
        });
      }
      this.treeData = treeData
      console.log(this.treeData)
    },
    getModelNum(){
      getRequest('/Model/getModelNum').then(res => {
        if(res){
          this.modelNum = res
        }
      })

    },
    handleNodeClick(data) {

      // 假设treeData是当前组件的一个数据属性，存储了整棵树的数据
      // 你需要遍历这棵树来检查data.label是否只存在于某个节点的children中
      let isChildLabelOnly = false;
      this.treeData.forEach(node => {
        if (node.children) {
          node.children.forEach(child => {
            if (child.label === data.label) {
              // 发现匹配的label在children中，但不能直接确定它是唯一的
              isChildLabelOnly = true;
              return; // 跳出当前循环，继续检查其他节点
            }
          });
        }

        // 如果在其他非children的位置发现了相同的label，则不是只属于children
        if (node.label === data.label) {
          isChildLabelOnly = false;
        }
      });

      // 只有当data.label只属于某个节点的children时才执行getRequest
      if (isChildLabelOnly) {
        this.modelSelected = data.label
        // 执行getRequest
        getRequest(`/modelResult/getModelResultAndModel/${this.modelSelected}`).then(res => {
          this.modelDetail = res
          const str = res[0].evaluate
          this.tableData[0].feature = res[0].feature
          const jsonObj = JSON.parse(str.replace(/'/g, '"'));
          const resultMap = new Map();
          for (const key in jsonObj) {
            resultMap.set(key, jsonObj[key]);
          }
          this.tableData[0].accuracy = resultMap.get('accuracy')
          this.tableData[0].precision = resultMap.get('precision')
          this.tableData[0].recall = resultMap.get('recall')
          this.tableData[0].f1Score = resultMap.get('f1')
          const fieldArray = res[0].feature.split(",");
          this.selectedAlgorithmFeatures = fieldArray.map(field => ({ name: field, value: '' }))
          console.log(this.selectedAlgorithmFeatures)
        })
        this.whetherexists()
        if(this.modelSelected.includes("多疾病")){
          this.toTags()
          this.getFeatureManage()
        }



      }
    },
    getFeatureManage() {
      getRequest('/TableData/FeatureMatch').then(res => {
        console.log("getFeatureManage")
        this.fileManage = res.data
        console.log(this.fileManage)
      })
    },
    /*模型调用*/



    saveData(){
      for (let i = 0; i < this.selectedAlgorithmFeatures.length; i++) {
        if (!this.selectedAlgorithmFeatures[i].value) {
          // 如果任何一个特征值为空，显示错误消息并返回
          this.$message.error(`${this.selectedAlgorithmFeatures[i].name} 不能为空`);
          return;
        }
      }
      this.alFlag = true
      this.disabled = true
    },
    promptDta(){
      this.loading = true
      const values = this.selectedAlgorithmFeatures.map(feature => feature.value);
      getRequest(`/Patient/getModelPathByModelName/${this.modelDetail[0].modelname}`).then(res => {
        let path = res;
        let fea = values
        let onlineUse = {
          path, fea
        }
        if(this.modelDetail[0].diseasename === '多疾病'){
          postRequest('/OnlineUse/useMulti',onlineUse).then(res => {
            const obj = {}
            console.log(res)
            obj[this.modelDetail[0].modelname] = res.res
            this.predictionResult1.push(obj);
            this.predictionResult = this.predictionResult1.reduce((acc, cur) => {
              return { ...acc, ...cur };
            }, {});

            this.loading = false
            console.log("this.predictionResult1")
            console.log(this.predictionResult1)
            console.log("this.predictionResult")
            console.log(this.predictionResult)
            console.log(this.predictionResult[0])
          })
        }else {
          postRequest('/OnlineUse/use',onlineUse).then(res => {
            const obj = {}
            obj[this.modelDetail[0].modelname] = res.res[0]
            this.predictionResult1.push(obj);
            this.predictionResult = this.predictionResult1.reduce((acc, cur) => {
              return { ...acc, ...cur };
            }, {});
            this.loading = false
            console.log("this.predictionResult1")
            console.log(this.predictionResult1)
            console.log("this.predictionResult")
            console.log(this.predictionResult)
            console.log(this.predictionResult[this.modelname])

          })
        }
      })
    },
    reuse(){
      const fieldArray = this.tableData[0].feature.split(",");
      this.selectedAlgorithmFeatures = fieldArray.map(field => ({ name: field, value: '' }))
      console.log(this.selectedAlgorithmFeatures)
      this.alFlag = false
      this.disabled = false
      this.predictionResult1=[]
      this.predictionResult={}

    },
    /*调整手动输入和历史输入*/
    Handle(){
      this.isHand = true
      this.isAuto = false
    },
    Histories(){
      this.isHand = false
      this.isAuto = true
    },

    /*历史数据*/
    whetherexists(){
      this.isHand = true
      this.isAuto = false

      getRequest(`/Model/whetherexists/${this.modelSelected}`).then(res => {
        console.log(res.data)
        if(res.data === 1){
          this.isHaveHis = true
        }else {
          this.isHaveHis = false
        }
      })
    },
    getAllMerge(){
      this.loading2 = true
      getRequest('/Model/upallmerge').then(res =>{
        if(res){
          this.historyData = res.data
          this.loading2 = false
          console.log(this.historyData)
          this.displayedData = [...this.historyData]
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection)
    },
    // 定义一个函数来处理数据并存储结果
    processAndStoreResult(patientId, batchResult) {
      let Result = [];
      for (let i = 0; i < batchResult.length; i++) {
        let data_array = JSON.parse(batchResult[i]);
        let obj = {};
        obj[patientId[i]] = data_array;
        Result.push(obj);
      }
      return Result;
    },
    batchPrediction() {
      this.predictionLoding = true
      const patientId = this.multipleSelection.map(item => item.patientId);
      let fea = this.modelDetail[0].feature.split(',');
      let path = this.modelDetail[0].pkl;
      let history = {
        path,
        patientId,
        fea
      };

      postRequest('/OnlineUse/history', history).then(res => {
        this.batchResult = res.res;
        this.batchResult = res.res;
        // 在函数内部创建一个临时数组用于存储新数据
        let tempResult = [];
        // 调用处理数据的函数，并将结果添加到临时数组中
        tempResult.push(...this.processAndStoreResult(patientId, this.batchResult));
        // 将临时数组中的数据添加到 this.Result 中
        this.Result.push(...tempResult);
        console.log(this.Result);
        this.toMergeData()
        this.predictionLoding = false
        this.dialogTableVisible = true
      });
    },

    predictPatient(patientId) {
      this.predictionLoding = true
      // 更新选项框的状态
      this.$refs.multipleTable.toggleRowSelection(this.historyData.find(item => item.patientId === patientId));
      let fea = this.modelDetail[0].feature.split(',');
      let path = this.modelDetail[0].pkl;
      patientId = [patientId];
      let history = {
        path,
        patientId,
        fea
      };

      postRequest('/OnlineUse/historySolo', history).then(res => {
        this.soloResult = res.res;
        let data_array = JSON.parse(this.soloResult);
        let obj = {};
        obj[patientId[0]] = data_array;
        // 将处理后的结果直接存储到 this.Result 中
        this.Result.push(obj);
        console.log(this.Result);
        this.toMergeData()
        this.predictionLoding = false
        this.dialogTableVisible = true
      });
    },

    resultShow(){
      this.dialogTableVisible = true
    },

    toMergeData(){
      this.Result.forEach(valueObj => {
        // 遍历 data 数组，在其中查找匹配的患者ID
        this.historyData.forEach(dataObj => {
          // 如果找到了匹配的患者ID
          if (valueObj.hasOwnProperty(dataObj.patientId)) {
            // 检查 mergedData 是否已经存在相同的 patientId
            let existingPatient = this.mergeData.find(item => item.patientId === dataObj.patientId);
            // 如果不存在相同的 patientId，则将当前数据合并到 mergedData 中
            if (!existingPatient) {
              // 将患者ID对应的值合并到 data 对象中
              dataObj["values"] = valueObj[dataObj.patientId];
              // 将合并后的对象存储到新数组中
              this.mergeData.push(dataObj);
            }
          }
        });
      });

// 输出合并后的结果
      console.log(this.mergeData);
    },
    downloadExcel() {
      const header = ['Patient ID', 'Name', 'Sex', this.tag1, this.tag2];
      const csvContent = [
        header.join(','), // CSV 头部
        ...this.mergeData.map(row => `${row.patientId},${row.name},${row.sexname},${row.values.join(',')}`)
      ].join('\n');

      // 创建一个 Blob 对象
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      // 创建一个 a 标签用于下载
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'result.csv'; // 下载文件名
      link.click();

    },

    conPre(){
      this.dialogTableVisible = false
    },
    resetTable() {
      this.highlightedRowIndex = -1;
      this.searchKeyword = ''
      this.getAllMerge()
    },
    searchTable(){
// 在historyData中查找匹配的索引
      const index = this.historyData.findIndex(item => item.patientId === this.searchKeyword);
      if (index !== -1) {
        // 移动匹配的项到数组的第一个位置
        const matchedItem = this.historyData.splice(index, 1)[0];
        this.historyData.unshift(matchedItem);
        // 更新高亮行的索引
        this.highlightedRowIndex = 0;
      } else {
        // 如果未找到匹配项，则清除高亮行的索引
        this.$message('没有找到该患者ID');
        this.highlightedRowIndex = -1;

      }
    },
    // 根据highlightedRowIndex给表格行添加样式
    highlightRow({ row, rowIndex }) {
      if(rowIndex === this.highlightedRowIndex){
        return 'warning-row';
      }
      return ''
    }

  }


}

</script>

<style scoped>
.container {
  display: flex;

}

.left {
  flex: 20%;
  border-right: #cecbcb 1px solid;
  border-left: #cecbcb 1px solid;
  border-top: #cecbcb 1px solid;

}

.right {
  flex: 80%;
  overflow: auto;
}
.custom-node {
  /* 添加您想要的自定义字体样式 */
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #333; /* 设置字体颜色 */
  margin-bottom: 10px;
  line-height: 40px; /* 设置行高 */
  padding: 5px 0; /* 添加上下内边距 */

}
.smallLft {
  flex: 50%;
  border-right: #cecbcb 1px solid;
}

.smallRight {
  flex: 50%;
}

/* 根据高亮行的索引给表格中的第一行添加特定样式 */
.warning-row {
  background: #e1af4f;
}

.el-table .success-row {
  background: #f0f9eb;
}

.highlighted-row {
  background: #f0f9eb !important;
}
</style>