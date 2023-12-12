<template>
    <div>
        <table class="table table-striped">
            <thead class="table-light">
                <tr>
                    <th>订单ID</th>
                    <th>用户ID</th>
                    <th>维修人员ID</th>
                    <th>公司ID</th>
                    <th>订单状态</th>
                    <th>紧急程度</th>
                    <th>设备ID</th>
                    <th>发起时间</th>
                    <th>订单位置</th>
                    <th>订单详情</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.orderId">
                    <td>{{ order.orderId }}</td>
                    <td>{{ order.userId }}</td>
                    <td>{{ order.maintenancePersonnelId }}</td>
                    <td>{{ order.companyId }}</td>
                    <td>{{ order.orderStatus }}</td>
                    <td>{{ order.urgencyLevel }}</td>
                    <td>{{ order.deviceId }}</td>
                    <td>{{ formatDate(order.createdAt) }}</td>
                    <td>{{ order.locationId }}</td>
                    <td>{{ order.orderDetail }}</td>
                </tr>
            </tbody>
        </table>
        <AddModal button="添加订单" title="输入订单信息"></AddModal>
    </div>
</template>

<script>
import API from '@/plugins/axiosInstance'
import AddModal from '@/components/AddModal.vue'

export default {
    data(){
        return{
            orders:[],
        }
    },
    mounted(){
        API.post("/company/orders",
            JSON.stringify({"pageNum":1,"pageSize":10}),
        {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': "Bearer "+localStorage.getItem("token")
            }
        }).then((response)=>{
            console.log(response.data.data)
            this.orders=response.data.data.list
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