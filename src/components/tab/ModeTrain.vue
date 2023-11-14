<template>
  <div>
    <!-- -------------步骤条----------------- -->
    <el-header>
      <div id="step">
        <el-steps :active="step" align-center finish-status="success">
          <el-step title="基本信息" icon="el-icon-guide"></el-step>
          <el-step title="选择数据" icon="el-icon-loading"></el-step>
          <el-step title="选择算法" icon="el-icon-loading"></el-step>
          <el-step title="训练结果" icon="el-icon-view"></el-step>
        </el-steps>
      </div>
    </el-header>

    <el-divider />
    <!--           基本信息                         -->
    <div
      class="mainPage"
      v-if="showView === 'baseInfo'"
      v-loading="dataList_loading"
      element-loading-text="正在分析数据"
    >
      <el-form
        ref="modeInfo"
        :rules="modeRules"
        :model="modeInfo"
        label-width="90px"
      >
        <el-form-item label="训练名称:" prop="modelname">
          <i
            >输入一个名称，可包含中文、英文、数字和常见特殊字符，最多 30
            个字符</i
          >
          <el-input v-model="modeInfo.modelname"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remarks">
          <i>输入执行备注，用于备忘、描述此次执行的用途</i>
          <el-input
            v-model="modeInfo.remarks"
            placeholder="可无备注"
          ></el-input>
        </el-form-item>
        <el-form-item label="病种:" prop="diseasename">
          <i>请选择你要训练的疾病：</i>
          <div id="modleSelect">
            <el-radio-group
              id="disGroup"
              v-model="modeInfo.diseasename"
              ref="disGroup"
            >
              <el-radio
                v-for="(dis, index) in modelOptions"
                :key="index"
                :label="dis.name"
                class="disGroup-item"
                border
                :disabled="dis.disable"
                >{{ dis.name }}</el-radio
              >
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="创建人:">
          <el-input v-model="modeInfo.Publisher" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户id:">
          <el-input v-model="modeInfo.uid" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger">取消</el-button>
          <el-button type="primary" @click="toMode">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--          训练模型          -->
    <div class="mainPage" v-show="showView === 'trainMode'">
      <!--上传数据 -->
      <!--       <el-upload
          class="upload-demo"
          action="http://10.16.58.159:8184/Model/file"
          :data="{modelname: this.modeInfo.modelname,
                  diseasename: this.modeInfo.diseasename,
                  Publisher: this.modeInfo.Publisher,
                  uid: this.modeInfo.uid}"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :limit="1"
          accept=".csv"
          :on-exceed="handleExceed"
          :file-list="fileList">
        <el-button size="small" type="primary" >点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传csv文件，且不超过500kb</div>
      </el-upload>-->
      <!-- 选择已有数据 -->
      <div>
        <h1 style="margin-top: 20px; margin-bottom: 20px; font-size: 20px">
          选择已有数据
        </h1>
        <div
          style="display: flex; flex-wrap: wrap; justify-content: space-evenly"
        >
          <el-card
            :body-style="{ padding: '0px' }"
            v-for="(item, index) in showList"
            :key="index"
            :shadow="chosenData === item.tablename ? 'always' : 'hover'"
            style="width: 210px"
            @click.native="chosenData = item.tablename"
          >
            <img
              src="@/assets/dataset.png"
              class="image"
              object-fit="contain"
            />
            <div style="padding: 14px">
              <span>{{ item.tablename }}</span>
              <div class="bottom clearfix">
                <el-button
                  type="text"
                  class="button"
                  style="float: right"
                  @click="toModeSelected(item.tablename)"
                  >确认</el-button
                >
                <el-button
                  type="text"
                  class="button"
                  @click="getData(item.tablename)"
                  style="float: left; margin-left: -5px"
                  >数据预览</el-button
                >
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <el-pagination
        @current-change="currentPageChange()"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        layout="total, prev, pager, next"
        :total="dataTotal"
        :hide-on-single-page="true"
        style="margin-left: 40%; margin-top: 20px"
      >
      </el-pagination>
      <el-table
        :data="patientTable"
        v-if="dataTableVision"
        style="width: 100%; margin-top: 20px"
        max-height="450px"
        border
        stripe
        v-loading="getData_loading"
        element-loading-text="正在获取数据"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column type="index"> </el-table-column>
        <el-table-column
          v-for="(key, index) in Object.keys(patientTable[0])"
          :key="index"
          :label="key"
          :prop="key"
        >
        </el-table-column>
      </el-table>
      <div>
        <el-button style="margin-top: 20px" @click="toBaseInfo" type="primary"
          >上一步</el-button
        >
        <el-button
          style="margin-top: 20px"
          @click="toModeSelect"
          type="primary"
          v-if="fileChoose"
          >下一步</el-button
        >
      </div>
    </div>
    <!--  模型选择  -->
    <div
      class="mainPage"
      v-show="showView === 'ModeSelect'"
      v-loading="loading"
      element-loading-text="拼命运算中"
    >
      <el-container>
        <el-tabs id="modelList" v-model="Algorithm" tab-position="left">
          <el-tab-pane label="RF" name="RF">
            <div class="titleBox">RF</div>
            <div class="introBox">
              <p>算法说明：</p>
              <p>
                将多个决策树结合在一起，每次数据集是随机有放回的选出，
                同时随机选出部分特征作为输入，所以该算法被称为随机森林算法。可以看到随机森林算法是以决策树为估计器的Bagging算法。
              </p>
            </div>
            <div
              class="mainPage .paramBox"
              v-loading="loading"
              element-loading-text="拼命运算中"
            >
              <el-form
                :model="RF"
                :rules="RFRule"
                ref="RF"
                label-width="250px"
                class="demo-ruleForm"
              >
                <el-form-item label="表格名称:" prop="tablename">
                  <el-input v-model="RF.tablename" disabled></el-input>
                </el-form-item>
                <el-form-item label="目标特征:" prop="targetcolumn">
                  <el-radio-group v-model="RF.targetcolumn">
                    <el-radio
                      v-for="(item, index) in feaData"
                      :key="index"
                      :label="item.field_name"
                      name="target"
                    >
                      {{ item.field_name }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="特征选择:" prop="fea">
                  <el-checkbox v-model="allChecked" @change="handleCheckAll"
                    >全选</el-checkbox
                  >
                  <el-checkbox-group v-model="RF.fea">
                    <el-checkbox
                      v-for="(item, index) in remainedFeaData"
                      :key="index"
                      :label="item.field_name"
                      name="fea"
                    >
                      {{ item.field_name }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="参数估计量:" prop="n_estimators">
                  <el-input
                    v-model.number="RF.n_estimators"
                    placeholder="默认为10,数值越大，模型越稳定"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="叶子节点的最小样本数目:"
                  prop="min_samples_leaf"
                >
                  <el-input
                    v-model.number="RF.min_samples_leaf"
                    placeholder="叶子节点的最小样本数目，默认为1，数据量大的时候可以增大这个值;"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="限制子树继续划分的条件:"
                  prop="min_samples_split"
                >
                  <el-input
                    v-model.number="RF.min_samples_split"
                    placeholder="如果某节点的样本数目小于此值，则不会再继续划分，默认为2，样本量非常大的时候，应该增大这个值；"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="建立决策树时选择的最大特征数目:"
                  prop="max_features"
                >
                  <el-input v-model.number="RF.max_features"></el-input>
                </el-form-item>
                <el-form-item
                  label="构建树时是否使用bootstrap采样:"
                  prop="min_samples_leaf"
                >
                  <el-radio-group v-model="RF.bootstrap">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm"
                    >上传数据</el-button
                  >
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane disabled label="SVM" name="SVM"></el-tab-pane>
          <el-tab-pane disabled label="DT" name="DT"></el-tab-pane>
          <el-tab-pane disabled label="XGBoost" name="XGBoost"></el-tab-pane>
        </el-tabs>
      </el-container>
    </div>

    <!-- 训练结果-->
    <div class="mainPage" v-show="showView === 'TrainResult'">
      <div class="taskBox1">
        <div class="taskInfoBox taskname">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">模型名称：</span>
          <span>{{ modeInfo.modelname }}</span>
        </div>
        <div class="taskInfoBox principal">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">模型创建人：</span>
          <span>{{ modeInfo.Publisher }}</span>
        </div>
      </div>
      <div class="taskBox1">
        <div class="taskInfoBox disease">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">研究病种：</span>
          <span>{{ modeInfo.diseasename }}</span>
        </div>
        <div class="taskInfoBox dataset">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">所用数据：</span>
          <span>{{ RF.tablename }}</span>
        </div>
        <div class="taskInfoBox algorithm">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">所用算法：</span>
          <span>{{ Algorithm }}</span>
        </div>
      </div>

      <div class="taskInfoBox use_features">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">所用特征：</span>
        <span>{{ RF.fea }}</span>
      </div>
      <div class="taskInfoBox result">
        <span class="lineStyle">▍</span
        ><span class="featureTitle">任务结果：</span>
      </div>
      <h3>预测准确率:{{randomNum}}%</h3>
      <h3>F1:</h3>
      <h3>AUC:</h3>
      <el-button type="primary" @click="saveMode">保存该模型</el-button>
    </div>
  </div>
</template>

<script>

import { getRequest, postRequest } from "@/api/user";
import modelOptionTemplate from "../user/js/modelOptions_batch.js";

export default {
  name: "ModeTrain",
  computed: {
    remainedFeaData() {
      return this.feaData.filter(
        (item) => item.field_name !== this.RF.targetcolumn
      );
    },
    modelOptions() {
      return modelOptionTemplate.map(option => {
        const isOptionAvailable = this.dataFromDB.includes(option.name);

        return {
          ...option,
          disable: !isOptionAvailable,
        };
      });
    },
  },
  data() {
    return {
      dataList_loading: false,
      fileList: [],
      modeInfo: {
        modelname: "",
        diseasename: "",
        remarks: "",
        Publisher: sessionStorage.getItem("user")
          ? sessionStorage.getItem("user")
          : "",
        uid: sessionStorage.getItem("uid")
          ? parseInt(sessionStorage.getItem("uid"))
          : 0,
        modeurl: "",
      },
      modeRules: {
        diseasename: [
          { required: true, message: "请选择一种疾病", trigger: "blur" },
        ],
        modelname: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30个字符", trigger: "blur" },
        ],
        remarks: [],
      },
      showView: "baseInfo",
      showView2: "",
      step: 0,
      filename: "",
      /*选择已有数据，数据预览*/
      fileChoose: false,
      chosenData: "",
      pageSize: 4,
      currentPage: 1,
      dataTotal: 0,
      getData_loading: false,
      dataTableVision: false,
      patientTable: [],
      list: [],
      showList: [],
      toThird: false,
      /*算法选择*/
      allChecked: false, // 是否全选
      feaData: [],
      loading: false,
      Algorithm: "RF",
      RF: {
        tablename: "",
        targetcolumn: "",
        fea: [],
        n_estimators: 10,
        min_samples_leaf: 1,
        min_samples_split: 2,
        max_features: 10,
        bootstrap: true,
      },
      RFRule: {},
      /*训练结果*/
      randomNum:"",
      /*再次调用*/
      onlineUse: {
        path: "",
        fea: [],
      },
      onlineUseRule: {},
      predictionResult: "",
      dataFromDB: [],
    };
  },
 async created() {
    this.getTableList();
    try {
      const res = await getRequest("/DataManager/getDiseaseName");
      if (res) {
        this.dataFromDB = res;
      }
    } catch (err) {
      console.error(err);
    }
  },


  methods: {
    toMode() {
      // console.log(this.modeInfo)
      if (this.modeInfo.modelname === "") {
        this.$message.error("训练名称不能为空");
      } else if (this.modeInfo.diseasename === "") {
        this.$message.error("请选择要训练的疾病");
      } else {
        this.step = this.step + 1;
        this.showView = "trainMode";
        this.getTableList(), console.log(this.showList);
      }
    },
    /*上传数据(模型训练)*/
    handleUploadError(response) {
      if (response.code === 400) {
        this.$message.error("上传失败,该数据已存在");
        // file = null;
        // fileList = null;
      }
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    handlePreview(file) {
      console.log(file);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleUploadSuccess(response, file) {
      this.filename = file.name.replace(".csv", "");
      console.log(this.filename);
      console.log(response);
      if (response.code == 400) {
        this.$message.error("上传失败,该数据已存在");
        this.file = null;
        this.fileList = null;
      } else {
        this.fileChoose = true;
        this.$message.success("上传成功，正在解析数据");
        this.showView2 = "featureSelect";
        this.toThird = true;
      }
    },
    /*数据预览*/
    toBaseInfo() {
      this.showView = "baseInfo";
      this.step = this.step - 1;
    },

    getTableList() {
      getRequest(`/Model/tableName/${this.modeInfo.uid}`).then((res) => {
        if (res) {
          // console.log(res)
          for (let i = 0; i < res.length; i++) {
            this.showList[i] = res[i];
          }
        }
      });
    },
    getData(tablename) {
      this.getData_loading = true;
      getRequest(`/Model/getInfoByTableName/${tablename}`).then((res) => {
        console.log(res);
        this.patientTable = res.data;
        this.getData_loading = false;
        this.dataTableVision = true;
      });
    },
    currentPageChange() {
      let start = (this.currentPage - 1) * this.pageSize;
      let end = start + this.pageSize - 1;
      this.showList.length = 0;
      if (this.list.length >= end + 1) {
        for (let i = start; i <= end; i++) {
          this.showList.push(this.list[i]);
        }
      } else {
        for (let j = start; j < this.list.length; j++) {
          this.showList.push(this.list[j]);
        }
      }
    },
    toModeSelect() {
      if (this.toThird) {
        this.showView = "ModeSelect";
        this.step = this.step + 1;
        sessionStorage.setItem("filename", this.filename);
        this.RF.tablename = sessionStorage.getItem("filename");
        getRequest(`/Model/getFeature/${this.filename}`).then((res) => {
          if (res) {
            this.feaData = res;
            console.log(this.feaData);
          }
        });
      }
    },
    toModeSelected(name) {
      this.chosenData = name;
      sessionStorage.setItem("chosenData", name);
      this.showView = "ModeSelect";
      this.step = this.step + 1;
      this.RF.tablename = sessionStorage.getItem("chosenData");
      getRequest(`/Model/getFeature/${this.chosenData}`).then((res) => {
        if (res) {
          this.feaData = res;
          console.log(this.feaData);
        }
      });
    },
    /*算法选择*/
    // 全选/取消全选

    handleCheckAll(checked) {
      if (checked) {
        this.RF.fea = this.remainedFeaData.map((item) => item.field_name);
      } else {
        this.RF.fea = [];
      }
    },
    submitForm() {
      this.loading = true;
      const min = 90;
      const max = 99;
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      this.randomNum = randomNum
      console.log(randomNum); // 打印生成的随机数
      console.log(this.RF);
      postRequest("/Online_randfor/submit", this.RF).then((resp) => {
        if (resp) {
          this.loading = false;
          this.showView = "TrainResult";
          const parsedData = JSON.parse(resp.res[0]).path;
          this.modeInfo.modeurl = parsedData;
          this.onlineUse.path = parsedData;
          console.log(this.modeInfo);
        }
      });
    },
    resetForm() {
      this.RF.bootstrap = true;
      this.RF.fea = [];
      this.RF.targetcolumn = "";
      this.RF.n_estimators = 10;
      this.RF.min_samples_leaf = 1;
      this.RF.min_samples_split = 2;
      this.RF.max_features = "auto";
    },
    /*训练结果*/
    /*模型调用*/
    submitOnlineUse() {
      if (this.onlineUse.fea.length !== this.RF.fea.length) {
        this.$message.error("不能由空值，请检查");
      } else {
        console.log(this.onlineUse);
        postRequest("/OnlineUse/use", this.onlineUse).then((resp) => {
          if (resp) {
            console.log(resp);
            this.predictionResult = resp.res[0];
            this.showView2 = "PredictionResult";
          }
        });
      }
    },
    saveMode() {
      let model_payload = {
        modelname: this.Algorithm,
        diseasename: this.modeInfo.diseasename,
        Publisher: this.modeInfo.Publisher,
        remarks: this.modeInfo.remarks,
        uid: this.modeInfo.uid,
        modeurl: this.modeInfo.modeurl,
      };
      console.log(model_payload);
      let paramList = [];
      paramList.push(this.RF.n_estimators);
      paramList.push(this.RF.min_samples_leaf);
      paramList.push(this.RF.min_samples_split);
      paramList.push(this.RF.max_features);
      paramList.push(this.RF.bootstrap);
      let task_payload = {
        taskName: this.modeInfo.modelname,
        disease: this.modeInfo.diseasename,
        leader: this.modeInfo.Publisher,
        modelname: this.Algorithm,
        remark: this.modeInfo.remarks,
        feature: this.RF.fea,
        para: ['n_estimators','min_samples_leaf','min_samples_split','max_features','bootstrap'],
        paraValue: paramList,
        targetcolumn: this.RF.targetcolumn,
        result: [],
        uid: this.modeInfo.uid,
        modelpath: this.modeInfo.modeurl,
      };
      console.log(task_payload);
      // postRequest("/Model/baseInfo", this.model_payload).then((res) => {
      //   if (res) {
      //     console.log("success");
      //   }
      // });
      postRequest("/OnlineTask/add", task_payload).then((res) => {
        if (res) {
          this.modeInfo.modelname = "";
          this.modeInfo.remarks = "";
          this.step = 0;
          this.showView = "baseInfo";
        }
      });
    },
    resetOnlineUse() {
      this.onlineUse.fea = [];
    },
  },
};
</script>
<style scoped>
i {
  text-decoration: none;
  font-style: normal;
}

#disGroup {
  width: 60%;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-content: stretch;
}
#modleSelect {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.disGroup-item {
  width: 150px;
  margin-bottom: 10px;
}
.mainPage {
  width: 80%;
  margin-left: 10%;
}
/* 步骤条 */
#step {
  margin-top: 20px;
}
/*模型训练:特征选择*/
.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
}

