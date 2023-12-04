<template>
  <ul class="list-group w-100">
    <li v-for="string in stringList" :key="string" class="list-group-item d-flex justify-content-between align-items-center">
      {{ string }}
    </li>
  </ul>
</template>

<script>
export default {
  props:{
    stringList: Array,
  },
}
</script>