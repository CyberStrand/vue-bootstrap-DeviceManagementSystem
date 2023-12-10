import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import device from '../views/device/device.vue'
import deviceView1 from'../views/device/deviceView1.vue'
import deviceView2 from'../views/device/deviceView2.vue'
import deviceView3 from'../views/device/deviceView3.vue'
import staff from '../views/staff/staff.vue'
import staffView1 from'../views/staff/staffView1.vue'
import staffView2 from'../views/staff/staffView2.vue'
import staffView3 from'../views/staff/staffView3.vue'
import order from '../views/order/order.vue'
import orderView1 from'../views/order/orderView1.vue'
import orderView2 from'../views/order/orderView2.vue'
import orderView3 from'../views/order/orderView3.vue'
import orderView4 from'../views/order/orderView4.vue'
import orderView5 from '@/views/order/orderView5.vue'
import person from '../views/person.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
    name: '订单概况',
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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
