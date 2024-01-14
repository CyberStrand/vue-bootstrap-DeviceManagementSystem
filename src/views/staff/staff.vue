<template>
  
</template>

<script>
export default {
  data(){
    return{
      list:['公司管理员:人员管理','人员详情','我的人员']
    }
  },
  mounted(){
    this.$emit('send',this.list)
  }
}
</script>

<style>

</style>