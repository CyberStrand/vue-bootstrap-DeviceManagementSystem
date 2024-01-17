<template>
    <h1>进行反馈</h1>
    <br>
    <br>
    <el-input v-model="textarea" :rows="2" type="textarea" placeholder="告诉我们你的反馈" />
    <br>
    <br>
    <br>
    <el-button type="primary" @click="submitFeedback">提交</el-button>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const apiHeaders = {
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + localStorage.getItem("token") // Replace with your actual JWT token
};
export default {
    name: 'Feedback',
    setup() {
        onMounted(() => {
        });
        const textarea = ref(null)
        const submitFeedback = () => {
            if (!textarea.value) {
                ElMessage({
                    type: 'warning',
                    message: '内容不能为空',
                })
            } else {
                ElMessageBox.confirm(
                    '确定提交反馈？',
                    '提交',
                    {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning',
                    }
                )
                    .then(() => {
                        fetch(`http://localhost:8080/feedback`, {
                            method: 'POST',
                            headers: apiHeaders,
                            body: JSON.stringify({
                                "feedbackContent": textarea.value,
                            })
                        })
                            .then(res => res.json())
                            .then(res => {
                            })
                            .catch(error => {
                                console.error('反馈失败:', error);
                            });
                        ElMessage({
                            type: 'success',
                            message: '提交成功',
                        })
                    })
                    .catch(() => {
                        ElMessage({
                            type: 'info',
                            message: '取消提交',
                        })
                    })
            }
        }

        return {
            textarea,
            submitFeedback,
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