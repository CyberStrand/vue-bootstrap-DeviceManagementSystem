<template>
  <el-container style="min-height: 100vh">
    <el-container>
      <el-main>
        <el-table :data="formData" style="width: 100%">
          <el-table-column fixeed prop="serial_number" label="序列号" width="120"/>
          <el-table-column prop="device_name" label="设备名称" width="120"/>
          <el-table-column prop="production_company_id" label="生产公司"/>
          <el-table-column prop="status" label="设备状态" width="120"/>
          <el-table-column prop="device_model" label="设备类型" width="120"/>
          <el-table-column prop="purchase_date" label="购买时间" width="120"/>
          <el-table-column prop="warranty_time" label="保修期" width="120"/>
          <el-table-column prop="location_id" label="设备地址" width="120"/>
          <el-table-column fixed ="right" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger"  @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="demo-pagination-block">
          <div class="demonstration"></div>
          <el-pagination
              v-model:current-page="pageNum"
              v-model:page-size="pageSize"
              :page-sizes="[5, 10, 15, 20]"
              :small="small"
              :disabled="disabled"
              :background="background"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </div>
      </el-main>
    </el-container>
  </el-container>

</template>



<script>
export default {
  name: 'OrdinaryUserDevices',
  data() {
    return {
      tableData: [],
      code: 0,
      message:"",
      total: 0,
      pageNum: 1,
      pageSize: 5,
      serialNumber: null,
      deviceName: null,
      status: null,
      ownerId: 12,
      locationId: null,
      addDialogVisible: false,
      formData: {
        serial_number: null,
        device_name: null,
        location_id: null,
        owner_id:12,
        status: null,
        device_model:null,
        purchase_date:null,
        warranty_time:365,
      },
    };
  },

  created() {
    this.fetchOrders();
  },

  methods: {
    handleSizeChange(pageSize) {
      console.log(pageSize);
      this.pageSize = pageSize;
      this.fetchOrders();
    },
    handleCurrentChange(pageNum) {
      console.log(pageNum);
      this.pageNum = pageNum;
      this.fetchOrders();
    },

    fetchOrders() {
      fetch('http://localhost:8080/ordinaryUser/devices', {
        method: 'POST', // Assuming you are making a POST request
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({

        })

      })
          .then(res => res.json())
          .then(res => {
            console.log(res);
            this.code = res.code;
            console.log(this.code);
            this.message = res.message;
            console.log(this.message);
            this.tableData = res.data.list;
            console.log(this.tableData);

            this.total = res.data.total;
            console.log(this.total);
          });
    },
  },
};
</script>

<style>

</style>