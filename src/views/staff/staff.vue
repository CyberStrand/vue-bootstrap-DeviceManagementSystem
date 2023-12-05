<template>
  
</template>

<script>
export default {
  data(){
    return{
      list:['人员概况','人员详情','我的人员']
    }
  },
  mounted(){
    this.$emit('send',this.list)
  }
}
</script>

<style>

</style>