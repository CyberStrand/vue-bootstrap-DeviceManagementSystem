<template>
<div v-if="isLoginPage">
  <router-view></router-view>
</div>
<div v-else>
  <Navbar></Navbar>
  <div class="container m-0">
    <div class="row">
      <div class="col-3 ps-0 pe-1">
        <Sidebar :stringList="this.stringList"></Sidebar>
      </div>
      <div class="col-9 pe-0 pt-3">
        <router-view @send="getlist"></router-view>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Navbar from "@/components/Navbar.vue"
import Sidebar from "@/components/Sidebar.vue"
import API from "@/plugins/axiosInstance.js"

export default {
  components:{
    Navbar,Sidebar
  },
  data(){
    return{
      stringList:Array,
      isLoginPage: true,
    }
  },
  watch: {
    '$route': function(to, from) {
      this.isLoginPage = to.path === '/login'||to.path === '/signup';
    }
  },
  created() {
    this.isLoginPage = this.$route.path === '/login'||this.$route.path === '/signup';
  },
  methods:{
    getlist(list){
      this.stringList=list
    }
  },
  mounted(){
    API.post("/login", 
        JSON.stringify({
            "username": "yangyutong",
            "password":12345678
        }), 
        {
            headers:{
                'Content-Type': 'application/json',
            }
        }
    ).then((response)=>{
      localStorage.setItem("token",response.data.data);
      console.log(response.data.data)
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 57px;
}

nav{
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
