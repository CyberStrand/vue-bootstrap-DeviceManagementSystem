<template slot-scope="scope">
  <el-container style="min-height: 100vh">
    <el-container>
      <el-main>
        <!--选择栏-->
        <div class="search-bar">
          <el-input type="text" class="search-input" v-model="company_name" :style="inputStyle"
            placeholder="公司名称"></el-input>
          <el-button type="primary" @click="fetchCompany">查询</el-button>
          <!-- 导出 -->
          <el-button style="float:left" type="success" @click="clickExport"><el-icon>
              <Promotion />
            </el-icon>&nbsp;导出</el-button>
          <!-- 打印 -->
          <el-button v-print="'#printArea'" type="success"> <el-icon>
              <Printer />
            </el-icon>打印</el-button>
          <!--增加-->
          <div class="action-buttons">
            <el-button type="primary" @click="openDialog">新增</el-button>
          </div>
        </div>


        <!-- 数据表 -->
        <el-table id="printArea" :data="tableData" :default-sort="{ prop: 'purchaseDate', order: 'descending' }"
          style="width: 100%">
          <el-table-column fixed prop="companyId" label="公司ID" width="80" />
          <el-table-column prop="companyName" label="公司名称" width="100" />
          <el-table-column fixed="right" label="操作">
            <template v-slot="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row.companyId)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.companyId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页栏-->
        <div class="pagination-bar">
          <el-pagination v-model="pageNum" :page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>

        <!--添加公司对话框-->
        <el-dialog title="新增公司" v-model="dialogVisible" width="30%" :before-close="handleClose">
          <el-form :model="formData" ref="formDataRef" label-width="80px">
            <!-- <el-form-item label="公司ID" prop="companyId">
              <el-input v-model="formData.companyId"></el-input>
            </el-form-item> -->
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="formData.companyName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveData">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <!--编辑公司对话框-->
        <el-dialog title="编辑公司" v-model="EditDialogVisible" width="30%" :before-close="handleClose">
          <el-form :model="formData" ref="formDataRef" label-width="80px">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="formData.companyName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateCompany">修改</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <!-- 导出 -->
        <el-dialog title="导出所有公司" v-model="exportDialogVisible" width="30%" :before-close="handleClose">
          <el-button type="primary" @click="exportAllCompanies"> &nbsp;导出</el-button>
        </el-dialog>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { ref, onMounted, toRaw } from 'vue';
import { export_json_to_excel } from "@/vendor/Export2Excel";


