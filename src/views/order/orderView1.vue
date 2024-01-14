<template>
    <form class="row g-6">
    <div class="col">
        <label for="queryInput" class="visually-hidden">查询</label>
        <input type="text" class="form-control" id="queryInput" v-model="this.orderId_Find" placeholder="输入查询ID">
    </div>
    <div class="col">
        <label for="queryInput" class="visually-hidden">查询</label>
        <input type="text" class="form-control" id="queryInput" v-model="this.userId_Find" placeholder="输入用户ID">
    </div>
    <div class="col-auto">
        <button type="submit" class="btn btn-primary mb-3" @click.prevent="finduser">查询</button>
    </div>
    </form>
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
            <tr v-for="order in currentOrders" :key="order.orderId">
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
    <span>页码: {{ currentPage }}/{{ pageCount }}</span>
    <button @click="currentPage++" class="btn btn-primary my-3 mx-3" :disabled="filteredOrders.length<=currentPage*pageSize">下一页</button>
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
            //用于查询
            orderId_Find:"",
            userId_Find:"",
        }
    },
    computed: {
        // 计算总页数
        pageCount() {
            return Math.ceil(this.filteredOrders.length / this.pageSize);
        },
        //筛选后的订单
        filteredOrders(){
            if(this.orderId_Find || this.userId_Find){
                return this.orders.filter((order) => {
                    return String(order.orderId).includes(String(this.orderId_Find)) && String(order.userId).includes(String(this.userId_Find))
                })
            }
            else{
                return this.orders
            }
        },
        //当前页的数据
        currentOrders() {
            let start = (this.currentPage - 1) * this.pageSize;
            let end = this.currentPage * this.pageSize;
            return this.filteredOrders.slice(start, end);
        }
    },
    created(){
        this.getOrders()
    },
    watch: {
        Change(){
            this.getOrders()
        },
        // currentPage() {
        //     this.getOrders()
        // },
    },
    methods: {
        formatDate(date) {
                // You can format the date as needed here
                return new Date(date).toLocaleDateString();
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