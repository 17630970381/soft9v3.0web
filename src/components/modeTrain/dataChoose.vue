
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
         <h1>请选择数据表: 下列表均是关于{{ diseasename }}</h1>
         <h1 style="margin-top: 10px">点击表名，即可查看数据</h1>
         <h1 style="margin-top: 10px">当前选择数据表为:{{tableName}}</h1>
       </div>
       <div v-for="(item, index) in tableNameList" :key="index"
            style="display: block;margin-right: 2px;margin-top: 5px;text-align: right;">
        <el-button style="color: #5e5959;background: #b6f1a4"
         @click="getData(item)">{{ item }}</el-button>
      </div>

     </div>
      <div class="right" style="overflow: auto">

        <el-table
            :data="tableData"
            v-if="dataTableVision"
            style="width: 100%; margin-top: 20px; max-height: 700px; overflow:auto"
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
          >
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 数据选择 -->
    <div>
      <el-button @click="toFeatureChoose()">
        选择该数据
      </el-button>
      <el-button @click="test">test</el-button>
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
      operators:"zbk",
      active:2,
      tableName:"",
      diseasename: '',
      tableNameList: [],
      getData_loading: false,
      dataTableVision: false,
      tableData: [], // 存放从后端获取的数据
      fea: [],
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
      this.$store.commit('dataChooseToFeatureChoose',this.tableName)
      this.$store.commit('setFea',this.fea)
      this.$router.replace('/featureChoose')
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
    },
    getFea(tableName){
        getRequest(`/Model/getFeaByTableName/${tableName}`).then(res => {
          this.fea = res
          console.log(res)
        })
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum

    },
    test(){
      console.log(this.tableName)
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
}
</style>