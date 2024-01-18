<template>
    <el-container style="min-height: 100vh">
        <el-container>
            <el-main>
                <!--选择栏-->
                <div style="padding: 10px 0">
                    订单号：<el-input style="width:100px" placeholder="请输入订单号" :style="inputStyle" v-model="orderId"></el-input>
                    <el-button type="primary" @click="fetchOrder">查询</el-button>
                    <!-- 导出 -->
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
                    <!-- 统计 -->
                    <el-button type="success" @click="statistics"><el-icon>
                            <PieChart />
                        </el-icon>&nbsp;统计</el-button>
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
                            <el-button size="mini" type="primary" @click="handleEdit(scope.row.orderId)">接单</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页栏-->
                <div class="pagination-bar">
                    <el-pagination v-model="pageNum" :page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
                <!-- 导出设备 -->
                <el-dialog title="导出订单" v-model="exportDialogVisible" width="30%" :before-close="handleClose">
                    <el-button type="primary" @click="exportAllOrders"> &nbsp;导出</el-button>
                </el-dialog>
                <el-dialog title="统计订单" v-model="statisticDialogVisible" width="50%" :before-close="handleClose">
                    &nbsp; <div id="chart" style="height: 300px;"></div>
                </el-dialog>
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
    PieChart,
    Printer,
    Promotion,
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
        const options = ref([
            { value: '', label: '默认' },
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
            fetch(`http://localhost:8080/unacceptedOrders?pageNum=-1&pageSize=${pageSize.value}`, {
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
                    tableData.value = tableData.value.filter(order => order.orderStatus === 'pending');
                    if (orderId.value) {
                        const orderIdSearch = parseInt(orderId.value, 10);
                        tableData.value = tableData.value.filter(order => order.orderId === orderIdSearch);
                        console.log('查询后结果：')
                        console.log(tableData.value)
                    };
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
            fetch('http://localhost:8080/acceptOrder', {
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
                        message: '接单成功',
                    })
                    console.log('Order accepted:', data);
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error accepting order:', error);
                });
        };
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

        const clickExport = () => {
            exportDialogVisible.value = true;
        };
        const exportDialogVisible = ref(false);
        const exportAllOrders = () => {
            console.log("执行了exportAllOrders函数");
            fetch(`http://localhost:8080/unacceptedOrders?pageNum=-1&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify({
                    "pageSize": pageSize.value,
                })
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    const orders = res.data.list;
                    console.log(orders);
                    const tHeader = ['订单ID', '订单状态', '紧急程度', '设备序列号',
                        '订单创建时间', '订单详情', '公司ID', '用户ID', '维修人员ID'];
                    const filterVal = ['orderId', 'orderStatus', 'urgencyLevel', 'deviceId',
                        'createdAt', 'orderDetail', 'companyId', 'userId', 'maintenancePersonnelId'];
                    const data = formatJson(filterVal, orders);
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


        const statisticDialogVisible = ref(false);
        const statistics = () => {
            console.log("执行了Statistics函数");
            statisticDialogVisible.value = true;
            fetchStatistics();
        };
        const fetchStatistics = () => {
            fetch(`http://localhost:8080/admin/orders?pageNum=-1&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders,
            })
                .then(res => res.json())
                .then(res => {
                    console.log('Raw response:', res.data.list);
                    // 添加映射关系将标签转化为文字
                    const statusSet = new Set(res.data.list.map(item => item.orderStatus));
                    const data = Array.from(statusSet).map(status => ({
                        value: res.data.list.filter(item => item.orderStatus === status).length,
                        name: mapStatus(status),
                    }));
                    // 绘制饼状图
                    console.log(data)
                    drawPieChart(data);
                })
                .catch(error => {
                    console.error('获取统计数据失败:', error);
                });
        };
        const mapStatus = (status) => {
            const statusMap = {
                'accepted': '已接单',
                'pending': '待接单',
                'completed': '已结束、待评价',
                'evaluated': '已评价',
                null: '未知',
            };
            return statusMap[status] || '';
        };

        const drawPieChart = (data) => {
            console.log(data)
            // 使用 ECharts 绘制饼状图
            const chart = echarts.init(document.getElementById('chart'));
            const option = {
                title: {
                    text: '设备统计',
                    subtext: '设备状态数量',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: data.map(item => item.name), // 修改这里
                },
                series: [
                    {
                        name: '数量',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                    },
                ],
            };
            chart.setOption(option);
        };
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
            exportDialogVisible,
            statisticDialogVisible,
            sort,
            changeSort,
            exportAllOrders,
            clickExport,
            formatJson,
            updateOrder,
            handleEdit,
            fetchOrder,
            handleSizeChange,
            handleCurrentChange,
            formatDate,
            statistics,
        };
    },
};
</script>
  
<style></style>
  
