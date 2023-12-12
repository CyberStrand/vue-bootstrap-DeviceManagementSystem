<template>
    <div v-if="this.orders">
    {{ orders }}<br>
    </div>
    <div v-else>
    loading...
    </div>
</template>

<script>
import API from '@/plugins/axiosInstance'

export default {
    data(){
        return{
            orders:[],
        }
    },
    mounted(){
        API.post("/company/orders",
            JSON.stringify({"pageNum":1,"pageSize":10}),
        {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': "Bearer "+localStorage.getItem("token")
            }
        }).then((response)=>{
            console.log(response.data.data)
            this.orders=response.data.data.list
        })
    },
}
</script>

<style>

</style>