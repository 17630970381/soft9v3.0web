<template>
    <el-container>
        <el-header id="Header">Header</el-header>
        <el-container>
            <el-aside id="Aside">
                <div id="PartList">
                    <div v-for="(p) of part" :key="p.index">
                        <span class="partName">{{p.name}}</span>
                        <el-switch 
                        v-model="p.active"
                        @change="swtch(p.index)" 
                        ></el-switch>
                        <br/><br/>
                    </div>
                </div>
            </el-aside>
            <el-main id="Main">
                <dangePredictVue/>
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
        background-color: aquamarine;
    }

    #Aside{
        background-color: rgb(202, 202, 202);
    }

    #Main{
        /* background-color: blueviolet; */
    }
</style>