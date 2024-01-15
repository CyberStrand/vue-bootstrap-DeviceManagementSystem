import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import companymanager from '../views/companymanager/manager.vue'
import companymanager_deviceVue from '../views/companymanager/companymanager_device.vue'
import companymanager_staffVue from '../views/companymanager/companymanager_staff.vue'
import companymanager_orderVue from '../views/companymanager/companymanager_order.vue'

import order from '../views/order/order.vue'
import orderView4 from '../views/order/orderView4.vue'
import orderView5 from '@/views/order/orderView5.vue'

import person from '../views/person.vue'
import login from '../views/login.vue'
import OrdinaryUserToDo from "../views/OrdinaryUser/OrdinaryUserToDo.vue";
import Admin from "../views/Admin/Admin.vue"
import AdminCompany from "../views/Admin/AdminCompany.vue"
import AdminDevice from "../views/Admin/AdminDevice.vue"
import AdminPersonnel from "../views/Admin/AdminPersonnel.vue"
import AdminOrder from "../views/Admin/AdminOrder.vue"
import AdminLog from "../views/Admin/AdminLog.vue"
import AdminTodo from "../views/Admin/AdminTodo.vue"
import OrdinaryUser from "@/views/OrdinaryUser/OrdinaryUser.vue";
import OrdinaryUserDevices from "@/views/OrdinaryUser/OrdinaryUserDevices.vue";
import OrdinaryUserMessages from "@/views/OrdinaryUser/OrdinaryUserMessages.vue";
import OrdinaryUserOrder from "@/views/OrdinaryUser/OrdinaryUserOrders.vue";
import signup from "@/views/signup.vue";



const routes = [
  {
    path: '/',
    redirect: "/login"
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin
  },
  {
    path: "/admin/company",
    name: '平台管理员：公司管理',
    component: AdminCompany
  },
  {
    path: "/admin/device",
    name: '平台管理员：设备管理',
    component: AdminDevice
  },
  {
    path: "/admin/personnel",
    name: '平台管理员：人员管理',
    component: AdminPersonnel
  },
  {
    path: "/admin/order",
    name: '平台管理员：订单管理',
    component: AdminOrder
  },
  {
    path: "/admin/log",
    name: '平台管理员：日志管理',
    component: AdminLog
  },
  {
    path: "/admin/todo",
    name: '平台管理员：待办事项管理',
    component: AdminTodo
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/OrdinaryUser',
    name: '普通用户',
    component: OrdinaryUser
  },
  {
    path: '/OrdinaryUserDevices',
    name: '普通用户:我的设备',
    component: OrdinaryUserDevices
  },
  {
    path: '/OrdinaryUserMessages',
    name: '普通用户:我的消息',
    component: OrdinaryUserMessages,
  },
  {
    path: '/OrdinaryUserOrder',
    name: '普通用户:我的订单',
    component: OrdinaryUserOrder,
  },
  {
    path:'/OrdinaryUserToDo',
    name:'普通用户:ToDo',
    component:OrdinaryUserToDo ,
  },
  {
    path: '/companymanager',
    name: '公司管理员',
    component: companymanager
  },
  {
    path: '/companymanager_device',
    name: '公司管理员:设备管理',
    component: companymanager_deviceVue
  },
  {
    path: '/companymanager_staff',
    name: '公司管理员:员工管理',
    component: companymanager_staffVue
  },
  {
    path: '/companymanager_order',
    name: '公司管理员:订单管理',
    component: companymanager_orderVue
  },

  {
    path: '/order',
    name: 'order',
    component: order
  },

  {
    path: '/order4',
    name: '维修人员：可接订单',
    component: orderView4
  },
  {
    path: '/order5',
    name: '维修人员：我的订单',
    component: orderView5
  },
  {
    path: '/person',
    name: 'person',
    component: person
  },
  {
    path: '/login',
    name: 'login',
    component: login

  },
  {
    path: '/signup',
    name: 'signup',
    component: signup

  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router
