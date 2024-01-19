<template>
<div class="container">
  <div class="row row-cols-1 row-cols-md-2 g-4">
    <div class="col">
      <div class="card border-success border-2">
        <div class="card-body ">
          <h5 class="card-title">设备状态一览图</h5>
          <BarChart :chartData="chartData_device" :chartOptions="chartOptions_device"></BarChart>
        </div>
      </div>
    </div>

    <div class="col ">
      <div class="card border-success border-2">
        <div class="card-body">
          <h5 class="card-title">员工绩效一览图</h5>
          <PieChart :chartData="chartData_user" :chartOptions="chartOptions_user"></PieChart>
        </div>
      </div>
    </div>

    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">订单情况一览图</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
        </div>
      </div>
    </div>

    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">月流量一览图</h5>
          <DynamicChart></DynamicChart>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import BarChart from './BarChart.vue';
import PieChart from './PieChart.vue';
import DynamicChart from './DynamicChart.vue';
import API from '@/plugins/axiosInstance'

export default {
  components: {
    BarChart,PieChart,DynamicChart
  },
  data() {
    return {
      devices: [],
      orders:[],
      users:[],
    }
  },
  created() {
    this.getDevices();
    this.getOrders();
    this.getusers();
  },
  computed:{
      //定义图表数据
      chartData_device(){
      return {
          labels: ['待维修', '待审核', '待报废', '待入库', '待出库', '已出库'],
          datasets: [
              {
                  label: '设备数量',
                  backgroundColor: '#198754',
                  borderColor: '#198754',
                  data: [this.CountDeviceStatus(0),this.CountDeviceStatus(1), this.CountDeviceStatus(2), this.CountDeviceStatus(3), this.CountDeviceStatus(4), this.CountDeviceStatus(5)]
              }
          ]
      }
      },
      //定义图表选项
      chartOptions_device(){
          return {
              title: {
                  display: true,
                  text: '设备数量统计'
              },
              responsive: true,
          }
      },
      //定义图表数据
      chartData_user(){
            return {
                labels: ['待评','差','中', '良', '优', '完美'],
                datasets: [
                    {
                        label: '员工人数',
                        backgroundColor: ['#c0d0b4','#e8edb9','#b4bda0','#a0bf52','#468c37','#007d62'],
                        data: [this.CountUserStatus(0),this.CountUserStatus(1), this.CountUserStatus(2), this.CountUserStatus(3), this.CountUserStatus(4), this.CountUserStatus(5)]
                    }
                ]
            }
        },
        //定义图表选项
        chartOptions_user(){
            return {
                title: {
                    display: true,
                    text: '人员评分'
                },
                responsive: true,
            }
        }
    },
    methods: {
      async getDevices() {
        await API.get("/company/devices", {
            params: {
                pageNum: -1,
            },
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            console.log(response.data.data);
            this.devices = response.data.data.list;
        }).catch((error) => {
            console.log(error);
        })
        },
      async getOrders() {
          await API.get("/company/orders", {
              params: {
                  pageNum: -1
              },
              headers: {
                  'Authorization': "Bearer " + localStorage.getItem("token")
              }
          }).then((response) => {
              console.log(response.data.data);
              this.orders = response.data.data.list;
          }).catch((error) => {
              console.log(error);
          })
        },
      async getusers() {
          await API.get("/company/personals", {
              params: {
                  pageNum: -1,
              },
              headers: {
                  'Authorization': "Bearer " + localStorage.getItem("token")
              }
          }).then((response) => {
              console.log(response.data.data);
              this.users = response.data.data.list;
          }).catch((error) => {
              console.log(error);
          })
        },
      CountDeviceStatus(status){
              let count=0
              for(let i=0;i<this.devices.length;i++){
                  if(this.devices[i].status===status){
                      count++
                  }
              }
              return count
        },
        CountUserStatus(status){
            let count=0
            for(let i=0;i<this.users.length;i++){
                if(this.users[i].score===status){
                    count++
                }
            }
            return count
        },
    }
}
</script>

<style>
 
</style>