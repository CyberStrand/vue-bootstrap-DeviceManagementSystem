<template>
  <el-container style="min-height: 100vh">
    <el-container>
      <el-main>
        <!--选择栏-->
        <div style="padding: 10px 0">
          订单号：<el-input style="width:100px" placeholder="请输入订单号" :style="inputStyle" v-model="orderId"></el-input>
          订单状态：
          <el-select placeholder="请选择订单状态" :style="inputStyle"  style="width:200px" v-model= "orderStatus" >
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button type="primary" @click="query">查询</el-button>
          <el-button type="danger" @click="openDialog">报修</el-button>
        </div>
        <!--数据表-->
        <el-table :data="tableData"
                  :default-sort="{ prop: 'purchaseDate', order: 'descending' }"
                  style="width: 100%">
          <el-table-column fixed prop="orderId" label="订单号" width="80"/>
          <el-table-column prop="maintenancePersonnelId" label="维修人员ID" width="100"/>
          <el-table-column prop="orderStatus" label="订单状态" width="100"/>
          <el-table-column prop="urgencyLevel" label="紧急程度" width="100"/>
          <el-table-column prop="deviceId" label="设备序列号" width="100"/>
          <el-table-column prop="createdAt" label="订单创建时间" width="100">
            <template v-slot="scope">
              {{ formatDate(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="orderDetail" label="订单详情" width="100"/>
          <el-table-column prop="locationId" label="设备地址" width="100"/>
          <el-table-column fixed="right" label="操作">
            <template v-slot="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row.orderId)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.orderId)">删除</el-button>
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
        <!--报修对话框-->
        <el-dialog
            title="报修"
            v-model="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
          <el-form :model="formData" ref="formDataRef" label-width="80px">
            <el-form-item label="设备ID" prop="deviceSerialNumber">
              <el-input v-model="formData.deviceSerialNumber"></el-input>
            </el-form-item>
            <el-form-item label="订单详情" palceholder= "请在此处描述设备的具体情况" prop="order_detail">
              <el-input v-model="formData.orderDetail"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveData">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!--编辑设备对话框-->
        <el-dialog
            title="修改信息"
            v-model="EditDialogVisible"
            width="30%"
            :before-close="handleClose"
            @close="resetFormData"
        >
          <el-form :model="formData" ref="formDataRef" label-width="80px">
       <!--     <el-form-item label="设备ID" palceholder= "请在此处修改要报修的设备" prop="deviceId">
              <el-input v-model="formData.deviceId"></el-input>
            </el-form-item>
            <el-form-item label="订单详情" palceholder= "请在此处修改描述设备的具体情况" prop="orderDetail">
              <el-input v-model="formData.orderDetail"></el-input>
            </el-form-item> -->
            <el-form-item label="加急" palceholder= "请在此处修改订单紧急状态" prop="urgencyLevel">
              <el-input v-model="formData.urgencyLevel"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateDevice">修改</el-button>
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
  'Authorization': "Bearer "+localStorage.getItem("token") // Replace with your actual JWT token
};

export default {
  name: 'OrdinaryUserDevices',
  setup() {
    const dialogVisible = ref(false);
    const tableData = ref([]);
    const total = ref(0);
    const pageNum = ref(1);
    const pageSize = ref(5);
    const orderStatus = ref('');
    const ownerId = ref(24);
    const orderId = ref(null);
    const options = ref([
      {value: 'accepted', label: '已结单'},
      {value: 'pending', label: '待接单'},
    ]);
    const inputStyle = ref({'font-size': '11px'});
    const EditDialogVisible = ref(false);
    const formData = ref({
      orderId: null,//自动创建
      userId: 24,
      maintenancePersonnelId: null,  //初始未分配为空
      companyId: null,        //初始未分配为空
      orderStatus: 'pending',//创建新订单默认未派单
      urgencyLevel:1,        //默认紧急程度最低
      deviceSerialNumber: '',
      createAt: '',
      orderDetail: '',
      locationId:null,//初始未分配为空
    });
    const formatDate = (dateString) => {
      const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
      return new Date(dateString).toLocaleDateString(undefined, options);
    };//重定义时间表达格式
    const handleSizeChange = (pagesize) => {
      pageSize.value = pagesize;
      fetchDevice();
    };//修改每一页展示的记录数目
    const handleCurrentChange = (pagenum) => {
      pageNum.value = pagenum;
      fetchDevice();
    };//修改页码
    const fetchDevice = () => {
      fetch('http://localhost:8080/ordinaryUser/order', {
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
    };//获取设备信息（查）
    const query = () => {
      fetch(`http://localhost:8080/ordinaryUser/orderSelect`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify({
          "orderStatus": orderStatus.value,
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
    const handleEdit = (order_id) => {
      EditDialogVisible.value = true;
      orderId.value = order_id;
    };
    const openDialog = () => {
      dialogVisible.value = true;
    };//打开添加设备对话框
    const handleClose = (done) => {
      done();
    };//关闭添加设备对话框
    const saveData = () => {
      console.log(formData)
      fetch("http://localhost:8080/ordinaryUser/orderAdd", {
        method: 'POST',
        headers: apiHeaders,
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
    const updateDevice = () => {
      formData.value.orderId=orderId.value
      console.log(formData.value)
      console.log(toRaw(formData.value))
      fetch("http://localhost:8080/ordinaryUser/order", {
        method: 'PUT',
        headers: apiHeaders,
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
    onMounted(() => {
      fetchDevice();
    });

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
      updateDevice,
      handleEdit,
      openDialog,
      fetchDevice,
      handleSizeChange,
      handleCurrentChange,
      handleDelete,
      query,
      handleClose,
      formatDate,
      saveData,
      EditDialogVisible,
    };
  },
};
</script>

<style>
</style>
