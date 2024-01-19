<template>
<div v-if="isLoginPage">
  <router-view></router-view>
</div>
<div v-else>
  <div class="d-print-none">
  <Navbar></Navbar>
  </div>
  <div class="container m-0">
    <div class="row">
      <div class="col-3 ps-0 pe-1 d-print-none">
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

export default {
  components:{
    Navbar,Sidebar
  },
  data(){
    return{
      stringList:JSON.parse(localStorage.getItem("stringList"))||[],
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
      this.stringList=list;
      localStorage.setItem("stringList",JSON.stringify(list));
    }
  },
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
