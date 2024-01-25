<template>
  <div class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
    style="width: 280px; position: fixed; top: 0; left: 0; height:100vh;">
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="32" fill="currentColor"
        class="bi bi-box-fill pe-none me-2" viewBox="0 0 16 16">
        <path fill-rule="evenodd"
          d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z" />
      </svg>
      <span class="fs-4">设备管理系统</span>
    </a>
    <hr>
    <ul class="nav nav-pills flex-column mb-auto">
      <li v-show="dashboard_visible">
        <router-link :to="Dashboardroute()" class="nav-link text-white" :class="{ 'active': isActive(Dashboardroute()) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-speedometer2 pe-none me-2" viewBox="0 0 16 16">
            <path
              d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4M3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.39.39 0 0 0-.029-.518z" />
            <path fill-rule="evenodd"
              d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A8 8 0 0 1 0 10m8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3" />
          </svg>
          Dashboard
        </router-link>
      </li>

      <li v-show="device_visible">
        <router-link :to="Deviceroute()" class="nav-link text-white" :class="{ 'active': isActive(Deviceroute()) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-hdd-rack pe-none me-2" viewBox="0 0 16 16">
            <path
              d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M3 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m2 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-2.5.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
            <path
              d="M2 2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1v2H2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1V7h1a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm13 2v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1m0 7v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1m-3-4v2H4V7z" />
          </svg>
          设备管理
        </router-link>
      </li>

      <li v-show="personnel_visible">
        <router-link :to="Personroute()" class="nav-link text-white" :class="{ 'active': isActive(Personroute()) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-person-fill-gear pe-none me-2" viewBox="0 0 16 16">
            <path
              d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
          </svg>
          人员管理
        </router-link>
      </li>

      <li v-show="order_visible">
        <router-link :to="Orderroute()" class="nav-link text-white" :class="{ 'active': isActive(Orderroute()) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-cart-check pe-none me-2" viewBox="0 0 16 16">
            <path
              d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
            <path
              d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
          </svg>
          {{ orderBarName }}
        </router-link>
      </li>

      <li v-show="company_visible">
        <router-link :to="Companyroute()" class="nav-link text-white" :class="{ 'active': isActive(Companyroute()) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-cart-check pe-none me-2" viewBox="0 0 16 16">
            <path
              d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
            <path
              d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
          </svg>
          公司管理
        </router-link>
      </li>

      <li v-show="log_visible">
        <router-link :to="Logroute()" class="nav-link text-white" :class="{ 'active': isActive(Logroute()) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-cart-check pe-none me-2" viewBox="0 0 16 16">
            <path
              d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
            <path
              d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
          </svg>
          日志管理
        </router-link>
      </li>

      <li v-show="todo_visible">
        <router-link :to="Todoroute()" class="nav-link text-white" :class="{ 'active': isActive(Todoroute()) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-check2-circle pe-none me-2" viewBox="0 0 16 16">
            <path
              d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
            <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
          </svg>
          待办管理
        </router-link>
      </li>

      <li v-show="feedback_visible">
        <router-link :to="Feedbackroute()" class="nav-link text-white" :class="{ 'active': isActive(Feedbackroute()) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-cart-check pe-none me-2" viewBox="0 0 16 16">
            <path
              d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
            <path
              d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
          </svg>
          {{ feedbackBarName }}
        </router-link>
      </li>

      <li v-show="accepted_order_visible">
        <router-link :to="accepted_order_route()" class="nav-link text-white"
          :class="{ 'active': isActive(accepted_order_route()) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-cart-check pe-none me-2" viewBox="0 0 16 16">
            <path
              d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
            <path
              d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
          </svg>
          已接订单
        </router-link>
      </li>

      <li v-show="message_visible">
        <router-link :to="Messageroute()" class="nav-link text-white" :class="{ 'active': isActive(Messageroute()) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-cart-check pe-none me-2" viewBox="0 0 16 16">
            <path
              d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
            <path
              d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
          </svg>
          我的消息
        </router-link>
      </li>

      <li v-show="rank_visible">
        <router-link :to="Rankroute()" class="nav-link text-white" :class="{ 'active': isActive(Rankroute()) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-star-half pe-none me-2" viewBox="0 0 16 16">
            <path
              d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8.001 2.223 8 2.226z" />
          </svg>
          维修人员评分排行榜
        </router-link>
      </li>

      <li v-show="feedbackSys_visible">
        <router-link :to="feedbackSysRoute()" class="nav-link text-white"
          :class="{ 'active': isActive(feedbackSysRoute()) }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-chat-square-text-fill pe-none me-2" viewBox="0 0 16 16">
            <path
              d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" />
          </svg>
          系统反馈
        </router-link>
      </li>

    </ul>
    <br>
    <hr>
    菜单管理：选择可见项<hr>
    <div v-show="ordinary_visible">
    <div>设备管理<el-switch v-model="device_visible" />
      订单管理<el-switch v-model="order_visible" /></div>
    <div>
      待办管理<el-switch v-model="todo_visible" />
      评价反馈<el-switch v-model="feedback_visible" /></div>
    <div>系统反馈<el-switch v-model="feedbackSys_visible" />
        我的消息<el-switch v-model="message_visible"/>
      </div>
    <div>维修人员评分排行榜<el-switch v-model="rank_visible" /></div>
      </div>
    <div v-show="admin_visible">
      <div>设备管理<el-switch v-model="device_visible" />
        人员管理<el-switch v-model="personnel_visible" /></div>
      <div>
        订单管理<el-switch v-model="order_visible" />
        公司管理<el-switch v-model="company_visible" /></div>
      <div>日志管理<el-switch v-model="log_visible" />
        待办管理<el-switch v-model="todo_visible"/>
      </div>
      <div >反馈管理<el-switch v-model="feedback_visible"/></div>
      <div>维修人员评分排行榜<el-switch v-model="rank_visible" /></div>
     </div>
    <div v-show="maintenance_personnel_visible">
      <div>可接订单<el-switch v-model="order_visible" />
        待办管理<el-switch v-model="todo_visible" /></div>
      <div>已接订单<el-switch v-model="accepted_order_visible" />
        系统反馈<el-switch v-model="feedbackSys_visible"/>
      </div>
      <div>维修人员评分排行榜<el-switch v-model="rank_visible" /></div>
    </div>
    <div v-show="company_manager_visible">
      <div>设备管理<el-switch v-model="device_visible" />
        人员管理<el-switch v-model="personnel_visible" /></div>
      <div>订单管理<el-switch v-model="order_visible" />
        待办管理<el-switch v-model="todo_visible" /></div>
      <div>反馈管理<el-switch v-model="feedback_visible" />
        系统反馈<el-switch v-model="feedbackSys_visible"/>
      </div>
      <div>维修人员评分排行榜<el-switch v-model="rank_visible" /></div>
    </div>

    <hr>
    <div id="he-plugin-simple"></div>
    <hr>
    <div class="d-flex align-items-center text-white text-decoration-none" aria-expanded="false">
      <a class="navbar-brand me-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions"
        aria-controls="offcanvasWithBothOptions">
        <img src="../assets/img_avatar1.png" style="width:40px" class="rounded-pill" />
      </a>
      <strong>{{ user.username }}</strong>
    </div>

  <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions"
    aria-labelledby="offcanvasWithBothOptionsLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">个人资料</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <ul class="list-group list-group-flush ">
        <li class="list-group-item">
          <img src="../assets/img_avatar1.png" style="width:60px" class="rounded-pill" />
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span>Role</span>
          <span>{{ role }}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span>Email</span>
          <span>{{ user.email }}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span>UserId</span>
          <span>{{ user.username }}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span>UserId</span>
          <span>{{ user.userId }}</span>
        </li>
        <li class="list-group-item" v-if="offline">
          <router-link to="/login" class="btn btn-outline-success">Log in</router-link>
        </li>
        <li class="list-group-item" v-if="offline">
          <router-link to="/login" class="btn btn-outline-success">Sign up</router-link>
        </li>
        <li class="list-group-item" v-else>
          <router-link to="/login" class="btn btn-outline-success" @click=expire()>Log out</router-link>
        </li>
      </ul>
    </div>
  </div>
    </div>
