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
        <el-form-item label="中文名">
          <el-input v-model="form.name" placeholder="请输入其他疾病名称"></el-input>
        </el-form-item>

        <!-- 其他疾病输入框 -->
        <el-form-item v-if="form.name === '其他'" label="其他疾病名称">
          <el-input v-model="form.otherDisease" placeholder="请输入其他疾病名称"></el-input>
        </el-form-item>
        <el-form-item label="英文名">
          <el-input v-model="form.code" placeholder="请输入疾病的英文名称"></el-input>
        </el-form-item>
        <el-form-item label="症状">
          <el-input v-model="form.symp" placeholder="请输入疾病的症状"></el-input>
        </el-form-item>
        <el-form-item label="科室">
          <el-checkbox @change="handleSelectAll" v-model="selectAll">全选</el-checkbox>
          <el-checkbox-group v-model="form.dptment">
            <el-checkbox v-for="department in departmentOptions" :key="department.value" :label="department.value">{{ department.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="建议">
          <el-input
              v-model="form.prevent"
              type="textarea"
              placeholder="请输入建议"
              :rows="4">
          </el-input> <!-- 可以根据需求调整行数 -->
        </el-form-item>
        <el-form-item label="病灶部位">
            <el-select v-model="form.part_name" placeholder="请选择部位" style="width: 100%; font-size: 18px;">
              <el-option label="肝脏" value="肝脏"></el-option>
              <el-option label="肺部" value="肺部"></el-option>
              <el-option label="大肠" value="大肠"></el-option>
              <el-option label="心脏" value="心脏"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
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
import {diseasePost, postRequest} from "@/api/user.js";
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
        code:'',
        name:'',
        otherDisease:'',
        symp:'',
        dptment:[],
        prevent: '',
        part_name: '',
      },
      diseaseOptions: [
        { value: '心脏病', label: '心脏病' },
        { value: '肾癌', label: '肾癌' },
        { value: '肺癌', label: '肺癌' },
        // 其他疾病选项
      ],
      departmentOptions: [
        { value: '皮肤科', label: '皮肤科' },
        { value: '传染病科', label: '传染病科' },
        { value: '急诊科', label: '急诊科' },
        { value: '心内科', label: '心内科' },
        { value: '心血管科', label: '心血管科' },
        { value: '呼吸内科', label: '呼吸内科' },
        { value: '肺科', label: '肺科' },
        { value: '内分泌科', label: '内分泌科' },
        { value: '肾内科', label: '肾内科' },
        { value: '肾病科', label: '肾病科' },
        { value: '肺内科', label: '肺内科' },
        { value: '肿瘤科', label: '肿瘤科' },
        { value: '肝胆外科', label: '肝胆外科' },
        { value: '消化内科', label: '消化内科' },
        { value: '妇产科', label: '妇产科' },
        { value: '乳腺外科', label: '乳腺外科' },
        { value: '神经外科', label: '神经外科' },
        { value: '泌尿外科', label: '泌尿外科' },
        { value: '神经科', label: '神经科' },
        { value: '血液科', label: '血液科' },
        { value: '老年病科', label: '老年病科' },
        { value: '精神科', label: '精神科' },
        { value: '康复医学科', label: '康复医学科' },
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
        this.form.dptment = this.departmentOptions.map(option => option.value);
      } else {
        this.form.dptment = [];
      }
    },
    resetForm(){
      // 重置表单内容
      this.form = {
        code:'',
        name:'',
        symp:'',
        dptment:'',
        prevent: '',
        part_name: '',
      };
      this.selectAll = false
      this.dialogVisible = false
    },
    submitForm(){
      this.init()
      let name = ''
      if(this.form.name !== ''){
        name = this.form.name
      }else if(this.form.otherDisease !== ''){
        name = this.form.otherDisease
      }

      if(this.form.symp==''){
        this.$alert("请填写疾病症状", "提示", {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'error',
              message: '请填写疾病症状'
            });
          }
        })
      }else if(name == ''){
        this.$alert("请填写疾病名称", "提示", {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'error',
              message: '请填写疾病名称'
            });
          }
        })
      }else if(this.form.dptment=='' ){
        this.$alert("请选择疾病科室", "提示", {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'error',
              message: '请选择疾病科室'
            });
          }
        })
      }else if(this.form.prevent=='' ){
        this.$alert("请输入建议", "提示", {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'error',
              message: '请输入建议'
            });
          }
        })
      }else {
        let code = this.form.code
        let name =''
        if(this.form.name === '其他'){
          name = this.form.otherDisease
        }else {
          name = this.form.name
        }
        let symp = this.form.symp
        let dptment = this.form.dptment.join(",");
        let prevent = this.form.prevent
        let partName = this.form.part_name
        let disease = {
          code,name,symp,dptment,prevent,partName
        }
        postRequest('/Diseases/add',disease).then(res => {
          if(res === 1){
            this.$alert('资讯已保存', '', {
              confirmButtonText: '确定',
              callback: action => {
                this.$message({
                  type: 'success',
                  message: `资讯保存成功`
                });
              }
            });
          }
        })
        this.dialogVisible = false

        diseasePost().then((res) => {
          this.diseaseList = res;
        });
        this.resetForm()
        this.init()
      }

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
    'form.dptment': {
      handler(newVal) {
        this.selectAll = newVal.length === this.departmentOptions.length;
      },
      immediate: true
    },

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
