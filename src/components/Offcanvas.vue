<template>
    <a class="navbar-brand" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
      <img src="../assets/img_avatar1.png" style="width:40px" class="rounded-pill"/>
    </a>

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
      email: "",
      name: "",
      offline: true,
    };
  },
}
</script>

<style>

</style>