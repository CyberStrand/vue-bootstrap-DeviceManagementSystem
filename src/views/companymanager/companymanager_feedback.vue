<template slot-scope="scope">
    <h1>田子奇</h1>
    <el-container style="min-height: 100vh">
        <el-container>
            <el-main>
                <!--选择栏-->
                <div class="search-bar">
                    <el-input type="text" class="search-input" v-model="feedbackContent" :style="inputStyle"
                        placeholder="反馈内容"></el-input>
                    <el-button type="primary" @click="fetchFeedback">查询</el-button>
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
                        </el-icon>&nbsp;更改排序（反馈ID）</el-button>
                </div>


                <!-- 数据表 -->
                <el-table id="printArea" :data="tableData" style="width: 100%">
                    <el-table-column fixed prop="feedbackId" label="反馈ID" width="80" />
                    <el-table-column fixed prop="userId" label="用户ID" width="80" />
                    <el-table-column prop="feedbackContent" label="反馈内容" width="100" />
                    <el-table-column fixed="right" label="操作">
                        <template v-slot="scope">
                            <el-button size="mini" type="danger" @click="handleDelete(scope.row.feedbackId)">删除</el-button>
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


const apiHeaders = {
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + localStorage.getItem("token") // Replace with your actual JWT token
};
export default {
    name: 'AdminCompany',
    setup() {
        const dialogVisible = ref(false);
        const tableData = ref([]);
        const total = ref(0);
        const pageNum = ref(1);
        const pageSize = ref(5);
        const feedbackContent = ref(null);
        const inputStyle = ref({ 'font-size': '11px' });
        const handleSizeChange = (pagesize) => {
            pageSize.value = pagesize;
            fetchFeedback();
        };//修改每一页展示的记录数目
        const handleCurrentChange = (pagenum) => {
            pageNum.value = pagenum;
            fetchFeedback();
        };
        const fetchFeedback = () => {
            fetch(`http://localhost:8080/company/feedbacks?pageNum=-1&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    tableData.value = res.data.list;
                    const startIndex = (pageNum.value - 1) * pageSize.value
                    const endIndex = pageNum.value * pageSize.value
                    if (feedbackContent.value) {
                        tableData.value = tableData.value.filter(feedback => {
                            return feedback.feedbackContent && feedback.feedbackContent.includes(feedbackContent.value);
                        });
                        console.log('查询后结果：')
                        console.log(tableData.value)
                    }
                    if (sort.value) {
                        tableData.value = tableData.value.sort((a, b) => a.feedbackId - b.feedbackId)
                    } else {
                        tableData.value = tableData.value.sort((a, b) => b.feedbackId - a.feedbackId)
                    }
                    total.value = tableData.value.length;
                    tableData.value = tableData.value.slice(startIndex, endIndex)
                })
                .catch(error => {
                    console.error('获取数据失败:', error);
                });
        };//获取公司信息（查）
        const handleDelete = (feedbackId) => {
            fetch(`http://localhost:8080/company/feedbacks`, {
                method: 'DELETE',
                headers: apiHeaders,
                body: JSON.stringify({
                    "feedbackId": feedbackId,
                })
            })
                .then(response => {
                    if (response.ok) {
                        console.log('删除成功');
                        fetchFeedback();
                    } else {
                        console.error(`删除失败: ${response.status} - ${response.statusText}`);
                    }
                })
                .catch(error => {
                    console.error('删除失败', error.message);
                });

        };
        const formatJson = (filterVal, jsonData) => {
            console.log("执行了formatJson函数");
            return jsonData.map(v => filterVal.map(j => v[j]));
        };
        const clickExport = () => {
            console.log("clickExport");
            fetch(`http://localhost:8080/company/feedbacks?pageNum=-1&pageSize=${pageSize.value}`, {
                method: 'POST',
                headers: apiHeaders
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    const feedbacks = res.data.list;
                    console.log(feedbacks);
                    console.log(typeof feedbacks)
                    const tHeader = ['反馈ID', '用户ID', '反馈内容'];
                    const filterVal = ['feedbackId', 'userId', 'feedbackContent'];
                    const data = formatJson(filterVal, feedbacks);
                    export_json_to_excel(tHeader, data, '所有反馈');
                });
        };
        const sort = ref(false)
        const changeSort = () => {
            if (sort.value) {
                sort.value = false
            } else {
                sort.value = true
            }
            console.log('改变了排序', sort.value)
            fetchFeedback()
        }

        onMounted(() => {
            fetchFeedback();
        });

        return {
            tableData,
            total,
            pageNum,
            pageSize,
            inputStyle,
            feedbackContent,
            sort,
            changeSort,
            clickExport,
            fetchFeedback,
            handleSizeChange,
            handleCurrentChange,
            handleDelete,
            formatJson,
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