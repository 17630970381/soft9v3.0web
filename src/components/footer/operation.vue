<!--<template>-->
<!--<div>-->
<!--  <div style="height: calc(100vh - 150px)">-->
<!--    <div>-->
<!--      <h1 style="text-align: center;font-size: 25px">系统操作说明</h1>-->
<!--    </div>-->
<!--    <div class="module">-->
<!--      <h2>登录</h2>-->
<!--      <p>用户登录页面。页面前端效果如下图。输入用户名与密码进行验证。也可以新注册一个账户进行登录。软件使用地址与试用账户如下：</p>-->
<!--      <img :src="require('@/assets/apicture/登录.png')" alt="login" style="width: 100%;margin-top: 5px">-->
<!--    </div>-->
<!--    <div class="module">-->
<!--      <h2>首页</h2>-->
<!--      <p>首页页面效果如下图所示。首页主要包括快捷入口与相应的统计信息展示</p>-->
<!--      <img :src="require('@/assets/apicture/首页.png')" alt="home" style="width: 100%;margin-top: 5px">-->
<!--    </div>-->
<!--    <div class="module">-->
<!--      <h2>数据管理</h2>-->
<!--      <h3>上传公开数据集</h3>-->
<!--      <p>页面效果如下图所示。用户可以在公开数据集处选择新建病种或上传数据 集。新建病种代表数据集的分类，用户可以直接上传数据集或在对应的病种下进行上传。</p>-->
<!--      <img :src="require('@/assets/apicture/数据管理1.png')" alt="upload" style="width: 100%;margin-top: 5px">-->
<!--      <p>上传界面如下图所示，用户输入相关数据集信息，点击确定，实现上传功能。上传成功后可在左侧对应位置处查看所上传的文件。</p>-->
<!--      <img :src="require('@/assets/apicture/数据管理2.png')" alt="upload" style="width: 100%;margin-top: 5px">-->
<!--      <h3>筛选专病数据集</h3>-->
<!--      <p>页面效果如下图所示。当用户想从数据库中筛选相应的疾病进行研究时，可以在相应的疾病下面进行筛选（若无相应的病种，可先新建病种，新建病种如上所示）</p>-->
<!--      <img :src="require('@/assets/apicture/数据管理3.png')" alt="upload" style="width: 100%;margin-top: 5px">-->
<!--      <p>筛选页面如下所示，输入新增数据集的相关信息后，在下方选择 相应的特征特征作为数据集的筛选条件，点击筛选病例，会展示根据筛选条件得 出的数据（展示前 30 条），点击新建表，筛选出的数据将会被保存到数据库中。</p>-->
<!--      <img :src="require('@/assets/apicture/数据管理4.png')" alt="upload" style="width: 100%;margin-top: 5px">-->
<!--    </div>-->
<!--    <div class="module">-->
<!--      <h2>模型训练</h2>-->
<!--      <p>用户首先填写 任务信息，之后选择相应的数据集作为训练数据如图。</p>-->
<!--      <img :src="require('@/assets/apicture/模型训练1.png')" alt="upload" style="width: 100%;margin-top: 5px">-->
<!--      <p>根据所选的数据集进行 特征选择，包括因变量（标签特征，唯一）和自变量（参与模型训练的特征）</p>-->
<!--      <img :src="require('@/assets/apicture/模型训练2.png')" alt="upload" style="width: 100%;margin-top: 5px">-->
<!--      <p>之后进行模型选择,用户通过选择软件提供的模型，调整相应参数来进行模型的训练。</p>-->
<!--      <img :src="require('@/assets/apicture/模型训练3.png')" alt="upload" style="width: 100%;margin-top: 5px">-->
<!--      <p>包括模型训练的结果展示和模 型的再次调用。模型的训练结果展示包括模型的相关信息、PR 曲线、ROC 曲线、 混淆矩阵和特征权重，相应的结果可下载。模型的再次调用如图所示，用户 可以根据之前选择的自变量输入相关指标进行预测。最后，点击保存，相关任务 信息将会被保存至数据库中，便于后续任务</p>-->
<!--      <img :src="require('@/assets/apicture/模型训练5.png')" alt="upload" style="width: 100%;margin-top: 5px">-->
<!--      <p>模型的科再次调用，用户 可以根据之前选择的自变量输入相关指标进行预测。最后，点击保存，相关任务 信息将会被保存至数据库中，便于后续任务。</p>-->
<!--      <img :src="require('@/assets/apicture/模型训练6.png')" alt="upload" style="width: 100%;margin-top: 5px">-->
<!--    </div>-->
<!--    <div class="module">-->
<!--      <h2>任务管理</h2>-->
<!--      <p>用户可以根据左侧的树形结 构或上方的筛选框来进行相应任务的筛选，用户可点击查看详情 来了解任务的详细信息，详细信息包括任务所用模型的相关信息、-->
<!--        PR 曲线、ROC 曲线、混淆矩阵和特征权重，也可点击模型调用，用户可以根据本 次任务所选用的相关特征来输入相关指标进行预测</p>-->
<!--      <img :src="require('@/assets/apicture/任务管理1.png')" alt="upload" style="width: 100%;margin-top: 5px">-->
<!--      <img :src="require('@/assets/apicture/任务管理2.png')" alt="upload" style="width: 100%;margin-top: 5px">-->
<!--      <img :src="require('@/assets/apicture/任务管理3.png')" alt="upload" style="width: 100%;margin-top: 5px">-->
<!--    </div>-->
<!--    <div class="module">-->
<!--      <h2>疾病预测</h2>-->
<!--      <p>用户可以在左侧模型列表中 选择模型，以此来进行疾病的预测。包括手动输入和历 史数据。手动输入页面包括模型详情、模型指标和相应的模型输入框，用户可以-->
<!--        手动输入相应指标，点击保存所输入数值，点击预测，相应的预测结果会在右侧 显示。如果训练模型的特征在病人库中存在，则可使用历史数据的功能，进行病 人的批量预测，-->
<!--        用户可以点击单选患者进行预测，也可批量勾选 患者进行预测。用户可以利用患者 ID 进行搜索，搜索到的结果将展示在第一行。用户可以点击下载，将本次批量预测的结果下载 至本地，也可点击继续预测，再次选择病人进行预测。-->
<!--      </p>-->
<!--    </div>-->
<!--  </div>-->
<!--</div>-->
<!--</template>-->
<!--<script>-->

