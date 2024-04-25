<template>
  <div>
    <el-container class="con">
      <el-header class="header">
        <el-menu

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
            :default-active="activeIndex"
            router
            class="el-menu-vertical-demo"
            background-color="#071135"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
<!--            <el-menu-item index="/dash">-->
<!--              <i class="el-icon-menu"></i>-->
<!--              <span slot="title">首页</span>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="/dataManage">-->
<!--              <i class="el-icon-menu"></i>-->
<!--              <span slot="title">数据管理</span>-->
<!--            </el-menu-item>-->
<!--            <el-submenu index="2">-->
<!--              <template slot="title"><i class="el-icon-message"></i>任务管理</template>-->
<!--              <el-menu-item-group>-->
<!--                <el-menu-item index="/modelManage">-->
<!--                  <i class="el-icon-menu"></i>-->
<!--                  <span slot="title">历史任务管理</span>-->
<!--                </el-menu-item>-->
<!--                <el-menu-item index="/modelTrain">-->
<!--                  <i class="el-icon-menu"></i>-->
<!--                  <span slot="title">模型训练</span>-->
<!--                </el-menu-item>-->
<!--                <el-menu-item index="/diseasePre_new">-->
<!--                  <i class="el-icon-menu"></i>-->
<!--                  <span slot="title">模型调用</span>-->
<!--                </el-menu-item>-->
<!--              </el-menu-item-group>-->
<!--            </el-submenu>-->
<!--            <el-submenu index="3" v-if="role === 0">-->
<!--              <template slot="title"><i class="el-icon-message"></i>系统管理</template>-->
<!--              <el-menu-item-group>-->
<!--                <el-menu-item index="/userManage">-->
<!--                  <i class="el-icon-menu"></i>-->
<!--                  <span slot="title">用户管理</span>-->
<!--                </el-menu-item>-->
<!--                <el-menu-item index="">-->
<!--                  <i class="el-icon-menu"></i>-->
<!--                  <span slot="title">信息发布</span>-->
<!--                </el-menu-item>-->
<!--                <el-menu-item index="">-->
<!--                  <i class="el-icon-menu"></i>-->
<!--                  <span slot="title">数据管理</span>-->
<!--                </el-menu-item>-->
<!--                <el-menu-item index="/logManage">-->
<!--                  <i class="el-icon-menu"></i>-->
<!--                  <span slot="title">日志查看</span>-->
<!--                </el-menu-item>-->
<!--                <el-menu-item index="/diseaseSet">-->
<!--                  <i class="el-icon-menu"></i>-->
<!--                  <span slot="title">病种设置</span>-->
<!--                </el-menu-item>-->
<!--              </el-menu-item-group>-->
<!--            </el-submenu>-->
            <template>
              <div v-for="item in visibleMenuItems" :key="item.name">
                <el-submenu
                    v-if="item.children && item.children.length"
                    :index="item.path"
                >
                  <template #title>
                    <i class="el-icon-menu"></i>
                    {{ item.name }}</template
                  >
                  <el-menu-item
                      v-for="subItem in item.children"
                      :key="subItem.name"
                      :index="subItem.path"
                  >
                    <i :class="subItem.icon"></i>
                    <router-link :to="subItem.path">{{
                        subItem.name
                      }}</router-link>
                  </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="item.path">
                  <template #title>
                    <router-link :to="item.path">
                      <i :class="item.icon"></i>
                      {{ item.name }}</router-link
                    >
                  </template>
                </el-menu-item>
              </div>
            </template>
             <div class="menu-footer">
              <el-menu-item index="/SoftwareIntro"> 软件介绍</el-menu-item>
              <el-menu-item index="/operation"> 操作手册</el-menu-item>
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
import {getRequest, postRequest} from "@/utils/api";

