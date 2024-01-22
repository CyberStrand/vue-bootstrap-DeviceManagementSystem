<template>
    <h1>田子奇</h1>
    <el-container style="min-height: 100vh">
        <el-container>
            <el-main>
                <!--选择栏-->
                <div style="padding: 10px 0">
                    <el-button type="success" @click="exportAllOrders"><el-icon>
                            <Promotion />
                        </el-icon>&nbsp;导出</el-button>
                    <!-- 打印 -->
                    <el-button v-print="'#printArea'" type="success"> <el-icon>
                            <Printer />
                        </el-icon>打印</el-button>
                    <!-- 排序 -->
                    <el-button type="success" @click="changeSort"><el-icon>
                            <PieChart />
                        </el-icon>&nbsp;更改排序（订单ID）</el-button>
                </div>

                <!--数据表-->
                <el-table id="printArea" :data="tableData" style="width: 100%">
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
                    <el-table-column fixed="right" label="操作">
                        <template v-slot="scope">
                            <el-button size="mini" type="primary" @click="handleEdit(scope.row.orderId)">完成订单</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页栏-->
                <div class="pagination-bar">
                    <el-pagination v-model="pageNum" :page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>
  
<script>
import { ref, onMounted, toRaw } from 'vue';
import { export_json_to_excel } from "@/vendor/Export2Excel";
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox } from 'element-plus';
import {
    CirclePlus,
    DeleteFilled, EditPen,
    PieChart,
    Printer,
    Promotion,
    Search,
    SortDown,
    SortUp
} from "@element-plus/icons-vue";

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
            { value: '', label: '默认' },
            { value: 'accepted', label: '已接单' },
            { value: 'pending', label: '待接单' },
            { value: 'completed', label: '已结束、待评价' },
            { value: 'evaluated', label: '已评价' },
        ]);
        const inputStyle = ref({ 'font-size': '11px' });
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
            fetch(`http://localhost:8080/maintanenceOrders?pageNum=-1&pageSize=${pageSize.value}`, {
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
                    const startIndex = (pageNum.value - 1) * pageSize.value
                    const endIndex = pageNum.value * pageSize.value
                    tableData.value = tableData.value.filter(order => order.orderStatus === 'accepted');
                    if (sort.value) {
                        tableData.value = tableData.value.sort((a, b) => a.orderId - b.orderId)
                    } else {
                        tableData.value = tableData.value.sort((a, b) => b.orderId - a.orderId)
                    }
                    total.value = tableData.value.length;
                    tableData.value = tableData.value.slice(startIndex, endIndex)
                })
                .catch(error => {
                    console.error('获取数据失败:', error);
                });
        };
        const handleEdit = (order_id) => {
            fetch('http://localhost:8080/completeOrder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token") // Replace with your actual JWT token
                },
                body: JSON.stringify({
                    order_id: order_id // Send orderId to the backend
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    ElMessage({
                        type: 'success',
                        message: '订单完成！',
                    })
                    console.log('Order accepted:', data);
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error accepting order:', error);
                });
        };
        const exportAllOrders = () => {
            console.log("执行了exportAllOrders函数");
            fetch(`http://localhost:8080/maintanenceOrders?pageNum=-1&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify({
                    "pageNum": pageNum.value,
                    "pageSize": pageSize.value,
                })
            })
                .then(res => res.json())
                .then(res => {
                    const orders = ref(null)
                    orders.value = res.data.list;
                    orders.value = orders.value.filter(order => order.orderStatus === 'accepted');
                    const tHeader = ['订单ID', '订单状态', '紧急程度', '设备序列号',
                        '订单创建时间', '订单详情', '公司ID', '用户ID', '维修人员ID'];
                    const filterVal = ['orderId', 'orderStatus', 'urgencyLevel', 'deviceId',
                        'createdAt', 'orderDetail', 'companyId', 'userId', 'maintenancePersonnelId'];
                    const data = formatJson(filterVal, orders.value);
                    export_json_to_excel(tHeader, data, '所有订单');
                });
        };
        const formatJson = (filterVal, jsonData) => {
            console.log("执行了formatJson函数");
            return jsonData.map(v => filterVal.map(j => v[j]));
        };

        onMounted(() => {
            fetchOrder();
        });

        const sort = ref(false)
        const changeSort = () => {
            if (sort.value) {
                sort.value = false
            } else {
                sort.value = true
            }
            console.log('改变了排序', sort.value)
            fetchOrder()
        }

        return {
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
            sort,
            changeSort,
            exportAllOrders,
            formatJson,
            handleEdit,
            fetchOrder,
            handleSizeChange,
            handleCurrentChange,
            formatDate,
        };
    },
};
</script>
  
<style></style>
  