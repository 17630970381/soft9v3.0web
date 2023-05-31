<template>
    <el-container>
        <el-header id="Header">
            <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1" style="color: cornflowerblue"
                    ><i class="el-icon-box"></i>基于多任务学习的多病种疾病风险预测</el-menu-item
                >
                <!--            <template slot="title">当前服务器：</template>-->
                <el-menu-item index="2" style="float: right"
                    ><i class="el-icon-close"></i>退出登录</el-menu-item
                >
                <el-menu-item index="3" style="float: right"
                    ><i class="el-icon-user"></i>欢迎你，xx</el-menu-item
                >
                <el-menu-item index="4" style="float: right"
                    ><i class="el-icon-question"></i
                ></el-menu-item>
            </el-menu>  
        </el-header>

        <el-container>
            <el-aside width="200px" id="Aside">
                <el-menu
                    default-active="1"
                    router
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                >
                    <el-menu-item index="/UserSideBar/Predict">
                        <i class="el-icon-menu"></i>
                        <span slot="title">风险预测</span>
                    </el-menu-item>
                    <el-menu-item index="/UserSideBar/DieaseIntro">
                        <i class="el-icon-menu"></i>
                        <span slot="title">健康咨询</span>
                    </el-menu-item>
                    <el-menu-item index="/#">
                        <i class="el-icon-menu"></i>
                        <span slot="title">个人信息</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <el-main id="Main">
                <router-view></router-view>
                    <!-- <div id="PartList">
                        <div v-for="(p) of part" :key="p.index">
                            <span class="partName">{{p.name}}</span>
                            <el-switch 
                            v-model="p.active"
                            @change="swtch(p.index)" 
                            ></el-switch>
                            <br/><br/>
                        </div>
                    </div> -->
            </el-main>
        </el-container>
    </el-container>
    
</template>

<script>
import dangePredictVue from '../tab/dangePredict.vue';
export default {
    name:"Predict",
    components:{dangePredictVue},
    data() {
        return {
            part:[{
                index:'back',
                name:'背部',
                active: false
            },{
                index:'arms',
                name:'四肢',
                active: false
            },{
                index:'five',
                name:'五官',
                active: false
            },{
                index:'digest',
                name:'消化系统',
                active: false
            },{
                index:'urinary',
                name:'泌尿系统',
                active: false
            },{
                index:'liver',
                name:'肝脏',
                active: false
            },{
                index:'heart',
                name:'心脏',
                active: false
            },{
                index:'head',
                name:'神经头部',
                active: false
            },{
                index:'body',
                name:'身体控制',
                active: false
            },{
                index:'skin',
                name:'皮肤',
                active: false
            }
            ],
            
            value3: true,
        }
    },
    methods:{
        swtch(index){
            for(var i = 0;i<this.part.length;i++){
                if(this.part[i].index != index){
                    this.part[i].active = false;
                }
            }
        },
    }

}
</script>

<style scoped>
    .partName{
        display: inline-block;
        width: 80px;
        text-align: center;
    }

    #Header{
        /* background-color: aquamarine; */
    }

    #Aside{
        /* background-color: rgb(150, 73, 73); */
        height: 200px;
    }

    #Main{
        /* background-color: blueviolet; */
    }
</style>