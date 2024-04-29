<!--<template>-->
<!--  <div>-->

<!--&lt;!&ndash;      <div style="font-size: 50px">多病种疾病风险预测工具软件</div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="size-icon">&ndash;&gt;-->
<!--&lt;!&ndash;        <div v-for="(item, index) in quickEntry" :key="index" class="icon">&ndash;&gt;-->
<!--&lt;!&ndash;          <div class="singleBox" @click="quickLink(index)">&ndash;&gt;-->
<!--&lt;!&ndash;            <img&ndash;&gt;-->
<!--&lt;!&ndash;              :src="item.img"&ndash;&gt;-->
<!--&lt;!&ndash;              class="imgStyle"&ndash;&gt;-->
<!--&lt;!&ndash;              style="border-radius: 15px"&ndash;&gt;-->
<!--&lt;!&ndash;            />&ndash;&gt;-->
<!--&lt;!&ndash;            <h3 style="font-size: 30px">{{ item.title }}</h3>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--     <div style="height: calc(100vh - 150px)">-->
<!--       <div>-->
<!--         <h1 style="text-align: center">系统介绍</h1>-->
<!--       </div>-->
<!--       <h1 style="text-align: center">多病种疾病风险预测工具软件</h1>-->
<!--      <div style="text-align: center">-->
<!--        <img style="border-top: #252525 1px solid;" :src="require('@/assets/apicture/softintro.png')"/>-->
<!--      </div>-->
<!--       <div class="module">-->
<!--         <h2>数据管理</h2>-->
<!--         <p>数据管理模块实现对医疗数据的数据上传、数据存储、数据查询、数据筛选功能。其中数据上传是指用户的数据文件传到数据库中，通过前端页面可以上传数据；数据存储功能将医疗数据存储到 PG 数据库中，可以根据上传的文件进行动态生成表来进行数据的存储；数据查询功能可以根据用户输入的特定的条件查询想要的数据；数据筛选功能用户可以通过相应的筛选条件来构造专病数据集并保存在数据库中。</p>-->
<!--       </div>-->
<!--       <div class="module">-->
<!--         <h2>模型训练</h2>-->
<!--         <p>模型训练模块主要实现利用相应医疗数据来训练预测模型。用户通过选择相应的数据集、相应的标签列和参与训练的特征，利用系统提供的相应模型来进行训练，得到相应的模型，用于之后的疾病预测。</p>-->
<!--       </div>-->
<!--       <div class="module">-->
<!--         <h2>任务管理</h2>-->
<!--         <p>任务管理模块实现对模型训练任务的查询、删除和新增功能。用户通过相关的筛选条件选择相应的任务查看详情，也可以再次调用任务所训练的模型；用户可以删除相应的任务；用户点击新增可以跳转至模型训练。</p>-->
<!--       </div>-->
<!--       <div class="module">-->
<!--         <h2>疾病预测</h2>-->
<!--         <p>疾病预测模块可以调用任务管理中的模型来实现疾病预测功能。用户通过选择相应的病种、模型来进行疾病预测。如果训练模型的特征在病人库中存在，则可使用历史数据的功能，进行病人的批量预测。</p>-->
<!--       </div>-->

<!--     </div>-->

<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--export default {-->
<!--  data(){-->
<!--    return {-->
<!--      quickEntry: [-->
<!--        {-->
<!--          title: "模型训练",-->
<!--          img: require("@/assets/model_intro.png"),-->
<!--          router: "/createTask",-->
<!--        },-->
<!--        {-->
<!--          title: "风险预测",-->
<!--          img: require("@/assets/danLiYuCe.png"),-->
<!--          router: "/predictionInfo",-->
<!--        },-->
<!--        {-->
<!--          title: "模型管理",-->
<!--          img: require("@/assets/batch.png"),-->
<!--          router: "/modelManage",-->
<!--        },-->
<!--      ],-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->

<!--  },-->
<!--  methods:{-->

<!--    quickLink(index) {-->
<!--      this.$router.push(this.quickEntry[index].router);-->
<!--    },-->

<!--  }-->
<!--};-->
<!--</script>-->
<!--<style scoped>-->
<!--.container {-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  height: 80vh;-->
<!--  flex-flow: column;-->
<!--}-->
<!--.size-icon {-->
<!--  font-size: 80px;-->
<!--  display: grid;-->

<!--  grid-template-columns: repeat(3, 300px);-->
<!--  grid-template-rows: repeat(1, 300px);-->
<!--  gap: 5px;-->
<!--  justify-items: center;-->
<!--  align-items: center;-->
<!--}-->
<!--.icon {-->
<!--  display: grid;-->
<!--  place-items: center;-->
<!--  text-align: center;-->
<!--}-->
<!--.icon svg-icon {-->
<!--  max-width: 100%;-->
<!--  vertical-align: middle;-->
<!--}-->
<!--.icon h3 {-->
<!--  margin-top: 10px;-->
<!--}-->

<!--.module {-->
<!--  margin-bottom: 20px; /* 模块之间的底部间距 */-->
<!--}-->

<!--.module h2 {-->
<!--  margin-top: 0; /* 模块标题的顶部间距 */-->
<!--  margin-bottom: 10px; /* 模块标题的底部间距 */-->
<!--  font-size: 20px; /* 模块标题的字体大小 */-->
<!--}-->

<!--.module p {-->
<!--  text-indent: 2em; /* 段落的首行缩进 */-->
<!--  font-size: 16px; /* 段落的字体大小 */-->
<!--}-->


<!--</style>-->


<template>
  <div>
    <vue-office-pdf :src="url"/>
  </div>
</template>

<script>
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
import VueOfficePdf from '@vue-office/pdf'
import { getRequest, postRequest } from "@/api/user";
export default {
  components:{
    VueOfficePdf
  },
  data(){
    return {
      url: '' //设置文档网络地址，可以是相对地址
    }
  },
  created(){
    getRequest("/File/getIntroFile").then((res) => {
      this.url = res
    });
    localStorage.removeItem('modelname');
  }
}
</script>