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
import userManage from "@/components/systemManage/userManage.vue";
import UserSideBar from "@/components/user/UserSideBar.vue"
import Predict from "@/components/user/Predict.vue"
import DieaseIntro from "@/components/user/DieaseIntro/DieaseIntro.vue"
import Batch from "@/components/tab/Batch.vue"
import SoftwareIntro from "@/components/footer/SoftwareIntro.vue";
import Login from "@/views/Login2.vue";
import Register from "@/views/register_new.vue";
import store from '../store/index'
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
    path: '/forget',
    name: 'forget',
    component: () => import('@/views/forget.vue'),
  },
  {
    path: "/sideBar",
    name: "SideBar",
    redirect: "/SoftwareIntro",
    meta: { roles: ['1', '0'] },
    component: SideBar,
    children: [
        //操作手册
      {
        path: "/operation",
        name: "operation",
        component: () => import("@/components/footer/operation.vue"),
        meta: { roles: ['1', '0'] },
      },
      //个人中心
      {
        path: "/userCenter",
        name: "userCenter",
        component: () => import("@/components/userCenter/userCenter.vue"),
        meta: { roles: ['1', '0'] },
      },
      //修改密码
      {
        path: "/updatePassword",
        name: "updatePassword",
        component: () => import("@/components/userCenter/updatePassword.vue"),
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/dash",
        name: "dash",
        component: dash,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/dataManage",
        name: "dataManage",
        component: dataManage,
        meta: { roles: ['1', '0'] },
      },
      //   模型训练开始
      {
        path: "/modelTrain",
        name: "ModelTrain",
        component: () => import("@/components/modeTrain/dataChoose.vue"),
        meta: { roles: ['1', '0'] },
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
        path: "/diseasePre_new",
        name: "diseasePre_new",
        component: () => import("@/components/diseasePrediction/diseasePre_new.vue"),
        meta: { roles: ['1', '0'] },
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
        meta: { roles: ['1', '0'] },
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
        meta: { roles: ['0'] },
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
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/diseasePre",
        name: "diseasePre",
        component: () => import("@/components/diseasePrediction/diseasePre.vue"),
      },
        //系统管理开始
      //日志管理
      {
        path: "/logManage",
        name: "logManage",
        component: () => import("@/components/systemManage/logManage.vue"),
        meta: { roles: ['0'] },
      },
      //   疾病设置
      {
        path: "/diseaseSet",
        name: "diseaseSet",
        component: () => import("@/components/systemManage/diseaseSet.vue"),
        meta: { roles: ['0'] },
      },
      {
        path: "/diseaseManager",
        name: "diseaseManager",
        component: () => import("@/components/systemManage/diseaseManager.vue"),
        meta: { roles: ['0'] },
      },
      {
        path: '/unauthorized',
        name: 'unauthorized',
        component: () => import("@/components/systemManage/404.vue"),
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/userManage',
        name: 'userManage',
        component: () => import("@/components/systemManage/userManage.vue"),
        meta: { roles: ['0'] },
      },
      {
        path: '/inform',
        name: 'inform',
        component: () => import("@/components/systemManage/inform.vue"),
        meta: { roles: ['0'] },
      },
      {
        path: '/AdminDataManage',
        name: 'AdminDataManage',
        component: () => import("@/components/systemManage/AdminDataManage.vue"),
        meta: { roles: ['0'] },
      },
      //系统管理结束
      {
        path: '/upload',
        name: 'upload',
        component: () => import("@/components/yolo/upload.vue"),
        meta: { roles: ['0'] },
      },
    ],
  },


];
const whiteList = ['/login', '/register', '/unauthorized','/forget']
const router = new VueRouter({
  // base:'/software9/',
  routes
 })
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从哪个路径跳转而来
  //next是一个函数，表示放行
  //next() 放行 next('/login')强制跳转

  if (to.path === '/') return next();
  if(to.path==='/register') return next();
  if(to.path==='/forget') return next();
  //获取token
  const uid = window.sessionStorage.getItem('uid');
  if (!uid) return next('/');
  console.log(to.path)
  if(to.path === "/detail"){
    store.commit("SetSideBarPath","/modelManage");
  }else{
    store.commit("SetSideBarPath",to.path);
  }
  next();
});
export default router
