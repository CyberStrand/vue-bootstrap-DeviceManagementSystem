
<template>
  <el-table :data="tableData"
            :default-sort="{ prop: 'orderId', order:'ascending' }"
            style="width: 100%">
    <el-table-column type="index" label="序列号" width="100"/>
    <el-table-column prop="orderId"  label="订单号" width="100" />
    <el-table-column  prop="companyId" label="公司号" width="100" />
    <el-table-column prop="feedbackContent" label="反馈内容" />
  </el-table>

  <!--分页栏-->
  <div class="pagination-bar">
    <el-pagination
        v-model="pageNum"
        :page-size="pageSize"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>

</template>

<script>
import {onMounted, ref} from "vue";
const apiHeaders = {
  'Content-Type': 'application/json',
  'Authorization': "Bearer "+localStorage.getItem("token") // Replace with your actual JWT token
};

export default {
  setup(){
    const tableData = ref([]);
    const total =ref(0);
    const pageNum = ref(1);
    const pageSize = ref(5);
    const handleSizeChange = (page_size) => {
      console.log("执行了handleSizeChange函数");
      pageSize.value = page_size;
      fetchFeedback();
    };//修改每一页展示的记录数目
    const handleCurrentChange = (page_num) => {
      console.log("执行了handleCurrentChange函数");
      pageNum.value = page_num;
      fetchFeedback();
    };//修改页码
    const fetchFeedback = () => {
      console.log("执行了fetchDevice函数");
      fetch(`http://localhost:8080/ordinaryUser/feedback?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders,
      })
          .then(res => res.json())
          .then(res => {
            tableData.value = res.data.list;
            total.value = res.data.total;
          })
          .catch(error => {
            console.error('获取数据失败:', error);
          });
    };//（查）
    onMounted(() => {
      console.log("执行了onMounted函数");
      fetchFeedback();
    });
    return{
      tableData,
      total,
      pageNum,
      pageSize,
      fetchFeedback,
      handleSizeChange,
      handleCurrentChange,

    }
  },
};

</script>

<style scoped>

</style>