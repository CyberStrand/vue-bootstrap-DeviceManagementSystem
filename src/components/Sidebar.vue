<template>
  <div class="d-flex flex-column flex-shrink-0 text-white bg-dark" style="width: 220px;position: fixed; height: 100vh; overflow-y: auto;">
    <ul class="nav nav-pills flex-column mb-auto fw-bold">
      <br>
      <li v-for="(string,index) in stringList" :key="index" class="nav-item m-1">
          <router-link class="nav-link text-white" :to="{name:string}">
            <a>{{ string }}</a>
            <hr>
          </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props:{
    stringList: Array,
  },
}
</script>

<style>
nav{
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>