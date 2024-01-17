<template>
  
</template>

<script>
export default {
  data(){
    return{
      list:['维修人员：可接订单','维修人员：我的订单','维修人员：待办事项']
    }
  },
  mounted(){
    this.$emit('send',this.list)
  }
}
</script>

<style>

</style>