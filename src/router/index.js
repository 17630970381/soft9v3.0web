import Vue from 'vue'
import VueRouter from 'vue-router'
import SideBar from '@/components/sideBar/index.vue'
import dash from '@/views/dash/index2.vue'
// import metastasis from "@/views/lung/metastasis";
// import earlyLung from "@/views/lung/earlyLung";
// import connectMining from "@/components/tab/connectMining.vue";
// import dangePredict from "@/components/tab/dangePredict.vue";
import ModelTrain from "@/components/tab/ModeTrain.vue"
import dataManage from "@/components/tab/dataManage.vue";
import tableManage from "@/components/tab/tableManage.vue";
import modelManage from "@/components/tab/modelManage.vue";
import userManage from "@/components/tab/userManage.vue";
import UserSideBar from "@/components/user/UserSideBar.vue"
import Predict from "@/components/user/Predict.vue"
import DieaseIntro from "@/components/user/DieaseIntro/DieaseIntro.vue"
import Batch from "@/components/tab/Batch.vue"
import SoftwareIntro from "@/components/tab/SoftwareIntro.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/register";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: "/sideBar",
    name: "SideBar",
    redirect: "/SoftwareIntro",
    component: SideBar,
    children: [
      {
        path: "/dash",
        name: "dash",
        component: dash,
      },
      {
        path: "/dataManage",
        name: "dataManage",
        component: dataManage,
      },
      //   模型训练开始
      {
        path: "/modelTrain",
        name: "ModelTrain",
        component: () => import("@/components/modeTrain/createTask.vue"),
      },
      {
        path: "/dataChoose",
        name: "dataChoose",
        component: () => import("@/components/modeTrain/dataChoose.vue"),
      },
      {
        path: "/featureChoose",
        name: "featureChoose",
        component: () => import("@/components/modeTrain/featureChoose.vue"),
      },
      {
        path: "/alChoose",
        name: "alChoose",
        component: () => import("@/components/modeTrain/alChoose.vue"),
      },
      {
        path: "/resultShow",
        name: "resultShow",
        component: () => import("@/components/modeTrain/resultShow.vue"),
      },
      //   模型训练结束
      //   疾病预测开始
      {
        path: "/diseasePre",
        name: "diseasePre",
        component: () => import("@/components/diseasePrediction/diseasePre.vue"),
      },
      {
        path: "/predictionInfo",
        name: "predictionInfo",
        component: () => import("@/components/diseasePrediction/predictionInfo.vue"),
      },
      {
        path: "/predictionResult",
        name: "predictionResult",
        component: () => import("@/components/diseasePrediction/predictionResult.vue"),
      },
      //   疾病预测结束
      // 模型管理开始
      {
        path: "/modelManage",
        name: "modelManage",
        component: () => import("@/components/modelManage/modelManage.vue"),
      },
      {
        path: "/detail",
        name: "detail",
        component: () => import("@/components/modelManage/detail.vue"),
      },
      // 模型管理结束
      {
        path: "/taskChoose",
        name: "taskChoose",
        component: () => import("@/components/tab/taskChoose.vue"),
      },
      {
        path: "/tableManage",
        name: "tableManage",
        component: tableManage,
      },
      {
        path: "/modelManage",
        name: "modelManage",
        component: modelManage,
      },
      {
        path: "/TaskManage",
        name: "taskManage",
        component: () => import("@/components/tab/TaskManage.vue")
      },
      {
        path: "/userManage",
        name: "userManage",
        component: userManage,
      },
      {
        path: "/Predict",
        name: "Predict_manager",
        component: Predict,
      },
      {
        path: "/DieaseIntro",
        name: "DieaseIntro_manager",
        component: DieaseIntro,
      },
      {
        path: "/Batch",
        name: "Batch",
        component: Batch,
      },
      {
        path: "/SoftwareIntro",
        name: "SoftwareIntro",
        component: SoftwareIntro,
      },
      {
        path: "/diseasePre",
        name: "diseasePre",
        component: () => import("@/components/diseasePrediction/diseasePre.vue"),
      }
    ],
  },
  {
    path: "/UserSideBar",
    name: "UserSideBar",
    component: UserSideBar,
    children: [
      {
        path: "Predict",
        name: "Predict",
        component: Predict,
      },
      {
        path: "DieaseIntro",
        name: "DieaseIntro",
        component: DieaseIntro,
      },
    ],
  },

  // {
  //     path : '/metastasis',
  //     name: 'metastasis',
  //     component : metastasis
  // },
  // {
  //     path:'/connectMining',
  //     name:'connectMining',
  //     component:connectMining,
  // },{
  //     path:'/dangePredict',
  //     name:'dangePredict',
  //     component:dangePredict,
  // },
  // {
  //     path:'/importModel',
  //     name:'importModel',
  //     component:importModel,
  // }
];

const router = new VueRouter({
  routes
 })
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从哪个路径跳转而来
  //next是一个函数，表示放行
  //next() 放行 next('/login')强制跳转

  if (to.path === '/') return next();
  if(to.path==='/register') return next();
  //获取token
  const uid = window.sessionStorage.getItem('uid');
  if (!uid) return next('/');
  next();
});
export default router
