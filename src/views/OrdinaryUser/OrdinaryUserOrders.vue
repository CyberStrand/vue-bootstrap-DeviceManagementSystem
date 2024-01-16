<template>
  <el-container style="min-height: 100vh">
    <el-container>
      <el-main>
        <!--选择栏-->
        <div style="padding: 10px 0">
          订单号：<el-input style="width:100px" placeholder="请输入订单号" :style="inputStyle" v-model="orderId"></el-input>
          订单状态：
          <el-select placeholder="请选择订单状态" :style="inputStyle"  style="width:200px" v-model= "orderStatus" >
            <el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button type="primary" @click="query">查询</el-button>
          <el-button type="danger" @click="openDialog">报修</el-button>
        </div>
        <div>
          <el-button style="float:left" type="success" @click="printBox"><el-icon><Printer /></el-icon>&nbsp;打印</el-button>
          <el-button style="float:left" type="success" @click="clickExport"><el-icon><Promotion /></el-icon>&nbsp;导出</el-button>
          <el-button style="float:left" type="success" @click="statistics"><el-icon><PieChart /></el-icon>&nbsp;统计</el-button>
        </div>
        <!--数据表-->
        <div id="1">
        <el-table :data="tableData"
                  :default-sort="{ prop: 'purchaseDate', order: 'descending' }"
                  style="width: 100%">
          <el-table-column fixed prop="orderId" label="订单号" width="80"/>
          <el-table-column prop="maintenancePersonnelId" label="维修人员ID" width="100"/>
          <el-table-column prop="orderStatus" label="订单状态" width="100">
            <template v-slot="scope">
              <span :style="{ color: getStatusColor(scope.row.orderStatus) }">{{ getStatusLabel(scope.row.orderStatus) }}</span>
            </template>
            </el-table-column>
          <el-table-column prop="urgencyLevel" label="紧急程度" width="100"/>
          <el-table-column prop="deviceId" label="设备序列号" width="100"/>
          <el-table-column prop="createdAt" label="订单创建时间" width="100">
            <template v-slot="scope">
              {{ formatDate(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="orderDetail" label="订单详情" width="100"/>
          <el-table-column fixed="right" label="操作">
            <template v-slot="scope">
              <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="primary" @click="handleEvaluate(scope.row)">评价</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row.orderId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
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
        <!--新增：报修对话框-->
        <el-dialog title="报修"
            v-model="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
          <el-form :model="addData" ref="formDataRef" label-width="80px">
            <el-form-item label="设备ID" prop="deviceSerialNumber">
              <el-input v-model="addData.deviceSerialNumber"></el-input>
            </el-form-item>
            <el-form-item label="订单详情" palceholder= "请在此处描述设备的具体情况" prop="order_detail">
              <el-input v-model="addData.orderDetail"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveData">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!--编辑设备对话框-->
        <el-dialog title="修改信息"
            v-model="EditDialogVisible"
            width="30%"
            :before-close="handleClose"
        >
          <el-form :model="formData" ref="formDataRef" label-width="80px">

            <el-form-item label="加急" palceholder= "修改订单紧急状态" >
              <el-select v-model="formData.urgencyLevel">
                <el-option
                    v-for="item in urgencyLevelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单详情" aria-placeholder="修改订单详情">
               <el-input v-model="formData.orderDetail"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateDevice">修改</el-button>
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
          <el-button type="primary" @click="exportOrderList"> &nbsp;导出</el-button>
        </el-dialog>
        <el-dialog title="统计待办事项"
                   v-model="statisticDialogVisible"
                   width="50%"
                   :before-close="handleClose">
          &nbsp; <div id="chart" style="height: 300px;"></div>
        </el-dialog>

        <div style="text-align: left;">
          【已实现】：增、删、改、导、印、统<br>
          【待实现】：查、序、评价
        </div>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {ref, onMounted, toRaw} from 'vue';
import {PieChart, Printer, Promotion} from "@element-plus/icons-vue";
import print from "print-js";
import {export_json_to_excel} from "@/vendor/Export2Excel";
import * as echarts from "echarts";

const apiHeaders = {
  'Content-Type': 'application/json',
  'Authorization': "Bearer "+localStorage.getItem("token")
};

export default {
  name: 'OrdinaryUserOrder',
  components: {PieChart, Promotion, Printer},
  setup() {
    const dialogVisible = ref(false);
    const tableData = ref([]);
    const total = ref(0);
    const pageNum = ref(1);
    const pageSize = ref(5);
    const orderStatus = ref('');
    const ownerId = ref(24);
    const orderId = ref(null);
    const exportDialogVisible= ref(false);
    const exportAll = ref(false);
    const statisticDialogVisible = ref(false);
    const orderStatusOptions = ref([
      {value: 'pending', label: '派单中'},
      {value: 'completed', label: '已完成'},
      {value: 'evaluated', label: '已评价'}
    ]);
    const urgencyLevelOptions = ref([
      {value:'1',label:'紧急程度1'},
      {value:'2',label:'紧急程度2'},
      {value:'3',label:'紧急程度3'},
      {value:'4',label:'紧急程度4'},
      {value:'5',label:'紧急程度5'},
    ])
    const inputStyle = ref({'font-size': '11px'});
    const EditDialogVisible = ref(false);
    const addData = ref({
      orderId: null,//自动创建
      userId: null,//自动获取
      maintenancePersonnelId: null,  //初始分配为空
      companyId: null,        //不知道咋填先不填
      orderStatus: 'pending',//创建新订单默认未派单
      urgencyLevel:1,        //默认紧急程度最低
      deviceId: '',//用户自己填
      createAt: '',
      orderDetail: ''//用户自己填
    });
    const formData = ref({
      orderId: null,//自动创建
      userId: null,//自动获取
      maintenancePersonnelId: null,  //初始分配为空
      companyId: null,        //不知道咋填先不填
      orderStatus: null,//创建新订单默认未派单
      urgencyLevel:null,        //默认紧急程度最低
      deviceId: '',//用户自己填
      createAt: new Date().toISOString(), //默认为当前时间
      orderDetail: ''//用户自己填
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
      fetch(`http://localhost:8080/ordinaryUser/order?pageSize=${pageSize.value}&pageNum=${pageNum.value}`, {
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
    const handleDelete = (orderId) => {
      fetch(`http://localhost:8080/ordinaryUser/order?orderId=${orderId}`, {
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
      EditDialogVisible.value = true;
      //保留一些不需要改变的数据项的值
      formData.value.orderId = row.orderId;
      formData.value.maintenancePersonnelId = row.maintenancePersonnelId;
      formData.value.companyId = row.companyId;
      formData.value.orderStatus = row.orderStatus;
      formData.value.deviceId = row.deviceId;
      formData.value.createAt = row.createAt;
    };
    const openDialog = () => {
      dialogVisible.value = true;
    };//打开添加设备对话框
    const handleClose = (done) => {
      done();
    };//关闭添加设备对话框
    const saveData = () => {
      console.log(addData)
      fetch("http://localhost:8080/ordinaryUser/orderAdd", {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(addData.value)
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
    const getStatusLabel = (status) => {
      //console.log("执行了getStatusLabel函数");
      const statusMap = {
        'pending': '派单中',
        'completed':'已完成',
        'evaluated': '已评价',
      };
      return statusMap[status] || '';
    };
    const getStatusColor = (status) => {
      // console.log("执行了getStatusColor函数");
      if(status==='pending')return '#ff7b7b'
      else if(status==='completed')return '#5b952a'
      else if(status==='evaluated')return '#4d90fe'
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
    const clickExport = () =>{
      exportDialogVisible.value = true;
    };//弹出导出的对话框
    const exportOrderList = ()=>{
      if (exportAll.value === true) exportAllOrder();
      else if (exportAll.value===false) exportOrder();
    } //选择导出什么数据
    const exportOrder = () => {
      console.log("执行了exportOrder函数");
      fetch(`http://localhost:8080/ordinaryUser/order?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            const todoList = res.data.list;
            console.log(res.data.list);
            const tHeader = ['订单号', '维修人员ID','订单状态','紧急程度','设备序列号','订单创建时间','订单详情'];
            const filterVal = ['orderId','maintenancePersonnelId','orderStatus','urgencyLevel','deviceId','createdAt','orderDetail'];
            const data = formatJson(filterVal, todoList);
            export_json_to_excel(tHeader, data, '本页订单信息');
          });
    };//导出当页的数据
    const exportAllOrder = () => {
      console.log("执行了exportAllOrder函数");
      fetch(`http://localhost:8080/ordinaryUser/allOrders`, {
        method: 'GET',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            console.log(res);
            const todoList = res.data;
            console.log(res.data);
            const tHeader = ['订单号', '维修人员ID','订单状态','紧急程度','设备序列号','订单创建时间','订单详情'];
            const filterVal = ['orderId','maintenancePersonnelId','orderStatus','urgencyLevel','deviceId','createdAt','orderDetail'];
            const data = formatJson(filterVal, todoList);
            export_json_to_excel(tHeader, data, '所有订单信息');
          });
    };//导出所有的数据
    const formatJson = (filterVal, jsonData) => {
      console.log("执行了formatJson函数");
      return jsonData.map(v => filterVal.map(j => v[j]));
    };
    const Sort = () =>{
      console.log("执行了Sort函数");
      fetch(`http://localhost:8080/ordinaryUser/sortdown?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
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
      fetch(`http://localhost:8080/ordinaryUser/orderStatistic`, {
        method: 'GET',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            console.log('Raw response:', res);
            const data = res.data.map(item => ({ value: item.count, name: mapStatus(item.order_status) }));
            drawPieChart(data);
          })
          .catch(error => {
            console.error('获取统计数据失败:', error);
          });
    };
    const mapStatus = (status) => {
      const statusMap = {
        'pending': '派单中',
        'completed': '已完成',
        'evaluated':'已评价',
      };
      return statusMap[status] || '';
    };
    const drawPieChart = (data) => {
      const chart = echarts.init(document.getElementById('chart'));
      const option = {
        title: {
          text: '订单分析',
          subtext: '',
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
      fetchDevice();
    });

    return {
      dialogVisible,
      tableData,
      total,
      pageNum,
      pageSize,
      ownerId,
      orderStatusOptions,
      inputStyle,
      formData,
      orderStatus,
      EditDialogVisible,
      exportDialogVisible,
      exportAll,
      statisticDialogVisible,
      addData,
      urgencyLevelOptions,
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
      getStatusLabel,
      getStatusColor,
      printBox,
      clickExport,
      statistics,
      exportOrderList,
    };
  },
};
</script>

<style>
</style>
