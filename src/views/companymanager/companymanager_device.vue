<template>
    <div>
    <BarChart :chartData="chartData" :chartOptions="chartOptions"></BarChart>
    <br/>
        <form class="row g-6">
        <div class="col">
            <label for="queryInput" class="visually-hidden">查询</label>
            <input type="text" class="form-control" id="queryInput" v-model="this.serialNumber_Find" placeholder="输入查询序列号">
        </div>
        <div class="col">
            <label for="queryInput" class="visually-hidden">查询</label>
            <input type="text" class="form-control" id="queryInput" v-model="this.deviceName_Find" placeholder="输入设备名称">
        </div>
        <div class="col-auto">
            <button type="submit" class="btn btn-success mb-3" @click.prevent="finduser">查询</button>
        </div>
        </form>
        <table class="table table-striped">
            <thead class="table-light">
                <tr>
                    <th>序列号</th>
                    <th>设备名称</th>
                    <th>拥有者ID</th>
                    <th>生产公司ID</th>
                    <th>设备状态</th>
                    <th>设备型号</th>
                    <th>购买时间</th>
                    <th>保修时间(天)</th>
                    <th>位置ID</th>
                    <th> </th>
                    <th> </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="device in currentDevices" :key="device.serialNumber">
                    <td>{{ device.serialNumber }}</td>
                    <td>{{ device.deviceName }}</td>
                    <td>{{ device.ownerId }}</td>
                    <td>{{ device.productionCompanyId }}</td>
                    <td>{{ device.status }}</td>
                    <td>{{ device.deviceModel }}</td>
                    <td>{{ formatDate(device.purchaseDate) }}</td>
                    <td>{{ device.warrantyTime }}</td>
                    <td>{{ device.locationId }}</td>
                    <td><button class="btn btn-danger py-2 " @click.prevent="Delete(device.serialNumber)">Delete</button></td>
                    <td><PutModal button="Update" title="修改设备信息" @submit="UpdateDevices" @default="SetDefult(device)">
                        <form>
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="form-label">序列号:</label>
                                    <input class="form-control" v-model="this.serialNumber_update">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">设备名:</label>
                                    <input class="form-control" v-model="this.deviceName_update">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">设备型号:</label>
                                    <input class="form-control" v-model="this.deviceModel_update">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">购买日期:</label>
                                    <input class="form-control" v-model.number="this.purchaseDate_update" type="date">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">保修时间</label>
                                    <input class="form-control" v-model="this.warrantyTime_update" type="number">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">保修时间</label>
                                    <input class="form-control" v-model="this.warrantyTime_update" type="number">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">设备状态</label>
                                    <input class="form-control" v-model="this.status_update">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">拥有人id</label>
                                    <input class="form-control" v-model="this.ownerId_update">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">地区id</label>
                                    <input class="form-control" v-model="this.locationId_update">
                                </div>
                            </div>
                        </form>
                    </PutModal></td>
                </tr>
            </tbody>
        </table>
        <div class="row g-6">
            <div class="col-auto">
                <AddModal button="添加设备" title="输入设备信息" @submit="AddDevice">
                <!--需要填写的信息:serialNumber,deviceName,deviceModel,purchaseDate,warrantyTime-->
                <form>
                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label">序列号:</label>
                            <input class="form-control" v-model="this.serialNumber">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">设备名称:</label>
                            <input class="form-control" v-model="this.deviceName">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">设备型号:</label>
                            <input class="form-control" v-model="this.deviceModel">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">保修时间:</label>
                            <input class="form-control" v-model="this.warrantyTime" type="number">
                        </div>
                        <div class="col-md-12">
                            <label class="form-label">购买日期:</label>
                            <input class="form-control" v-model="this.purchaseDate" type="date">
                        </div>
                        
                    </div>
                </form>
                </AddModal>
            </div>
            <div class="col-auto">
                <button class="btn btn-success" @click.prevent="Export">导出表单</button>
            </div>
            <div class="col-auto">
            <button class="btn btn-success" @click="PagePrint()">打印页面</button>
            </div>
        </div>
        <br>
        <!-- 分页控件 -->
        <button @click="currentPage--" class="btn btn-success my-3 mx-3" :disabled="currentPage <= 1">上一页</button>
        <span>页码: {{ currentPage }}/{{ pageCount }}</span>
        <button @click="currentPage++" class="btn btn-success my-3 mx-3" :disabled="filteredDevices.length<=currentPage*pageSize">下一页</button>
    </div>
</template>

<script>
import API from '@/plugins/axiosInstance'
import AddModal from '@/components/AddModal.vue'
import BarChart from '@/components/BarChart.vue'
import PutModal from '@/components/PutModal.vue'

