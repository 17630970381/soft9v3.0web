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

          <el-dropdown style="float: right;margin-right: 30px">
            <span  class="el-dropdown-link" style="float: right;color:#fff;font-size: 15px"><i class="el-icon-user"></i>欢迎你，{{LoginUserName}}</span><i style="color: #fff" class="el-icon-arrow-down el-icon--right"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="toUserCenter">个人信息</el-dropdown-item>
              <el-dropdown-item @click.native="updatePass">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="LogOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu>
<!--        <user-center @update-success="handleUpdateSuccess"></user-center>-->
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
            <el-menu-item index="/dataManage">
              <i class="el-icon-menu"></i>
              <span slot="title">数据管理</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-message"></i>任务管理</template>
              <el-menu-item-group>
                <el-menu-item index="/modelManage">
                  <i class="el-icon-menu"></i>
                  <span slot="title">历史任务管理</span>
                </el-menu-item>
                <el-menu-item index="/modelTrain">
                  <i class="el-icon-menu"></i>
                  <span slot="title">模型训练</span>
                </el-menu-item>
                <el-menu-item index="/diseasePre_new">
                  <i class="el-icon-menu"></i>
                  <span slot="title">模型调用</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="/logManage">
              <i class="el-icon-menu"></i>
              <span slot="title">日志管理</span>
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
import updatePassword from "@/components/userCenter/updatePassword.vue";
import UpdatePassword from "@/components/userCenter/updatePassword.vue";
import UserCenter from "@/components/userCenter/userCenter.vue";

export default {
  components: {UserCenter, UpdatePassword},
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

    handleUpdateSuccess() {
      // 更新操作，例如重新获取数据等
      this.LoginUserName = sessionStorage.getItem("user")
    },
    LogOut(){
      sessionStorage.clear();
      this.LoginUserName = "";
      this.$router.replace("/")
    },
    toUserCenter(){
      this.$router.replace("/userCenter")
    },
    updatePass(){
      this.$router.replace("/updatePassword")
    }

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


.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
