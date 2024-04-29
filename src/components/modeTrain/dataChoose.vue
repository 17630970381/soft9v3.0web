
<template>
  <div>
    <div style="border-bottom: #868585 solid 1px; padding-bottom: 10px">
      <el-steps :active="active">
        <el-step title="基本信息" icon="el-icon-edit"></el-step>
        <el-step title="特征选择" icon="el-icon-picture"></el-step>
        <el-step title="算法选择" icon="el-icon-picture"></el-step>
        <el-step title="运算结果" icon="el-icon-picture"></el-step>
      </el-steps>
    </div>
    <!--  选择数据  -->
    <div style="margin: 5px 0;">
      <el-form :rules="rules" :model="formData" label-width="100px" style="width: 70%;margin-top: 10px">
      <div style="display: flex">
        <el-form-item prop="modelname" label="任务名:" style="margin-right: 20px;">
          <el-input v-model="formData.modelname" style="width: 100%; font-size: 18px;"></el-input>
        </el-form-item>
        <el-form-item label="负责人:" prop="assignee">
          <el-input v-model="formData.assignee" disabled style="width: 100%; font-size: 18px;"></el-input>
        </el-form-item>
      </div>
    </el-form>

    </div>
    <h3>选择数据集：</h3>
    <div class="container" >

     <div class="left">
<!--       <div style="text-align: center;margin-bottom: 20px;">-->
<!--         <h1 style="margin-top: 10px">点击表名，即可查看数据</h1>-->
<!--       </div>-->
<!--       <div v-for="(item, index) in tableNameList" :key="index"-->
<!--            style="display: block;margin-right: 2px;margin-top: 5px;text-align: right;">-->
<!--        <el-card style="border-radius: 20px"-->
<!--                 :class="{ 'selected-item': item === tableName }"-->
<!--                 @click.native="getData(item)">{{ item }}</el-card>-->
<!--      </div>-->
     <div>
       <el-card style="text-align: center;font-size: 20px;
                        border-bottom: #868585 dashed 1px;font-weight: bold;background: #c5c5c5">数据集列表</el-card>
     </div>
      <div style="text-align: center;margin: 20px 0;border-bottom: #868585 dashed 1px">
        <h3>选择下方数据集名称，可查看数据</h3>
      </div>
       <el-tree :data="treeData"

                :check-on-click-node="true"
                :highlight-current="true"
                @node-click="handleNodeClick">
         <template slot-scope="{ node, data }">
          <span class="custom-node">{{ data.label }} <template v-if="node.childNodes && node.childNodes.length">
          (数据集数量：{{ node.childNodes.length }})
          </template>
          </span>
         </template>
       </el-tree>

     </div>
      <div class="right">
          <div class="describe_content">
            <i class="el-icon-folder"></i> 数据集名称:<span style="font-weight:bold;font-size:18px;color:#252525">{{ tableName }}</span>
            <p style="margin-top:0.5%">
              <i class="el-icon-user"></i>创建人: <span>{{ operators }}</span>
              <i class="el-icon-time"></i>创建时间: <span>{{time}}</span>
              <i class="el-icon-folder-opened"></i>所属疾病: <span>{{ formData.diseasename }}</span>
              <i class="el-icon-finished"></i> 样本个数:<span>{{ sampleNum }}</span>
              <i class="el-icon-finished"></i> 特征个数:<span>{{ featureNum }}</span>
            </p>
          </div>

        <div v-loading="getData_loading" element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.05)"

            class="tablePlaceholder" v-if="tableData.length <1 && !getData_loading">请在左侧选择数据</div>


        <el-table
            :data="tableData"
            v-if="dataTableVision"
            style="width: 100%"
            :header-cell-style="{ backgroundColor: '#c1c1c5', color: 'black', fontWeight: 'bold'}"
            border
            stripe
            height="780"

        >
          <el-table-column type="index"> </el-table-column>
          <!--                  v-for="(key, index) in Object.keys(tableData[0])"-->
          <el-table-column
              :width="colWidth"
              v-for="(value, key) in tableData[0]"
              :key="index"
              :label="key"
              :prop="key"
              :sortable="isSortable(key)"
          >
            <template slot-scope="scope">
              <div class="cell" :title="scope.row[key]">{{ scope.row[key] }}</div>
            </template>
          </el-table-column>
        </el-table>



      </div>
    </div>

    <!-- 数据选择 -->
    <div style="text-align: center">
      <el-button @click="toFeatureChoose()">
        下一步
      </el-button>
<!--      <el-button @click="dataToCreate()">-->
<!--        上一步-->
<!--      </el-button>-->
    </div>

  </div>
</template>

<script>
import {getRequest} from "@/api/user";
import VirtualList from 'vue-virtual-scroll-list';

