<template>
  <h2>待办事项</h2>
  <hr>
  <el-container style="min-height: 100vh">
    <el-container>
      <el-main>
        <!--选择栏-->
        <div class="search-bar">
          <el-button style="float:left" type="warning" @click="fetchDevice"><el-icon><CirclePlus /></el-icon>&nbsp正序查询所有</el-button>
          <el-button style="float:left" type="success" @click="openDialog"><el-icon><CirclePlus /></el-icon>&nbsp;新增</el-button>
          <el-button style="float:left" type="success" @click="printBox"><el-icon><Printer /></el-icon>&nbsp;打印</el-button>
          <el-button style="float:left" type="success" @click="clickExport"><el-icon><Promotion /></el-icon>&nbsp;导出</el-button>
          <el-button style="float:left" type="success" @click="statistics"><el-icon><PieChart /></el-icon>&nbsp;统计</el-button>
          <el-button style="float:left" type="info" @click="SortDown"><el-icon><SortDown /></el-icon>&nbsp;倒序查看</el-button>
          <el-button style="float:right" type="primary" @click="queryTodo"><el-icon><Search /></el-icon>&nbsp;查询</el-button>
          <el-select style="float:right" class="search-input" v-model="todoStatus" placeholder="状态">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <br>
        <hr>
        <!--数据表-->
        <div id="1">
          <el-table :data="tableData"
                    :default-sort="{ prop: 'todoId', order:'ascending' }"
                    style="width: 100%">
            <el-table-column type="index" label="序列号" width="80" />

            <el-table-column  prop="todoContent" label="待办事项" width="565"/>
            <el-table-column prop="todoStatus" label="状态" width="100">
              <template v-slot="scope">
                <span :style="{ color: getStatusColor(scope.row.todoStatus) }">{{ getStatusLabel(scope.row.todoStatus) }}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button size="small" type="primary" @click="handleEdit(scope.row)"><el-icon><EditPen /></el-icon>修改</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row.todoId)"><el-icon><DeleteFilled /></el-icon>&nbsp;删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页栏-->
        <div class="pagination-bar">
          <el-pagination
              v-model="pageNum"
              :page-size="pageSize"
              :page-sizes="[5, 10, 15, 20]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </div>
        <el-dialog title="新增待办事项"
                   v-model="dialogVisible"
                   width="30%"
                   :before-close="handleClose"
        >
          <el-form :model="formData" ref="formDataRef" label-width="80px">
            <el-form-item label="待办内容" prop="todoContent">
              <el-input v-model="formData.todoContent"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveData">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog title="编辑待办事项"
                   v-model="EditDialogVisible"
                   width="30%"
                   :before-close="handleClose"
        >
          <el-form :model="formData" ref="formDataRef" label-width="80px">
            <el-form-item label="待办内容" prop="todoContent">
              <el-input v-model="formData.todoContent"></el-input>
            </el-form-item>
            <el-form-item label="已完成？">
              <el-switch v-model="formData.todoBoolStatus" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateDevice">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog title="导出待办事项"
                   v-model="exportDialogVisible"
                   width="30%"
                   :before-close="handleClose">
          <el-switch
              v-model="exportAll"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              active-text="导出所有"
              inactive-text="导出当前"
          />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button type="primary" @click="exportTodoList"> &nbsp;导出</el-button>
        </el-dialog>
        <el-dialog title="统计待办事项"
                   v-model="statisticDialogVisible"
                   width="50%"
                   :before-close="handleClose">
          &nbsp; <div id="chart" style="height: 300px;"></div>
        </el-dialog>
        <div style="text-align: left;">
          【已实现】：增、删、查、改、导、印、统、序<br>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {ref, onMounted, toRaw} from 'vue';
