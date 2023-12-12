<template>
  <el-container style="min-height: 100vh">
    <el-container>
      <el-main>
        <!--选择栏-->
        <div style="padding: 10px 0">
          接收时间：<el-input style="width:100px" placeholder="查找信息时间" :style="inputStyle" v-model="sendTime"></el-input>
          消息内容：<el-input style="width:100px" placeholder="查找信息内容" :style="inputStyle" v-model="messageContent"></el-input>
          阅读状态：
          <el-select placeholder="选择信息状态" :style="inputStyle"  style="width:150px" v-model="readStatus">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button type="primary" @click="query">查询</el-button>
        </div>

        <!--数据表-->
        <el-table :data="tableData"
                  :default-sort="{ prop: 'messageId', order: 'descending' }"
                  style="width: 100%">
          <el-table-column prop="messageId" label="序号" width="100"/>
          <el-table-column fixed prop="sendTime" label="发送时间" width="100">
            <template v-slot="scope">
              {{ formatDate(scope.row.sendTime) }}
           </template>
          </el-table-column>
          <el-table-column prop="readStatus" label="阅读状态" width="100"/>
          <el-table-column prop="messageContent" label="消息内容" width="480"/>
          <el-table-column fixed="right" label="操作">
            <template v-slot="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row.messageId)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.messageId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页栏-->
        <div class="demo-pagination-block">
          <div class="demonstration"></div>
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

        <!--编辑消息状态的对话框-->
        <el-dialog
        title="修改消息状态"
        v-model="EditDialogVisible"
        width="30%"
        :before-close="handleClose"
        @close="resetFormData"
        >
        <el-form :model="formData" ref="formDataRef" label-width="80px">
          <el-form-item label="消息状态" prop="readStatus">
            <el-select v-model="formData.readStatus" placeholder="请选择消息状态">
              <el-option
                  v-for="option in options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateMessage">修改</el-button>
          </el-form-item>
        </el-form>
        </el-dialog>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {ref, onMounted, toRaw} from 'vue';
const apiHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb21wYW55SWQiOi0xLCJ1c2VyVHlwZSI6Im9yZGluYXJ5IiwiZXhwIjoxNzAyMzkzMjQ0LCJ1c2VySWQiOjI0fQ.PF_vGNZJ4FyWYyseFUTAYFeJ5jy7b1bkSTUvsM0hm4g'
};
export default {
  name: 'OrdinaryUserDevices',
  setup() {
    const messageId = ref(null);
    const receiverId = ref(24);
    const dialogVisible = ref(false);
    const tableData = ref([]);
    const total = ref(0);
    const pageNum = ref(1);
    const pageSize = ref(5);
    const readStatus = ref('');
    const ownerId = ref(12);
    const options = ref([
      {value: 'unread', label: '未读'},
      {value: 'read', label: '已读'},
    ]);
    const inputStyle = ref({'font-size': '11px'});
    const EditDialogVisible = ref(false);
    const formData = ref({
      messageId:null,
      receiverId:null,
      readStatus:'',
      messageContent:'',
      sendTime:''
    });
    const formatDate = (dateString) => {
      const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
      return new Date(dateString).toLocaleDateString(undefined, options);
    };//重定义时间表达格式
    const handleSizeChange = (pagesize) => {
      pageSize.value = pagesize;
      fetchMessage();
    };//修改每一页展示的记录数目
    const handleCurrentChange = (pagenum) => {
      pageNum.value = pagenum;
      fetchMessage();
    };//修改页码
    const fetchMessage = () => {
      fetch('http://localhost:8081/ordinaryUser/message', {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify({
          "pageNum": pageNum.value,
          "pageSize": pageSize.value,
          "receiverId":receiverId.value,
        })
      })
          .then(res => res.json())
          .then(res => {
            console.log(res);
            tableData.value = res.data.list;
            total.value = res.data.total;
          })
          .catch(error => {
            console.error('获取数据失败:', error);
          });
    };//获取所有消息消息（查）
    const query = () => {
      fetch(`http://localhost:8081/ordinaryUser/messageSelect`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify({
          "readStatus": readStatus.value,
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
    };//根据消息状态(已读/未读)查询消息（查）
    const handleDelete = (messageId) => {
      console.log(messageId);
      fetch(`http://localhost:8081/ordinaryUser/message?messageId=${messageId}`, {
        method: 'DELETE',
        headers: apiHeaders,
      })
          .then(response => {
            if (response.ok) {
              console.log('删除成功');
              fetchMessage();
            } else {
              console.error(`删除失败: ${response.status} - ${response.statusText}`);
            }
          })
          .catch(error => {
            console.error('删除失败', error.message);
          });
    };//删除消息（删）
    const handleEdit = (message_id) => {
      EditDialogVisible.value = true;
      messageId.value = message_id;
    };
    const updateMessage = () => {
      const requestBody = {
        messageId:messageId.value,
        readStatus:formData.value.readStatus,
      }
      console.log(requestBody)
      fetch("http://localhost:8081/ordinaryUser/message", {
        method: 'PUT',
        headers: apiHeaders,
        body: JSON.stringify(requestBody)
      })
          .then(response => response.json())
          .then(data => {
            console.log('Response from server:', data);
            dialogVisible.value = false;// 关闭对话框
            fetchMessage();//自动刷新
          })
          .catch(error => {
            console.error('Error during data submission:', error);
          });
    }//更新消息状态(改)
    onMounted(() => {
      fetchMessage();
    });

    return {
      dialogVisible,
      tableData,
      total,
      pageNum,
      pageSize,
      readStatus,
      ownerId,
      options,
      inputStyle,
      formData,
      updateMessage,
      handleEdit,
      fetchMessage,
      handleSizeChange,
      handleCurrentChange,
      handleDelete,
      query,
      formatDate,
      EditDialogVisible,
    };
  },
};
</script>

<style>
</style>
