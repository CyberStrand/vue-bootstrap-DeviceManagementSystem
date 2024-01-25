<template>
<div class="container">
  <div class="row g-4">
    <div class="col-12 col-md-6 col-lg-4 d-flex d-flex">
      <div class="card border-success border-2" >
        <div class="card-body ">
          <h5 class="card-title">设备状态一览图</h5>
          <BarChart :chartData="chartData_device" :chartOptions="chartOptions_device" ></BarChart>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-6 col-lg-4 d-flex d-flex">
      <div class="card border-success border-2">
        <div class="card-body">
          <h5 class="card-title">员工绩效一览图</h5>
          <PieChart :chartData="chartData_user" :chartOptions="chartOptions_user"></PieChart>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-6 col-lg-4 d-flex">
      <div class="card border-success border-2">
        <div class="card-body">
          <h5 class="card-title">设备保修期一览图</h5>
          <PieChart :chartData="chartData_r" :chartOptions="chartOptions_order"></PieChart>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-6 col-lg-4 d-flex">
      <div class="card border-success border-2">
        <div class="card-body">
          <h5 class="card-title">订单情况一览图</h5>
          <PolarChart :chartData="chartData_order" :chartOptions="chartOptions_order"></PolarChart>  
        </div>
      </div>
    </div>

    <div class="col-12 col-md-6 col-lg-4 d-flex">
      <div class="card border-success border-2">
        <div class="card-body">
          <h5 class="card-title">软件流量一览图</h5>
          <linechart :chartData="chartData_v" :chartOptions="chartOptions_order"></linechart>  
        </div>
      </div>
    </div>

    <div class="col-12 col-md-6 col-lg-4 d-flex">
      <div class="card border-success border-2 col-12">
        <div class="card-body">
          <h5 class="card-title">驾驶舱</h5>
          <router-link :to="{name:'panel'}" class="btn btn-success mb-3">learn more</router-link>
        </div>
      </div>
    </div>
    <!-- <div class="col d-flex">
      <div class="card border-success border-2">
        <div class="card-body">
          <Cool></Cool>
        </div>
      </div>
    </div> -->
  </div>
</div>
</template>

<script>
import BarChart from './BarChart.vue';
import PieChart from './PieChart.vue';
//import Cool from './cool.vue';
import PolarChart from './PolarChart.vue';
import API from '@/plugins/axiosInstance'
import linechart from './linechart.vue';

export default {
  components: {
    BarChart,PieChart,PolarChart,linechart
    //,Cool
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
        },
        //定义图表数据
        chartData_order(){
            return {
                labels: ['不紧急', '较不紧急', '中等紧急', '较紧急', '非常紧急'],
                datasets: [
                    {
                        label: '订单数量',
                        backgroundColor: ['rgba(232,237,185,0.4)','rgba(180,189,160,0.4)','rgba(160,191,82,0.4)','rgba(70, 140, 55, 0.4)','rgba(0, 125, 98, 0.4)'],
                        data: [this.CountOrderStatus(1), this.CountOrderStatus(2), this.CountOrderStatus(3), this.CountOrderStatus(4), this.CountOrderStatus(5)]
                    }
                ]
            }
        },
        //定义图表选项
        chartOptions_order(){
            return {
                title: {
                    display: true,
                    text: '订单数量统计'
                },
                responsive: true,
            }
        },
        //定义图表数据
        chartData_r(){
            return {
                labels: ['1年', '2年', '3年', '4年', '5年'],
                datasets: [
                    {
                        label: '到期年份',
                        backgroundColor: ['rgba(232,237,185,0.4)','rgba(180,189,160,0.4)','rgba(160,191,82,0.4)','rgba(70, 140, 55, 0.4)','rgba(0, 125, 98, 0.4)'],
                        data: [1,5,3,8,2]
                    }
                ]
            }
        },
        //定义图表数据
        chartData_v(){
            return {
                labels: ['第一季度', '第二季度', '第三季度', '第四季度'],
                datasets: [
                    {
                        label: '到期年份',
                        backgroundColor: 'rgba(0, 125, 98)',
                        data: [1,2,6,4]
                    }
                ]
            }
        },
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
        CountOrderStatus(status){
            let count=0
            for(let i=0;i<this.orders.length;i++){
                if(this.orders[i].urgencyLevel===status){
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