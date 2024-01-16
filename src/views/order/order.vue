<template>
  
</template>

<script>
export default {
  data(){
    return{
      list:['公司管理员:订单管理','订单详情','我的订单','维修人员：可接订单','维修人员：我的订单','维修人员：待办事项']
    }
  },
  mounted(){
    this.$emit('send',this.list)
  }
}
</script>

<style>

</style>