
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

    <!-- 算法选择 -->
    <div class="alChoose">
    <!--  算法选择框：占20%     -->
      <div class="small-div left">
        <el-row justify="end">
          <el-col :span="24" v-for="algorithm in algorithms" :key="algorithm.name">
            <div class="algorithm-container">
              <el-link
                  style="margin-right: 10px;"
                  @click="showAlgorithmDetails(algorithm)"
                  :class="{ 'disabled-link': !algorithm.isActive }"
              >
                {{algorithm.name}}
              </el-link>
              <el-switch
                  v-model="algorithm.isActive"
                  active-text=""
                  inactive-text=""
                  @change="handleSwitchChange(algorithm)"
              >{{ algorithm.name }}</el-switch>
            </div>
          </el-col>
        </el-row>
      </div>
    <!--  算法选择详情（所需超参）：占80%     -->
      <div class="small-div right">
        <el-row>
          <el-col :span="24">
            <div v-if="selectedAlgorithm">
              <h2>{{ selectedAlgorithm.name }}</h2>

              <p>{{ selectedAlgorithm.details }}</p>
              <!-- 显示所需超参信息 -->
              <el-form :model="selectedAlgorithm.parameters" label-position="left" label-width="120px">
                <el-form-item v-for="(value, key) in selectedAlgorithm.parameters" :key="key" :label="key">
                  <el-input v-model="selectedAlgorithm.parameters[key]" :disabled="!selectedAlgorithm.isActive" />
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>

    </div>
    <!--  底部提交  -->

    <div class="bottom-buttons">
      <el-button @click="goToFea">上一步</el-button>
      <el-button v-if="selectedAlgorithm" type="primary" @click="trainModels">提交训练</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: "alChoose",
  computed: {
    formData() {
      return this.$store.state.formData
    }
  },
  data() {
    return {
      active:4,
      algorithms: [
        { name: 'RF',
          isActive: false,
          details: '',
          parameters: { RF1: '', RF2: '' } },
        { name: 'SVM',
          isActive: false,
          details: '',
          parameters: { SVM1: '', SVM2: '' } },
        // 其他算法的配置
      ],
      selectedAlgorithm: null,
    }
  },
  methods: {
    handleSwitchChange(algorithm) {
      // 处理开关状态变化
      if (algorithm.isActive) {
        // 如果开关激活，可以执行相应的操作，比如获取算法介绍和超参数
        // 同时，你可能需要在这里异步加载算法介绍和超参数，然后再显示
        this.loadAlgorithmDetails(algorithm);
      } else {
        // 如果开关关闭，清空右侧显示的算法详情
        this.selectedAlgorithm = null;
      }
    },
    async loadAlgorithmDetails(algorithm) {
      // 模拟异步加载算法介绍和超参数的过程
      // 实际上，你可能需要通过接口请求获取这些数据
      algorithm.details = await this.getAlgorithmDetails(algorithm.name);
      // 假设参数信息也通过接口请求获取
      algorithm.parameters = await this.getAlgorithmParameters(algorithm.name);
      // 更新右侧显示的算法详情
      this.selectedAlgorithm = algorithm;
      // 添加额外的算法描述信息
      algorithm.details += `\n${algorithm.name}`;

      // 更新右侧显示的算法详情
      this.selectedAlgorithm = algorithm;
    },
    getAlgorithmDetails(algorithmName) {
      // 模拟通过接口请求获取算法介绍的数据
      return new Promise((resolve) => {
        // 假设通过接口请求获取数据
        setTimeout(() => {
          resolve(`${algorithmName}.`);
        }, 1);
      });
    },
    getAlgorithmParameters(algorithmName) {
      // 模拟通过接口请求获取算法参数的数据
      return new Promise((resolve) => {
        // 假设通过接口请求获取数据
        setTimeout(() => {
          resolve({ param1: '', param2: '' });
        }, 1);
      });
    },
    showAlgorithmDetails(algorithm) {
      // 点击算法名称时，显示对应的算法详情
      this.loadAlgorithmDetails(algorithm);
    },
    trainModels() {
      // 将选择的算法和其他必要的数据传递给后端进行模型训练
      const selectedAlgorithms = this.algorithms.filter((algorithm) => algorithm.isActive);
      const requestData = {
        selectedAlgorithms,
        // 其他数据
      };
      this.$router.replace('/resultShow')

      // 调用后端接口进行模型训练
      // axios.post('/train-models', requestData)
      //   .then(response => {
      //     // 处理后端返回的结果
      //   })
      //   .catch(error => {
      //     // 处理错误
      //   });
    },

    goToFea(){
      this.$router.replace('featureChoose')
    }
  },

}
</script>


<style scoped>
.alChoose {
  display: flex;
  width: 100%;

}

.small-div {
  height: 70vh; /* 或者适应你的实际高度需求 */

}

.left {
  flex: 20%;
  border-right: #000000 solid 1px;
}

.right {
  flex: 80%;
}

.el-row {
  margin-bottom: 10px;
}

.el-switch {
  display: inline-block;
  margin-right: 10px;
  margin-top: 10px;
}

.el-link {
  display: inline-block;
  cursor: pointer;
}

.disabled-link {
  pointer-events: none;
  color: #ccc;
}

.algorithm-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.bottom-buttons {
  display: flex;
  justify-content: center;
}
</style>