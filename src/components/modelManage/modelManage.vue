<template>
<div class="container">
  <div class="left">
    <div style="margin-bottom: 10px">
      <el-card style="text-align: center;font-size: 20px;
                        border-bottom: #868585 dashed 1px;font-weight: bold;background: #e7e7e7; ">任务列表</el-card>
    </div>
    <div style="margin-left: 5px;border-bottom: #868585 dashed 1px">
      <h3>任务总数：{{modelNum}}</h3>
    </div>
    <div style="text-align: center;margin: 20px 0;border-bottom: #868585 dashed 1px">
      <h3>选择下方任务列表名称，可查看任务详情</h3>
    </div>
      <el-tree :data="treeData"
               :props="defaultProps"
               @node-click="handleNodeClick">
        <template slot-scope="{ node, data }">
          <span class="custom-node">{{ data.label }} <template v-if="node.childNodes && node.childNodes.length">
          (任务数量：{{ node.childNodes.length }})
          </template>
          </span>
        </template>
      </el-tree>
  </div>
  <div class="right">
    <div style="margin-left: 30px">
      <el-select v-model="disease" placeholder="请选择疾病"  style="display: inline-block; margin-right: 10px;">
        <el-option v-for="item in diseaseList" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-input v-model="modelname" placeholder="请输入任务名称"  style="display: inline-block; margin-right: 10px; width: 200px">
      </el-input>
      <el-input v-model="publisher" placeholder="请输入创建人名称"  style="display: inline-block; margin-right: 10px; width: 200px">
      </el-input>
      <el-button type="primary" @click="load">搜索</el-button>
      <el-button @click="clean" type="danger">清空</el-button>
      <el-button @click="createNewModel" type="warning">创建新任务</el-button>
    </div>
    <!-- 模型展示 -->
    <div>
      <div style="margin-top: 15px;display: flex;
  flex-wrap: wrap;" >
        <el-card v-for="(card, index) in mergedList" :key="index"
                 style="width: 550px;height: 320px; margin-left: 30px;
               margin-bottom: 10px;word-wrap: break-word;overflow: auto;">
          <div style="font-size: 20px;margin-bottom: 10px">任务名称：<span style="font-weight: bold;">{{ card.modelname }}</span></div>
          <div style="font-size: 20px;margin-bottom: 10px">所用算法：<span style="font-weight: bold;">{{ card.alname }}</span> </div>
          <div style="font-size: 20px;margin-bottom: 10px">最高准确率：<span style="font-weight: bold;">{{ card.mostacc }}</span></div>
          <div style="font-size: 20px;margin-bottom: 10px">创建人：<span style="font-weight: bold;">{{ card.publisher }} </span></div>
          <div style="font-size: 20px;margin-bottom: 10px">涉及疾病：<span style="font-weight: bold;">{{ card.diseasename }} </span></div>
          <div style="font-size: 20px;margin-bottom: 10px">所用数据集：<span style="font-weight: bold;">{{ card.tablename }} </span></div>
          <div style="margin-top: 20px;text-align: center;">
            <el-button @click="getDetail(card.modelname,card.diseasename)" type="primary">查看详情</el-button>
            <el-popconfirm
                style="margin-left: 10px"
                title="删除后无法恢复"
                icon="el-icon-warning"
                icon-color="red"
                @confirm="deleteCard(card.modelname,card.publisher)"
            >
              <el-button slot="reference" type="danger"
              >删除</el-button
              >
            </el-popconfirm>
          </div>
        </el-card>
      </div>
    </div>
    <div style="text-align: center;">
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[1, 5, 10, 20]"
          :page-size="pageSize"
          layout="total,  prev, pager, next"
          :total="total">
      </el-pagination>
    </div>
  </div>
</div>
</template>

<script >

import {getRequest, putRequest} from "@/utils/api";


