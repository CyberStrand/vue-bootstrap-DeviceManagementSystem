<template>
    <el-container style="min-height: 100vh">
        <el-container>
            <el-main>
                <!--选择栏-->
                <div class="search-bar">
                    <el-input class="search-input" v-model="username" placeholder="用户名"></el-input>
                    <el-select class="search-input" v-model="userType" placeholder="用户类型">
                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                    <el-button type="primary" @click="fetchPersonnel">查询</el-button>
                </div>

                <!--增加与批量删除-->
                <div class="action-buttons">
                    <el-button type="primary" @click="openDialog">新增</el-button>
                </div>

                <!--数据表-->
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column fixed prop="userId" label="用户ID" width="80" />
                    <el-table-column prop="username" label="用户名" width="100" />
                    <el-table-column prop="phoneNumber" label="电话" width="100" />
                    <el-table-column prop="email" label="电子邮件" width="100" />
                    <el-table-column prop="score" label="评分" width="100" />
                    <el-table-column prop="companyId" label="公司ID" width="100" />
                    <el-table-column prop="userType" label="用户类型" width="100">
                        <template v-slot="scope">
                            <span>{{ getUserTypeLabel(scope.row.userType) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作">
                        <template v-slot="scope">
                            <el-button size="mini" type="primary" @click="handleEdit(scope.row.userId)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.row.userId)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--分页栏-->
                <div class="pagination-bar">
                    <el-pagination v-model="pageNum" :page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>

                <!--添加设备对话框-->
                <el-dialog title="新增用户" v-model="dialogVisible" width="30%" :before-close="handleClose">
                    <el-form :model="formData" ref="formDataRef" label-width="80px">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="formData.username"></el-input>
                        </el-form-item>
                        <el-form-item label="电话号码" prop="phoneNumber">
                            <el-input v-model="formData.phoneNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="电子邮箱" prop="email">
                            <el-input v-model="formData.email"></el-input>
                        </el-form-item>
                        <el-form-item label="评分" prop="score">
                            <el-input v-model="formData.score"></el-input>
                        </el-form-item>
                        <el-form-item label="公司ID" prop="companyId">
                            <el-input v-model="formData.companyId"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="formData.password"></el-input>
                        </el-form-item>
                        <el-form-item label="用户类别" prop="user_type">
                            <el-select v-model="formData.user_type">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="saveData">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>

                <!--编辑设备对话框-->
                <el-dialog title="编辑设备" v-model="EditDialogVisible" width="30%" :before-close="handleClose">
                    <el-form :model="formData" ref="formDataRef" label-width="80px">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="formData.username"></el-input>
                        </el-form-item>
                        <el-form-item label="电话号码" prop="phoneNumber">
                            <el-input v-model="formData.phoneNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="电子邮箱" prop="eamil">
                            <el-input v-model="formData.eamil"></el-input>
                        </el-form-item>
                        <el-form-item label="评分" prop="score">
                            <el-input v-model="formData.score"></el-input>
                        </el-form-item>
                        <el-form-item label="公司ID" prop="companyId">
                            <el-input v-model="formData.companyId"></el-input>
                        </el-form-item>
                        <el-form-item label="用户类别" prop="user_type">
                            <el-select v-model="formData.user_type">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="updateDevice">修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>

            </el-main>
        </el-container>
    </el-container>
</template>
  
<script>
import { ref, onMounted, toRaw } from 'vue';

const apiHeaders = {
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + localStorage.getItem("token") // Replace with your actual JWT token
};
export default {
    name: 'AdminDevice',
    setup() {
        const dialogVisible = ref(false);
        const tableData = ref([]);
        const total = ref(0);
        const pageNum = ref(1);
        const pageSize = ref(5);
        const user_id = ref('');
        const username = ref(null)
        const userType = ref(null)
        const options = ref([
            { value: '', label: '默认'},
            { value: 'ordinary', label: '普通用户' },
            { value: 'admin', label: '平台管理员' },
            { value: 'company_manager', label: '公司管理员' },
            { value: 'maintenance_personnel', label: '维修人员' },
        ]);
        const inputStyle = ref({ 'font-size': '11px' });
        const EditDialogVisible = ref(false);
        const formData = ref({
            userId: '',
            username: '',
            phoneNumber: '',
            eamil: '',
            score: '',
            user_type: '',
            companyId: '',
            password: '',
        });
        const handleSizeChange = (pagesize) => {
            pageSize.value = pagesize;
            fetchPersonnel();
        };//修改每一页展示的记录数目
        const handleCurrentChange = (pagenum) => {
            pageNum.value = pagenum;
            fetchPersonnel();
        };//修改页码
        const fetchPersonnel = () => {
            console.log(pageSize.value)
            console.log(pageNum.value)
            fetch(`http://localhost:8080/admin/users?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify({
                    "pageNum": pageNum.value,
                    "pageSize": pageSize.value,
                })
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res.data.list);
                    tableData.value = res.data.list;
                    total.value = res.data.total;
                    if (username.value) {
                        tableData.value = tableData.value.filter(personnel => personnel.username.includes(username.value));
                        console.log('查询后结果：')
                        console.log(tableData.value)
                    };
                    if (userType.value) {
                        tableData.value = tableData.value.filter(personnel => personnel.userType.includes(userType.value));
                        console.log('查询后结果：')
                        console.log(tableData.value)
                    };
                })
                .catch(error => {
                    console.error('获取数据失败:', error);
                });
        };
        const handleDelete = (userId) => {
            console.log(userId)
            fetch(`http://localhost:8080/admin/user`, {
                method: 'DELETE',
                headers: apiHeaders,
                body: JSON.stringify({
                    'userId': userId,
                })
            })
                .then(response => {
                    if (response.ok) {
                        console.log('删除成功');
                        fetchPersonnel();
                    } else {
                        console.error(`删除失败: ${response.status} - ${response.statusText}`);
                    }
                })
                .catch(error => {
                    console.error('删除失败', error.message);
                });
        };//删除设备（删）
        const handleEdit = (serialNumber) => {
            EditDialogVisible.value = true;
            user_id.value = serialNumber;
        };
        const openDialog = () => {
            dialogVisible.value = true;
        };//打开添加设备对话框
        const handleClose = (done) => {
            done();
        };//关闭添加设备对话框
        const saveData = () => {
            console.log(formData.value)
            console.log(toRaw(formData.value))
            fetch("http://localhost:8080/admin/user", {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify(formData.value)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response from server:', data);
                    dialogVisible.value = false;// 关闭对话框
                    fetchPersonnel();//自动刷新
                })
                .catch(error => {
                    console.error('Error during data submission:', error);
                });
        };//保存添加设备对话框中的数据
        const updateDevice = () => {
            formData.value.userId = user_id.value;
            console.log(formData.value)
            console.log(toRaw(formData.value))
            fetch("http://localhost:8080/admin/user", {
                method: 'PUT',
                headers: apiHeaders,
                body: JSON.stringify(formData.value)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response from server:', data);
                    dialogVisible.value = false;// 关闭对话框
                    fetchPersonnel();//自动刷新
                })
                .catch(error => {
                    console.error('Error during data submission:', error);
                });
        }
        const getUserTypeLabel = (status) => {
            const statusMap = {
                'ordinary': '普通用户',
                'admin': '平台管理员',
                'company_manager': '公司管理员',
                'maintenance_personnel': '维修人员',
            };
            return statusMap[status] || '';
        };

        const getStatusColor = (status) => {
            if (status === 2) return '#ff7b7b'
            else if (status === 0) return '#5b952a'
        };

        onMounted(() => {
            fetchPersonnel();
        });

        return {
            dialogVisible,
            tableData,
            total,
            pageNum,
            pageSize,
            options,
            inputStyle,
            formData,
            EditDialogVisible,
            username,
            userType,
            getStatusColor,
            getUserTypeLabel,
            updateDevice,
            handleEdit,
            openDialog,
            fetchPersonnel,
            handleSizeChange,
            handleCurrentChange,
            handleDelete,
            handleClose,
            saveData,
        };
    },
};
</script>
  
<style scoped>
.search-bar {
    padding: 10px 0;
    align-items: center;
}

.search-input {
    width: 100px;
    margin-right: 10px;
}

.action-buttons {
    padding: 10px 0;
}

.pagination-bar {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
}

.el-table th,
.el-table td {
    text-align: center;
}

.el-dialog {
    overflow-y: auto;
}

/* Custom styles for status */
.error-status {
    color: #ff7b7b;
    /* Light red */
}
</style>