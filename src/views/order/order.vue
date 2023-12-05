<template>
  
</template>

<script>
export default {
  data(){
    return{
      list:['订单概况','订单详情','我的订单']
    }
  },
  mounted(){
    this.$emit('send',this.list)
  }
}
</script>

<style>

</style>