<template>
  <h2>待办事项</h2>
  <hr>
  <el-container style="min-height: 100vh">
    <el-container>
      <el-main>
        <!--选择栏-->
        <div class="search-bar">
          <el-button style="float:left" type="warning" @click="openDialog"><el-icon><CirclePlus /></el-icon>&nbsp;新增</el-button>
          <el-button style="float:left" type="success" @click="printBox"><el-icon><Printer /></el-icon>&nbsp;打印</el-button>
          <el-button style="float:left" type="info" @click="printBox"><el-icon><Promotion /></el-icon>&nbsp;导出</el-button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button style="float:right" type="primary" @click="query"><el-icon><Search /></el-icon>&nbsp;查询</el-button>
          <el-select style="float:right" class="search-input" v-model="todoStatus" placeholder="状态">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>

        </div>

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
              <el-button size="mini" type="primary" @click="handleEdit(scope.row.todoId)"><el-icon><EditPen /></el-icon>&nbsp;修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.todoId)"><el-icon><DeleteFilled /></el-icon>&nbsp;删除</el-button>
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


        <el-dialog
            title="新增代办实现"
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

        <el-dialog
            title="编辑"
            v-model="EditDialogVisible"
            width="30%"
            :before-close="handleClose"
        >
          <el-form :model="formData" ref="formDataRef" label-width="80px">
            <el-form-item label="待办内容" prop="todoContent">
              <el-input v-model="formData.todoContent"></el-input>
            </el-form-item>
            <el-form-item label="待办事项状态" prop="todoStatus">
              <el-input v-model="formData.todoStatus"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateDevice">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {ref, onMounted, toRaw} from 'vue';
import print from 'print-js'
const apiHeaders = {
  'Content-Type': 'application/json',
  'Authorization': "Bearer "+localStorage.getItem("token") // Replace with your actual JWT token
};
export default {
  name: 'OrdinaryUserTodo',
  setup(props, { root }) {
    const dialogVisible = ref(false);
    const tableData = ref([]);
    const total = ref(0);
    const pageNum = ref(1);
    const pageSize = ref(5);
    const todoStatus = ref('');
    const ownerId = ref(24);
    const todoId = ref(null);
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
    });

    const handleSizeChange = (pagesize) => {
      pageSize.value = pagesize;
      fetchDevice();
    };//修改每一页展示的记录数目
    const handleCurrentChange = (pagenum) => {
      pageNum.value = pagenum;
      fetchDevice();
    };//修改页码
    const fetchDevice = () => {
      console.log("开始获取数据")
      console.log(apiHeaders)
      fetch('http://localhost:8080/ordinaryUser/todos', {
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
    };//（查）
    const query = () => {
      fetch(`http://localhost:8080/ordinaryUser/todosSelect`, {
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
    };//根据设备状态查询设备信息（查）
    const handleDelete = (todoId) => {
      fetch(`http://localhost:8080/ordinaryUser/todo?todoId=${todoId}`, {
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
    const handleEdit =(todo_id) =>{
      EditDialogVisible.value = true;
      todoId.value = todo_id;
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
      fetch("http://localhost:8080/ordinaryUser/todoModify",{
        method:'POST',
        headers:apiHeaders,
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
    const updateDevice = () =>{
      formData.value.todoId = todoId.value;
      console.log(formData.value)
      console.log(toRaw(formData.value))
      fetch("http://localhost:8080/ordinaryUser/todo",{
        method:'PUT',
        headers:apiHeaders,
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
        'done': '已完成',
        'undone': '未完成',
      };
      return statusMap[status] || '';
    };
    const getStatusColor = (status) => {
      if(status==='undone')return '#ff7b7b'
      else if(status==='done')return '#5b952a'
    };
    const printBox = () => {
      setTimeout(() => {
        // 在这里使用 this.$print
        print({
          printable: '1',
          type: 'html',
          scanStyles: false,
          targetStyles: ['*']
        });
      }, 500);
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
      todoStatus,
      ownerId,
      options,
      inputStyle,
      formData,
      todoId,
      EditDialogVisible,
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
      saveData,
      printBox,

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

.el-table th, .el-table td {
  text-align: center;
}

.el-dialog {
  overflow-y: auto;
}

.error-status {
  color: #ff7b7b; /* Light red */
}
h2{
  color: rgb(64, 158, 255);
}
</style>