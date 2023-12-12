<template>
  <div>
    <el-button @click="openDialog" type="primary">新增</el-button>

    <el-dialog v-model="dialogVisible" title="提示" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const dialogVisible = ref(false);
    const formData = ref({
      serial_number: null,
      device_name: null,
      location_id: null,
      owner_id: 12,
      status: null,
      device_model: null,
      purchase_date: null,
      warranty_time: 365,
    });

    const openDialog = () => {
      dialogVisible.value = true;
    };

    const handleClose = () => {
      // Your before-close logic here
    };

    return {
      dialogVisible,
      openDialog,
      handleClose,
      formData,
    };
  },
};
</script>

<style>

</style>