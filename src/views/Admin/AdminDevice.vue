<template>
    <el-container style="min-height: 100vh">
        <el-container>
            <el-main>
                <!--选择栏-->
                <div class="search-bar">
                    <el-input class="search-input" v-model="serialNumber" placeholder="序列号"></el-input>
                    <el-input class="search-input" v-model="deviceName" placeholder="设备名称"></el-input>
                    <el-input class="search-input" v-model="locationId" placeholder="设备地址"></el-input>
                    <el-select class="search-input" v-model="status" placeholder="设备状态">
                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                    <el-button type="primary" @click="query">查询</el-button>
                </div>

                <!--增加与批量删除-->
                <div class="action-buttons">
                    <el-button type="primary" @click="openDialog">新增</el-button>
                </div>

                <!--数据表-->
                <el-table :data="tableData" :default-sort="{ prop: 'purchaseDate', order: 'descending' }"
                    style="width: 100%">
                    <el-table-column fixed prop="serialNumber" label="序列号" width="80" />
                    <el-table-column prop="deviceName" label="设备名称" width="100" />
                    <el-table-column prop="productionCompanyId" label="生产公司" width="100" />
                    <el-table-column prop="status" label="设备状态" width="100">
                        <template v-slot="scope">
                            <span :style="{ color: getStatusColor(scope.row.status) }">{{ getStatusLabel(scope.row.status)
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="deviceModel" label="设备类型" width="100" />
                    <el-table-column prop="purchaseDate" label="购买时间" width="100">
                        <template v-slot="scope">
                            {{ formatDate(scope.row.purchaseDate) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="warrantyTime" label="保修期" width="100" />
                    <el-table-column prop="locationId" label="设备地址" width="100" />
                    <el-table-column fixed="right" label="操作">
                        <template v-slot="scope">
                            <el-button size="mini" type="primary" @click="handleEdit(scope.row.serialNumber)">编辑</el-button>
                            <el-button size="mini" type="danger"
                                @click="handleDelete(scope.row.serialNumber)">删除</el-button>
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
                <el-dialog title="新增设备" v-model="dialogVisible" width="30%" :before-close="handleClose">
                    <el-form :model="formData" ref="formDataRef" label-width="80px">
                        <el-form-item label="序列号" prop="serialNumber">
                            <el-input v-model="formData.serialNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="厂家ID" prop="productionCompanyId">
                            <el-input v-model="formData.productionCompanyId"></el-input>
                        </el-form-item>
                        <el-form-item label="设备名称" prop="deviceName">
                            <el-input v-model="formData.deviceName"></el-input>
                        </el-form-item>
                        <el-form-item label="运行状态" prop="status">
                            <el-select v-model="formData.status">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="设备型号" prop="deviceModel">
                            <el-select v-model="formData.deviceModel">
                                <el-option v-for="item in models" :key="item.value" :label="item.label"
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
                        <el-form-item label="设备名称" prop="deviceName">
                            <el-input v-model="formData.deviceName"></el-input>
                        </el-form-item>
                        <el-form-item label="运行状态" prop="status">
                            <el-select v-model="formData.status">
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
        const status = ref('');
        const ownerId = ref(24);
        const serial_number = ref('');
        const options = ref([
            { value: '0', label: '正常运行中' },
            { value: '1', label: '维修中' },
            { value: '2', label: '发生错误' },
        ]);
        const models = ref([
            { value: '0', label: 'model X' },
            { value: '1', label: 'model Y' },
            { value: '2', label: 'model Z' },
        ]);
        const inputStyle = ref({ 'font-size': '11px' });
        const EditDialogVisible = ref(false);
        const formData = ref({
            serialNumber: '',
            deviceName: '',
            locationId: null,
            ownerId: 12,
            status: null,
            deviceModel: '',
            productionCompanyId: null,
            purchaseDate: '',
            warrantyTime: 365,
        });
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };//重定义时间表达格式
        const handleSizeChange = (pagesize) => {
            pageSize.value = pagesize;
            fetchDevice();
        };//修改每一页展示的记录数目
        const handleCurrentChange = (pagenum) => {
            pageNum.value = pagenum;
            fetchDevice();
        };//修改页码
        const fetchDevice = () => {
            console.log(pageSize.value)
            console.log(pageNum.value)
            fetch(`http://localhost:8080/admin/devices?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify({
                    "pageNum": pageNum.value,
                    "pageSize": pageSize.value,
                })
            })
                .then(res => res.json())
                .then(res => {
                    tableData.value = res.data.list;
                    total.value = res.data.total;
                })
                .catch(error => {
                    console.error('获取数据失败:', error);
                });
        };//获取设备信息（查）
        const query = () => {
            fetch(`http://localhost:8080/admin/device_by_status?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify({
                    "status": status.value,
                    "pageNum": pageNum.value,
                    "pageSize": pageSize.value,
                })
            })
                .then(res => res.json())
                .then(res => {
                    tableData.value = res.data.list;
                    total.value = res.data.total;
                })
                .catch(error => {
                    console.error('获取数据失败:', error);
                });
        };//根据设备状态查询设备信息（查）
        const handleDelete = (serialNumber) => {
            console.log(serialNumber)
            fetch(`http://localhost:8080/admin/device`, {
                method: 'DELETE',
                headers: apiHeaders,
                body: JSON.stringify({
                    'serialNumber': serialNumber,
                })
            })
                .then(response => {
                    if (response.ok) {
                        console.log('删除成功');
                        fetchDevice();
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
            serial_number.value = serialNumber;
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
            fetch("http://localhost:8080/admin/device", {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify(formData.value)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response from server:', data);
                    dialogVisible.value = false;// 关闭对话框
                    fetchDevice();//自动刷新
                })
                .catch(error => {
                    console.error('Error during data submission:', error);
                });
        };//保存添加设备对话框中的数据
        const updateDevice = () => {
            formData.value.serialNumber = serial_number.value;
            console.log(formData.value)
            console.log(toRaw(formData.value))
            fetch("http://localhost:8080/admin/device", {
                method: 'PUT',
                headers: apiHeaders,
                body: JSON.stringify(formData.value)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response from server:', data);
                    dialogVisible.value = false;// 关闭对话框
                    fetchDevice();//自动刷新
                })
                .catch(error => {
                    console.error('Error during data submission:', error);
                });
        }
        const getStatusLabel = (status) => {
            const statusMap = {
                '0': '正常运行中',
                '1': '维修中',
                '2': '发生错误',
            };
            return statusMap[status] || '';
        };

        const getStatusColor = (status) => {
            if (status === 2) return '#ff7b7b'
            else if (status === 0) return '#5b952a'
        };

        onMounted(() => {
            fetchDevice();
        });

        return {
            dialogVisible,
            tableData,
            total,
            pageNum,
            pageSize,
            status,
            ownerId,
            options,
            models,
            inputStyle,
            formData,
            getStatusColor,
            getStatusLabel,
            updateDevice,
            handleEdit,
            openDialog,
            fetchDevice,
            handleSizeChange,
            handleCurrentChange,
            handleDelete,
            query,
            handleClose,
            formatDate,
            saveData,
            EditDialogVisible,
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