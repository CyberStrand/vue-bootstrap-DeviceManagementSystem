<template>
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column label="公司ID" prop="companyId" />
    <el-table-column label="公司名称" prop="companyName" />
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>


<script>
import { ElContainer, ElMain, ElTable, ElTableColumn, ElButton, ElPagination } from 'element-plus';

export default {
  components: {
    ElContainer,
    ElMain,
    ElTable,
    ElTableColumn,
    ElButton,
    ElPagination,
  },
  name: 'AdminCompany',
  data() {
    return {
      tableData: [],
      search: ''
    };
  },
  computed: {
    filterTableData() {
      return this.tableData.filter(
        (data) =>
          !this.search ||
          data.companyId.toLowerCase().includes(this.search.toLowerCase()) ||
          data.companyName.toString().toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  mounted() {
    this.fetchOrders();
  },

  methods: {
    fetchOrders() {
      // Make an API request to fetch orders data from backend using fetch
      fetch('http://localhost:8080/admin/companies', {
        method: 'Post', // Assuming you are making a POST request
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token") // Replace with your actual JWT token
        },
        body: JSON.stringify({})
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.tableData = data.data.list;
          console.log('Companies:', data); // Assign received data to orders array
        })
        .catch(error => {
          console.error('Error fetching AdminCOmpanies', error);
        });
    },
    handleDelete(index, row) {
      fetch('http://localhost:8080/admin/company', {
        method: 'Delete', // Assuming you are making a POST request
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token") // Replace with your actual JWT token
        },
        body: JSON.stringify({
          "companyId": row.companyId
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          console.log('Company deleted successfully');
          this.fetchOrders(); // 重新获取数据来更新表格
        })
        .catch(error => {
          console.error('Error deleting company', error);
        });
    },
    handleEdit(index, row) {
      fetch('http://localhost:8080/admin/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify({
          "companyId": row.companyId,
          "companyName": row.companyName
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          console.log('Company updated successfully');
          this.fetchOrders(); // Refresh table data after updating
        })
        .catch(error => {
          console.error('Error updating company', error);
          // Handle error scenarios here
        });
    },


  },
};
</script>

<style></style>