export default {
  components: {UserCenter, UpdatePassword},
  // components: { AppMain },
  data() {
    return {
      activeMenu: "/SideBar",
      LoginUserName:"",
      uid: sessionStorage.getItem("uid")
          ? parseInt(sessionStorage.getItem("uid"))
          : 0,
      menuItems: [
        {
          name: "首页",
          path: "/dash",
          roles: ["0", "1"],
          icon: "el-icon-menu",
        },
        {
          name: "任务管理",
          path: "/taskManage",
          roles: ["0", "1"],
          icon: "el-icon-s-custom",
          children:[
            {
              name: "历史任务查看",
              path: "/modelManage",
              roles: ["0", "1"],
              icon: "el-icon-s-custom",
            },
            {
              name: "模型训练",
              path: "/modelTrain",
              roles: ["0", "1"],
              icon: "el-icon-s-custom",
            }, {
              name: "任务调用",
              path: "/diseasePre_new",
              roles: ["0", "1"],
              icon: "el-icon-s-custom",
            },
          ]
        },
        {
          name: "数据管理",
          path: "/dataManage",
          roles: ["0","1"],
          icon: "el-icon-s-custom",
        },
        {
          name: "系统管理",
          path: "/manage",
          roles: ["0"],
          children: [
            {
              name: "用户管理",
              path: "/userManage",
              roles: ["0"],
              icon: "el-icon-s-custom",
            },
            {
              name: "信息发布",
              path: "/inform",
              roles: ["0"],
              icon: "el-icon-s-custom",
            },
            {
              name: "系统数据管理",
              path: "/AdminDataManage",
              roles: ["0"],
              icon: "el-icon-s-custom",
            },
            {
              name: "日志查看",
              path: "/logManage",
              roles: ["0"],
              icon: "el-icon-s-custom",
            },
            // {
            //   name: "病种设置",
            //   path: "/diseaseSet",
            //   roles: ["0"],
            //   icon: "el-icon-s-custom",
            // },
            {
              name: "病种设置",
              path: "/diseaseManager",
              roles: ["0"],
              icon: "el-icon-s-custom",
            },
          ],
        },
      ],
    };
  },
  watch: {
    // 监听路由变化来更新菜单高亮
    $route(newRoute) {
      this.activeMenu = newRoute.path;
    },
  },
  computed: {
    visibleMenuItems() {
      const userRoles = sessionStorage.getItem("userrole");
      return this.menuItems.filter((item) => {
        const hasRole = item.roles.some((role) => userRoles.includes(role));
        if (hasRole && item.children) {
          // Filter children based on user roles
          item.children = item.children.filter((child) =>
              child.roles.some((role) => userRoles.includes(role))
          );
        }
        return hasRole;
      });
    },
    // 写在data里使用router.push时更改vuex后该值不会响应式更新
    activeIndex() {
      return this.$store.state.sideBarPath;
    },
  },
  created() {
    this.LoginUserName = sessionStorage.getItem("user")
    this.getUserDetail()
  },
  methods: {
    getUserDetail(){
      getRequest(`/user/getmessage/${this.uid}`).then(res => {
            if(res.code === 200){
              this.role = res.data.role
            }
      })},
    handleUpdateSuccess() {
      // 更新操作，例如重新获取数据等
      this.LoginUserName = sessionStorage.getItem("user")
    },
    LogOut(){
      // console.log("退出登录123")
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

a {
  color: inherit; /* 继承父元素颜色或指定颜色 */
  text-decoration: none; /* 去除下划线 */
}
.el-icon-mobile-phone {
  color: white;
}
.el-menu-vertical-demo {
  /*解决侧边栏颜色无法撑起整个高度问题*/
  /*解决侧边栏凸起问题*/
  border-right: none;
  height: 100%;
}

.header {
  background-color: #071135;
  text-align: center;
  line-height: 60px;
}

.side {
  background-color: #071135;
  /* color: #333; */

  height: calc(100vh - 81px);
}

.main {
  height: calc(100vh - 81px);
}
.menu-footer {
  position: absolute;
  bottom: 0;
  margin-left: 40px;
}
.el-footer {
  height: 20px !important;
  font-size: 10px;
  background-color: #8e909794;
  color: #252525;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* .el-main {
    display: block;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
} */

.el-main {
  display: block;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
}
</style>
