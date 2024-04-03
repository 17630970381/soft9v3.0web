
<template>
  <div>
    <div style="border-bottom: #868585 solid 1px; padding-bottom: 10px">
      <el-steps :active="active">
        <el-step title="任务信息" icon="el-icon-edit"></el-step>
        <el-step title="选择数据" icon="el-icon-upload"></el-step>
        <el-step title="特征选择" icon="el-icon-picture"></el-step>
        <el-step title="算法选择" icon="el-icon-picture"></el-step>
        <el-step title="运算结果" icon="el-icon-picture"></el-step>
      </el-steps>
    </div>
    <!--  选择数据  -->
    <div class="container" >
     <div class="left">
       <div style="text-align: center;margin-bottom: 20px;">
         <h1 style="margin-top: 10px">点击表名，即可查看数据</h1>
       </div>
       <div v-for="(item, index) in tableNameList" :key="index"
            style="display: block;margin-right: 2px;margin-top: 5px;text-align: right;">
        <el-card style="border-radius: 20px"
                 :class="{ 'selected-item': item === tableName }"
                 @click.native="getData(item)">{{ item }}</el-card>
      </div>

     </div>
      <div class="right">
        <el-card class="right_table_topCard" style="overflow-y: auto">
          <div class="describe_content">
            <h3>数据集名称: {{ tableName }}</h3>
            <p style="margin-top:0.5%">
              <i class="el-icon-user"></i>创建人: <span>{{ operators }}</span>
              <i class="el-icon-time"></i>创建时间: <span>{{time}}</span>
              <i class="el-icon-folder-opened"></i>所属类别: <span>{{ diseasename }}</span>
            </p>
          </div>
         <div style="overflow-y: auto">
           <el-table
               :data="tableData"
               v-if="dataTableVision"
               style="width: 100%;"
               :header-cell-style="{ backgroundColor: '#8c8c8c', color: 'black', fontWeight: 'bold' }"
               border
               stripe
               v-loading="getData_loading"
               element-loading-text="正在获取数据"
               element-loading-spinner="el-icon-loading"
           >
             <el-table-column type="index"> </el-table-column>
             <el-table-column
                 v-for="(key, index) in Object.keys(tableData[0])"
                 :key="index"
                 :label="key"
                 :prop="key"
                 :sortable="isSortable(key)"
             >
             </el-table-column>
           </el-table>
         </div>
        </el-card>

      </div>
    </div>

    <!-- 数据选择 -->
    <div>
      <el-button @click="toFeatureChoose()">
        选择该数据
      </el-button>
      <el-button @click="dataToCreate()">
        上一步
      </el-button>
    </div>

  </div>
</template>

<script>
import DataManage from "@/components/tab/dataManage.vue";
import {getRequest} from "@/api/user";


export default {
  name: "dataChoose",
  components: {DataManage},
  computed: {
    formData() {
      return this.$store.state.formData
    },

  },
  data() {
    return {
      uid: 111,
      operators:"",
      active:2,
      tableName:"",
      diseasename: '',
      tableNameList: [],
      getData_loading: false,
      dataTableVision: false,
      tableData: [], // 存放从后端获取的数据
      fea: [],
      time:""
      // 分页
    }
  },
  created() {

    this.diseasename = this.formData.diseasename

  },
  mounted() {
    this.getTableNameList()
  },

  methods: {
    toFeatureChoose(){

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
        this.$store.commit('setFea',this.fea)
        this.$store.commit('putTableName',this.tableName)
        this.$router.replace('/featureChoose')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消选择'
        });
      });

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
      this.getData_loading = true
      let tableName = item
      getRequest(`/Model/getInfoByTableName/${tableName}`).then(res => {
        this.getData_loading = false
        this.dataTableVision = true
        this.tableData = res.data
        this.tableName = item
      })
      this.getFea(tableName)
      this.getTableBaseInfo(tableName)
    },
    getFea(tableName){
        getRequest(`/Model/getFeaByTableName/${tableName}`).then(res => {
          this.fea = res
        })
    },
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
    }

  },

}
</script>


<style scoped>
/*页面布局*/
.container {
  display: flex;
  height: calc(100vh - 255px);
}

.left {
  flex: 20%;
  border-right: #868585 1px solid;

}

.right {
  flex: 80%;
  overflow: auto;
}

.right_table_topCard {
  padding: 0;
  height: calc(100vh - 300px);
  width: 95%;
  border-radius: 3px;
  border-bottom: 1px solid #e6e6e6;
  top: 2%;
  left: 1%;

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


</style>