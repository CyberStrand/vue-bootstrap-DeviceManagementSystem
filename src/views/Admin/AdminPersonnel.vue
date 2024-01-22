<template>
    <h1>童柄魁</h1>
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

                <!-- 导出 -->
                <el-button type="success" @click="clickExport"><el-icon>
                        <Promotion />
                    </el-icon>&nbsp;导出</el-button>
                <!-- 打印 -->
                <el-button v-print="'#printArea'" type="success"> <el-icon>
                        <Printer />
                    </el-icon>打印</el-button>
                <!-- 排序 -->
                <el-button type="success" @click="changeSort"><el-icon>
                        <PieChart />
                    </el-icon>&nbsp;更改排序（用户ID）</el-button>
                <!-- 统计 -->
                <el-button type="success" @click="statistics"><el-icon>
                        <PieChart />
                    </el-icon>&nbsp;统计</el-button>
                <!--增加与批量删除-->
                <el-button type="primary" @click="openDialog">新增</el-button>

                <!--数据表-->
                <el-table id="printArea" :data="tableData" style="width: 100%">
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
            fetch(`http://localhost:8080/admin/users?pageNum=-1&pageSize=${pageSize.value}`, {
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
                    if (username.value) {
                        tableData.value = tableData.value.filter(personnel => {
                            return personnel.username && personnel.username.includes(username.value)
                        });
                        console.log('查询后结果：')
                        console.log(tableData.value)
                    };
                    if (userType.value) {
                        tableData.value = tableData.value.filter(personnel => {
                            return personnel.userType && personnel.userType.includes(userType.value)
                        });
                        console.log('查询后结果：')
                        console.log(tableData.value)
                    };
                    if (sort.value) {
                        tableData.value = tableData.value.sort((a, b) => a.userId - b.userId)
                    } else {
                        tableData.value = tableData.value.sort((a, b) => b.userId - a.userId)
                    }
                    total.value = tableData.value.length;
                    tableData.value = tableData.value.slice(startIndex, endIndex)
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
            fetch(`http://localhost:8080/admin/users?pageNum=-1&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders,
            })
                .then(res => res.json())
                .then(res => {
                    const personnels = res.data.list;
                    console.log(personnels);
                    const tHeader = ['用户ID', '用户名', '电话', '电子邮件',
                        '评分', '公司ID', '用户类型'];
                    const filterVal = ['userId', 'username', 'phoneNumber', 'email', 'score', 'companyId', 'userType'];
                    const data = formatJson(filterVal, personnels);
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

        const sort = ref(false)
        const changeSort = () => {
            if (sort.value) {
                sort.value = false
            } else {
                sort.value = true
            }
            console.log('改变了排序', sort.value)
            fetchPersonnel()
        }

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
            sort,
            changeSort,
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