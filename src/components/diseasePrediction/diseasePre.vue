<template>
<div>
  <div class="main">
    <div class="left_tree">
      <el-tree
          ref="tree"
          :data="treeData()"
          :show-checkbox="false"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :check-on-click-node="true"
          :highlight-current="true"
          @node-click="changeData"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
                icon="el-icon-delete"
                size="mini"
                type="text"
                @click="() => remove(node, data)"
            >
            </el-button>
          </span>
        </span>
      </el-tree>
      <el-dialog title="提示" :visible.sync="dialogDiseaseVisible" width="30%">
        <span>
          请输入新病种名称：<el-input
            placeholder="请输入内容"
            v-model="diseaseName"
            class="nameInput"
        ></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cleanInput()">取 消</el-button>
          <el-button type="primary" @click="() => append()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="right">
      <div class="right_head">
        <el-button style="margin-left: 50px;margin-top: 20px;border-radius: 30px"
                   type="primary">选择算法</el-button>
        <h4 style="margin-left: 55px;margin-top: 10px">公共算法:</h4>
        <div class="publicAl">
          <div v-for="(algorithm, index) in publicAlgorithms" :key="index"
               class="algorithm-switch">
            <el-switch v-model="algorithm.selected" :active-text="algorithm.name"
                       @change="updatePublicSelectedAlgorithms"
                       style="margin-right: 10px;"/>
          </div>
        </div>
        <h4 style="margin-left: 55px;margin-top: 10px">已训练算法:</h4>
        <div class="privateAl">
          <div v-for="(algorithm, index) in trainedAlgorithms" :key="index"
               class="algorithm-switch">
            <el-switch v-model="algorithm.selected" :active-text="algorithm.name"
                       @change="updateSelectedAlgorithms"/>
          </div>
        </div>
      </div>
      <div class="right_body1">
        <el-tag
            v-for="tag in tags"
            :key="tag.name"
            closable
            :type="tag.type"
            @close="removeTag(tag.name)"
            @click="handleTagClick(tag.name)"
            style="cursor: pointer;margin-right: 10px">
          {{tag.name}}
        </el-tag>
      </div>
      <div class="right_body2" v-if="tags.length > 0">
        <el-button type="primary"  @click="parameterShow">输入参数</el-button>
        <el-button type="primary"  @click="historyShow ">使用历史数据</el-button>
      </div>
      <div style="margin-left: 20px;margin-top: 10px">
        <Parameter v-if="tags.length > 0 && parameterShow1 "
                      :selectedAlgorithms = "selectedAlgorithms"
                      :publicSelectedAlgorithms = "publicSelectedAlgorithms"
                      :electionAl = "electionAl"/>
      </div>

      <div style="margin-left: 20px;margin-top: 10px">
        <historyData v-if="historyShow1 && tags.length > 0"/>
      </div>

    </div>
  </div>
</div>
</template>

<script >

import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { treeData } from "@/components/tab/treeTargetData.js";
import Parameter from "@/components/diseasePrediction/Parameter.vue";
import parameter from "@/components/diseasePrediction/Parameter.vue";
import HistoryData from "@/components/diseasePrediction/historyData.vue";
export default {
  name: "diseasePre",
  components: {
    HistoryData,
    Parameter,
  },
  computed: {
    parameter() {
      return parameter
    },
    ...mapState(["taskList"]),
    ...mapGetters(["taskLeaderList", "taskDiseaseList"]),

    tags() {
      const tagsFromSelected = this.selectedAlgorithms.map(name => ({ name, type: 'success' }));
      const tagsFromPublic = this.publicSelectedAlgorithms.map(name => ({ name, type: 'info' }));
      return [...tagsFromSelected, ...tagsFromPublic];
    },
  },
  data() {
    return {
      // 公共算法选择
      publicAlgorithms: [
        { name: 'SVM', selected: false },
        { name: 'RF', selected: false },
        { name: 'XGbost', selected: false },
        { name: 'DT', selected: false },
      ],
      // 已训练算法选择
      trainedAlgorithms: [
        { name: 'Algorithm 1', selected: false },
        { name: 'Algorithm 2', selected: false },
        { name: 'Algorithm 3', selected: false },
      ],
      selectedAlgorithms: [],
      publicSelectedAlgorithms: [],
      // 组件渲染
      parameterShow1: false,
      historyShow1:false,
      electionAl: "",
    }
  },
  methods: {
    treeData() {
      return treeData
    },
    // 算法选择
    updateSelectedAlgorithms() {
      this.selectedAlgorithms = this.trainedAlgorithms.filter(algorithm => algorithm.selected).map(algorithm => algorithm.name);
      console.log(this.selectedAlgorithms)
    },
    updatePublicSelectedAlgorithms() {
      this.publicSelectedAlgorithms= this.publicAlgorithms.filter(algorithm => algorithm.selected).map(algorithm => algorithm.name)
      console.log(this.publicSelectedAlgorithms)
    },
    // 不同算法的特征选择
    removeTag(tagName) {
      // 公共算法
      this.publicSelectedAlgorithms = this.publicSelectedAlgorithms.filter(name => name !== tagName);
      // Find the corresponding el-switch and set its state to false
      const algorithm = this.publicAlgorithms.find(algorithm => algorithm.name === tagName);
      if (algorithm) {
        algorithm.selected = false;
      }
      // 训练的算法
      this.selectedAlgorithms = this.selectedAlgorithms.filter(name => name !== tagName);
      // Find the corresponding el-switch and set its state to false
      const algorithm1 = this.trainedAlgorithms.find(algorithm => algorithm.name === tagName);
      if (algorithm1) {
        algorithm1.selected = false;
      }
      console.log(this.publicSelectedAlgorithms)
      console.log(this.selectedAlgorithms)

      if(this.tags.length <= 0)
      {
        this.parameterData.selectedAlgorithms = []
        this.parameterData.publicSelectedAlgorithms = []
        this.electionAl = ""
      }

    },

    handleTagClick(tagName) {
      // Handle the tag click event, you can perform any action here
      console.log('Tag Clicked:', tagName);
      this.electionAl = tagName
    },
    // 组件渲染
    parameterShow(){
      this.parameterShow1 = !this.parameterShow1
      this.historyShow1 = false
    },
    historyShow(){
      this.historyShow1 = !this.historyShow1
      this.parameterShow1 = false
    },
    changeData(node) {
      this.disease = node.label;
    },
  },

}
</script>


<style>
.main {
  display: flex;
  justify-content: space-between;
}

.left_tree {
  display: inline-block;
  border-radius: 3px;
  border-left: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

#top_buttons {
  margin-left: 3%;
  margin-bottom: 20px;
}

#top_buttons > * {
  display: inline-block;
}

.right {
  width: 80%;
  height: calc(100vh - 105px);
}

.right_head {
  margin-left: 20px;
  width: 90vh;
  height: 250px;
  border: 2px  #333; /* 边框 */
  border-radius: 30px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3); /* 阴影 */
}


.publicAl {
  margin-left: 55px;
  margin-top: 10px;
}

.privateAl {
  margin-left: 55px;
  margin-top: 10px;
}

.algorithm-switch {
  display: inline-block;
  margin-right: 15px;
}

.right_body1 {
  margin-left: 20px;
  margin-top: 20px;
}

.right_body2 {
  margin-left: 20px;
  margin-top: 10px;
}
</style>