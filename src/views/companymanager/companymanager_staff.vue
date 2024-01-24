<template>
    <h1>刘梓言</h1>
    <div>
        <BarChart :chartData="chartData" :chartOptions="chartOptions"></BarChart>
        <br>
        <form class="row g-6">
            <div class="col">
                <label for="queryInput" class="visually-hidden">查询</label>
                <input type="text" class="form-control" id="queryInput" v-model="this.userId_Find" placeholder="输入查询ID">
            </div>
            <div class="col">
                <label for="queryInput" class="visually-hidden">查询</label>
                <input type="text" class="form-control" id="queryInput" v-model="this.username_Find" placeholder="输入用户名">
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-success mb-3" @click.prevent="finduser">查询</button>
            </div>
        </form>
        <table class="table table-striped">
            <thead class="table-light">
                <tr>
                    <th>用户ID</th>
                    <th>用户名</th>
                    <th>手机号</th>
                    <th>邮箱</th>
                    <th>用户类型</th>
                    <th>评分</th>
                    <th>公司ID</th>
                    <th> </th>
                    <th> </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in currentUsers" :key="user.userId">
                    <td>{{ user.userId }}</td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.phoneNumber }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.userType }}</td>
                    <td>{{ user.score }}</td>
                    <td>{{ companyId}}</td>
                    <td><button class="btn btn-danger py-2" @click.prevent="Delete(user.userId)">删除</button></td>
                    <td><PutModal button="更新" title="修改人员信息" @submit="UpdateUser" @default="SetDefult(user)">
                        <form>
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="form-label">ID:</label>
                                    <input class="form-control" v-model="this.userId_update">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">用户名:</label>
                                    <input class="form-control" v-model="this.username_update">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">密码:</label>
                                    <input class="form-control" v-model="this.password_update" type="password">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">手机号:</label>
                                    <input class="form-control" v-model.number="this.phoneNumber_update" type="tel">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">邮箱</label>
                                    <input class="form-control" v-model="this.email_update" type="email">
                                </div>
                            </div>
                        </form>
                    </PutModal></td>
                </tr>
            </tbody>
        </table>
        <div class="row g-6">
            <div class="col-auto">
            <AddModal button="添加人员" title="输入人员信息" @submit="Adduser">
                <form>
                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label">用户名:</label>
                            <input class="form-control" v-model="this.username">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">密码:</label>
                            <input class="form-control" v-model="this.password" type="password">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">手机号:</label>
                            <input class="form-control" v-model.number="this.phoneNumber" type="tel">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">邮箱</label>
                            <input class="form-control" v-model="this.email" type="email">
                        </div>
                    </div>
                </form>
            </AddModal>
            </div>

            <div class="col-auto">
            <button class="btn btn-success" @click="Export">导出表单</button>
            </div>

            <div class="col-auto">
            <button class="btn btn-success" @click="PagePrint()">打印页面</button>
            </div>

        </div>
        <br>
        <!-- 分页控件 -->
        <button @click="currentPage--" class="btn btn-success my-3 mx-3" :disabled="currentPage <= 1">上一页</button>
        <span>页码: {{ currentPage }}/{{ pageCount }}</span>
        <button @click="currentPage++" class="btn btn-success my-3 mx-3" :disabled="filteredUsers.length<=currentPage*pageSize">下一页</button>
    </div>
</template>

<script>
import API from '@/plugins/axiosInstance'
import AddModal from '@/components/AddModal.vue'
import PutModal from '@/components/PutModal.vue'
import BarChart from '@/components/BarChart.vue'

export default {
    data(){
        return{
            //用于显示
            users:[],
            Change:false,
            currentPage: 1,
            pageSize: 7,
            //用于插入
            username:"",
            password:"",
            phoneNumber:"",
            email:"",
            //用于查询
            userId_Find:"",
            username_Find:"",
            //用于更新
            userId_update:"",
            username_update:"",
            password_update:"",
            phoneNumber_update:"",
            email_update:"",
        }
    },
    computed: {
        // 计算总页数
        pageCount() {
        return Math.ceil(this.filteredUsers.length / this.pageSize);
        },
        //筛选后的用户
        filteredUsers(){
            if(this.userId_Find||this.username_Find){
                return this.users.filter((user)=>{
                    return String(user.userId).includes(String(this.userId_Find))&&String(user.username).includes(String(this.username_Find))
                })
            }
            else{
                return this.users
            }
        },
        //当前页的数据
        currentUsers() {
            let start = (this.currentPage - 1) * this.pageSize;
            let end = this.currentPage * this.pageSize;
            return this.filteredUsers.slice(start, end);
        },
        //定义图表数据
        chartData(){
            return {
                labels: ['0','1', '2', '3', '4', '5'],
                datasets: [
                    {
                        label: '员工人数',
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
                    text: '人员评分'
                },
                responsive: true,
            }
        }
    },
    created(){
        this.getusers()
    },
    watch: {
        Change(){
            this.getusers();
            //this.$router.go(0);
        },
        // currentPage() {
        //     this.getusers()
        // },
    },
    methods: {
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
        CountStatus(status){
            let count=0
            for(let i=0;i<this.filteredUsers.length;i++){
                if(this.filteredUsers[i].score===status){
                    count++
                }
            }
            return count
        },
        async Adduser(){
            await API.post("/company/personals",
            //传入的参数:username,password,phoneNumber,email
            JSON.stringify({
                "username":this.username,
                "password":this.password,
                "phoneNumber":this.phoneNumber,
                "email":this.email,}),
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+localStorage.getItem("token")
                }
            }).then((response)=>{
                console.log(response)
                if(response.data.message==='success'){
                    alert("添加成功")
                    this.Change=!this.Change
                }
                else{
                    alert("添加失败")
                }
            })
        },
        async UpdateUser(){
            await API.put("/company/personals",
            //传入的参数:userId,username,password,phoneNumber,email
            JSON.stringify({
                "userId":this.userId_update,
                "username":this.username_update,
                "password":this.password_update,
                "phoneNumber":this.phoneNumber_update,
                "email":this.email_update,}),
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
        async Delete(number){
            await API.request({
                method: 'delete',
                url: "/company/personals",
                data: {"userId": number},
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+localStorage.getItem("token")
                }
            }).then((response)=>{
                if(response.data.message==='success'){
                    alert("删除成功")
                    this.Change=!this.Change
                }
                else{
                    alert("删除失败")
                }
            }).catch((error)=>{
                console.log(error)
            })
        },
        async Export(){
            await API.request({
                method: 'get',
                url: "/company/personals/export",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+localStorage.getItem("token")
                },
                responseType: 'blob',
            }).then((response)=>{
                    const blob = new Blob([response.data], {type: 'application/vnd.ms-excel'})
                    const filename = '人员信息表.xls'
                    saveAs(blob, filename)
                    alert("导出成功")
            }).catch((error)=>{
                alert("导出失败")
                console.log(error)
            })
        },
        PagePrint(){
            window.print()
        },
        SetDefult(user){
            this.userId_update=user.userId
            this.username_update=user.username
            this.password_update=user.password
            this.phoneNumber_update=user.phoneNumber
            this.email_update=user.email
        },
    },
    components:{
        AddModal,PutModal,BarChart
    }
}
</script>

<style>

</style>