import print from 'print-js'
import {export_json_to_excel} from "@/vendor/Export2Excel";
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
import * as echarts from 'echarts'
const apiHeaders = {
  'Content-Type': 'application/json',
  'Authorization': "Bearer "+localStorage.getItem("token") // Replace with your actual JWT token
};
export default {
  name: 'OrdinaryUserTodo',
  components: {EditPen, Promotion, SortUp, Search, SortDown, DeleteFilled, PieChart, Printer, CirclePlus},
  setup() {
    const dialogVisible = ref(false);
    const exportDialogVisible = ref(false);
    const statisticDialogVisible = ref(false);
    const tableData = ref([]);
    const total = ref(0);
    const pageNum = ref(1);
    const pageSize = ref(5);
    const todoStatus = ref(null);
    const ownerId = ref(24);
    const todoId = ref(null);
    const exportAll = ref(true);
    const sortDownStatus = ref(false);
    const options = ref([
      { value: 'done', label: '已完成' },
      { value: 'undone', label: '未完成' },
    ]);
    const inputStyle = ref({ 'font-size': '11px' });
    const EditDialogVisible = ref(false);
    const formData = ref({
      user_id:1054,
      todoContent:'',
      todoStatus:'undone',
      todoBoolStatus:false,
    });
    const handleSizeChange = (page_size) => {
      console.log("执行了handleSizeChange函数");
      pageSize.value = page_size;
      fetchTodo();
    };//修改每一页展示的记录数目
    const handleCurrentChange = (page_num) => {
      console.log("执行了handleCurrentChange函数");
      pageNum.value = page_num;
      fetchTodo();
    };//修改页码
    const fetchTodo = () =>{
      console.log("执行了fetchTodo函数");
      if( sortDownStatus.value===true){
        console.log("当前处于倒序查看的状态中")
        SortDown();
      }
      else {
        if (todoStatus.value==null){
          console.log("没有进行条件查询，查询所有函数")
          fetch(`http://localhost:8080/maintenancePersonnel/todos?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
            method: 'POST',
            headers: apiHeaders,
          })
              .then(res => res.json())
              .then(res => {
                tableData.value = res.data.list;
                total.value = res.data.total;
              })
              .catch(error => {
                console.error('获取数据失败:', error);
              });
        }
        else{
          console.log("在条件查询")
          console.log(todoStatus)
          fetch(`http://localhost:8080/maintenancePersonnel/todoSelect`, {
            method: 'POST',
            headers: apiHeaders,
            body: JSON.stringify({
              "todoStatus": todoStatus.value,
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
        }
      }
    };
    const queryTodo = () =>{
      sortDownStatus.value = false;
      fetchTodo();
    }
    const fetchDevice = () => {
      todoStatus.value = null;
      sortDownStatus.value = false;
      console.log("执行了fetchDevice函数");
      fetch(`http://localhost:8080/maintenancePersonnel/todos?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            tableData.value = res.data.list;
            total.value = res.data.total;
          })
          .catch(error => {
            console.error('获取数据失败:', error);
          });
    };//（查）
    const handleDelete = (todoId) => {
      console.log("执行了handleDelete函数");
      fetch(`http://localhost:8080/maintenancePersonnel/todo?todoId=${todoId}`, {
        method: 'DELETE',
        headers: apiHeaders,
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
    const handleEdit = (row) => {
      console.log("执行了handleEdit函数");
      EditDialogVisible.value = true;
      todoId.value = row.todoId;
      formData.value.todoContent = row.todoContent;
      formData.value.todoStatus = row.todoStatus;
      formData.value.todoBoolStatus = formData.value.todoStatus === "done";
    };
    const openDialog = () => {
      console.log("执行了openDialog函数");
      dialogVisible.value = true;
    };//打开添加设备对话框
    const handleClose = (done) => {
      console.log("执行了handleClose函数");
      done();
    };//关闭添加设备对话框
    const saveData = () => {
      console.log("执行力saveData函数")
      console.log(formData.value)
      console.log(toRaw(formData.value))
      fetch("http://localhost:8080/maintenancePersonnel/todoModify", {
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
    };//保存添加设备对话框中的数据
    const updateDevice = () => {
      EditDialogVisible.value = false;
      console.log("执行了updateDevice函数");
      formData.value.todoId = todoId.value;
      console.log(formData.value.todoBoolStatus);
      if (formData.value.todoBoolStatus) formData.value.todoStatus = 'done'
      else formData.value.todoStatus = 'undone'
      console.log(formData.value)

      fetch("http://localhost:8080/maintenancePersonnel/todo", {
        method: 'PUT',
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
    }
    const getStatusLabel = (status) => {
      //console.log("执行了getStatusLabel函数");
      const statusMap = {
        'done': '已完成',
        'undone': '未完成',
      };
      return statusMap[status] || '';
    };
    const getStatusColor = (status) => {
      // console.log("执行了getStatusColor函数");
      if (status === 'undone') return '#ff7b7b'
      else if (status === 'done') return '#5b952a'
    };
    const printBox = () => {
      console.log("执行了printBox函数");
      setTimeout(() => {
        // 在这里使用 this.$print
        print({
          printable: '1',
          type: 'html',
          scanStyles: false,
          targetStyles: ['*']
        });
      }, 500);
    };//打印当页的数据
    const clickExport = () => {
      exportDialogVisible.value = true;
    };//弹出导出的对话框
    const exportTodoList = () => {
      if (exportAll.value === true) exportAllTodo();
      else if (exportAll.value === false) exportTodo();
    } //选择导出什么数据
    const exportTodo = () => {
      console.log("执行了exportTodo函数");
      fetch(`http://localhost:8080/maintenancePersonnel/todos?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            const todoList = res.data.list;
            console.log(res.data.list);
            const tHeader = ['待办内容', '状态'];
            const filterVal = ['todoContent', 'todoStatus'];
            const data = formatJson(filterVal, todoList);
            export_json_to_excel(tHeader, data, '本页待办事项');
          });
    };//导出当页的数据
    const exportAllTodo = () => {
      console.log("执行了exportAllTodo函数");
      fetch(`http://localhost:8080/maintenancePersonnel/allTodos`, {
        method: 'GET',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            console.log(res);
            const todoList = res.data;
            console.log(res.data);
            const tHeader = ['待办内容', '状态'];
            const filterVal = ['todoContent', 'todoStatus'];
            const data = formatJson(filterVal, todoList);
            export_json_to_excel(tHeader, data, '所有待办事项');
          });
    };//导出所有的数据
    const formatJson = (filterVal, jsonData) => {
      console.log("执行了formatJson函数");
      return jsonData.map(v => filterVal.map(j => v[j]));
    };
    const SortDown = () => {
      todoStatus.value = null;
      sortDownStatus.value = true;
      console.log("执行了SortDown函数");
      fetch(`http://localhost:8080/maintenancePersonnel/sortdown?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            tableData.value = res.data.list;
            total.value = res.data.total;
          })
          .catch(error => {
            console.error('获取数据失败:', error);
          });
    };
    const statistics = () => {
      console.log("执行了Statistics函数");
      statisticDialogVisible.value = true;
      fetchStatistics();
    };
    const fetchStatistics = () => {
      fetch(`http://localhost:8080/maintenancePersonnel/statistic`, {
        method: 'GET',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            console.log('Raw response:', res);

            // 添加映射关系将标签转化为文字
            const data = res.data.map(item => ({value: item.count, name: mapStatus(item.todo_status)}));

            // 绘制饼状图
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
      // 使用 ECharts 绘制饼状图
      const chart = echarts.init(document.getElementById('chart'));
      const option = {
        title: {
          text: '待办事项统计',
          subtext: '已完成和未完成数量',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: data.map(item => item.name),
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
      console.log("执行了onMounted函数");
      fetchDevice();
    });
    return {
      dialogVisible,
      tableData,
      total,
      pageNum,
      pageSize,
      todoStatus,
      ownerId,
      options,
      inputStyle,
      formData,
      todoId,
      EditDialogVisible,
      exportDialogVisible,
      statisticDialogVisible,
      exportAll,
      sortDownStatus,
      getStatusColor,
      getStatusLabel,
      updateDevice,
      handleEdit,
      openDialog,
      fetchDevice,
      fetchTodo,
      handleSizeChange,
      handleCurrentChange,
      handleDelete,
      handleClose,
      saveData,
      printBox,
      SortDown,
      exportTodo,
      formatJson,
      statistics,
      exportAllTodo,
      clickExport,
      exportTodoList,
      queryTodo,
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

.pagination-bar {
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
}

.el-table th, .el-table td {
  text-align: center;
}

h2 {
  color: rgb(64, 158, 255);
}
</style>