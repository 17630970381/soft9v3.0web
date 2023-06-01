<template>
  <el-tabs tab-position="left" id="tabs" v-model="activeName" @tab-click="handleClick" type="border-card">
    <el-tab-pane name="心脏" label="心脏">
      <div class="content">心脏</div>
    </el-tab-pane>
    <el-tab-pane name="肺部" label="肺部">
      <div class="content">肺部</div>
    </el-tab-pane>
    <el-tab-pane name="肝脏" label="肝脏">
      <div class="content">肝脏</div>
    </el-tab-pane>
    <el-tab-pane name="脾脏" label="脾脏">
      <div class="content">脾脏</div>
    </el-tab-pane>
    <el-tab-pane name="肾脏" label="肾脏">
      <div class="content">肾脏</div>
    </el-tab-pane>
    <el-tab-pane name="大肠" label="大肠">
      <div class="content">大肠</div>
    </el-tab-pane>
    <el-tab-pane name="小肠" label="小肠">
      <div class="content">小肠</div>
    </el-tab-pane>
    <el-tab-pane name="简介" label="简介">
      <div class="content">简介</div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  export default {
    props: {selectName:String},
    data() {
      return {
        activeName: '简介',
        timer:null
      };
    },
    methods: {
      // 防抖
      fd(fuc,...args){
          clearTimeout(this.timer)
          this.timer = setTimeout(fuc.bind(this,...args),150)
      },
      init(){
        let tab = document.querySelector('.el-tabs__header')
        // console.log(tab);
        tab.addEventListener('mouseover',event=>{
          this.fd((e)=>{
            this.$emit('hover',e.target.innerText)
          },event,)
        })
        tab.addEventListener('mouseout',event=>{
         
          this.fd((e)=>{
            this.$emit('hover','')
          },event,)
            
          
        })
      },
      handleClick(tab, event) {
        console.log(tab.$el.id,event);
      }
    },
    mounted(){
      this.init()
    },
    watch:{
      selectName(){
        this.activeName=this.selectName?this.selectName:'简介'
      }
    }
  };
</script>
<style scoped>
.el-tabs {
  height: 100%;
  box-shadow: none;
  border: none;
}
</style>
