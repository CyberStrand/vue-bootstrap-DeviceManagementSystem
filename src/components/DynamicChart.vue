<template>
    <Bar :data="chartData" :options="chartOptions" ref="myChart"></Bar>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartData
} from 'chart.js'
import { Bar } from 'vue-chartjs'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    
    data(){
        return{
            chartData: {
                labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                datasets: [{
                    data: Array.from({length:12},()=>{Math.floor(Math.random() * (50 - 5 + 1)) + 5}),
                    backgroundColor: '#198754'
                }]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: true
            },
        }
    },
    computed:{
        D_data(){
            return Array
        }
    },
    mounted(){
        setInterval(() => {
            this.D_data = this.getRandomInt()
        }, 3000)
    },
    methods:{
        getRandomInt() {
            return Array.from({length:12},()=>{Math.floor(Math.random() * (50 - 5 + 1)) + 5}) 
        },
    },
    components: {
        Bar
    },
}
</script>

<style>

</style>