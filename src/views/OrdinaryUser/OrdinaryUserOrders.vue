<template>




</template>

<script>
export default {
  data(){
    return{
      list:['普通用户:我的设备','普通用户:我的消息','普通用户:我的订单']
    }
  },
  mounted(){
    this.$emit('send',this.list)
  }
}
</script>

<style>

</style>