<!--export default {-->
<!--  name: "operation",-->
<!--  data(){-->
<!--    return{-->

<!--    }-->
<!--  }-->

<!--}-->

<!--</script>-->
<!--<style scoped>-->
<!--.module {-->
<!--  margin-bottom: 20px; /* 模块之间的底部间距 */-->
<!--}-->

<!--.module h2 {-->
<!--  margin-top: 0; /* 模块标题的顶部间距 */-->
<!--  margin-bottom: 10px; /* 模块标题的底部间距 */-->
<!--  font-size: 30px; /* 模块标题的字体大小 */-->
<!--}-->

<!--.module p {-->
<!--  text-indent: 2em; /* 段落的首行缩进 */-->
<!--  font-size: 20px; /* 段落的字体大小 */-->
<!--}-->

<!--.module h3 {-->
<!--  margin-top: 0; /* 模块标题的顶部间距 */-->
<!--  margin-bottom: 10px; /* 模块标题的底部间距 */-->
<!--  font-size: 25px; /* 模块标题的字体大小 */-->
<!--}-->
<!--</style>-->

<template>
  <div>
    <vue-office-docx :src="url"/>
    <!-- <vue-office-excel :src="url" />
    <vue-office-pdf :src="url" /> -->
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
    VueOfficeDocx
  },
  data(){
    return {
      url: '', //设置文档网络地址，可以是相对地址
    }
  },
  created(){
    getRequest("/File/getOptFile").then((res) => {
      this.url = res
    });
    localStorage.removeItem('modelname');
  }
}
</script>

<style scoped>
</style>