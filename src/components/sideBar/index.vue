<template>
  <div>
    <el-container class="con">
      <el-header class="header">
        <el-menu
        :default-active="activeIndex"
          background-color="#071135"
          text-color="#fff"
          active-text-color="#fff"
          class="el-menu-demo"
          mode="horizontal"
        >
          <span index="1" style="float: left; color: cornflowerblue">
            <i class="el-icon-box"></i>
            <span style="font-size:20px">多病种疾病风险预测工具软件</span></span
          >
          <!--            <template slot="title">当前服务器：</template>-->
          <el-menu-item index="2" style="float: right" @click="LogOut"
            ><i class="el-icon-close"></i>退出登录</el-menu-item
          >
          <span  index="3" style="float: right;color:#fff"
            ><i class="el-icon-user"></i>欢迎你，{{LoginUserName}}</span
          >
          <!-- <el-menu-item index="4" style="float: right">
            <span @click="openDialog()">软件介绍</span>
            <i class="el-icon-question"></i>
            <el-dialog
            title="软件介绍"
            :visible="describVision"
            width="50%"
            @close="closedialog()"
            @closed="closedialog()">
              <p style="line-height: 30px;">{{description1}}</p>
              <p style="line-height: 30px;">{{description2}}</p>
              <img src="@/assets/description.jpg" alt="软件流程图" width="100%">
            </el-dialog>
          </el-menu-item> -->
          <!--          <el-menu-item index="3" disabled>消息中心</el-menu-item>-->
          <!--          <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>-->
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="200px" class="side">
          <el-menu
            default-active="1"
            router
            class="el-menu-vertical-demo"
            background-color="#071135"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="/dash">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>

            <el-menu-item index="/DieaseIntro">
              <i class="el-icon-menu"></i>
              <span slot="title">健康资讯</span>
            </el-menu-item>
            <el-menu-item index="">
              <i class="el-icon-menu"></i>
              <span slot="title">模型训练</span>
            </el-menu-item>
            <el-menu-item index="/Predict">
              <i class="el-icon-menu"></i>
              <span slot="title">病例风险预测</span>
            </el-menu-item>
            <el-menu-item index="/Batch">
              <i class="el-icon-menu"></i>
              <span slot="title">人群患病风险预测</span>
            </el-menu-item>
            <el-menu-item index="/dataManage">
              <i class="el-icon-menu"></i>
              <span slot="title">数据管理</span>
            </el-menu-item>
            <el-menu-item index="/tableManage">
              <i class="el-icon-menu"></i>
              <span slot="title">字段管理</span>
            </el-menu-item>


             <div class="menu-footer">
              <el-menu-item index="/SoftwareIntro"> 软件介绍</el-menu-item>
              <el-menu-item > 操作手册</el-menu-item>
            </div>

          </el-menu>
        </el-aside>
        <el-main class="main">
          <!-- <app-main></app-main> -->
          <router-view></router-view>
        </el-main>
      </el-container>

      <el-footer>
        <h1>
          重庆邮电大学 大数据智能计算创新研发团队 @CopyRight 2020-2023 All Rights
          Reserved
        </h1>
      </el-footer>

    </el-container>
  </div>
</template>

<script>
// import AppMain from "@/components/AppMain";
export default {
  // components: { AppMain },
  data() {
    return {
      activeIndex: "0",
      LoginUserName:""
      // describVision: false,
      // description1: "基于多任务学习的多病种疾病风险预测软件是一款医疗健康软件，通过调用相关算法，用户可以进行多种疾病（共病）的风险预测，可以帮助用户更好",
      // description2:"地管理自己的健康状况。本软件现有首页，健康咨询、单例预测和批量预测等功能，具体流程如此下图:"
    };
  },
  created() {
    this.LoginUserName = sessionStorage.getItem("user")
  },
  methods: {
    LogOut(){
      sessionStorage.clear();
      this.LoginUserName = "";
      this.$router.replace("/")
    }
    // openDialog(){
    //   this.describVision = true;
    //   console.log("open",this.describVision)
    // },
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // closedialog(){
    //   this.describVision = false;
    //   console.log('close',this.describVision)
    // }
  },
};
</script>

<style scoped>
.el-icon-mobile-phone {
  color: white;
}
.el-menu-item {
  color: aliceblue;
}

.el-menu-vertical-demo span {
  font-size: 14px;
}
.el-menu-vertical-demo {
  /*解决侧边栏颜色无法撑起整个高度问题*/
  height: 100%;
  /*解决侧边栏凸起问题*/

  border-right: none;
}
.header {
  background-color: #071135;
  color: #333;
  /* text-align: center; */
  line-height: 60px;
}

.side {
  /*background-color: #071135;*/
  color: #333;
  /*text-align: center;*/
  /*line-height: 200px;*/
  height: calc(100vh - 81px);
}

.main {
  height: calc(100vh - 81px);
  /* overflow: hidden; */
}

.el-footer {
  height: 20px !important;
  font-size: 10px;
  background-color: #cdd0da94;
  color: #252525;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-footer {
  position: absolute;
  bottom: 0;
  margin-left: 40px;
}

</style>