const apiHeaders = {
  'Content-Type': 'application/json',
  'Authorization': "Bearer " + localStorage.getItem("token") // Replace with your actual JWT token
};
export default {
  name: 'AdminCompany',
  setup() {
    const dialogVisible = ref(false);
    const tableData = ref([]);
    const total = ref(0);
    const pageNum = ref(1);
    const pageSize = ref(5);
    const status = ref('');
    const ownerId = ref(24);
    const company_id = ref('');
    const company_name = ref(null);
    const options = ref([
      { value: '0', label: '正常运行中' },
      { value: '1', label: '维修中' },
      { value: '2', label: '发生错误' },
    ]);
    const inputStyle = ref({ 'font-size': '11px' });
    const EditDialogVisible = ref(false);
    const formData = ref({
      companyId: '',
      companyName: '',
    });
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };//重定义时间表达格式
    const handleSizeChange = (pagesize) => {
      pageSize.value = pagesize;
      fetchCompany();
    };//修改每一页展示的记录数目
    const handleCurrentChange = (pagenum) => {
      pageNum.value = pagenum;
      fetchCompany();
    };
    const fetchCompany = () => {
      fetch(`http://localhost:8080/admin/companies?pageNum=${pageNum.value}&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders
      })
        .then(res => res.json())
        .then(res => {
          tableData.value = res.data.list;
          total.value = res.data.total;
          console.log(tableData.value)
          if (company_name.value) {
            tableData.value = tableData.value.filter(company => company.companyName.includes(company_name.value));
            console.log('查询后结果：')
            console.log(tableData.value)
          }
        })
        .catch(error => {
          console.error('获取数据失败:', error);
        });
    };//获取公司信息（查）
    const handleDelete = (companyId) => {
      fetch(`http://localhost:8080/admin/company`, {
        method: 'DELETE',
        headers: apiHeaders,
        body: JSON.stringify({
          "companyId": companyId,
        })
      })
        .then(response => {
          if (response.ok) {
            console.log('删除成功');
            fetchCompany();
          } else {
            console.error(`删除失败: ${response.status} - ${response.statusText}`);
          }
        })
        .catch(error => {
          console.error('删除失败', error.message);
        });
    };//删除公司（删）
    const handleEdit = (companyId) => {
      EditDialogVisible.value = true;
      company_id.value = companyId;
    };
    const openDialog = () => {
      dialogVisible.value = true;
    };//打开添加公司对话框
    const handleClose = (done) => {
      done();
    };//关闭添加公司对话框
    const saveData = () => {
      console.log(formData.value)
      console.log(toRaw(formData.value))
      fetch("http://localhost:8080/admin/company", {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(formData.value)
      })
        .then(response => response.json())
        .then(data => {
          console.log('Response from server:', data);
          dialogVisible.value = false;// 关闭对话框
          fetchCompany();//自动刷新
        })
        .catch(error => {
          console.error('Error during data submission:', error);
        });
    };//保存添加公司对话框中的数据
    const updateCompany = () => {
      formData.value.companyId = company_id.value;
      console.log(formData.value)
      console.log(toRaw(formData.value))
      fetch("http://localhost:8080/admin/company", {
        method: 'PUT',
        headers: apiHeaders,
        body: JSON.stringify({
          'companyId': formData.value.companyId,
          'companyName': formData.value.companyName
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log('Response from server:', data);
          dialogVisible.value = false;// 关闭对话框
          fetchCompany();//自动刷新
        })
        .catch(error => {
          console.error('Error during data submission:', error);
        });
    };
    const getStatusLabel = (status) => {
      const statusMap = {
        '0': '正常运行中',
        '1': '维修中',
        '2': '发生错误',
      };
      return statusMap[status] || '';
    };

    const getStatusColor = (status) => {
      if (status === 2) return '#ff7b7b'
      else if (status === 0) return '#5b952a'
    };

    const clickExport = () => {
      exportDialogVisible.value = true;
    };
    const exportDialogVisible = ref(false);
    const exportAllCompanies = () => {
      console.log("执行了exportAllCompanies函数");
      fetch(`http://localhost:8080/admin/companies?pageNum=-1&pageSize=${pageSize.value}`, {
        method: 'POST',
        headers: apiHeaders,
      })
        .then(res => res.json())
        .then(res => {
          const companies = res.data.list;
          console.log(companies);
          console.log(typeof companies)
          const tHeader = ['公司ID', '公司名'];
          const filterVal = ['companyId', 'companyName'];
          const data = formatJson(filterVal, companies);
          export_json_to_excel(tHeader, data, '所有公司');
        });
    };
    const formatJson = (filterVal, jsonData) => {
      console.log("执行了formatJson函数");
      return jsonData.map(v => filterVal.map(j => v[j]));
    };

    onMounted(() => {
      fetchCompany();
    });

    return {
      dialogVisible,
      tableData,
      total,
      pageNum,
      company_name,
      pageSize,
      status,
      ownerId,
      options,
      inputStyle,
      formData,
      EditDialogVisible,
      exportDialogVisible,
      exportAllCompanies,
      clickExport,
      getStatusColor,
      getStatusLabel,
      updateCompany,
      handleEdit,
      openDialog,
      fetchCompany,
      handleSizeChange,
      handleCurrentChange,
      handleDelete,
      handleClose,
      formatJson,
      formatDate,
      saveData,
    };
  },
};
</script>

<style scoped>
.search-bar {
  padding: 10px 0;
  align-items: center;
}

.search-input {
  width: 100px;
  margin-right: 10px;
}

.action-buttons {
  padding: 10px 0;
}

.pagination-bar {
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
}

.el-table th,
.el-table td {
  text-align: center;
}

.el-dialog {
  overflow-y: auto;
}

/* Custom styles for status */
.error-status {
  color: #ff7b7b;
  /* Light red */
}
</style>