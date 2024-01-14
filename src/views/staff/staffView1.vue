<template>
    <div>
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
                <button type="submit" class="btn btn-primary mb-3" @click.prevent="finduser">查询</button>
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
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in filteredUsers" :key="user.userId">
                    <td>{{ user.userId }}</td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.phoneNumber }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.userType }}</td>
                    <td>{{ user.score }}</td>
                    <td>{{ companyId}}</td>
                    <td><button class="btn btn-danger py-2 " @click.prevent="Delete(user.userId)">Delete</button></td>
                </tr>
            </tbody>
        </table>
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
        <br>
        <!-- 分页控件 -->
        <button @click="currentPage--" class="btn btn-primary my-3 mx-3" :disabled="currentPage <= 1">上一页</button>
        <span>页码: {{ currentPage }}/{{ pageCount }}</span>
        <button @click="currentPage++" class="btn btn-primary my-3 mx-3" :disabled="users.length<pageSize">下一页</button>
    </div>
</template>

<script>
import API from '@/plugins/axiosInstance'
import AddModal from '@/components/AddModal.vue'

export default {
    data(){
        return{
            //用于显示
            users:[],
            Change:false,
            currentPage: 1,
            pageSize: 8,
            //用于插入
            username:"",
            password:"",
            phoneNumber:"",
            email:"",
            //用于查询
            userId_Find:"",
            username_Find:"",
        }
    },
    computed: {
        // 计算总页数
        pageCount() {
        return Math.ceil(this.users.length / this.pageSize);
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
        }
    },
    created(){
        this.getusers()
    },
    watch: {
        Change(){
            this.getusers()
        },
        currentPage() {
            this.getusers()
        },
    },
    methods: {
        async getusers() {
            await API.get("/company/personals", {
                params: {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize
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
    },
    components:{
        AddModal
    }
}
</script>

<style>

</style>