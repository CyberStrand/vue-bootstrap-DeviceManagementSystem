<template></template>

<script>
export default {
  data() {
    return {
      list: ['平台管理员：公司管理', '平台管理员：设备管理', '平台管理员：人员管理',
        '平台管理员：订单管理', '平台管理员：日志管理', '平台管理员：待办事项管理',
        '平台管理员：反馈管理', '提出反馈']
    }
  },
  mounted() {
    this.$emit('send', this.list)
  }
}
</script>

<style></style>