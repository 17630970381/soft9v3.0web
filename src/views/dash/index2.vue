<template>
<div>
  <!-- 统计总数  -->
  <div class="top">
    <el-card class="card">
      <img class="cardImage" src="your-image-url.jpg">
      <!-- el-card 的内容 -->
      <div>
        <!-- 这里放 el-card 的内容 -->
        <p>专病集数量：25</p>
      </div>
    </el-card>
    <el-card class="card">
      <img class="cardImage" src="your-image-url.jpg">
      <!-- el-card 的内容 -->
      <div>
        <!-- 这里放 el-card 的内容 -->
        <p>样本数量：1000</p>
      </div>
    </el-card>
    <el-card class="card">
      <img class="cardImage" src="your-image-url.jpg">
      <!-- el-card 的内容 -->
      <div>
        <!-- 这里放 el-card 的内容 -->
        <p>起始时间：2023-12-20-9:00</p>
      </div>
    </el-card>
    <el-card class="card">
      <img class="cardImage" src="your-image-url.jpg">
      <!-- el-card 的内容 -->
      <div>
        <!-- 这里放 el-card 的内容 -->
        <p>模型总数:20</p>
      </div>
    </el-card>
  </div>
  <!-- 三个表 -->
  <div class="middle">
    <el-card class="middleCard" >

      <firstGraph/>
    </el-card>
    <el-card class="middleCard">
      <firstMidMid/>
    </el-card>
    <el-card class="middleCard">
      <firstMidRight/>
    </el-card>
  </div>
  <!-- 一个趋势图  -->
  <div class="firstFooter">
    <div class="bottomTitle">
      <h1>正负样本占比</h1>
    </div>
    <div class="bottomCard">
      <firstBottom/>
    </div>
  </div>
</div>
</template>

<script >

import firstGraph from "@/views/graph/firstGraph.vue";
import firstMidMid from "@/views/graph/firstMidMid.vue";
import firstMidRight from "@/views/graph/firstMidRight.vue";
import firstBottom from "@/views/graph/firstBottom.vue";

export default {
  name:"index2",
  components: {firstGraph,firstMidMid,firstMidRight,firstBottom},
  data() {
    return{

    }
  },


  methods:{

  },
}
</script>



<style scoped>
.top {
  box-sizing: border-box;
  height: 10vh;
  display: flex;
  justify-content:space-around;
  border: 2px solid #868585; /* 设置边框样式，可根据需要调整颜色和宽度 */
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);/* 设置阴影样式，可根据需要调整颜色和阴影参数 */
  margin-bottom: 10px;
}

.top .card {
  width: 300px;
  /* 设置 el-card 高度，你可以根据需要调整或使用其他单位如 px、rem 等 */
  height: 80%;
  margin-top: 10px;
  display: flex;
  flex-direction: column; /* 纵向排列子元素 */
  justify-content: center; /* 子元素水平居中 */
  align-items: center; /* 子元素垂直居中 */
  text-align: center;
  border-radius: 25px;
  position: relative; /* 设置相对定位 */
}

.cardImage {
  position: absolute; /* 设置绝对定位 */
  top: 10px; /* 距离上边框的距离，根据需要调整 */
  left: 10px; /* 距离左边框的距离，根据需要调整 */
  width: 30px; /* 设置图片宽度，根据需要调整 */
  height: 30px; /* 设置图片高度，根据需要调整 */
}

.middle{
  box-sizing: border-box;
  width: 100%;
  height: 38vh;
  display: flex;
  justify-content:space-around;
  border: 2px solid #868585; /* 设置边框样式，可根据需要调整颜色和宽度 */
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);/* 设置阴影样式，可根据需要调整颜色和阴影参数 */
  margin-bottom: 10px;
}

.middleCard {
  width: 500px;
  /* 设置 el-card 高度，你可以根据需要调整或使用其他单位如 px、rem 等 */
  height: 330px;
  margin-top: 8px;
  display: flex;
  flex-direction: column; /* 纵向排列子元素 */
  justify-content: center; /* 子元素水平居中 */
  align-items: center; /* 子元素垂直居中 */
  text-align: center;
  border-radius: 15px;
}

.firstFooter {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 37vh;
  border: 2px solid #868585; /* 设置边框样式，可根据需要调整颜色和宽度 */
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);/* 设置阴影样式，可根据需要调整颜色和阴影参数 */
}

.bottomCard {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 设置容器高度，这里使用视窗高度 */
  margin-top: 10px;
}

</style>