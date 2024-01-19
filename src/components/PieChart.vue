<template>
    <Doughnut :data="chartData" :options="chartOptions" />
  </template>
  
  <script>
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
  import { Doughnut } from 'vue-chartjs'
  
  ChartJS.register(ArcElement, Tooltip, Legend)
  
  export default {
    components: {
      Doughnut
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
    }
  }
  </script>
  