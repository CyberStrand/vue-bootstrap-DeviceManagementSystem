<template>
  <Navbar></Navbar>
  <div class="container m-0">
    <div class="row">
      <div class="col-2 ps-0 pe-1 bg-dark">
        <Sidebar :stringList="this.stringList"></Sidebar>
      </div>
      <div class="col-10 pe-0">
        <router-view></router-view>
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
      stringList:['设备概况','设备详情','我的设备'],
    }
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
