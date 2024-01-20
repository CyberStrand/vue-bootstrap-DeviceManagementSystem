<template>
    <el-container style="min-height: 100vh">
        <el-container>
            <el-main>

                <!-- 导出 -->
                <el-button type="success" @click="exportAllPersonnels"><el-icon>
                        <Promotion />
                    </el-icon>&nbsp;导出</el-button>
                <!-- 打印 -->
                <el-button v-print="'#printArea'" type="success"> <el-icon>
                        <Printer />
                    </el-icon>打印
                </el-button>
                <!--数据表-->
                <el-table id="printArea" :data="tableData">
                    <el-table-column prop="score" label="评分" :sortable="true" />
                    <el-table-column prop="userId" label="维修人员ID" />
                    <el-table-column prop="username" label="维修人员名称" />
                    <el-table-column prop="phoneNumber" label="电话" />
                    <el-table-column prop="email" label="电子邮件" />
                    <el-table-column prop="companyId" label="公司ID" />
                </el-table>
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
    'Authorization': "Bearer " + localStorage.getItem("token") // Replace with your actual JWT token
};
export default {
    name: 'rank',
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
            { value: '', label: '默认' },
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
            fetch(`http://localhost:8080/rank?pageNum=-1&pageSize=${pageSize.value}`, {
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
                    tableData.value = tableData.value.filter(user => user.userType === 'maintenance_personnel');
                    tableData.value = tableData.value.sort((a, b) => a.score - b.score)
                    total.value = res.data.total;
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
        const clickExport = () => {
            exportDialogVisible.value = true;
        };
        const exportDialogVisible = ref(false);
        const exportAllPersonnels = () => {
            console.log("执行了exportAllPersonnel函数");
            fetch(`http://localhost:8080/rank?pageNum=-1&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify({
                    "pageNum": pageNum.value,
                    "pageSize": pageSize.value,
                })
            })
                .then(res => res.json())
                .then(res => {
                    const personnels = ref(null)
                    personnels.value = res.data.list;
                    personnels.value = personnels.value.filter(user => user.userType === 'maintenance_personnel')
                    console.log(personnels.value);
                    const tHeader = ['用户ID', '用户名', '电话', '电子邮件',
                        '评分', '公司ID', '用户类型'];
                    const filterVal = ['userId', 'username', 'phoneNumber', 'email', 'score', 'companyId', 'userType'];
                    const data = formatJson(filterVal, personnels.value);
                    export_json_to_excel(tHeader, data, '所有人员');
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
            fetch(`http://localhost:8080/admin/users?pageNum=-1&pageSize=${pageSize.value}`, {
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
                    text: '人员统计',
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
            exportDialogVisible,
            statisticDialogVisible,
            exportAllPersonnels,
            clickExport,
            formatJson,
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
            statistics,
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