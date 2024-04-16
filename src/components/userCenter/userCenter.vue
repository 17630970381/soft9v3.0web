<template>
<div >
  <div style="display: flex; justify-content: center; align-items: center; height: calc(100vh - 150px);">
   <el-card style="width: 40%;">
     <h3 style="text-align: center;margin-bottom: 20px;font-weight: bolder;">用户个人信息</h3>
     <el-form ref="form" :model="form" label-width="150px" style="width: 60%;font-size: 15px" :rules="rules">
       <el-form-item label="用户名:" prop="username" >
         <el-input v-model="form.username"></el-input>
       </el-form-item>
       <el-form-item label="角色:" >
         <el-input v-model="form.role" disabled></el-input>
       </el-form-item>
       <el-form-item label="创建时间:">
         <el-input  v-model="form.createTime" disabled></el-input>
       </el-form-item>
       <el-form-item label="密保答案1:" prop="answer_1">
         <el-input v-model="form.answer_1"></el-input>
       </el-form-item>
       <el-form-item label="密保答案2:" prop="answer_2">
         <el-input v-model="form.answer_2"></el-input>
       </el-form-item>
       <el-form-item label="密保答案3:" prop="answer_3">
         <el-input v-model="form.answer_3"></el-input>
       </el-form-item>
       <el-form-item v-if="form.role === '普通用户'" label="剩余上传文件容量:">
         <el-input  v-model="form.uploadSize" disabled></el-input>
       </el-form-item>
       <el-form-item>
         <el-button type="primary" @click="submitForm">保存</el-button>
       </el-form-item>
     </el-form>

   </el-card>
 </div>
</div>
</template>

<script >
import {getRequest, postRequest} from "@/utils/api";

export default {
  name:"userCenter",
  data(){
    return{
      form:{
        username:'',
        role:'',
        createTime:'',
        answer_1:'',
        answer_2:'',
        answer_3:'',
        uploadSize:'',
        uid: sessionStorage.getItem("uid")
            ? parseInt(sessionStorage.getItem("uid"))
            : 0,
      },
      rules:{
        username: [
          { required: true },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        answer_1:[
          { required: true },
          {min:1, max:20, message: '长度在 1到 20 个字符', trigger: 'blur'}
        ],
        answer_2:[
          { required: true },
          {min:1, max:20, message: '长度在 1到 20 个字符', trigger: 'blur'}
        ],
        answer_3:[
          { required: true },
          {min:1, max:20, message: '长度在 1到 20 个字符', trigger: 'blur'}
        ]
      },
    }
  },
  created() {
    this.getUserDetail()
  },
  methods:{
    getUserDetail(){
      getRequest(`/user/getmessage/${this.form.uid}`).then(res => {
        if(res.code === 200){
          let data = res.data
          this.form.username = data.username
          if(data.role === 0){
            this.form.role = "管理员"
          }else if(data.role === 1){
            this.form.role = "普通用户"
          }
          console.log(data)
          this.form.createTime = data.createTime
          this.form.answer_1 = data.answer_1
          this.form.answer_2 = data.answer_2
          this.form.answer_3 = data.answer_3
          this.form.uploadSize = data.uploadSize
          console.log(this.form)
        }
      })
    },
    submitForm(){
      if(this.form.role === '管理员'){
        this.form.role = 0
      }else if(this.form.role ==='普通用户'){
        this.form.role = 1
      }
      postRequest('/user/updateUser',this.form).then(res => {
        if(res.code === 200){
          window.sessionStorage.setItem("user", this.form.username);
          this.getUserDetail()
          this.$message.success("修改成功")
          setTimeout(function() {
            location.reload();
          }, 100);
        }else {
          this.$message.error("修改失败")
        }
      })
    }
  }
}
</script>

<style scoped>

</style>