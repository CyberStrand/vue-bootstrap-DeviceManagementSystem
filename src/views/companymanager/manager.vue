<template>
  <Dashboard></Dashboard>
</template>

<script>
import Dashboard from '@/components/Dashboard.vue';

export default {
  components: { Dashboard },
  data(){
    return{
      list:['公司管理员:设备管理','公司管理员:员工管理','公司管理员:订单管理','公司管理员:查看评价','公司管理员:ToDo']
    }
  },
  mounted(){
    this.$emit('send',this.list)
  }
}
</script>

<style>

</style>