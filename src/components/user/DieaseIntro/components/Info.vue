<template>
  <div style="display: flex; height: 100%">
    <!-- ------------------------侧边栏----------------------- -->
    <div id="sideMenu" style="height: 100%; width: 22%">
      <el-menu
        style="height: 100%"
        id="menus"
        ref="menus"
        default-active=""
        v-model="activeName"
        @select="handleClick"
      >
        <el-submenu
          v-for="(part, index1) of diseaseList"
          :key="index1"
          :index="part.partName"
        >
          <template slot="title">{{ part.partName }}</template>
          <el-menu-item
            v-for="(dis, index2) of part.symp"
            :key="index2"
            :index="dis.code"
            >{{ dis.name }}</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </div>

    <!-- -------------------------详情页------------------------------ -->
    <div style="display: flex; flex-direction: column; height: 100%; align-items: center; justify-content: flex-start;width: 78%">

      <!-- el-button -->
      <div style="height: 10%; width: 100%; text-align: center;" @click="dialogVisible = true">
        <el-button type="primary" round >
          添加资讯 <i class="el-icon-plus"></i>
        </el-button>
      </div>
     <div v-show="this.detailInfo.name" class="detailInfo" style="width: 100%; flex: 1; overflow-y: auto; padding: 20px; box-sizing: border-box; ">
       <!-- 行内样式应该用驼峰命名，fontSize,textAlign,css文件里不能用驼峰，只能用font-size，
       自动格式化文档会把行内样式的fintSize改成fontsize导致失效 -->
       <h1 style="font-size: 28px; text-align: center" >
         {{ this.detailInfo.name }}
       </h1>

       <h3>症状:</h3>
       <p>{{ this.detailInfo.symp }}</p>
       <h3>科室:</h3>
       <p>{{ this.detailInfo.dptment }}</p>
       <h3>建议:</h3>
       <p>{{ this.detailInfo.prevent }}</p>
       <!-- <p>{{this.detailInfo.partName}}</p> -->
     </div>
  </div>
    <el-dialog
        title="添加资讯"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="resetForm">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="疾病">
          <el-select v-model="form.disease" placeholder="请选择疾病">
            <el-option
                v-for="disease in diseaseOptions"
                :key="disease.value"
                :label="disease.label"
                :value="disease.value"
            ></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>

        <!-- 其他疾病输入框 -->
        <el-form-item v-if="form.disease === '其他'" label="其他疾病名称">
          <el-input v-model="form.otherDisease" placeholder="请输入其他疾病名称"></el-input>
        </el-form-item>
        <el-form-item label="科室">
          <el-checkbox @change="handleSelectAll" v-model="selectAll">全选</el-checkbox>
          <el-checkbox-group v-model="form.departments">
            <el-checkbox v-for="department in departmentOptions" :key="department.value" :label="department.value">{{ department.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="建议">
          <el-input
              v-model="form.advice"
              type="textarea"
              placeholder="请输入建议"
              :rows="4">
          </el-input> <!-- 可以根据需求调整行数 -->

        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm">取 消</el-button>
    <el-button type="primary"  @click="submitForm">确 定</el-button>
  </span>
    </el-dialog>
   </div>
</template>
<script>
import { diseasePost } from "@/api/user.js";
import { disInfoGet } from "@/api/user.js";
export default {
  props: { selectName: String },
  data() {
    return {
      activeName: '软件简介',
      timer: null,
      diseaseList: [],
      detailInfo: {
        name: null,
        symp: null,
        dptment: null,
        prevent: null,
        partName: null,
      },
      dialogVisible: false,
      form: {
        disease: '', // 选择的疾病
        otherDisease: '' ,// 其他疾病名称
        departments: '', //科室名称
        advice:'',//建议
        // 其他表单项
      },
      diseaseOptions: [
        { value: '心脏病', label: '心脏病' },
        { value: '肾癌', label: '肾癌' },
        { value: '肺癌', label: '肺癌' },
        // 其他疾病选项
      ],
      departmentOptions: [
        { value: '科室1', label: '科室1' },
        { value: '科室2', label: '科室2' },
        { value: '科室3', label: '科室3' },
        // 其他科室选项
      ],
      selectAll:false,
    };
  },
  methods: {
    // 防抖
    fd(fuc, ...args) {
      clearTimeout(this.timer);
      this.timer = setTimeout(fuc.bind(this, ...args), 150);
    },
    init() {
      // let menu = this.$refs.menus;
      let menus = this.$refs.menus.$el;
      // console.log(tab);
      menus.addEventListener("mouseover", (event) => {
        this.fd((e) => {
          // console.log(e)
          if (e.target.localName != "li") {
            this.$emit(
              "hover",
              e.target.innerText == "软件简介" ? "" : e.target.innerText
            );
          }
        }, event);
      });
      menus.addEventListener("click", (event) => {
        this.fd((e) => {
          // console.log(e)
          if (e.target.localName != "li") {
            this.$emit(
              "hover",
              e.target.innerText == "软件简介" ? "" : e.target.innerText
            );
          }
        }, event);
      });
      menus.addEventListener("mouseout", (event) => {
        // console.log(event)

        this.fd(() => {
          this.$emit("hover", this.activeName);
          this.$emit("select", this.activeName);
        }, event);
      });
    },
    handleClick(index, indexPath) {
      this.activeName = indexPath[0];
      disInfoGet(index).then((res) => {
        console.log("!!!!!!!!!!");
        console.log(res);
        let { name, symp, dptment, prevent, partName } = res; //解构赋值

        this.detailInfo.name = name;
        this.detailInfo.symp = symp;
        this.detailInfo.dptment = dptment;
        this.detailInfo.prevent = prevent;
        this.detailInfo.partName = partName;
      });
      console.log(index, indexPath);
    },
    handleSelectAll() {
      if (this.selectAll) {
        this.form.departments = this.departmentOptions.map(option => option.value);
      } else {
        this.form.departments = [];
      }
    },
    resetForm(){
      // 重置表单内容
      this.form = {
        disease: '',
        otherDisease: '',
        departments: [],
        suggestion: ''
      };
      this.selectAll = false
      this.dialogVisible = false
    },
    submitForm(){
      console.log(111);
      this.dialogVisible = false
      this.resetForm()
    }
  },
  mounted() {
    this.init();
    diseasePost().then((res) => {
      this.diseaseList = res;
    });
  },
  watch: {
    selectName() {
      this.activeName = this.selectName ? this.selectName : "简介";
    },
    activeName() {
      console.log(this.activeName);
    },
    'form.departments': {
      handler(newVal) {
        this.selectAll = newVal.length === this.departmentOptions.length;
      },
      immediate: true
    }
  },
};
</script>
<style scoped>
.el-tabs {
  height: 100%;
  box-shadow: none;
  border: none;
}
h3{
  margin: 1%;
}
p{
  margin: 1%;
}
#menus {
  /* height: 80%; */
  /* overflow-y: auto; */
  overflow-x: hidden;
}
.is-active{
  /* background-color: red; */
}
</style>
