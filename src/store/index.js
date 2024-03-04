import Vue from 'vue'
import Vuex from 'vuex'
import storage from '../utils/storage'
import taskModule from "@/store/taskModule";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toolBar : true,
    allTableData:[],
    dataList: [],
    taskList: [],
    modelList: [],
  //  创建任务 => 数据选择
    formData: {
      taskName: '',
      assignee: '',
      participants: '',
      notes: ''
    }


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

    SetDataList(state, value) {
      state.dataList = value;
    },
    SetTaskList(state, value) {
      state.taskList = value;
    },
    SetModelList(state, value) {
      state.modelList = value;
    },
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
  },
  modules: {
    disFactor: taskModule,
    f_Factor: taskModule,
    factorDis: taskModule,
  }
})
