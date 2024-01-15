<template>
    <el-container style="min-height: 100vh">
        <el-container>
            <el-main>
                <!--选择栏-->
                <div class="search-bar">
                    <el-input class="search-input" v-model="userName4search" placeholder="用户名"></el-input>
                    <el-button type="primary" @click="fetchLog">查询</el-button>
                    <!-- 导出 -->
                    <el-button type="success" @click="exportAllLog"><el-icon>
                            <Promotion />
                        </el-icon>&nbsp;导出</el-button>
                    <!-- 打印 -->
                    <el-button v-print="'#printArea'" type="success"> <el-icon>
                            <Printer />
                        </el-icon>打印</el-button>
                    <!-- 统计 -->
                    <el-button type="success" @click="statistics"><el-icon>
                            <PieChart />
                        </el-icon>&nbsp;统计</el-button>
                </div>


                <!--数据表-->
                <el-table id="printArea" :data="tableData" style="width: 100%">
                    <el-table-column fixed prop="loginLogId" label="日志ID" width="80" />
                    <el-table-column prop="userId" label="用户ID" width="80" />
                    <el-table-column prop="userName" label="用户名" width="100" />
                    <el-table-column prop="loginTime" label="登陆时间" width="100" />
                    <el-table-column prop="userType" label="用户类型" width="100">
                        <template v-slot="scope">
                            <span>{{ getUserTypeLabel(scope.row.userType) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作">
                        <template v-slot="scope">
                            <el-button size="mini" type="primary" @click="handleEdit(scope.row.loginLogId)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.row.loginLogId)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--分页栏-->
                <div class="pagination-bar">
                    <el-pagination v-model="pageNum" :page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>

                <!--编辑设备对话框-->
                <el-dialog title="编辑日志" v-model="EditDialogVisible" width="30%" :before-close="handleClose">
                    <el-form :model="formData" ref="formDataRef" label-width="80px">
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="formData.userName"></el-input>
                        </el-form-item>
                        <el-form-item label="用户类别" prop="useType">
                            <el-select v-model="formData.userType">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="updateLog">修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>

                <!-- 导出设备 -->
                <el-dialog title="导出人员" v-model="exportDialogVisible" width="30%" :before-close="handleClose">
                    <el-button type="primary" @click="exportAllPersonnels"> &nbsp;导出</el-button>
                </el-dialog>
                <el-dialog title="统计人员" v-model="statisticDialogVisible" width="50%" :before-close="handleClose">
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
    name: 'AdminLog',
    methods: {
    },

    setup() {
        const dialogVisible = ref(false);
        const tableData = ref([]);
        const total = ref(0);
        const pageNum = ref(1);
        const pageSize = ref(5);
        const inputStyle = ref({ 'font-size': '11px' });
        const EditDialogVisible = ref(false);
        const formData = ref({
            loginLogId: '',
            userId: 11,
            userName: '',
            userType: '',
            loginTime: '',
        });
        const userName4search = ref(null);
        const options = ref([
            { value: '', label: '默认' },
            { value: 'ordinary', label: '普通用户' },
            { value: 'admin', label: '平台管理员' },
            { value: 'company_manager', label: '公司管理员' },
            { value: 'maintenance_personnel', label: '维修人员' },
        ]);
        const handleSizeChange = (pagesize) => {
            pageSize.value = pagesize;
            fetchLog();
        };//修改每一页展示的记录数目
        const handleCurrentChange = (pagenum) => {
            pageNum.value = pagenum;
            fetchLog();
        };
        const fetchLog = () => {
            fetch(`http://localhost:8080/loginLog?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders
            })
                .then(res => res.json())
                .then(res => {
                    tableData.value = res.data.list;
                    total.value = res.data.total;
                    console.log(tableData.value)
                    if (userName4search.value) {
                        tableData.value = tableData.value.filter(log => log.userName.includes(userName4search.value));
                        console.log('查询后结果：')
                        console.log(tableData.value)
                    }
                })
                .catch(error => {
                    console.error('获取数据失败:', error);
                });
        };
        const getUserTypeLabel = (status) => {
            const statusMap = {
                'ordinary': '普通用户',
                'admin': '平台管理员',
                'company_manager': '公司管理员',
                'maintenance_personnel': '维修人员',
            };
            return statusMap[status] || '';
        };
        const openDialog = () => {
            dialogVisible.value = true;
        };

        const handleDelete = (logId) => {
            console.log(logId)
            fetch(`http://localhost:8080/loginLog/id`, {
                method: 'DELETE',
                headers: apiHeaders,
                body: JSON.stringify({
                    'id': logId,
                })
            })
                .then(response => {
                    if (response.ok) {
                        console.log('删除成功');
                        console.log(response)
                        fetchLog();
                    } else {
                        console.error(`删除失败: ${response.status} - ${response.statusText}`);
                    }
                })
                .catch(error => {
                    console.error('删除失败', error.message);
                });
        };

        const logId4Edit = ref(null);
        const handleEdit = (logId) => {
            EditDialogVisible.value = true;
            logId4Edit.value = logId;
        };


        const updateLog = () => {
            formData.value.loginLogId = logId4Edit.value;
            console.log(formData.value)
            console.log(toRaw(formData.value))
            fetch("http://localhost:8080/loginLog", {
                method: 'PUT',
                headers: apiHeaders,
                body: JSON.stringify(formData.value)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response from server:', data);
                    EditDialogVisible.value = false;// 关闭对话框
                    fetchLog();//自动刷新
                })
                .catch(error => {
                    console.error('Error during data submission:', error);
                });
        };

        const exportAllLog = () => {
            console.log("执行了exportAllLog函数");
            fetch(`http://localhost:8080/loginLog?pageNum=-1&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders,
            })
                .then(res => res.json())
                .then(res => {
                    const logs = res.data.list;
                    console.log(logs);
                    const tHeader = ['日志ID', '用户ID', '用户名', '用户类型', '登录时间'];
                    const filterVal = ['loginLogId', 'userId', 'userName', 'userType', 'loginTime'];
                    const data = formatJson(filterVal, logs);
                    export_json_to_excel(tHeader, data, '所有日志');
                });
        };

        const formatJson = (filterVal, jsonData) => {
            console.log("执行了formatJson函数");
            return jsonData.map(v => filterVal.map(j => v[j]));
        };

        const statisticDialogVisible = ref(false);
        const statistics = () => {
            console.log("执行了Statistics函数");
            statisticDialogVisible.value = true;
            fetchStatistics();
        };
        const fetchStatistics = () => {
            fetch(`http://localhost:8080/loginLog?pageNum=-1&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders,
            })
                .then(res => res.json())
                .then(res => {
                    console.log('Raw response:', res.data.list);
                    // 添加映射关系将标签转化为文字
                    const statusSet = new Set(res.data.list.map(item => item.userType));
                    const data = Array.from(statusSet).map(status => ({
                        value: res.data.list.filter(item => item.userType === status).length,
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
                'ordinary': '普通用户',
                'admin': '平台管理员',
                'company_manager': '公司管理员',
                'maintenance_personnel': '维修人员',
            };
            return statusMap[status] || '';
        };

        const drawPieChart = (data) => {
            console.log(data)
            // 使用 ECharts 绘制饼状图
            const chart = echarts.init(document.getElementById('chart'));
            const option = {
                title: {
                    text: '日志统计',
                    subtext: '数量',
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

        onMounted(() => {
            fetchLog();
        });

        return {
            pageSize,
            pageNum,
            tableData,
            total,
            dialogVisible,
            inputStyle,
            formData,
            EditDialogVisible,
            options,
            userName4search,
            statisticDialogVisible,
            statistics,
            exportAllLog,
            updateLog,
            handleEdit,
            handleDelete,
            fetchLog,
            getUserTypeLabel,
            handleSizeChange,
            handleCurrentChange,
            openDialog,
        };
    },
};
</script>
  
<style></style>
  