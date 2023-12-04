<template>
    <div v-if="devices.length">
    <div v-for="device in devices" :key="device.id">
        {{ device.title }}
        {{ device.status }}
        <button @click="deleteDevice(device)">Delete</button>
        <br>
    </div>
  </div>
</template>

<script>
//import axios from 'axios'

export default {
    data(){
        return{
            devices:[]
        }
    },
    mounted(){
        fetch('http://localhost:3000/devices')
            .then(res => res.json())
            .then(data => this.devices = data)
            .catch(err => console.log(err.message))
    },
    // methods:{
    //     deleteDevice(device){
    //         this.devices = this.devices.filter((item)=>{
    //             return device !== item
    //         })
    //         axios.delete('http://localhost:3000/devices/${device.id}')
    //     },
    // }

}
</script>

<style>

</style>