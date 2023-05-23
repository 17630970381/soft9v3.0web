<template>
    <div>
        <!--===============================  头部按钮   ======================================================================-->
        <div id="top_buttons">
            <div id="model_state">

                <el-input
                    placeholder="请输入电话查询"
                    v-model="telForSearch"
                    clearable>
                </el-input>
            </div>

        </div>

        <!--===============================   表格    ========================================================================-->
        <div id="table">
            <el-table
                :data="tableData.filter(data => !telForSearch || data.userTel.includes(telForSearch))"
                style="width: 100%" stripe :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
                <!-- :data="tableData.filter(data => !(value1 || value2) || data.userTel.includes(value1) && data.userSex.includes(value2))" -->
                <el-table-column label="用户编号" prop="userID">
                </el-table-column>
                <el-table-column label="用户名" prop="userName">
                </el-table-column>
                <el-table-column label="性别" prop="userSex">
                </el-table-column>
                <el-table-column label="年龄" prop="userAge">
                </el-table-column>
                <el-table-column label="联系电话" prop="userTel">
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime">
                </el-table-column>
                <el-table-column align="center">
                    <template slot="header">
                        <span>操作</span>
                    </template>
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--===============================     编辑表单   ===================================================================-->
        <el-dialog title="编辑" :visible.sync="dialogFormVisible">
            <el-form :model="dialogForm" ref="dialogFormRef" :rules="rules" label-width="80px">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="dialogForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="userSex">
                        <el-select v-model="dialogForm.userSex" placeholder="请选择">
                            <el-option v-for="item in options_source" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                </el-form-item>
            </el-form>
            <!--          slot="footer"意思是Dialog存在一个名为footer的插槽，是dialog的按钮操作区的内容-->
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('dialogFormRef')">重置</el-button>
                <el-button type="primary" @click="submitForm('dialogFormRef')">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>



<script>
export default {
    data() {
        return {
            activeName: 'first',
            options_up: [{
                value: '198xxx0223',
                label: '198xxx0223'
            }, {
                value: '133xxx2705',
                label: '133xxx2705'
            }],
            value1: '',
            telForSearch: '',
            options_source: [{
                value: '男',
                label: '男'
            }, {
                value: '女',
                label: '女'
            }],
            value2: '',

            tableData: [{
                userID: 'M100000000001',
                userName: '用户名1',
                userSex: '男',
                userAge: 'xxx',
                userTel: '198xxx0223',
                createTime: '2022-01-10'
            }, {
                userID: 'M100000000001',
                userName: '用户名1',
                userSex: '男',
                userAge: 'xxx',
                userTel: '198xxx0223',
                createTime: '2022-01-10'
            }, {
                userID: 'M100000000001',
                userName: '用户名1',
                userSex: '男',
                userAge: 'xxx',
                userTel: '198xxx0223',
                createTime: '2022-01-10'
            }, {
                userID: 'M100000000001',
                userName: '用户名1',
                userSex: '男',
                userAge: 'xxx',
                userTel: '198xxx0223',
                createTime: '2022-01-10'
            }, {
                userID: 'M100000000001',
                userName: '用户名1',
                userSex: '男',
                userAge: 'xxx',
                userTel: '198xxx0223',
                createTime: '2022-01-10'
            }, {
                userID: 'M100000000001',
                userName: '用户名5',
                userSex: '男',
                userAge: 'xxx',
                userTel: '133xxx2705',
                createTime: '2022-01-10'
            }, {
                userID: 'M100000000001',
                userName: '用户名2',
                userSex: '男',
                userAge: 'xxx',
                userTel: '198xxx0223',
                createTime: '2022-01-10'
            }, {
                userID: 'M100000000001',
                userName: '用户名6',
                userSex: '女',
                userAge: 'xxx',
                userTel: '133xxx2705',
                createTime: '2022-01-10'
            }],
            search: '',
            dialogFormVisible: false,
            dialogForm: {
                userSex: '',
                userName: '',
            },
            editIndex: -1,
            rules: {
                userSex: [
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        handleEdit(index, row) {
            this.dialogForm = Object.assign({}, row);
            this.editIndex = index;
            this.dialogFormVisible = true;
        },
        handleDelete(index) {
            this.tableData.splice(index, 1);
        },
        handleSelectionChange() {
            console.log('选中的值为：', this.value1)
        },
        resetForm() {
            this.dialogForm.userSex = ''
            this.dialogForm.userName = ''
        },
        submitForm() {
            console.log('editIndex:', this.editIndex);
            console.log('tableData:', this.tableData);

            this.$refs.dialogFormRef.validate((valid) => {
                if (valid) {
                    if (this.editIndex !== -1) {
                        this.tableData[this.editIndex].userSex = this.dialogForm.userSex;
                        this.tableData[this.editIndex].userName = this.dialogForm.userName;
                    } else {
                        this.tableData.push({
                            userSex: this.dialogForm.userSex,
                            userName: this.dialogForm.userName,
                        })
                    }
                    this.dialogFormVisible = false
                    this.editIndex = -1
                    this.resetForm();
                } else {
                    console.log('submit failed');
                }
            });

        }
    }
};
</script>


<style scoped>
#top_buttons>* {
    display: inline-block;
}

#model_state {
    margin-right: 40px;
}

#model_type {
    margin-right: 20px;
}

#top_right_buttons {
    float: right;
    margin-right: 100px;
}

#table {
    margin-top: 10px;
}
</style>