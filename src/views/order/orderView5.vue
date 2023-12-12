<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>订单ID</th>
                    <th>用户ID</th>
                    <th>维修人员ID</th>
                    <th>公司ID</th>
                    <th>订单状态</th>
                    <th>紧急程度</th>
                    <th>设备ID</th>
                    <th>发起时间</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.orderId">
                    <td>{{ order.orderId }}</td>
                    <td>{{ order.userId }}</td>
                    <td>{{ order.maintenancePersonnelId }}</td>
                    <td>{{ order.companyId }}</td>
                    <td>{{ order.orderStatus }}</td>
                    <td>{{ order.urgencyLevel }}</td>
                    <td>{{ order.deviceId }}</td>
                    <td>{{ formatDate(order.createdAt) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            orders: [] // Initialize empty array to hold orders data
        };
    },
    mounted() {
        this.fetchOrders(); // Fetch orders when component is mounted
    },
    methods: {
        fetchOrders() {
            // Make an API request to fetch orders data from backend using fetch
            fetch('http://localhost:8000/maintanenceOrders', {
                method: 'Post', // Assuming you are making a POST request
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem("token") // Replace with your actual JWT token
                },
                body: JSON.stringify({
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Orders:', data);
                    this.orders = data.data.list; // Assign received data to orders array
                })
                .catch(error => {
                    console.error('Error fetching orders', error);
                });
        },
        formatDate(date) {
            // You can format the date as needed here
            return new Date(date).toLocaleDateString();
        }
    }
};
</script>
  
<style>
table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}
</style>

  