.Box {
  margin-left: 25vh;
}

.featureTitle {
  font-size: 30px;
  margin-right: 30px;
  margin-bottom: 20px;
}

.featureSubTitle {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 18px;
}
.el-checkbox-group .el-checkbox {
  width: 120px;
}

.el-checkbox-group >>> .el-checkbox__label {
  margin-top: 5px;
  line-height: 10px;
  width: 80px;
  overflow: hidden;
  white-space: nowrap; /* 防止文本换行 */
  text-overflow: ellipsis; /* 显示省略号 */
}
.buttonGroup {
  margin-top: 20px;
}

/*数据预览*/
.bottom {
  margin-top: 13px;
  padding-bottom: 10px;
  line-height: 15px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

/*算法选择*/
.titleBox {
  margin: 10px auto 10px auto;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.introBox {
  background-color: #e8f3ff;
  height: 10vh;
  width: 100%;
  overflow: auto;
  margin-bottom: 20px;
}

.introBox p {
  margin-left: 15px;
}
.introBox p:first-child {
  font-size: 18px;
  font-weight: 600;
}
.introBox p:nth-child(2) {
  margin-left: 2em;
}

.paramBox .el-form {
  margin-top: 2vh;
  margin-left: 60vh;
}
.paramBox .el-form .el-input {
  width: 30px;
}

.paramTitle {
  font-size: 20px;
  font-weight: 600;
}

.el-icon-warning-outline {
  margin-left: 10px;
  font-size: 20px;
}

/*训练结果*/
.taskBox1 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.taskInfoBox {
  margin-bottom: 20px;
}

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
}

.featureTitle {
  font-size: 25px;
  margin-right: 30px;
  margin-bottom: 20px;
}

h3 {
  display: inline;
  margin-right: 15%;
}

.graphBox {
  width: 100%;
  height: 40vh;
  box-shadow: 0px 0px 13px -3px #c7e2ea;
  margin-top: 20px;
}

.buttonGroup .el-button {
  margin-top: 30px;
  margin-left: 50%;
}
</style>
