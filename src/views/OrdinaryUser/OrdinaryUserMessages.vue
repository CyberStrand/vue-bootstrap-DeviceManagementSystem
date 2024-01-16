<template>
  <el-container style="min-height: 100vh">
    <el-container>
      <el-main>
        <!--选择栏-->
        <div style="padding: 10px 0">
          消息发送时间：
            <el-date-picker
                v-model="sendTime"
                type="date"
                placeholder="选择查询日期"
            />
          消息内容：<el-input style="width:100px" placeholder="查找信息内容" :style="inputStyle" v-model="messageContent"></el-input>
          阅读状态：
          <el-select placeholder="选择信息状态" :style="inputStyle"  style="width:150px" v-model="readStatus">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button type="primary" @click="query">查询</el-button>
          <br>
          <hr>
          <el-button style="float:left" type="success" @click="printBox"><el-icon><Printer /></el-icon>&nbsp;打印当前页</el-button>
          <el-button style="float:left" type="success" @click="clickExport"><el-icon><Promotion /></el-icon>&nbsp;导出</el-button>
          <el-button style="float:left" type="success" @click="statistics"><el-icon><PieChart /></el-icon>&nbsp;统计</el-button>
          <el-button style="float:left" type="success" @click="sortDown"><el-icon><SortDown /></el-icon>&nbsp;倒序查看</el-button>
        </div >

        <!--数据表-->
        <div id="1">
          <el-table
              :data="tableData"
              :default-sort="{ prop: 'sendTime', order: tableOrder }"
              @sort-change="sort"
              style="width: 100%"
          >
          <el-table-column fixed prop="sendTime" label="发送时间" width="115" sortable>
            <template v-slot="scope">
              {{ formatDate(scope.row.sendTime) }}
           </template>
          </el-table-column>
          <el-table-column prop="readStatus" label="阅读状态" width="100">
            <template v-slot="scope">
              <span :style="{ color: getStatusColor(scope.row.readStatus) }">{{ getStatusLabel(scope.row.readStatus) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="messageContent" label="消息内容" width="540"/>
          <el-table-column fixed="right" label="操作">
            <template v-slot="scope">
              <el-button size="small" type="danger" @click="handleDelete(scope.row.messageId)">删除</el-button>
              &nbsp;&nbsp;&nbsp;
              <el-switch
                  :model-value="getStatusModelValue(scope.row)"
                  @update:model-value="handleSwitchChange(scope.row)"
                  class="ml-2"
                  width="60"
                  inline-prompt
                  active-text="已读"
                  inactive-text="未读"
                  @change="handleSwitchChange(scope.row)"
              />
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

        <el-dialog title="导出消息"
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
          <el-button type="primary" @click="exportMessageList"> &nbsp;导出</el-button>
        </el-dialog>

        <el-dialog title="统计待办事项"
                   v-model="statisticDialogVisible"
                   width="50%"
                   :before-close="handleClose">
          &nbsp; <div id="chart" style="height: 300px;"></div>
        </el-dialog>
        <div style="text-align: left;">
        【已实现】删、改、导、印、统、序。<br>
        【待实现】增、查
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {ref, onMounted} from 'vue';
import print from "print-js";
import {export_json_to_excel} from "@/vendor/Export2Excel";
import {PieChart, Printer, Promotion, SortDown, SortUp} from "@element-plus/icons-vue";
import * as echarts from "echarts";
const apiHeaders = {
  'Content-Type': 'application/json',
  'Authorization': "Bearer "+localStorage.getItem("token") // Replace with your actual JWT token
};
export default {
  name: 'OrdinaryUserMessages',
  components: {SortDown, PieChart, SortUp, Printer, Promotion},
  setup() {
    const size = ref<'default' | 'large' | 'small'>('default');
    const exportDialogVisible = ref(false);
    const statisticDialogVisible = ref(false);
    const readStatusBool = ref(false);
    const sendTime = ref('');
    const messageContent = ref(null);
    const messageId = ref(null);
    const tableOrder=ref('descending');
    const exportAll = ref (true);
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
      getMessage();
    };//修改每一页展示的记录数目
    const handleCurrentChange = (pagenum) => {
      pageNum.value = pagenum;
      getMessage();
    };//修改页码

    //获取消息，这里需要注意，由于每次调整页码，都会调用这个函数
    //如果这个时候已经筛选了一些条件，再调整页码，会导致查询结果又变成未筛选的状态，
    // 因此这里要根据是否处于查询场景进行一些判断
    const getMessage = () => {
      console.log("执行了getMessage函数")
      fetch(`http://localhost:8080/ordinaryUser/message?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders,
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
      fetch(`http://localhost:8080/ordinaryUser/messageSelect`, {
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
      fetch(`http://localhost:8080/ordinaryUser/message?messageId=${messageId}`, {
        method: 'DELETE',
        headers: apiHeaders,
      })
          .then(response => {
            if (response.ok) {
              console.log('删除成功');
              getMessage();
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
      fetch("http://localhost:8080/ordinaryUser/message", {
        method: 'PUT',
        headers: apiHeaders,
        body: JSON.stringify(requestBody)
      })
          .then(response => response.json())
          .then(data => {
            console.log('Response from server:', data);
            dialogVisible.value = false;// 关闭对话框
            getMessage();//自动刷新
          })
          .catch(error => {
            console.error('Error during data submission:', error);
          });
    }//更新消息状态(改)
    const getStatusColor = (status) => {
      if(status==='unread')return '#ff7b7b'
      else if(status==='read')return '#5b952a'
    };
    const getStatusLabel = (status) => {
      const statusMap = {
        'read': '已读',
        'unread': '未读',
      };
      return statusMap[status] || '';
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
    };//实现打印功能：（只能打印当前页数据，而非所有数据）
    const clickExport = () =>{
      exportDialogVisible.value = true;
    };//实现导出功能
    const exportMessageList = ()=>{
      if (exportAll.value === true) exportAllMessage();
      else if (exportAll.value===false) exportMessage();
    } //选择导出数据
    const exportMessage = () => {
      console.log("执行了exportMessage函数");
      fetch(`http://localhost:8080/ordinaryUser/message?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            const messageList = res.data.list; // 修正变量名为 messageList
            console.log(res.data.list);

            // 遍历所有消息进行状态处理
            messageList.forEach(message => {
              if (message.readStatus === 'read') {
                message.readStatus = '已读';
              } else {
                message.readStatus = '未读';
              }
            });
            const tHeader = ['发送时间','消息状态', '消息内容'];
            const filterVal = ['sendTime','readStatus', 'messageContent'];
            const data = formatJson(filterVal, messageList);
            export_json_to_excel(tHeader, data, '本页消息');
          });
    };//导出当页的数据
    const exportAllMessage = () => {
      console.log("执行了exportAllMessage函数");
      fetch(`http://localhost:8080/ordinaryUser/allMessage`, {
        method: 'GET',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            console.log(res);
            const allMessages = res.data; // 修正变量名为 allMessages
            console.log(res.data);
            // 遍历所有消息进行状态处理
            allMessages.forEach(message => {
              if (message.readStatus === 'read') {
                message.readStatus = '已读';
              } else {
                message.readStatus = '未读';
              }
            });
            const tHeader = ['发送时间', '消息状态', '消息内容'];
            const filterVal = ['sendTime', 'readStatus', 'messageContent'];
            const data = formatJson(filterVal, allMessages); // 修正为 allMessages
            export_json_to_excel(tHeader, data, '所有消息');
          })
          .catch(error => {
            console.error('导出所有消息失败:', error);
          });
    };//导出所有数据
    const formatJson = (filterVal, jsonData) => {
      console.log("执行了formatJson函数");
      return jsonData.map(v => filterVal.map(j => v[j]));
    };
    const statistics = () =>{
      console.log("执行了Statistics函数");
      statisticDialogVisible.value = true;
      fetchStatistics();
    }//实现统计功能
    const fetchStatistics = () => {
      fetch(`http://localhost:8080/ordinaryUser/messageStatistic`, {
        method: 'GET',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            console.log('Raw response:', res);
            // 添加映射关系将标签转化为文字
            const data = res.data.map(item => ({ value: item.count, name: mapStatus(item.read_status) }));
            // 绘制饼状图
            drawPieChart(data);
          })
          .catch(error => {
            console.error('获取统计数据失败:', error);
          });
    };
    const drawPieChart = (data) => {
      // 使用 ECharts 绘制饼状图
      const chart = echarts.init(document.getElementById('chart'));
      const option = {
        title: {
          text: '消息统计',
          subtext: '已读消息和未读消息数量统计',
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
    const mapStatus = (status) => {
      const statusMap = {
        'read': '已读',
        'unread': '未读',
      };
      return statusMap[status] || '';
    };
    const handleClose = (done) => {
      console.log("执行了handleClose函数");
      done();
    };//关闭添加设备对话框
    const sort = ({ prop, order }) => {
      console.log("执行了倒序查看函数sort")
      console.log("tableOrder原来为：");
      console.log(tableOrder);
      tableOrder.value = order;
      console.log("tableOrder此时为：");
      console.log(tableOrder);
      getMessage();
    };//只能修改当前页面的数据顺序

    const sortDown = () =>{
      fetch(`http://localhost:8080/ordinaryUser/messageSort?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders,
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
    };
    const getStatusModelValue = (row) => {
      console.log("执行了getStatusModelValue函数")
      return row.readStatus === 'read';
    };
    const handleSwitchChange = (row) => {
      console.log("执行了handleSwitchChange函数")
      console.log("row:")
      console.log(row)
      const value = getStatusModelValue(row)
      console.log("value:")
      console.log(value)
      const newStatus = value ? 'unread' : 'read';
      const messageId = row.messageId;

      const requestBody = {
        readStatus: newStatus,
        messageId: messageId,
      };
      console.log("requestBody是：")
      console.log(requestBody)

      fetch(`http://localhost:8080/ordinaryUser/message`, {
        method: 'PUT',
        headers: apiHeaders,
        body: JSON.stringify(requestBody),
      })
          .then(response => response.json())
          .then(data => {
            console.log('Response from server:', data);
            getMessage();//自动刷新
          })
          .catch(error => {
            console.error('Error during data submission:', error);
          });
    };
    onMounted(() => {
      getMessage();
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
      size,
      sendTime,
      tableOrder,
      messageContent,
      exportDialogVisible,
      exportAll,
      EditDialogVisible,
      statisticDialogVisible,
      readStatusBool,
      sortDown,
      handleClose,
      getStatusColor,
      getStatusLabel,
      updateMessage,
      handleEdit,
      getMessage,
      handleSizeChange,
      handleCurrentChange,
      handleDelete,
      query,
      formatDate,
      sort,
      printBox,
      clickExport,
      exportMessageList,
      formatJson,
      statistics,
      mapStatus,
      drawPieChart,
      fetchStatistics,
      handleSwitchChange,
      getStatusModelValue,
    };
  },
};
</script>

<style>
</style>
