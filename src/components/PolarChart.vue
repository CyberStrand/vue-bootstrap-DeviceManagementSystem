<template>
  <PolarArea :data="chartData" :options="chartOptions"></PolarArea>
</template>

<script>
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { PolarArea } from 'vue-chartjs'
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

export default {
    components: {
        PolarArea
    },
    props: {
        chartData: {
            type: Object,
            required: true
        },
        chartOptions: {
            type: Object,
            default: () => {}
        }
    },
}
</script>

<style>

</style>