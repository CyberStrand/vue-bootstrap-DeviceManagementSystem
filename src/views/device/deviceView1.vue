<template>
    <div>
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
                </tr>
            </thead>
            <tbody>
                <tr v-for="device in devices" :key="device.deviceId">
                    <td>{{ device.serial_number }}</td>
                    <td>{{ device.device_name }}</td>
                    <td>{{ device.owner_id }}</td>
                    <td>{{ device.production_company_id }}</td>
                    <td>{{ device.status }}</td>
                    <td>{{ device.device_model }}</td>
                    <td>{{ formatDate(device.purchase_date) }}</td>
                    <td>{{ device.warranty_time }}</td>
                    <td>{{ device.location_id }}</td>
                </tr>
            </tbody>
        </table>
        <AddModal button="添加设备" title="输入设备信息"></AddModal>
    </div>
</template>

<script>
import API from '@/plugins/axiosInstance'
import AddModal from '@/components/AddModal.vue'

export default {
    data(){
        return{
            devices:[],
        }
    },
    mounted(){
        API.get("/company/devices",{
            params: {
                pageNum: 5,
                pageSize: 9
            },
            headers:{
                'Content-Type': 'application/json',
                'Authorization': "Bearer "+localStorage.getItem("token")
            }
        }).then((response)=>{
            console.log(response.data.data)
            this.devices=response.data.data.list
        })
    },
    methods: {
        formatDate(date) {
                // You can format the date as needed here
                return new Date(date).toLocaleDateString();
            }
    },
    components:{
        AddModal
    }
}
</script>

<style>

</style>