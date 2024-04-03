<template>
  <div>
    <div class="container">
      <div style="font-size: 50px">多病种疾病风险预测工具软件</div>
      <div class="size-icon">
        <div v-for="(item, index) in quickEntry" :key="index" class="icon">
          <div class="singleBox" @click="quickLink(index)">
            <img
              :src="item.img"
              class="imgStyle"
              style="border-radius: 15px"
            />
            <h3 style="font-size: 30px">{{ item.title }}</h3>
          </div>
        </div>
        <!-- <div class="icon">
          <img src="@/assets/book.png" alt="健康资讯">
          <h3 style="font-size: 30px">健康资讯</h3>
        </div>
        <div class="icon">
          <img src="@/assets/model_intro.png" alt="模型训练">
          <h3 style="font-size: 30px">模型训练</h3>
        </div>

        <div class="icon">
          <img src="@/assets/danLiYuCe.png" alt="风险预测">
          <h3 style="font-size: 30px">风险预测</h3>
        </div>
        <div class="icon">
          <img src="@/assets/batch.png" alt="批量预测">
          <h3 style="font-size: 30px">批量预测</h3>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import {getRequest} from "@/utils/api";

export default {
  setup() {},
  data(){
    return {
      quickEntry: [
        {
          title: "健康资讯",
          img: require("@/assets/book.png"),
          router: "/DieaseIntro",
        },
        {
          title: "模型训练",
          img: require("@/assets/model_intro.png"),
          router: "/createTask",
        },
        {
          title: "风险预测",
          img: require("@/assets/danLiYuCe.png"),
          router: "/predictionInfo",
        },
        {
          title: "模型管理",
          img: require("@/assets/batch.png"),
          router: "/modelManage",
        },
      ],
    }
  },

  methods:{
    quickLink(index) {
      this.$router.push(this.quickEntry[index].router);
    },

  }
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  flex-flow: column;
}
.size-icon {
  font-size: 80px;
  display: grid;

  grid-template-columns: repeat(2, 300px);
  grid-template-rows: repeat(2, 300px);
  gap: 5px;
  justify-items: center;
  align-items: center;
}
.icon {
  display: grid;
  place-items: center;
  text-align: center;
}
.icon svg-icon {
  max-width: 100%;
  vertical-align: middle;
}
.icon h3 {
  margin-top: 10px;
}
</style>