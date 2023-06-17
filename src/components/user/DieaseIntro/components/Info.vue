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
  <div style="display: flex; height: 100%">
    <!-- ------------------------侧边栏----------------------- -->
    <div id="sideMenu" style="height: 100%; width: 22%">
      <el-menu
        style="height: 100%"
        id="menus"
        ref="menus"
        default-active="软件简介"
        v-model="activeName"
        @select="handleClick"
      >
        <el-menu-item index="软件简介">
          <template slot="title">软件简介</template>
        </el-menu-item>
        <el-submenu
          v-for="(part, index1) of diseaseList"
          :key="index1"
          :index="part.partName"
        >
          <template slot="title">{{ part.partName }}</template>
          <el-menu-item
            v-for="(dis, index2) of part.symp"
            :key="index2"
            :index="dis.code"
            >{{ dis.name }}</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </div>

    <!-- -------------------------详情页------------------------------ -->

    <div v-if="this.detailInfo.name" class="detailInfo">
      <!-- 行内样式应该用驼峰命名，fontSize,textAlign,css文件里不能用驼峰，只能用font-size，
      自动格式化文档会把行内样式的fintSize改成fontsize导致失效 -->
      <h1 style="font-size: 28px; text-align: center">
        {{ this.detailInfo.name }}
      </h1>

      <h3>症状:</h3>
      <p>{{ this.detailInfo.symp }}</p>
      <h3>科室:</h3>
      <p>{{ this.detailInfo.dptment }}</p>
      <h3>建议:</h3>
      <p>{{ this.detailInfo.prevent }}</p>
      <!-- <p>{{this.detailInfo.partName}}</p> -->
    </div>
    <div v-else>软件简介</div>
  </div>
</template>
<script>
import { diseasePost } from "@/api/user.js";
import { disInfoGet } from "@/api/user.js";
export default {
  props: { selectName: String },
  data() {
    return {
      activeName: '软件简介',
      timer: null,
      diseaseList: [],
      detailInfo: {
        name: null,
        symp: null,
        dptment: null,
        prevent: null,
        partName: null,
      },
    };
  },
  methods: {
    // 防抖
    fd(fuc, ...args) {
      clearTimeout(this.timer);
      this.timer = setTimeout(fuc.bind(this, ...args), 150);
    },
    init() {
      let menu = this.$refs.menus;
      console.log(menu);
      let menus = this.$refs.menus.$el;
      // console.log(tab);
      menus.addEventListener("mouseover", (event) => {
        this.fd((e) => {
          // console.log(e)
          if (e.target.localName != "li") {
            this.$emit(
              "hover",
              e.target.innerText == "软件简介" ? "" : e.target.innerText
            );
          }
        }, event);
      });
      menus.addEventListener("click", (event) => {
        this.fd((e) => {
          // console.log(e)
          if (e.target.localName != "li") {
            this.$emit(
              "hover",
              e.target.innerText == "软件简介" ? "" : e.target.innerText
            );
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
      this.activeName = indexPath[0];
      disInfoGet(index).then((res) => {
        console.log("!!!!!!!!!!");
        console.log(res);
        let { name, symp, dptment, prevent, partName } = res; //解构赋值

        this.detailInfo.name = name;
        this.detailInfo.symp = symp;
        this.detailInfo.dptment = dptment;
        this.detailInfo.prevent = prevent;
        this.detailInfo.partName = partName;
      });
      console.log(index, indexPath);
    },
  },
  mounted() {
    this.init();
    diseasePost().then((res) => {
      console.log(res);
      this.diseaseList = res;
    });
  },
  watch: {
    selectName() {
      this.activeName = this.selectName ? this.selectName : "简介";
    },
    activeName() {
      console.log(this.activeName);
    },
  },
};
</script>
<style scoped>
.el-tabs {
  height: 100%;
  box-shadow: none;
  border: none;
}
#menus {
  /* height: 80%; */
  /* overflow-y: auto; */
  overflow-x: hidden;
}
.is-active{
  /* background-color: red; */
}
</style>
