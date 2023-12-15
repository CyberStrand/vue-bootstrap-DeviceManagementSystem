<template>
    <main class="form-signin w-25 m-auto">
        <form @submit.prevent="submitForm">
            <img src="../assets/img_avatar1.png" style="width:60px" class="rounded-pill"/>
            <h1 class="h3 mb-3 fw-normal">Please sign up</h1>

            <div class="form-floating">
                <input type="email" class="form-control" v-model="email" placeholder="Email">
                <label for="floatingInput">Email</label>
            </div>

            <div class="form-floating mb-3">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <div v-if="!this.isSend">
                        <button class="btn btn-primary w-100 py-2 my-2" @click.prevent="sendcode">Send Code</button>
                        </div>
                        <div v-else>
                        <button class="btn btn-secondary w-100 py-2 my-2" disabled>Code is Sent</button>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                    <input type="code" class="form-control w-100 py-2 my-2" v-model="code" placeholder="Code">
                    </div>
                </div>
            </div>

            <div class="form-floating">
            <input type="phonenumber" class="form-control" v-model="phone" placeholder="PhoneNumber">
            <label for="floatingInput">phoneNumber</label>
            </div>

            <div class="form-floating">
            <input type="username" class="form-control" v-model="username" placeholder="Username">
            <label for="floatingInput">Username</label>
            </div>

            <div class="form-floating">
            <input type="password" class="form-control" v-model="password" placeholder="Password">
            <label for="floatingPassword">Password</label>
            </div>

            <div class="form-check text-start my-3">
            <input class="form-check-input" type="checkbox" value="remember-me" v-model="remember">
            <label class="form-check-label" for="flexCheckDefault">
                Remember me
            </label>
            </div>
            <button class="btn btn-primary w-100 py-2 my-2" type="submit">Sign up</button>
            <p class="mt-5 mb-3 text-body-secondary">© 2017–2023</p>
        </form>
    </main>

</template>

<script>
import API from '@/plugins/axiosInstance.js';

export default {
    data(){
        return {
        email: '245231528@qq.com',
        phone: 13035610707,
        username: 'ziqi',
        password: '145411',
        code:'',
        remember: false,
        isSend: false
        }
    },
    methods:{
        async submitForm() {
        API.post("/register", 
            JSON.stringify({
                "username": this.username,
                "email": this.email,
                "code": this.code,
                "password": this.password,
                "phoneNumber": this.phone
            }), 
            {
                headers:{
                    'Content-Type': 'application/json',
                }
            }
        ).then((response)=>{
            console.log(response)
            if (response.data.message == 'success') {
                // 如果获取到了有效的 token，导航到 "home" 页面
                this.$router.push({ name: 'login' })
            }
        })
        },

        async sendcode() {
            // 发送请求到后端来获取 token
            API.post("/email", 
                JSON.stringify({
                    "email":this.email,
                }), 
                {
                    headers:{
                        'Content-Type': 'application/json',
                    }
                }
            ).then((response)=>{
                if(response.data.data == 1){
                    this.isSend = true
                }
            })
        }
    }
}
</script>

<style>

</style>