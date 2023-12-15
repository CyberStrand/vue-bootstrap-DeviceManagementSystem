<template>
</template>

<script>
export default {
data(){
  return{
    list:['平台管理员：公司管理']
  }
},
mounted(){
  this.$emit('send',this.list)
}
}
</script>

<style>

</style>