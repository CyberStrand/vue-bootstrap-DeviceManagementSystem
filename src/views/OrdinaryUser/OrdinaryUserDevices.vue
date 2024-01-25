<template>
  <h1>杨羽彤</h1>
  <el-container style="min-height: 100vh">
    <el-container>
      <el-main>
        <!--选择栏-->
        <div class="search-bar">
          <el-input class="search-input" v-model="serialNumber" placeholder="序列号"></el-input>
          <el-input class="search-input" v-model="deviceName" placeholder="设备名称"></el-input>
          <el-select class="search-input" v-model="status" placeholder="设备状态">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button type="primary" @click="query">查询</el-button>
        </div>
        <div class="action-buttons">
          <el-button style="float:left" type="warning" @click="findAllDevices"><el-icon><CirclePlus /></el-icon>&nbsp正序查询所有</el-button>
          <el-button style="float:left" type="primary" @click="openDialog">新增</el-button>
          <el-button style="float:left" type="success" @click="printBox"><el-icon><Printer /></el-icon>&nbsp;打印</el-button>
          <el-button style="float:left" type="success" @click="clickExport"><el-icon><Promotion /></el-icon>&nbsp;导出</el-button>
          <el-button style="float:left" type="success" @click="statistics"><el-icon><PieChart /></el-icon>&nbsp;统计</el-button>
          <el-button style="float:left" type="info" @click="SortDown"><el-icon><SortDown /></el-icon>&nbsp;倒序查看</el-button>

        </div>
        <br><hr>
        <!--数据表-->
        <div id = "1">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column fixed prop="serialNumber" label="序列号"  width="100" sortable/>
          <el-table-column prop="deviceName" label="设备名称" width="100"/>
          <el-table-column prop="productionCompanyId" label="生产公司" width="100"/>
          <el-table-column prop="status" label="设备状态" width="120" sortable>
          <template v-slot="scope">
            <span :style="{ color: getStatusColor(scope.row.status) }">{{ getStatusLabel(scope.row.status) }}</span>
          </template>
          </el-table-column>
          <el-table-column prop="deviceModel" label="设备类型" width="100"/>
          <el-table-column prop="purchaseDate" label="购买时间" width="100">
            <template v-slot="scope">
              {{ formatDate(scope.row.purchaseDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="warrantyTime" label="保修期" width="100"/>
          <el-table-column fixed="right" label="操作">
            <template v-slot="scope">
              <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row.serialNumber)">删除</el-button>
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
        <!--添加设备对话框-->
        <el-dialog title="新增设备"
            v-model="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
          <el-form :model="addData" ref="formDataRef" label-width="80px">
            <el-form-item label="序列号" prop="serialNumber">
              <el-input v-model="addData.serialNumber"></el-input>
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="addData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceModel">
              <el-input v-model="addData.deviceModel"></el-input>
            </el-form-item>
            <el-form-item label="运行状态" prop="status">
              <el-select v-model="addData.status">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveData">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog title="编辑设备信息"
            v-model="EditDialogVisible"
            width="30%"
            :before-close="handleClose"
        >
          <el-form :model="formData" ref="formDataRef" label-width="80px">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="formData.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="运行状态" prop="status">
              <el-select v-model="formData.status">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateDevice">修改</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog title="导出设备信息"
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
        <el-dialog title="统计设备状态"
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
import print from "print-js";
import {export_json_to_excel} from "@/vendor/Export2Excel";
import * as echarts from "echarts";
import {CirclePlus, PieChart, Printer, Promotion, SortDown, SortUp} from "@element-plus/icons-vue";

const apiHeaders = {
  'Content-Type': 'application/json',
  'Authorization': "Bearer "+localStorage.getItem("token")
};
export default {
  name: 'OrdinaryUserDevices',
  components: {CirclePlus, SortDown, SortUp, Promotion, Printer, PieChart},
  setup() {
    const dialogVisible = ref(false);
    const tableData = ref([]);
    const total = ref(0);
    const pageNum = ref(1);
    const pageSize = ref(5);
    const status = ref('');
    const ownerId = ref(24);
    const serialNumber = ref('');
    const deviceName = ref('');
    const exportDialogVisible = ref(false);
    const exportAll = ref(true);
    const statisticDialogVisible = ref(false);
    const serialNumberForSearch = ref('');
    const deviceNameForSearch = ref('');
    const statusForSearch = ref(null);
    const sortStatus = ref(false);
    const queryStatus = ref(false);
    const options = ref([
      { value: '0', label: '正常运行中' },
      { value: '1', label: '维修中' },
      { value: '2', label: '发生错误' },
    ]);
    const inputStyle = ref({ 'font-size': '11px' });
    const EditDialogVisible = ref(false);
    const formData = ref({
      serialNumber: '',
      deviceName: '',
      locationId: null,
      ownerId:null,
      status: null,
      deviceModel: '',
      purchaseDate: '',
      warrantyTime: null,
      productionCompanyId:null,
    });//编辑设备
    const addData = ref({
      serialNumber: '',
      deviceName: '',
      status: null,
      deviceModel: '',
      purchaseDate: new Date().toISOString(),
      warrantyTime:365,
      productionCompanyId:1,
    });//添加设备
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
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
      console.log("执行了fetchDevice函数，开始获取数据")
      console.log(queryStatus.value)
      console.log(sortStatus.value)
      if(queryStatus.value===true){
        console.log("选择执行query函数")
        query()}
      else if(queryStatus.value===false){
        if(sortStatus.value===true){
          console.log("选择执行sortDown函数")
          SortDown()}
        else if(sortStatus.value===false){
          console.log("选择执行findAllMessages函数")
          findAllDevices()}
      }
    };
    const findAllDevices = () =>{
      sortStatus.value = false;
      queryStatus.value = false;
      console.log("执行了findAllDevices，用于正序查找所有数据")
      fetch(`http://localhost:8080/ordinaryUser/devices?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            console.log(res.data.list);
            tableData.value = res.data.list;
            total.value = res.data.total;
          })
          .catch(error => {
            console.error('获取数据失败:', error);
          });
    }//正序查找所有
    const query=()=>{
      queryStatus.value = true;
      sortStatus.value = false;
      const params = {
        pageSize: pageSize.value,
        pageNum: pageNum.value,
      };

      if (serialNumber.value !== null) {
        params.serialNumber = serialNumber.value;
      }

      if (deviceName.value !== null) {
        params.deviceName = deviceName.value;
      }
      if(status.value !==null){
        params.status = status.value;
      }
      console.log("执行了query函数")
      fetch(`http://localhost:8080/ordinaryUser/deviceFind?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(params)
      })
          .then(res => res.json())
          .then(res => {
            console.log(res.data.list);
            tableData.value = res.data.list;
            total.value = res.data.total;
          })
          .catch(error => {
            console.error('获取数据失败:', error);
          });

    }//查询
    const SortDown = () =>{
      sortStatus.value = true;
      console.log("执行了SortDown函数，用于倒序排列")
      fetch(`http://localhost:8080/ordinaryUser/devicesDesc?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            console.log(res.data.list);
            tableData.value = res.data.list;
            total.value = res.data.total;
          })
          .catch(error => {
            console.error('获取数据失败:', error);
          });
    }//排序
    const handleDelete = (serialNumber) => {
      fetch(`http://localhost:8080/ordinaryUser/devices?serialNumber=${serialNumber}`, {
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
    const handleEdit =(row) =>{
      formData.value.serialNumber = row.serialNumber;
      formData.value.warrantyTime = row.warrantyTime;
      formData.value.locationId = row.locationId;
      formData.value.purchaseDate  = row.purchaseDate;
      formData.value.deviceModel = row.deviceModel;
      formData.value.productionCompanyId = row.productionCompanyId;
      formData.value.serialNumber = row.serialNumber;
      formData.value.deviceName = row.deviceName;
      formData.value.status = null;
      EditDialogVisible.value = true;
    };
    const openDialog = () => {
      dialogVisible.value = true;
    };//打开添加设备对话框
    const handleClose = (done) => {
      done();
    };//关闭添加设备对话框
    const saveData = () => {
      console.log(addData.value)
      console.log(toRaw(addData.value))
      fetch("http://localhost:8080/ordinaryUser/deviceAdd",{
        method:'POST',
        headers:apiHeaders,
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
    const updateDevice = () =>{
      EditDialogVisible.value = false;
      fetch("http://localhost:8080/ordinaryUser/devices",{
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
        '0': '正常运行中',
        '1': '维修中',
        '2': '发生错误',
      };
      return statusMap[status] || '';
    };
    const getStatusColor = (status) => {
      if(status===2)return '#ff7b7b'
      else if(status===0)return '#5b952a'
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
    const exportTodoList = ()=>{
      if (exportAll.value === true) exportAllTodo();
      else if (exportAll.value===false) exportTodo();
    } //选择导出什么数据
    const exportTodo = () => {
      console.log("执行了exportTodo函数");
      fetch(`http://localhost:8080/ordinaryUser/devices?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            const todoList = res.data.list;
            console.log(res.data.list);
            const tHeader = ['序列号', '设备名称','生产公司ID','设备状态','设备类型','购买时间','保修期'];
            const filterVal = ['serialNumber', 'deviceName','productionCompanyId','status','deviceModel','purchaseDate','warrantyTime'];
            const data = formatJson(filterVal, todoList);
            export_json_to_excel(tHeader, data, '本页设备信息');
          });
    };//导出当页的数据
    const exportAllTodo = () => {
      console.log("执行了exportAllTodo函数");
      fetch(`http://localhost:8080/ordinaryUser/allDevices`, {
        method: 'GET',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            console.log(res);
            const todoList = res.data;
            console.log(res.data);
            const tHeader = ['序列号', '设备名称','生产公司ID','设备状态','设备类型','购买时间','保修期'];
            const filterVal = ['serialNumber', 'deviceName','productionCompanyId','status','deviceModel','purchaseDate','warrantyTime'];
            const data = formatJson(filterVal, todoList);
            export_json_to_excel(tHeader, data, '所有设备信息');
          });
    };//导出所有的数据
    const formatJson = (filterVal, jsonData) => {
      console.log("执行了formatJson函数");
      return jsonData.map(v => filterVal.map(j => v[j]));
    };
    const statistics = () => {
      console.log("执行了Statistics函数");
      statisticDialogVisible.value = true;
      fetchStatistics();
    };
    const fetchStatistics = () => {
      fetch(`http://localhost:8080/ordinaryUser/deviceStatistic`, {
        method: 'GET',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            console.log(res);
            // 添加映射关系将标签转化为文字
            const data = res.data.map(item => ({ value: item.count, name: mapStatus(item.status) }));
            // 绘制饼状图
            drawPieChart(data);
          })
          .catch(error => {
            console.error('获取统计数据失败:', error);
          });
    };
    const mapStatus = (status) => {
      const statusMap = {
        '0': '正常运行中',
        '1': '维修中',
        '2': '发生错误'
      };
      return statusMap[status] || '';
    };
    const drawPieChart = (data) => {
      // 使用 ECharts 绘制饼状图
      const chart = echarts.init(document.getElementById('chart'));
      const option = {
        title: {
          text: '设备运行状态统计',
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
      status,
      ownerId,
      options,
      inputStyle,
      formData,
      serialNumber,
      deviceName,
      EditDialogVisible,
      exportDialogVisible,
      exportAll,
      statisticDialogVisible,
      addData,
      sortStatus,
      queryStatus,
      findAllDevices,
      getStatusColor,
      getStatusLabel,
      updateDevice,
      handleEdit,
      openDialog,
      fetchDevice,
      handleSizeChange,
      handleCurrentChange,
      handleDelete,
      handleClose,
      formatDate,
      saveData,
      printBox,
      clickExport,
      exportTodoList,
      statistics,
      SortDown,
      query,
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

</style>