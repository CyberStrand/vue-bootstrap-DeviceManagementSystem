<template>
    <GridCard></GridCard>
</template>

<script>
import GridCard from '@/components/GridCard.vue'

export default {
  name: 'HomeView',
  components: {
    GridCard
  },
  data(){
    return{
      list:[],
    }
  },
  mounted(){
    this.$emit('send',this.list)
  }
}
</script>
