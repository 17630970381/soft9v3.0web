import Vue from 'vue'
import Vuex from 'vuex'
import storage from '../utils/storage'
import taskModule from "@/store/taskModule";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sideBarPath: '',
    toolBar : true,
    allTableData:[],
    dataList: [],
    taskList: [],
    modelList: [],
  //  创建任务 => 数据选择
    formData: {
      modelName: '',
      assignee: '',
      diseasename: '',
      notes: ''
    },
  //   数据表选择
    dataChoose: "",
    /*选择数据表名*/
    tableName:"",
  // 模型训练，特征选择 传递选择的特征
    featureChooseData: {
      target: "",
      trainFea: [],
    },

    completeParameter:[],
  // 算法结果
    resultData: {},
    // 算法选择中以选算法
    selectedAlgorithms:[],
    fea: [],

    // 疾病预测
    formPreData:{
      publisher:"",
      diseasename:"",
      uid:+"",
    },
    // 疾病预测结果数组
    predictionResult:[],
    selectedModelName:[],
    //模型详情
    modelname:"",
    //模型训练中算法参数选择
    pvalue:0,
    bvalue:0,
  },
  getters: {
    getAllTableData(state){
      state.allTableData=storage.get("allTableData");
      return state.allTableData;
    },

    // 获取有数据的疾病列表
    dataDisList(state) {
      let newArray = [];
      state.dataList.forEach(({ disease }) => {
        if (newArray.indexOf(disease) === -1) {
          //去重
          newArray.push(disease);
        }
      });
      return newArray;
    },

    dataCreatorList(state) {
      let newArray = [];
      state.dataList.forEach(({ creator }) => {
        if (newArray.indexOf(creator) === -1) {
          //去重
          newArray.push(creator);
        }
      });
      return newArray;
    },

    taskLeaderList(state) {
      let newArray = [];
      state.taskList.forEach(({ leader }) => {
        if (newArray.indexOf(leader) === -1) {
          //去重
          newArray.push(leader);
        }
      });
      return newArray;
    },
    taskDiseaseList(state) {
      let newArray = [];
      state.taskList.forEach(({ disease }) => {
        if (newArray.indexOf(disease) === -1) {
          //去重
          newArray.push(disease);
        }
      });
      return newArray;
    },

    // 模型训练中 特征选择（已选择完毕的特征）
    getFeatureChooseData: (state) => state.featureChooseData,

  },
  mutations: {
    changeToolBar(state) {
      state.toolBar = !state.toolBar
      state.toolBar = !state.toolBar
    },
    setAllTableData(state,allTableData){
      state.allTableData=allTableData
    },
    // 模型训练中 createTask => 数据选择
    taskToDataChoose(state,data) {
      state.formData = data;
    },
    // 数据表选择
    dataChooseToFeatureChoose(state,data) {
      state.tableName = data;
    },
    SetDataList(state, value) {
      state.dataList = value;
    },
    SetTaskList(state, value) {
      state.taskList = value;
    },
    SetModelList(state, value) {
      state.modelList = value;
    },
    // 模型训练中 特征选择（已选择完毕的特征）
    updateFeatureChooseData(state, data) {
      state.featureChooseData = data;
    },
    // 算法运行完的结果，传到结果展示页面
    setResultData(state,data){
      state.resultData = data;
    },
    selectedAlgorithms(state,data){
      state.selectedAlgorithms = data
    },
    setTableName(state,data){
      state.dataChoose =data
    },
    setFea(state,data){
      state.fea = data
    },
    completeParameter(state,data){
      state.completeParameter = data
    },
    toDiseasePre(state,data){
      state.formPreData = data
    },
    // 模型调用结果数组
    predictionResult(state,data){
      state.predictionResult = data
    },
    selectedModelName(state,data){
      state.selectedModelName = data
    },
    //模型详情
    manageModelName(state,data){
      state.modelname = data
    },
    putTableName(state,data){
      state.tableName = data
    },
    //模型训练中算法参数选择
    pvalue(state,data){
      state.pvalue = data
    },
    bvalue(state,data){
      state.bvalue = data
    },
    SetSideBarPath(state,value){
      state.sideBarPath = value;
    }
  },
  actions: {
    getDataList(context) {
      getRequest("/DataTable/upall")
          .then((res) => {
            context.commit("SetDataList", res.reverse());
          })
          .catch((err) => {
            console.log("数据列表获取错误，请联系管理员。");
            console.log(err);
          });
    },
    getTaskList(context,uid) {
      getRequest(`/Task/all?uid=${uid}`)
          .then((res) => {
            context.commit("SetTaskList", res.reverse());
          })
          .catch((err) => {
            console.log("任务列表获取错误，请联系管理员。");
            console.log(err);
          });
    },
    getModelList(context) {
      getRequest("/Model/all")
          .then((res) => {
            context.commit("SetModelList", res);
          })
          .catch((err) => {
            console.log("模型列表获取错误，请联系管理员。");
            console.log(err);
          });
    },
// 模型训练中 特征选择（已选择完毕的特征）
    updateFeatureChooseData({ commit }, data) {
      commit('updateFeatureChooseData', data);
    },
  },
  modules: {
    disFactor: taskModule,
    f_Factor: taskModule,
    factorDis: taskModule,
  }
})
