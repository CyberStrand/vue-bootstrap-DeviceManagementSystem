<template>
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
    <AddModal button="分派订单" title="输入分派信息" @submit="Distribute">
        <form>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">分派人ID:</label>
                    <input class="form-control" v-model="userID">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">订单ID:</label>
                    <input class="form-control" v-model="orderID">
                </div>
            </div>
        </form>
    </AddModal>
    <br>
    <!-- 分页控件 -->
    <button @click="currentPage--" class="btn btn-primary my-3 mx-3" :disabled="currentPage <= 1">上一页</button>
    <span>页码: {{ currentPage }}</span>
    <button @click="currentPage++" class="btn btn-primary my-3 mx-3" :disabled="orders.length<pageSize">下一页</button>
</template>

<script>
import API from '@/plugins/axiosInstance'
import AddModal from '@/components/AddModal.vue'

export default {
    data(){
        return{
            orders:[],
            userID:"",
            orderID:"",
            Change:false,
            currentPage: 1,
            pageSize: 10,
        }
    },
    computed: {
        // 计算总页数
        pageCount() {
        return Math.ceil(this.orders.length / this.pageSize);
        },
    },
    created(){
        this.getOrders()
    },
    watch: {
        Change(){
            this.getOrders()
        },
        currentPage() {
            this.getOrders()
        },
    },
    methods: {
        formatDate(date) {
                // You can format the date as needed here
                return new Date(date).toLocaleDateString();
        },

        async getOrders() {
        await API.get("/company/orders", {
            params: {
                pageNum: this.currentPage,
                pageSize: this.pageSize
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

        async Distribute(){
            await API.post("/company/orders/distribute",
            JSON.stringify({"userId":this.userID,"orderId":this.orderID}),
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+localStorage.getItem("token")
                }
            }).then((response)=>{
                if(response.data.data===1){
                    alert("分派成功")
                    this.Change=!this.Change
                }
                else{
                    alert("分派失败")
                }
            })
        }
    },
    components:{
        AddModal
    }
}
</script>

<style>

</style>