</template>

<script>
import Offcanvas from './Offcanvas.vue';
import { ref } from 'vue';
import API from '@/plugins/axiosInstance';
export default {
  data() {
    const ordinary_visible = ref(false)
    const admin_visible =ref(false)
    // 人员可见性
    const personnel_visible = ref(false)
    // 订单可见性
    const order_visible = ref(false)
    // 日志可见性
    const log_visible = ref(false)
    // 待办事项可见性
    const todo_visible = ref(false)
    // 设备可见性
    const device_visible = ref(false)
    // 反馈可见性
    const feedback_visible = ref(false)
    // 公司可见性
    const company_visible = ref(false)
    // 维修人员 已接订单可见性
    const accepted_order_visible = ref(false)
    // 维修人员 排行榜可见性 | 默认所有人可见
    const rank_visible = ref(true)
    // 普通用户 消息可见性 
    const message_visible = ref(false)
    // 提出系统反馈 | 默认除平台管理员所有人可见
    const feedbackSys_visible = ref(true)
    // dashboard 可见性
    const dashboard_visible = ref(false)
    const company_manager_visible = ref(false)
    const maintenance_personnel_visible =ref(false)
    const orderBarName = ref('订单管理')
    const feedbackBarName = ref('反馈管理')
    const user = ref(Object)

    return {
      user,
      personnel_visible,
      order_visible,
      log_visible,
      todo_visible,
      device_visible,
      feedback_visible,
      company_visible,
      accepted_order_visible,
      rank_visible,
      message_visible,
      orderBarName,
      feedbackBarName,
      feedbackSys_visible,
      dashboard_visible,
      ordinary_visible,
      admin_visible,
      maintenance_personnel_visible,
      company_manager_visible,
    }
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
  },
  components: {
    Offcanvas
  },
  computed: {
    role() {
      return localStorage.getItem('userType');
    },
    name() {
      return localStorage.getItem('userId');
    },
    offline() {
      return !localStorage.getItem('token');
    }
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
    expire() {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userType');
    },
    Deviceroute() {
      switch (this.role) {
        case 'company_manager':
          return '/companymanager_device'
        case 'ordinary':
          return '/OrdinaryUserDevices'
        case 'admin':
          return '/admin/device'
        default:
          return '/login'
      }
    },
    Personroute() {
      switch (this.role) {
        case 'company_manager':
          return '/companymanager_staff'
        case 'ordinary':
          return '/OrdinaryUserPerson'
        case 'admin':
          return '/admin/personnel'
        default:
          return '/login'
      }
    },
    Orderroute() {
      switch (this.role) {
        case 'company_manager':
          return '/companymanager_order'
        case 'admin':
          return '/admin/order'
        case 'maintenance_personnel':
          return '/order4'
        case 'ordinary':
          return '/OrdinaryUserOrder'
        default:
          return '/login'
      }
    },
    Companyroute() {
      switch (this.role) {
        case 'admin':
          return '/admin/company'
        default:
          return '/login'
      }
    }, 
    Dashboardroute() {
      switch (this.role) {
        case 'company_manager':
          return '/dashboard'
        default:
          return '/login'
      }
    },
    Logroute() {
      switch (this.role) {
        case 'admin':
          return '/admin/log'
        default:
          return '/login'
      }
    },
    Todoroute() {
      switch (this.role) {
        case 'admin':
          return '/admin/todo'
        case 'maintenance_personnel':
          return '/maintainerToDo'
        case 'company_manager':
          return '/companymanager_todo'
        case 'ordinary':
          return '/OrdinaryUserToDo'
        default:
          return '/login'
      }
    },
    Feedbackroute() {
      switch (this.role) {
        case 'admin':
          return '/admin/feedback'
        case 'company_manager':
          return '/companymanager_feedback'
        case 'ordinary':
          return '/OrdinaryUserFeedback'
        default:
          return '/login'
      }
    },
    accepted_order_route() {
      switch (this.role) {
        case 'maintenance_personnel':
          return '/order5'
        default:
          return '/login'
      }
    },
    Rankroute() {
      switch (this.role) {
        case 'maintenance_personnel':
          return '/rank'
        case 'company_manager':
          return '/rank'
        case 'admin':
          return '/rank'
        case 'ordinary':
          return '/rank'
        default:
          return '/login'
      }
    },
    Messageroute() {
      switch (this.role) {
        case 'ordinary':
          return '/OrdinaryUserMessages'
        default:
          return '/login'
      }
    },
    feedbackSysRoute() {
      switch (this.role) {
        case 'maintenance_personnel':
          return '/feedback'
        case 'company_manager':
          return '/feedback'
        case 'ordinary':
          return '/feedback'
        default:
          return '/login'
      }
    }
  },
  mounted() {
    API.get("/user", {
      params: {
        pageNum: -1
      },
      headers: {
        'Authorization': "Bearer " + localStorage.getItem("token")
      }
    }).then((response) => {
      this.user = response.data.data;
    }).catch((error) => {
      console.log(error);
    })
    switch (this.role) {
      case 'admin':
        this.admin_visible = ref(true)
        this.personnel_visible = ref(true)
        this.device_visible = ref(true)
        this.company_visible = ref(true)
        this.order_visible = ref(true)
        this.log_visible = ref(true)
        this.todo_visible = ref(true)
        this.feedback_visible = ref(true)
        this.feedbackSys_visible = ref(false)
        break
      case 'maintenance_personnel':
        this.maintenance_personnel_visible = ref(true)
        this.todo_visible = ref(true)
        this.order_visible = ref(true)
        this.accepted_order_visible = ref(true)
        this.orderBarName = ref('可接订单')
        break
      case 'company_manager':
        this.company_manager_visible = ref(true)
        this.device_visible = ref(true)
        this.personnel_visible = ref(true)
        this.order_visible = ref(true)
        this.feedback_visible = ref(true)
        this.todo_visible = ref(true)
        this.dashboard_visible = ref(true)
        break
      case 'ordinary':
        this.ordinary_visible = ref(true)
        this.device_visible = ref(true)
        this.message_visible = ref(true)
        this.order_visible = ref(true)
        this.todo_visible = ref(true)
        this.feedback_visible = ref(true)
        this.feedbackBarName = ref('评价反馈')
        break
      default:
        console.log(this.role)
        break
    }
  }
}
</script>

<style scoped>
.nav-pills .nav-link.active {
  color: #fff !important;
  /* 设置文字颜色为白色 */
  background-color: var(--bs-success) !important;
  /* 设置背景颜色为success */
}</style>