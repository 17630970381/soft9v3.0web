<template>
<div>
  <el-table
      :data="tableData"
      style="width: 100%"
      stripe :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column
        prop="taskId"
        label="taskId"
        width="150">
    </el-table-column>
    <el-table-column
        prop="taskName"
        label="任务名称"
        width="150">
    </el-table-column>
    <el-table-column
        prop="leader"
        label="创建人"
        width="150">
    </el-table-column>
    <el-table-column
        prop="disease"
        label="疾病"
        width="150">
    </el-table-column>
    <el-table-column
        prop="model"
        label="所用算法"
        width="150">
    </el-table-column>
    <el-table-column
        prop="feature"
        label="所用特征">
    </el-table-column>
    <el-table-column
        prop="targetcolumn"
        label="目标列"
        width="150">
    </el-table-column>
    <el-table-column
        fixed="right"
        label="操作"
    width="200">
      <template slot-scope="scope">
        <el-button  @click="handleClick(scope.row)" type="primary" size="small">使用模型</el-button>
        <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='不用了'
            icon="el-icon-info"
            icon-color="red"
            title="您确定删除该模型吗吗？"
            @confirm="delMode(scope.row.taskId)"
            style="margin-left: 5px;margin-right: 5px"
        >
          <el-button  size="small" type="danger" slot="reference">删除<i class="el-icon-remove-outline" style="margin-left: 5px "></i></el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
      title="调用模型"
      :visible.sync="dialogVisible1"
      width="50%">
    <el-form :model="onlineUse"  ref="onlineUse" label-width="300px"  class="demo-ruleForm">
      <el-form-item label="模型地址:">
        <el-input v-model="onlineUse.path" disabled></el-input>
      </el-form-item>
      <el-form-item :label="onlineUse.fea[index]" v-for="(item, index) in onlineUse.fea" :key="index">
        <el-input v-model="reOnlineUse.fea[index]" :placeholder="'请输入' + item"  ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button  @click="resetOnlineUse">取 消</el-button>
    <el-button type="primary" @click="submitOnlineUse">确 定</el-button>
  </span>
  </el-dialog>
  <el-dialog
      title="提示"
      :visible.sync="dialogVisible2"
      width="30%">
    <h3>预测结果:{{predictionResult}}</h3>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>


<script >
import {getRequest} from "@/utils/api";
import {delRequest, postRequest} from "@/api/user";

export default {
  name: 'taskChoose',

  mounted() {
    this.getAllTask()
  },
  data() {
    return {
      tableData:[],
      uid: sessionStorage.getItem("uid") ? parseInt(sessionStorage.getItem("uid")) : 0,
      onlineUse:{
        path: "",
        fea:[]
      },
      predictionResult: "",
      dialogVisible1:false,
      dialogVisible2:false,
      reOnlineUse:{
        path:"",
        fea: []
      },
    }

  },
  methods: {
    getAllTask() {
      getRequest(`/OnlineTask/getAllById/${this.uid}`).then(res => {
        if (res) {
          console.log(res)
          this.tableData = res
        }
      })
    },
    handleClick(row) {
      console.log(row)
      this.onlineUse.path = row.modelpath
      this.onlineUse.fea = row.feature.split(",")
      this.reOnlineUse.path = row.modelpath
      this.dialogVisible1 = true
      console.log(this.onlineUse)

    },
    delMode(taskId){
      console.log(taskId)
      delRequest(`/OnlineTask/delByTaskId/${taskId}`).then(res => {
        if(res){
          this.$message.success("删除成功")
          this.getAllTask()
        }else {
          this.$message.error("删除失败")
        }
      })
    },
    resetOnlineUse(){
      this.dialogVisible1 = false
      this.reOnlineUse.path = ""
      this.reOnlineUse.fea= []
    },
    submitOnlineUse() {
      if (this.reOnlineUse.fea.length !== this.onlineUse.fea.length) {
        this.$message.error("不能由空值，请检查")
      } else {
        console.log(this.onlineUse)
        postRequest("/OnlineUse/use", this.reOnlineUse).then(resp => {
          if (resp) {
            console.log(resp)
            this.predictionResult = resp.res[0]
            this.dialogVisible2 = true
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>