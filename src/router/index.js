import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import device from '../views/device/device.vue'
import deviceView1 from '../views/device/deviceView1.vue'
import deviceView2 from '../views/device/deviceView2.vue'
import deviceView3 from '../views/device/deviceView3.vue'
import staff from '../views/staff/staff.vue'
import staffView1 from '../views/staff/staffView1.vue'
import staffView2 from '../views/staff/staffView2.vue'
import staffView3 from '../views/staff/staffView3.vue'
import order from '../views/order/order.vue'
import orderView1 from '../views/order/orderView1.vue'
import orderView2 from '../views/order/orderView2.vue'
import orderView3 from '../views/order/orderView3.vue'
import orderView4 from '../views/order/orderView4.vue'
import orderView5 from '@/views/order/orderView5.vue'
import person from '../views/person.vue'
import login from '../views/login.vue'
import Admin from "../views/Admin/Admin.vue"
import AdminCompany from "../views/Admin/AdminCompany.vue"
import AdminDevice from "../views/Admin/AdminDevice.vue"
import AdminPersonnel from "../views/Admin/AdminPersonnel.vue"
import AdminOrder from "../views/Admin/AdminOrder.vue"
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
    path: '/device',
    name: 'device',
    component: device
  },
  {
    path: '/device1',
    name: '设备概况',
    component: deviceView1
  },
  {
    path: '/device2',
    name: '设备详情',
    component: deviceView2
  },
  {
    path: '/device3',
    name: '我的设备',
    component: deviceView3
  },
  {
    path: '/staff',
    name: 'staff',
    component: staff
  },
  {
    path: '/staff1',
    name: '人员概况',
    component: staffView1
  },
  {
    path: '/staff2',
    name: '人员详情',
    component: staffView2
  },
  {
    path: '/staff3',
    name: '我的人员',
    component: staffView3
  },
  {
    path: '/order',
    name: 'order',
    component: order
  },
  {
    path: '/order1',
    name: '公司管理员:订单管理',
    component: orderView1
  },
  {
    path: '/order2',
    name: '订单详情',
    component: orderView2
  },
  {
    path: '/order3',
    name: '我的订单',
    component: orderView3
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
