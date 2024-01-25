<template>
    <Chart></Chart>
</template>

<script>
import Chart from '@/components/chart.vue';
export default {
    components: {
        Chart
    },
}
</script>

<style scoped>
.container {
    background-image: url('~@/assets/bg.png');
    background-size: cover;
    background-repeat: no-repeat;
    width: 100vw;
    height: 100vh;
    background-position: center;
}
</style>