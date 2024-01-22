<template>
    <h1>徐洋</h1>
    <el-container style="min-height: 100vh">
        <el-container>
            <el-main>
                <!--选择栏-->
                <el-input class="search-input" v-model="todoContent4search" placeholder="待办内容"></el-input>
                <el-select class="search-input" v-model="todoStatus4search" placeholder="待办状态">
                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
                <div class="search-bar">
                    <el-button type="primary" @click="fetchTodo">查询</el-button>
                    <!-- 导出 -->
                    <el-button type="success" @click="exportAllTodo"><el-icon>
                            <Promotion />
                        </el-icon>&nbsp;导出</el-button>

                    <!-- 打印 -->
                    <el-button v-print="'#printArea'" type="success"> <el-icon>
                            <Printer />
                        </el-icon>打印</el-button>
                    <!-- 排序 -->
                    <el-button type="success" @click="changeSort"><el-icon>
                            <PieChart />
                        </el-icon>&nbsp;更改排序（待办ID）</el-button>
                    <!-- 统计 -->
                    <el-button type="success" @click="statistics"><el-icon>
                            <PieChart />
                        </el-icon>&nbsp;统计</el-button>
                    <el-button type="primary" @click="openDialog">新增</el-button>
                </div>
                <!-- 数据表 -->
                <el-table id="printArea" :data="tableData" style="width: 100%">
                    <el-table-column fixed prop="todoId" label="待办事项ID" width="80" />
                    <el-table-column prop="todoContent" label="待办内容" width="100" />
                    <el-table-column prop="todoStatus" label="待办状态" width="100">
                        <template v-slot="scope">
                            <span :style="{ color: getStatusColor(scope.row.todoStatus) }">{{
                                getStatusLabel(scope.row.todoStatus)
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作">
                        <template v-slot="scope">
                            <el-button size="mini" type="primary" @click="handleEdit(scope.row.todoId)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.row.todoId)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页栏-->
                <div class="pagination-bar">
                    <el-pagination v-model="pageNum" :page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>

                <!--添加待办对话框-->
                <el-dialog title="新增待办" v-model="dialogVisible" width="30%" :before-close="handleClose">
                    <el-form :model="formData" ref="formDataRef" label-width="80px">
                        <el-form-item label="待办内容" prop="todoContent">
                            <el-input v-model="formData.todoContent"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="saveData">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>

                <!--编辑待办对话框-->
                <el-dialog title="编辑待办" v-model="EditDialogVisible" width="30%" :before-close="handleClose">
                    <el-form :model="formData" ref="formDataRef" label-width="80px">
                        <el-form-item label="待办内容" prop="todoContent">
                            <el-input v-model="formData.todoContent"></el-input>
                        </el-form-item>
                        <el-form-item label="待办状态" prop="todoStatus">
                            <el-select v-model="formData.todoStatus">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="updateTodo">修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>

                <!-- 统计待办 -->
                <el-dialog title="统计待办" v-model="statisticDialogVisible" width="50%" :before-close="handleClose">
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
    name: 'AdminTodo',
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
            todoId: '',
            todoContent: '',
            todoStatus: '',
        });
        const todoContent4search = ref(null);
        const todoStatus4search = ref(null);
        const options = ref([
            { value: 'done', label: '已完成' },
            { value: 'undone', label: '未完成' },
        ]);
        const handleSizeChange = (pagesize) => {
            pageSize.value = pagesize;
            fetchTodo();
        };//修改每一页展示的记录数目
        const handleCurrentChange = (pagenum) => {
            pageNum.value = pagenum;
            fetchTodo();
        };
        const fetchTodo = () => {
            fetch(`http://localhost:8080/admin/todos?pageNum=-1&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders
            })
                .then(res => res.json())
                .then(res => {
                    tableData.value = res.data.list;
                    const startIndex = (pageNum.value - 1) * pageSize.value
                    const endIndex = pageNum.value * pageSize.value
                    if (todoContent4search.value) {
                        tableData.value = tableData.value.filter(todo => {
                            return todo.todoContent && todo.todoContent.includes(todoContent4search.value)
                        });
                        console.log('查询后结果：')
                        console.log(tableData.value)
                    }
                    console.log(todoStatus4search.value)
                    if (todoStatus4search.value) {
                        tableData.value = tableData.value.filter(todo => todo.todoStatus === todoStatus4search.value);
                        console.log('查询后结果：')
                        console.log(tableData.value)
                    }
                    if (sort.value) {
                        tableData.value = tableData.value.sort((a, b) => a.todoId - b.todoId)
                    } else {
                        tableData.value = tableData.value.sort((a, b) => b.todoId - a.todoId)
                    }
                    total.value = tableData.value.length;
                    tableData.value = tableData.value.slice(startIndex, endIndex)
                })
                .catch(error => {
                    console.error('获取数据失败:', error);
                });
        };
        const getStatusLabel = (status) => {
            const statusMap = {
                'done': '已完成',
                'undone': '未完成',
            };
            return statusMap[status] || '';
        };
        const getStatusColor = (status) => {
            if (status === 'undone') return '#ff7b7b'
            else if (status === 'done') return '#5b952a'
        };
        const openDialog = () => {
            dialogVisible.value = true;
        };//打开添加设备对话框

        const saveData = () => {
            console.log(formData.value)
            console.log(toRaw(formData.value))
            fetch("http://localhost:8080/admin/todo", {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify(formData.value)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response from server:', data);
                    dialogVisible.value = false;// 关闭对话框
                    fetchTodo();//自动刷新
                })
                .catch(error => {
                    console.error('Error during data submission:', error);
                });
        };

        const handleDelete = (todoId) => {
            console.log(todoId)
            fetch(`http://localhost:8080/admin/todo`, {
                method: 'DELETE',
                headers: apiHeaders,
                body: JSON.stringify({
                    'todoId': todoId,
                })
            })
                .then(response => {
                    if (response.ok) {
                        console.log('删除成功');
                        console.log(response)
                        fetchTodo();
                    } else {
                        console.error(`删除失败: ${response.status} - ${response.statusText}`);
                    }
                })
                .catch(error => {
                    console.error('删除失败', error.message);
                });
        };

        const todoId4Edit = ref(null);
        const handleEdit = (todoId) => {
            EditDialogVisible.value = true;
            todoId4Edit.value = todoId;
        };


        const updateTodo = () => {
            formData.value.todoId = todoId4Edit.value;
            console.log(formData.value)
            console.log(toRaw(formData.value))
            fetch("http://localhost:8080/admin/todo", {
                method: 'PUT',
                headers: apiHeaders,
                body: JSON.stringify(formData.value)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response from server:', data);
                    EditDialogVisible.value = false;// 关闭对话框
                    fetchTodo();//自动刷新
                })
                .catch(error => {
                    console.error('Error during data submission:', error);
                });
        };

        const exportAllTodo = () => {
            console.log("执行了exportAllTodo函数");
            fetch(`http://localhost:8080/admin/todos?pageNum=-1&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders,
            })
                .then(res => res.json())
                .then(res => {
                    const devices = res.data.list;
                    console.log(devices);
                    const tHeader = ['待办ID', '待办内容', '代办状态'];
                    const filterVal = ['todoId', 'todoContent', 'todoStatus'];
                    const data = formatJson(filterVal, devices);
                    export_json_to_excel(tHeader, data, '所有待办');
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
            fetch(`http://localhost:8080/admin/todos?pageNum=-1&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders,
            })
                .then(res => res.json())
                .then(res => {
                    console.log('Raw response:', res.data.list);
                    // 添加映射关系将标签转化为文字
                    const statusSet = new Set(res.data.list.map(item => item.todoStatus));
                    const data = Array.from(statusSet).map(status => ({
                        value: res.data.list.filter(item => item.todoStatus === status).length,
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
                'done': '已完成',
                'undone': '未完成',
            };
            return statusMap[status] || '';
        };

        const drawPieChart = (data) => {
            console.log(data)
            // 使用 ECharts 绘制饼状图
            const chart = echarts.init(document.getElementById('chart'));
            const option = {
                title: {
                    text: '待办统计',
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
            fetchTodo()
        }

        onMounted(() => {
            fetchTodo();
        });

        return {
            todoId4Edit,
            pageSize,
            pageNum,
            tableData,
            total,
            dialogVisible,
            inputStyle,
            formData,
            EditDialogVisible,
            options,
            todoContent4search,
            todoStatus4search,
            statisticDialogVisible,
            sort,
            changeSort,
            statistics,
            exportAllTodo,
            updateTodo,
            handleEdit,
            handleDelete,
            fetchTodo,
            getStatusLabel,
            getStatusColor,
            handleSizeChange,
            handleCurrentChange,
            openDialog,
            saveData,
        };
    },
};
</script>
  
<style></style>
  