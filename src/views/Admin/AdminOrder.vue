<template>
    <el-container style="min-height: 100vh">
        <el-container>
            <el-main>
                <!--选择栏-->
                <div style="padding: 10px 0">
                    订单号：<el-input style="width:100px" placeholder="请输入订单号" :style="inputStyle" v-model="orderId"></el-input>
                    订单状态：
                    <el-select placeholder="请选择订单状态" :style="inputStyle" v-model="orderStatus">
                        <el-option v-for="item in options" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                    <el-button type="primary" @click="fetchOrder">查询</el-button>
                    <el-button type="primary" @click="openDialog">新增</el-button>
                </div>
                <!--数据表-->
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column fixed prop="orderId" label="订单号" width="80" />
                    <el-table-column prop="orderStatus" label="订单状态" width="100">
                        <template v-slot="scope">
                            <span>{{ getOrderStatusLabel(scope.row.orderStatus) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="urgencyLevel" label="紧急程度" width="100" />
                    <el-table-column prop="deviceId" label="设备序列号" width="100" />
                    <el-table-column prop="createdAt" label="订单创建时间" width="100">
                        <template v-slot="scope">
                            {{ formatDate(scope.row.createdAt) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderDetail" label="订单详情" width="100" />
                    <!-- <el-table-column prop="locationId" label="地址ID" width="100" /> -->
                    <el-table-column prop="companyId" label="公司ID" width="100" />
                    <el-table-column prop="userId" label="用户ID" width="100" />
                    <el-table-column prop="maintenancePersonnelId" label="维修人员ID" width="100" />
                    <el-table-column fixed="right" label="操作">
                        <template v-slot="scope">
                            <el-button size="mini" type="primary" @click="handleEdit(scope.row.orderId)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.row.orderId)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页栏-->
                <div class="pagination-bar">
                    <el-pagination v-model="pageNum" :page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
                <!--新增对话框-->
                <el-dialog title="报修" v-model="dialogVisible" width="30%" :before-close="handleClose">
                    <el-form :model="formData" ref="formDataRef" label-width="80px">
                        <el-form-item label="紧急程度" prop="urgencyLevel">
                            <el-input v-model="formData.urgencyLevel"></el-input>
                        </el-form-item>
                        <el-form-item label="用户ID" prop="userId">
                            <el-input v-model="formData.userId"></el-input>
                        </el-form-item>
                        <el-form-item label="维修人员ID" prop="maintenancePersonnelId">
                            <el-input v-model="formData.maintenancePersonnelId"></el-input>
                        </el-form-item>
                        <el-form-item label="公司ID" prop="companyId">
                            <el-input v-model="formData.companyId"></el-input>
                        </el-form-item>
                        <el-form-item label="设备序列号" prop="deviceSerialNumber">
                            <el-input v-model="formData.deviceSerialNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="订单详情" prop="orderDetail">
                            <el-input v-model="formData.orderDetail"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="地址ID" prop="locationId">
                            <el-input v-model="formData.locationId"></el-input>
                        </el-form-item> -->
                        <el-form-item label="订单状态" prop="orderStatus">
                            <el-select v-model="formData.orderStatus">
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
                <el-dialog title="修改信息" v-model="EditDialogVisible" width="30%" :before-close="handleClose"
                    @close="resetFormData">
                    <el-form :model="formData" ref="formDataRef" label-width="80px">
                        <el-form-item label="紧急程度" prop="urgencyLevel">
                            <el-input v-model="formData.urgencyLevel"></el-input>
                        </el-form-item>
                        <el-form-item label="用户ID" prop="userId">
                            <el-input v-model="formData.userId"></el-input>
                        </el-form-item>
                        <el-form-item label="维修人员ID" prop="maintenancePersonnelId">
                            <el-input v-model="formData.maintenancePersonnelId"></el-input>
                        </el-form-item>
                        <el-form-item label="公司ID" prop="companyId">
                            <el-input v-model="formData.companyId"></el-input>
                        </el-form-item>
                        <el-form-item label="设备序列号" prop="deviceSerialNumber">
                            <el-input v-model="formData.deviceSerialNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="订单详情" prop="orderDetail">
                            <el-input v-model="formData.orderDetail"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="地址ID" prop="locationId">
                            <el-input v-model="formData.locationId"></el-input>
                        </el-form-item> -->
                        <el-form-item label="订单状态" prop="orderStatus">
                            <el-select v-model="formData.orderStatus">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="updateOrder">修改</el-button>
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
    'Authorization': "Bearer " + localStorage.getItem("token")
};

export default {
    name: 'OrdinaryUserDevices',
    methods: {
        getOrderStatusLabel(status) {
            const statusMap = {
                'accepted': '已接单',
                'pending': '待接单',
                'completed': '已结束、待评价',
                'evaluated': '已评价',
            };
            return statusMap[status] || '';
        },
    },

    setup() {
        const dialogVisible = ref(false);
        const tableData = ref([]);
        const total = ref(0);
        const pageNum = ref(1);
        const pageSize = ref(5);
        const orderStatus = ref(null);
        const ownerId = ref(24);
        const orderId = ref(null);
        const orderDetail = ref('');
        const options = ref([
            { value: '', label: '默认'},
            { value: 'accepted', label: '已接单' },
            { value: 'pending', label: '待接单' },
            { value: 'completed', label: '已结束、待评价' },
            { value: 'evaluated', label: '已评价' },
        ]);
        const inputStyle = ref({ 'font-size': '11px' });
        const EditDialogVisible = ref(false);
        const formData = ref({
            orderId: null,//自动创建
            userId: 24,
            maintenancePersonnelId: null,  //初始未分配为空
            companyId: null,        //初始未分配为空
            orderStatus: '',//创建新订单默认未派单
            urgencyLevel: 1,        //默认紧急程度最低
            deviceSerialNumber: '',
            createAt: '',
            orderDetail: '',
            // locationId: null,//初始未分配为空
        });
        const getOrderStatusLabel = (status) => {
            const statusMap = {
                'accepted': '已接单',
                'pending': '待接单',
                'completed': '已结束、待评价',
                'evaluated': '已评价',
            };
            return statusMap[status] || '';
        };
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };//重定义时间表达格式
        const handleSizeChange = (pagesize) => {
            pageSize.value = pagesize;
            fetchOrder();
        };//修改每一页展示的记录数目
        const handleCurrentChange = (pagenum) => {
            pageNum.value = pagenum;
            fetchOrder();
        };//修改页码
        const fetchOrder = () => {
            console.log(pageSize.value)
            console.log(pageNum.value)
            fetch(`http://localhost:8080/admin/orders?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
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
                    console.log(tableData.value)
                    if (orderId.value) {
                        const orderIdSearch = parseInt(orderId.value, 10);
                        tableData.value = tableData.value.filter(order => order.orderId === orderIdSearch);
                        console.log('查询后结果：')
                        console.log(tableData.value)
                    };
                    if (orderStatus.value) {
                        tableData.value = tableData.value.filter(order => order.orderStatus === orderStatus.value);
                        console.log('查询后结果：')
                        console.log(tableData.value)
                    };
                })
                .catch(error => {
                    console.error('获取数据失败:', error);
                });
        };
        const handleDelete = (orderId) => {
            fetch(`http://localhost:8080/admin/order`, {
                method: 'DELETE',
                headers: apiHeaders,
                body: JSON.stringify({
                    'orderId': orderId,
                })
            })
                .then(response => {
                    if (response.ok) {
                        console.log('删除成功');
                        fetchOrder();
                    } else {
                        console.error(`删除失败: ${response.status} - ${response.statusText}`);
                    }
                })
                .catch(error => {
                    console.error('删除失败', error.message);
                });
        };//删除设备（删）
        const handleEdit = (order_id) => {
            EditDialogVisible.value = true;
            orderId.value = order_id;
        };
        const openDialog = () => {
            dialogVisible.value = true;
        };//打开添加设备对话框
        const handleClose = (done) => {
            done();
        };//关闭添加设备对话框
        const saveData = () => {
            console.log(formData)
            fetch("http://localhost:8080/admin/order", {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify(formData.value)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response from server:', data);
                    dialogVisible.value = false;// 关闭对话框
                    fetchOrder();//自动刷新
                })
                .catch(error => {
                    console.error('Error during data submission:', error);
                });
        };//保存添加设备对话框中的数据
        const updateOrder = () => {
            formData.value.orderId = orderId.value
            console.log(formData.value)
            console.log(toRaw(formData.value))
            fetch("http://localhost:8080/admin/order", {
                method: 'PUT',
                headers: apiHeaders,
                body: JSON.stringify(formData.value)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response from server:', data);
                    dialogVisible.value = false;// 关闭对话框
                    fetchOrder();//自动刷新
                })
                .catch(error => {
                    console.error('Error during data submission:', error);
                });
        };
        onMounted(() => {
            fetchOrder();
        });

        return {
            dialogVisible,
            tableData,
            total,
            pageNum,
            pageSize,
            ownerId,
            options,
            inputStyle,
            formData,
            orderStatus,
            orderId,
            EditDialogVisible,
            updateOrder,
            handleEdit,
            openDialog,
            fetchOrder,
            handleSizeChange,
            handleCurrentChange,
            handleDelete,
            handleClose,
            formatDate,
            saveData,
        };
    },
};
</script>
  
<style></style>
  