<template>
    <!-- Button trigger modal -->
  <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" @click.prevent="$emit('default')">
    {{ button  }}
  </button>
  
  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">{{ title }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-success" @click.prevent="$emit('submit')">提交</button>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  export default {
    props:{
      title:{
        type:String,
        default:""
      },
      button:{
        type:Array,
        default:""
    },
    },
    emits:['submit']
  }
  </script>
  
  <style>
  
  </style>