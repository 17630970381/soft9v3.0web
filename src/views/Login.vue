<template>
  <div class="myMain">
    <div>
      <div class="mainRight">
        <img src="http://www.cqupt.edu.cn/dfiles/13011/cqupt/img/favicon_128x128.ico" style="height: 100px;width: 100px;"/>
        <h1>
          多病种疾病风险预测工具软件
        </h1>
      </div>
      <div class="mainImg">
        <img class="gif" src="https://img.benmu-health.com/sanyi-health/gif.gif"/>
        <img class="png" src="https://img.benmu-health.com/sanyi-health/main-pic-new.png">
      </div>
      <div class="loginDiv">
        <div>
          <el-form
              element-loading-text="正在登陆..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              ref="loginForm"
              :model="loginForm"
              :rules="rules"
              class="loginContainer"
              style="font-size: 30px;height: 500px"

          >
            <h3 class="loginTitle">系统登陆</h3>
            <el-form-item  prop="username">
              <el-input placeholder="请输入账号" size="medium" prefix-icon="el-icon-user" v-model="loginForm.username"
                        @keydown.enter.native="submitLogin"></el-input>
            </el-form-item>
            <el-form-item  prop="password">
              <el-input placeholder="请输入密码" size="medium" prefix-icon="el-icon-lock" show-password v-model="loginForm.password"
                        @keydown.enter.native="submitLogin"></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <div class="input-with-image">
                <el-input style="width: 250px; margin-right: 5px;" type="text" v-model="loginForm.code" placeholder="点击图片更换验证码"
                          @keydown.enter.native="submitLogin"></el-input>
                <img style="height: 38px" :src="captchaUrl" @click="updateCaptcha">
              </div>
            </el-form-item>
            <el-form-item>

              <el-button style="float: right" size="small" @click="findPass">忘记密码</el-button>
            </el-form-item>
            <el-form-item style="margin: 10px 0;text-align: right">
              <el-button type="primary"
                         size="medium"
                         autocomplete="off"
                         @click="submitLogin"

              >登录</el-button>
              <el-button @click="register" type="warning" size="medium" autocomplete="off" >注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="cooperation">
      <el-row class="text-coop">
        <el-col :span="24">合作单位：</el-col>
      </el-row>
      <el-row class="text-photo1" style="margin-top: 5px;">
        <el-col :span="6">
          <img src="../assets/cqupt.png" alt="重庆邮电大学" style="height: 45px;">
        </el-col>
        <el-col :span="5">
          <img src="../assets/sdu.png" alt="山东大学" style="height: 45px;">
        </el-col>
        <el-col :span="5">
          <img src="../assets/sanjun.jpg" alt="陆军军医大学" style="height: 45px;">
        </el-col>
        <el-col :span="7">
          <img src="../assets/sfu.png" alt="山东第一医科大学" style="height: 45px;">
        </el-col>
      </el-row>
      <el-row class="text-photo1">
        <el-col :span="6">
          <img src="../assets/lrjk.png" alt="联仁健康" style="height: 45px;">
        </el-col>
        <el-col :span="5">
          <img src="../assets/hhrj.png" alt="互惠软件" style="height: 45px;">
        </el-col>
        <el-col :span="5">
          <img src="../assets/ft.png" alt="富通" style="height: 45px;">
        </el-col>
        <el-col :span="7">
          <img src="../assets/sdhl.png" alt="山东华链医疗科技有限公司" style="height: 45px;">
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { postRequest, getRequest } from "@/utils/api";
export default {
  name: "Login",
  data() {
    return {
      captchaUrl:'/captcha?time'+ new Date(),
      loginForm: {
        username: '',
        password: '',
        code:'',
      },
      loading: false,
      checked: true,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          postRequest("/user/login", this.loginForm).then((resp) => {

            if (resp) {
              getRequest(`/user/getUid/${this.loginForm.username}`).then((res) => {
                window.sessionStorage.setItem("uid",res);
                this.loading = false;

                window.sessionStorage.setItem("user", this.loginForm.username);
                this.$router.replace('/sideBar');
              })

              // if (resp.code == 200) {

              //    this.$router.replace('/sideBar');
              // }
            }
            else{
                this.$message.error("用户不存在或者密码错误或者验证码错误")
              }
          });


        } else {
          this.$message.error("请输入所有字段");
          return false;
        }
      });

    },
    register() {
      this.$router.push("/register");
    },
    updateCaptcha(){
      this.captchaUrl = '/captcha?time'+ new Date()
    },
    findPass(){
      this.$router.replace('/findPass')
    }
  },
};
</script>

<style scoped>
  *{
    box-sizing: border-box;
  }
.myMain {
  width: 100%;
  background: url("https://img.benmu-health.com/sanyi-health/bg1-new.png") no-repeat;
  background-size: 100% 100%;
  height: 95vh;
}

.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 20px 10px;
  margin-bottom: 150px;
  width: 400px;
  height: 400px;
  padding: 55px 35px 15px 35px;
  background: white;
  border: 1px solid #eaeaee;
  box-shadow: 0 0 25px #cac6c6;

}

.loginTitle {
  margin: 0px auto 40px auto;
  text-align: center;
}

.loginDiv {
  position: absolute;
  right: 80px;
  margin-top: 40px;
}


img.gif {
  position: absolute;
  top: 479px;
  left: 909px;
}

img.png{
  position: absolute;
  top: 315px;
  left: 612px;
}

.mainRight {
  position: absolute;
  top: 8px;
  left: 200px;
  display: flex;
  align-items: center;
  flex-direction: column;
}


.mainRight h1{
  display: block;
  color: white;
  font-size: 40px;
  letter-spacing: 4px;
  margin-top: -10px;
}
.mainImg{
  display: block;
  position: absolute;
  left: -480px;
  top: -200px;
}

.cooperation{
  background-color:white;
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 150px;
}
.cooperation .text-coop{
  margin-left: 20px;
  text-align: left;
  font-size: 20px;
  font-weight: 1000;
  color: black;
}
.cooperation img{
  margin-left: 10px;
}
.loginRemember {
  text-align: left;
  margin: 0px 0px 10px 0px;
}
.el-form-item__content {
  display: flex;
  align-items: center;
}
  .input-with-image {
    display: flex;
    align-items: center;
  }
</style>
