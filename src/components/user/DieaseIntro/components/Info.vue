<template>
  <!-- <el-tabs
    tab-position="left"
    id="tabs"
    v-model="activeName"
    @tab-click="handleClick"
    type="border-card"
  >
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
  </el-tabs> -->
  <div id="sideMenu" style="width:20%">
    <el-menu id="menus" ref="menus" default-active="9" v-model="activeName" @select="handleClick" :unique-opened="true">
      <el-submenu index="心脏">
        <template slot="title">心脏</template>
      </el-submenu>
      <el-submenu index="肺部" name="肺部">
        <template slot="title">肺部</template>
        <el-menu-item index="肺部-普通感冒">普通感冒</el-menu-item>
      </el-submenu>
      <el-submenu index="肝脏">
        <template slot="title">肝脏</template>
        <el-menu-item index="肝脏-酒精性肝炎">酒精性肝炎</el-menu-item>
      </el-submenu>
      <el-submenu index="脾脏">
        <template slot="title">脾脏</template>
      </el-submenu>
      <el-submenu index="肾脏">
        <template slot="title">肾脏</template>
      </el-submenu>
      <el-submenu index="大肠">
        <template slot="title">大肠</template>
      </el-submenu>
      <el-submenu index="小肠">
        <template slot="title">小肠</template>
      </el-submenu>
      <el-submenu index="其他">
        <template slot="title">其他</template>
        <el-menu-item index="其他-黄疸">黄疸</el-menu-item>
        <el-menu-item index="其他-低血糖">低血糖</el-menu-item>
        <el-menu-item index="其他-关节炎">关节炎</el-menu-item>
        <el-menu-item index="其他-水痘">水痘</el-menu-item>
      </el-submenu>
      <el-menu-item index="软件简介">
        <template slot="title">软件简介</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import {testget,testpost} from '@/api/user.js'
export default {
  props: { selectName: String },
  data() {
    return {
      activeName: "简介",
      timer: null,
    };
  },
  methods: {
    // 防抖
    fd(fuc, ...args) {
      clearTimeout(this.timer);
      this.timer = setTimeout(fuc.bind(this, ...args), 150);
    },
    init() {
      
      let menu = this.$refs.menus
      console.log(menu)
      let menus = this.$refs.menus.$el
      // console.log(tab);
      menus.addEventListener("mouseover", (event) => {
        this.fd((e) => {
          console.log(e)
          if(e.target.localName!='li'){
            this.$emit("hover", e.target.innerText=='软件简介'?'':e.target.innerText);
          }
        }, event);
      });
      menus.addEventListener("click", (event) => {
        this.fd((e) => {
          console.log(e)
          if(e.target.localName!='li'){
            this.$emit("hover", e.target.innerText=='软件简介'?'':e.target.innerText);
          }
        }, event);
      });
      menus.addEventListener("mouseout", (event) => {
        // console.log(event)

        this.fd(() => {
          this.$emit("hover", this.activeName);
          this.$emit("select", this.activeName);
        }, event);
      });
    },
    handleClick(index, indexPath) {
      this.activeName=indexPath[0]


      console.log(index,indexPath);
    },
  },
  mounted() {
    this.init();
    testget(1,2)
    testpost(3,4)
  },
  watch: {
    selectName() {
      this.activeName = this.selectName ? this.selectName : "简介";
    },
    activeName(){
      console.log(this.activeName)
    }
  },
};
</script>
<style scoped>
.el-tabs {
  height: 100%;
  box-shadow: none;
  border: none;
}
</style>
