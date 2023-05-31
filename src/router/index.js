import Vue from 'vue'
import VueRouter from 'vue-router'
import SideBar from '@/components/sideBar/index.vue'
import dash from '@/views/dash/index.vue'
// import metastasis from "@/views/lung/metastasis";
// import earlyLung from "@/views/lung/earlyLung";
// import connectMining from "@/components/tab/connectMining.vue";
// import dangePredict from "@/components/tab/dangePredict.vue";
import dataManage from "@/components/tab/dataManage.vue";
import modelManage from "@/components/tab/modelManage.vue";
import userManage from "@/components/tab/userManage.vue";
import LogIn from "@/views/LogIn.vue"
import UserSideBar from "@/components/user/UserSideBar.vue"
import Predict from "@/components/user/Predict.vue"
import DieaseIntro from "@/components/user/DieaseIntro.vue"
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'LogIn',
        component: LogIn,
    },
    {
        path: '/sideBar',
        name: 'SideBar',
        redirect:'/dash',
        component: SideBar,
        children: [
            {
                path: '/dash',
                name: 'dash',
                component: dash,
            },
            {
                path: '/dataManage',
                name: 'dataManage',
                component: dataManage,
            
            },
            {
                path: '/modelManage',
                name: 'modelManage',
                component: modelManage,
            },
            {
                path: '/userManage',
                name: 'userManage',
                component: userManage,
            },
        ]
    },
    {
        path: '/UserSideBar',
        name: 'UserSideBar',
        component: UserSideBar,
        children: [{
            path: 'Predict',
            name: 'Predict',
            component: Predict
        }, {
            path: 'DieaseIntro',
            name: 'DieaseIntro',
            component: DieaseIntro
        }]
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
    
  
]

const router = new VueRouter({
  routes
})
export default router