export default {
  name: "modelManage",
  data() {
   return{
     treeData:[],
     disease:'',
     modelname:'',
     publisher:'',
     cardDataList:[],
     pageNum:1,
     pageSize:8,
     total: 0,
     diseaseList:[],
     defaultProps: {
       children: 'children',
       label: 'label'
     },
     mergedList:[],
     modelNum: 0,
     currentUser: sessionStorage.getItem("user")
         ? sessionStorage.getItem("user")
         : "",
   }
  },
  created() {
    this.load()
    this.getDisease()
    this.getTree()
    this.getModelNum()
    localStorage.removeItem('modelname');
  },
  methods: {
    getTree(){
      getRequest('/modelResult/getTableName').then(res=> {
        if(res){
          this.transformToTree(res)
        }
      })
    },
    transformToTree(rawData){
      const diseaseMap = {};
      rawData.forEach(item => {
        if (!diseaseMap[item.diseasename]) {
          diseaseMap[item.diseasename] = [];
        }
        diseaseMap[item.diseasename].push({ label: item.modelname });
      });

      // 创建树形结构
      const treeData = [];
      for (const diseasename in diseaseMap) {
        treeData.push({
          label: diseasename,
          children: diseaseMap[diseasename]
        });
      }
      this.treeData = treeData
      console.log(this.treeData)
    },
    getModelNum(){
      getRequest('/Model/getModelNum').then(res => {
        if(res){
          this.modelNum = res
        }
      })

    },
    test(){
      this.load()
    },
    deleteCard(modelname,publisher) {
      console.log('deleteCard')
      console.log(modelname)
      if(this.currentUser !== publisher){
        this.$alert("您只能删除您自己创建的任务", "提示", {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'error',
              message: '您只能删除您自己创建的任务'
            });
          }
        })
      }else {
        putRequest(`/Model/remove/${modelname}`).then(res => {
          if(res){
            this.load()
            this.$message.success("删除成功");
          }
        })
      }

    },
    getDetail(modelname){
      this.$store.commit("manageModelName",modelname)
      this.$router.replace('/detail')
    },
    clean(){
      this.disease = ''
      this.modelname = ''
      this.publisher = ''
      this.load()
    },
    load(){
      getRequest(`/TaskManager/selectByPage/?pageNum=${this.pageNum}&pageSize=${this.pageSize}&disease=${this.disease}&modelname=${this.modelname}&publisher=${this.publisher}`
      ).then(
          res => {
            console.log(res.data.records)
            this.cardDataList = res.data.records
            this.total = res.data.total
            console.log(this.cardDataList)
            this.load2()
          }
      )

    },

    load2(){
      getRequest('/modelResult/getModelResult').then(res => {
        this.mergedList = this.cardDataList.map(cardData => {
          // 查找与当前cardData具有相同modelname的res对象
          let matchingRes = res.find(item => item.modelname == cardData.modelname);

          // 如果没有找到匹配的res对象，则使用空对象
          matchingRes = matchingRes || {};

          // 合并cardData和找到的res对象
          return {
            ...cardData,
            ...matchingRes
          };
        });

        console.log("mergedList");
        console.log(this.mergedList);
      })
    },

    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.load()
    },
    getDisease(){
        getRequest('/Model/getDisease').then(
            res =>{
              this.diseaseList = res
              console.log(this.diseaseList)
            }
        )
    },
    createNewModel(){
      this.$router.replace('/modelTrain')
    },
    handleNodeClick(data){
      console.log(data.label);

      // 假设treeData是当前组件的一个数据属性，存储了整棵树的数据
      // 你需要遍历这棵树来检查data.label是否只存在于某个节点的children中
      let isChildLabelOnly = false;
      this.treeData.forEach(node => {
        if (node.children) {
          node.children.forEach(child => {
            if (child.label === data.label) {
              // 发现匹配的label在children中，但不能直接确定它是唯一的
              isChildLabelOnly = true;
              return; // 跳出当前循环，继续检查其他节点
            }
          });
        }

        // 如果在其他非children的位置发现了相同的label，则不是只属于children
        if (node.label === data.label) {
          isChildLabelOnly = false;
        }
      });

      // 只有当data.label只属于某个节点的children时才执行getRequest
      if (isChildLabelOnly) {
        getRequest(`/TaskManager/selectByPage/?pageNum=${this.pageNum}&pageSize=${this.pageSize}&disease=${this.disease}&modelname=${data.label}&publisher=${this.publisher}`)
            .then(res => {
              this.cardDataList = res.data.records;
              this.total = res.data.total;
              console.log(res);
              this.load2()
            });

      }
      },
    getNodeCount(node) {
      let count = 1; // 默认为 1，因为当前节点本身也算一个节点
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          count += this.getNodeCount(child); // 递归调用计算子节点数量
        });
      }
      return count;
    },
  }
}
</script>



<style scoped>
.container {
  display: flex;

}

.left {
  flex: 20%;
  border-right: #cecbcb 1px solid;
  border-left: #cecbcb 1px solid;
  border-top: #cecbcb 1px solid;

}

.right {
  flex: 80%;
  overflow: auto;
}

.custom-node {
  /* 添加您想要的自定义字体样式 */
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  overflow: hidden;

}

</style>