export default {
    data(){
        return{
            devices:[],
            Change:false,
            currentPage: 1,
            pageSize: 7,
            serialNumber:"",
            deviceName:"",
            deviceModel:"",
            purchaseDate:null,
            warrantyTime:Int32Array,

            //用于查询
            serialNumber_Find:"",
            deviceName_Find:"",
            //用于修改
            serialNumber_update:"",
            deviceName_update:"",
            deviceModel_update:"",
            purchaseDate_update:null,
            warrantyTime_update:Int32Array,
            status_update:Int32Array,
            ownerId_update:"",
            locationId_update:"",
            
        }
    },
    computed: {
        // 计算总页数
        pageCount() {
            return Math.ceil(this.filteredDevices.length / this.pageSize);
        },
        //筛选后的设备
        filteredDevices(){
            if(this.serialNumber_Find || this.deviceName_Find){
                return this.devices.filter((device) => {
                    return String(device.serialNumber).includes(String(this.serialNumber_Find)) && String(device.deviceName).includes(String(this.deviceName_Find))
                })
            }
            else{
                return this.devices
            }
        },
        //当前页的数据
        currentDevices() {
            let start = (this.currentPage - 1) * this.pageSize;
            let end = this.currentPage * this.pageSize;
            return this.filteredDevices.slice(start, end);
        },
        //定义图表数据
        chartData(){
            return {
                labels: ['待维修', '待审核', '待报废', '待入库', '待出库', '已出库'],
                datasets: [
                    {
                        label: '设备数量',
                        backgroundColor: '#198754',
                        borderColor: '#198754',
                        data: [this.CountStatus(0),this.CountStatus(1), this.CountStatus(2), this.CountStatus(3), this.CountStatus(4), this.CountStatus(5)]
                    }
                ]
            }
        },
        //定义图表选项
        chartOptions(){
            return {
                title: {
                    display: true,
                    text: '设备数量统计'
                },
                responsive: true,
            }
        }
    },
    created(){
        this.getDevices()
    },
    watch: {
        Change(){
            this.getDevices()
        },
        // currentPage() {
        //     this.getDevices()
        // },
    },
    methods: {
        formatDate(date) {
                // You can format the date as needed here
                return new Date(date).toLocaleDateString();
        },
        //统计不同状态的设备数量
        CountStatus(status){
            let count=0
            for(let i=0;i<this.filteredDevices.length;i++){
                if(this.filteredDevices[i].status===status){
                    count++
                }
            }
            return count
        },
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
        async UpdateDevices(){
            await API.put("/company/devices",
            //传入的参数:serialNumber,deviceName,deviceModel,purchaseDate,warrantyTime,status,ownerId,locationId
            JSON.stringify({
                "serialNumber":this.serialNumber_update,
                "deviceName":this.deviceName_update,
                "deviceModel":this.deviceModel_update,
                "purchaseDate":this.purchaseDate_update,
                "warrantyTime":this.warrantyTime_update,
                "status":this.status_update,
                "ownerId":this.ownerId_update,
                "locationId":this.locationId_update,}),
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+localStorage.getItem("token")
                }
            }).then((response)=>{
                console.log(response)
                if(response.data.message==='success'){
                    alert("修改成功")
                    this.Change=!this.Change
                }
                else{
                    alert("修改失败")
                }
            })
        },
        async AddDevice(){
            await API.post("/company/devices",
            //传入的参数:serialNumber,deviceName,deviceModel,purchaseDate,warrantyTime
            JSON.stringify({"serialNumber":this.serialNumber,"deviceName":this.deviceName,"deviceModel":this.deviceModel,"purchaseDate":this.purchaseDate,"warrantyTime":this.warrantyTime}),
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+localStorage.getItem("token")
                }
            }).then((response)=>{
                if(response.data.data===1){
                    alert("添加成功")
                    this.Change=!this.Change
                }
                else{
                    alert("添加失败")
                }
            })
        },
        async Export(){
            await API.request({
                method: 'get',
                url: "/company/devices/export",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+localStorage.getItem("token")
                },
                responseType: 'blob',
            }).then((response)=>{
                    const blob = new Blob([response.data], {type: 'application/vnd.ms-excel'})
                    const filename = '设备信息表.xls'
                    saveAs(blob, filename)
                    alert("导出成功")
            }).catch((error)=>{
                alert("导出失败")
                console.log(error)
            })
        },
        async Delete(number){
            console.log(number)
            await API.request({
                method: 'delete',
                url: "/company/devices",
                data: {"serialNumber": number},
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+localStorage.getItem("token")
                }
            }).then((response)=>{
                if(response.data.data===1){
                    alert("删除成功")
                    this.Change=!this.Change
                }
                else{
                    alert("删除失败，非本公司产品")
                }
            })
        },
        PagePrint(){
            window.print()
        },
        SetDefult(device){
            this.serialNumber_update=device.serialNumber
            this.deviceName_update=device.deviceName
            this.deviceModel_update=device.deviceModel
            this.purchaseDate_update=device.purchaseDate
            this.warrantyTime_update=device.warrantyTime
            this.status_update=device.status
            this.ownerId_update=device.ownerId
            this.locationId_update=device.locationId
        },

        },
    components:{
        AddModal,BarChart,PutModal
    }
}
</script>

<style>

</style>