export default {
  name: "dataChoose",
  components: {
    VirtualList
  },
  data() {
    return {

      uid: sessionStorage.getItem("uid")
          ?sessionStorage.getItem("uid")
          : "",
      operators:"",
      active:1,
      tableName:"",
      tableNameList: [],
      getData_loading: false,
      dataTableVision: false,
      tableData: [], // 存放从后端获取的数据
      fea: [],
      time:"",
      treeData:[],
      /*创建任务*/
      formData: {
        modelname: '',
        assignee: sessionStorage.getItem("user")
            ? sessionStorage.getItem("user")
            : "",
        diseasename: '',
        notes: ''
      },
      rules: {
        modelname: [
          { required: true, message: "请输入模型名称", trigger: "blur" },
        ],
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      sampleNum:0,
      featureNum: 0,
    }
  },
  created() {
    this.getTree()
  },


  methods: {
    getTree(){
      if(localStorage.getItem("modelname") !== ''){
        this.formData.modelname = localStorage.getItem("modelname")
      }
      getRequest('/DataManager/getDiseaseTableName').then(res=> {
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
        diseaseMap[item.diseasename].push({ label: item.tablename });
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

    toFeatureChoose(){
      if(this.formData.modelname==''){
        this.$alert("请填写任务名称", "提示", {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'error',
              message: '请填写任务名称'
            });
          }
        })
      }
      if(this.tableName === ''){
        this.$alert("请选择数据", "提示", {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'error',
              message: '请选择数据'
            });
          }
        })
      }
      if (this.formData.modelname !=='' && this.tableName !==''){
        getRequest(`/Model/isRepeatModel/${this.formData.modelname}`).then(
            res => {
              if(!res){
                this.formData.modelname = ''
                this.$alert("模型名称与已有模型重复，请重新输入", "提示", {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$message({
                      type: 'error',
                      message: '模型名称与已有模型重复，请重新输入'
                    });
                  }
                })

              }else {
                this.$confirm(`请确认是否选择该数据:${this.tableName}`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'success'
                }).then(() => {
                  this.$message({
                    type: 'success',
                    message: `成功选择数据${this.tableName}`
                  });
                  this.$store.commit('dataChooseToFeatureChoose',this.tableName)
                  // this.$store.commit('setFea',this.fea)
                  this.$store.commit('putTableName',this.tableName)
                  this.$store.commit('taskToDataChoose',this.formData)
                  this.$router.replace('/featureChoose')
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消选择'
                  });
                });
                localStorage.setItem('modelname',this.formData.modelname)
                this.$router.replace('/dataChoose')

              }

            }
        )
      }



    },
    dataToCreate(){
      this.$router.replace('/modelTrain')
    },
    getTableNameList(){
       getRequest(`/Model/getTableByDisease/${this.diseasename}`).then(res => {
         this.tableNameList = res
         this.getData(this.tableNameList[0])
         this.tableName = this.tableNameList[0]
       })

    },
    getData(item){
      this.tableData =[]
      this.getData_loading = true
      let tableName = item
      getRequest(`/Model/getInfoByTableName/${tableName}`).then(res => {
        this.getData_loading = false
        this.dataTableVision = true
        this.tableData = res.data
      })
      // this.getFea(tableName)
      this.getTableBaseInfo(tableName)
      this.getNumber(tableName)
    },

    // getFea(tableName){
    //     getRequest(`/Model/getFeaByTableName/${tableName}`).then(res => {
    //       this.fea = res
    //     })
    // },

    getTableBaseInfo(tableName){
      getRequest(`/Model/getTableInfo/${tableName}`).then(res => {
        this.operators = res[0].operators
        const dateTime = res[0].loadtime.substring(0, 19);
        this.time = dateTime
      })
    },
    test(){
      console.log(this.tableName)
    },
    isSortable(key) {
      // 获取第一个数据行的字段值
      const value = this.tableData.length > 0 ? this.tableData[0][key] : null;
      // 判断字段值是否为数字或数字型字符串
      return typeof value === 'number' || /^\d+(\.\d+)?$/.test(value);
    },

    handleNodeClick(data){
      // console.log(data.label);

      // 假设treeData是当前组件的一个数据属性，存储了整棵树的数据
      // 你需要遍历这棵树来检查data.label是否只存在于某个节点的children中
      let isChildLabelOnly = false;
      let parentLabel = ''
      this.treeData.forEach(node => {
        if (node.children) {
          node.children.forEach(child => {
            if (child.label === data.label) {
              // 发现匹配的label在children中，但不能直接确定它是唯一的
              isChildLabelOnly = true;
              parentLabel = node.label;
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

        this.formData.diseasename = parentLabel
        this.tableName = data.label
        this.getData(data.label)
      }
    },

    getNumber(tablename){
      getRequest(`/Model/getNumber/${tablename}`).then(
          res => {
            this.sampleNum = res[0]
            this.featureNum = res[1]
          }
      )
    },

  },

}
</script>


<style scoped>
/*页面布局*/
.container {
  display: flex;
  height: calc(100vh - 350px);
}

.left {
  flex: 10%;
  border-right: #868585 1px solid;

}

.right {
  flex: 80%;
  overflow: auto;

}


.describe_content {
  display: inline-block;
  width: 70%;
}

.describe_content span {
  margin: 10px;
}


.selected-item {
  background-color: #44b3f5; /* 设置选中时的背景颜色 */
}

.cell{
  white-space: nowrap; /* 防止文字换行 */
  overflow: hidden; /* 隐藏溢出的文字 */
  text-overflow: ellipsis;
}

.custom-node {
  /* 添加您想要的自定义字体样式 */

  font-size: 16px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-right: 8px;
  overflow: hidden;

}

.el-tree-node__content {
 margin: 4px 0 !important;/* 设置节点间距 */
}




.tablePlaceholder{
  height: calc(100vh - 500px);
  text-align: center;
  line-height: 600px;
  background-color: rgba(179, 178, 178, 0.144);
  font-weight: bold;
  color: rgba(58, 57, 57, 0.651);
  user-select:none;
}

.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>