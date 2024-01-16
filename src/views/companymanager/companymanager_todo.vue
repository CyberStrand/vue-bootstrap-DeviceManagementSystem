<template>
    <div>
        <form class="row g-6">
            <div class="col">
                <label for="queryInput" class="visually-hidden">查询</label>
                <input type="text" class="form-control" id="queryInput" v-model="this.todoId_Find" placeholder="输入todoID">
            </div>
            <div class="col">
                <label for="queryInput" class="visually-hidden">查询</label>
                <input type="text" class="form-control" id="queryInput" v-model="this.todoStatus_Find" placeholder="输入todo状态">
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-success mb-3" @click.prevent="findtodo">查询</button>
            </div>
        </form>
        <table class="table table-striped">
            <thead class="table-light">
                <tr>
                    <th>待办事项ID</th>
                    <th>用户ID</th>
                    <th>待办内容</th>
                    <th>状态</th>
                    <th> </th>
                    <th> </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="todo in currenttodos" :key="todo.todoId">
                    <td>{{ todo.todoId }}</td>
                    <td>{{ todo.userId }}</td>
                    <td>{{ todo.todoContent }}</td>
                    <td>{{ todo.todoStatus }}</td>
                    <td><button class="btn btn-danger py-2 " @click.prevent="Delete(todo.todoId)">Delete</button></td>
                    <td><PutModal button="Update" title="修改人员信息" @submit="Updatetodo" @default="SetDefult(todo)">
                        <form>
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="form-label">todoID:</label>
                                    <input class="form-control" v-model="this.todoId_update">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">todo内容:</label>
                                    <input class="form-control" v-model="this.todoContent_update">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">todo状态:</label>
                                    <input class="form-control" v-model="this.todoStatus_update">
                                </div>
                            </div>
                        </form>
                    </PutModal></td>
                </tr>
            </tbody>
        </table>
        <div class="row g-6">
            <div class="col-auto">
            <AddModal button="新增todo" title="输入todo信息" @submit="Addtodo">
                <form>
                    <label class="form-label">todo内容:</label>
                    <input class="form-control" v-model="this.todoContent">
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
        <button @click="currentPage++" class="btn btn-success my-3 mx-3" :disabled="filteredtodos.length<=currentPage*pageSize">下一页</button>
    </div>
</template>

<script>
import API from '@/plugins/axiosInstance'
import AddModal from '@/components/AddModal.vue'
import PutModal from '@/components/PutModal.vue'

export default {
    data(){
        return{
            //用于显示
            todos:[],
            Change:false,
            currentPage: 1,
            pageSize: 7,
            //用于插入
            todoContent:"",
            //用于查询
            todoId_Find:"",
            todoStatus_Find:"",
            //用于更新
            todoId_update:"",
            todoContent_update:"",
            todoStatus_update:"",
        }
    },
    computed: {
        // 计算总页数
        pageCount() {
        return Math.ceil(this.filteredtodos.length / this.pageSize);
        },
        //筛选后的用户
        filteredtodos(){
            if(this.todoId_Find||this.todoStatus_Find){
                return this.todos.filter((todo)=>{
                    return String(todo.todoId).includes(String(this.todoId_Find))&&String(todo.todoStatus)===(String(this.todoStatus_Find))
                })
            }
            else{
                return this.todos
            }
        },
        //当前页的数据
        currenttodos() {
            let start = (this.currentPage - 1) * this.pageSize;
            let end = this.currentPage * this.pageSize;
            return this.filteredtodos.slice(start, end);
        }
    },
    created(){
        this.gettodos()
    },
    watch: {
        Change(){
            this.gettodos();
            //this.$router.go(0);
        },
        // currentPage() {
        //     this.gettodos()
        // },
    },
    methods: {
        async gettodos() {
            await API.get("/company_manager/todos", {
                params: {
                    pageNum: -1,
                },
                headers: {
                    'Authorization': "Bearer " + localStorage.getItem("token")
                }
            }).then((response) => {
                console.log(response.data.data);
                this.todos = response.data.data.list;
            }).catch((error) => {
                console.log(error);
            })
        },
        async Addtodo(){
            await API.post("/company_manager/todo",
            //传入的参数:todoname,password,phoneNumber,email
            JSON.stringify({
                "todoContent":this.todoContent,}),
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
        async Updatetodo(){
            await API.put("/company_manager/todo",
            //传入的参数:todoId,todoContent,todoStatus
            JSON.stringify({
                "todoId":this.todoId_update,
                "todoContent":this.todoContent_update,
                "todoStatus":this.todoStatus_update,}),
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
                url: "/company_manager/todo",
                data: {"todoId": number},
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
                url: "/company_manager/todos/export",
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
        SetDefult(todo){
            this.todoId_update=todo.todoId
            this.todoContent_update=todo.todoContent
            this.todoStatus_update=todo.todoStatus
        },
    },
    components:{
        AddModal,PutModal
    }
}
</script>

<style>

</style>