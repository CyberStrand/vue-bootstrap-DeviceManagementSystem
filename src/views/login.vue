<template>
    <main class="form-signin w-25 m-auto">
        <form @submit.prevent="submitForm">
            <img src="../assets/img_avatar1.png" style="width:60px" class="rounded-pill"/>
            <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

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
            <button class="btn btn-success w-100 py-2 my-2" type="submit">Sign in</button>
            <router-link class="btn btn-secondary w-100 py-2" :to="{name:'signup'}">Register</router-link>
            <p class="mt-5 mb-3 text-body-secondary">© 2017–2023</p>
        </form>
    </main>

</template>

<script>
import API from '@/plugins/axiosInstance.js';

export default {
    data(){
        return {
        username: 'ziqi',
        password: '145411',
        remember: false
        }
    },
    methods:{
        async submitForm() {
        // 发送请求到后端来获取 token

        API.post("/login", 
            JSON.stringify({
                "username": this.username,
                "password":this.password
            }), 
            {
                headers:{
                    'Content-Type': 'application/json',
                }
            }
        ).then((response)=>{
          console.log("登录成功")
        localStorage.setItem("token",response.data.data);
        console.log(response.data.data)
        })
        // 检查是否获取到了有效的 token
        if (localStorage.getItem('token')) {
          console.log(localStorage.getItem('token'))
            // 如果获取到了有效的 token，导航到 "home" 页面
            this.$router.push({ name: 'home' })
            }
        }
    }
}
</script>

<style>

</style>