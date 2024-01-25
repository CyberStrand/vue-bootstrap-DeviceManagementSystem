<template>
<div v-if="isLoginPage||isHomePage||isPanelPage">
  <router-view></router-view>
</div>
<div v-else>

  <div class="container m-0">
    <div class="row">
      <div class="col-3 d-print-none">
        <Sidebar></Sidebar>
      </div>
      <div class="col-9">
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
  watch: {
    '$route': function(to, from) {
      if(!localStorage.getItem("token")&&to.path!=='/login'&&to.path!=='/signup'){
        this.$router.push({name:'login'})
      }
    }
  },
  computed:
  {
    isHomePage(){
      return this.$route.path === '/home';
    },
    isLoginPage(){
      return this.$route.path === '/login'||this.$route.path === '/signup';
    },
    isPanelPage(){
      return this.$route.path === '/panel';
    }
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
  /* margin-top: 57px; */
}
/* 
nav{
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
