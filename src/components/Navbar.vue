<template>
<nav class="navbar navbar-dark bg-dark navbar-expand-lg fixed-top">
  <div class="container-fluid">

    <a class="navbar-brand" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
      <img src="../assets/img_avatar1.png" style="width:40px" class="rounded-pill"/>
    </a>

    <div class="collapse navbar-collapse ">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item " :class="this.active">
          <router-link :to="{name:'home'}" class="nav-link">
            首页
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name:'普通用户'}" class="nav-link">
            普通用户
          </router-link>
        </li>

        <li class="nav-item">
          <router-link :to="{name:'公司管理员'}" class="nav-link">
            公司管理员
          </router-link>
        </li>

        <li class="nav-item">
          <router-link :to="{name:'order'}" class="nav-link">
            订单管理
          </router-link>
        </li>

        <li class="nav-item">
          <router-link :to="{name: 'admin'}" class="nav-link">
            平台管理员
          </router-link>
        </li>

      </ul>
天气：
      <div id="he-plugin-simple"></div>

      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>


  </div>
</nav>
<div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">个人资料</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="list-group list-group-flush ">
          <li class="list-group-item">
            <img src="../assets/img_avatar1.png" style="width:60px" class="rounded-pill"/>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>邮箱</span>
            <span>{{ email }}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>名称</span>
            <span>{{ name }}</span>
          </li>
          <li class="list-group-item" v-if="offline">
            <router-link to="/login" class="btn btn-outline-success">Log in</router-link>
          </li>
          <li class="list-group-item" v-if="offline">
            <router-link to="/login" class="btn btn-outline-success">Sign up</router-link>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      email: '245231528@qq.com',
      name: '未来最棒',
      offline: true,
    };
  },
  created() {
    window.WIDGET = {
      "CONFIG": {
        "modules": "01234",
        "background": "5",
        "tmpColor": "FFFFFF",
        "tmpSize": "16",
        "cityColor": "FFFFFF",
        "citySize": "16",
        "aqiColor": "FFFFFF",
        "aqiSize": "16",
        "weatherIconSize": "24",
        "alertIconSize": "18",
        "padding": "10px 10px 10px 10px",
        "shadow": "0",
        "language": "auto",
        "fixed": "false",
        "vertical": "top",
        "horizontal": "left",
        "key": "dbf7ce395e2c4aaf9c65a9c0cdd4a5c4"
      }
    };
    (function (d) {
      const c = d.createElement('link');
      c.rel = 'stylesheet'
      c.href = 'https://widget.qweather.net/simple/static/css/he-simple.css?v=1.5.0'
      const s = d.createElement('script');
      s.src = 'https://widget.qweather.net/simple/static/js/he-simple.js?v=1.5.0'
      const sn = d.getElementsByTagName('script')[0];
      sn.parentNode.insertBefore(c, sn)
      sn.parentNode.insertBefore(s, sn)
    })(document)
  }
};
</script>

<style>

</style>