<template>
    <div>
        <table v-if="!selectedOrder">
            <thead>
                <tr>
                    <th>订单ID</th>
                    <th>用户ID</th>
                    <th>维修人员ID</th>
                    <th>公司ID</th>
                    <th>订单状态</th>
                    <th>紧急程度</th>
                    <th>设备ID</th>
                    <th>订单位置</th>
                    <th>发起时间</th>
                    <th>操作</th>
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
                    <td>{{ order.locationId }}</td>
                    <td>{{ formatDate(order.createdAt) }}</td>
                    <td>
                        <button @click="showOrderDetails(order)">接单</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="selectedOrder">
            <h2>Order Details</h2>
            <p><strong>订单ID: </strong> {{ selectedOrder.orderId }}</p>
            <p><strong>用户ID: </strong> {{ selectedOrder.userId }}</p>
            <p><strong>维修人员ID: </strong> {{ selectedOrder.maintenancePersonnelId }}</p>
            <p><strong>公司ID: </strong> {{ selectedOrder.companyId }}</p>
            <p><strong>订单状态: </strong> {{ selectedOrder.orderStatus }}</p>
            <p><strong>紧急程度: </strong> {{ selectedOrder.urgencyLevel }}</p>
            <p><strong>设备ID: </strong> {{ selectedOrder.deviceId }}</p>
            <p><strong>发起时间: </strong> {{ selectedOrder.orderId }}</p>
            <p><strong>操作: </strong> {{ formatDate(selectedOrder.createdAt) }}</p>
            <div>
                <button @click="acceptOrder(selectedOrder.orderId)">确认接单</button>
                <button @click="cancelAcceptance()">取消接单</button>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            orders: [], // Initialize empty array to hold orders data
            selectedOrder: null,
            locations: {}
        };
    },
    mounted() {
        this.fetchOrders(); // Fetch orders when component is mounted
    },
    methods: {
        fetchOrders() {
            // Make an API request to fetch orders data from backend using fetch
            fetch('http://localhost:8000/pendingOrders', {
                method: 'Post', // Assuming you are making a POST request
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+localStorage.getItem("token") // Replace with your actual JWT token

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
        },
        acceptOrder(orderId) {
            // Make an API request to accept order with orderId
            fetch('http://localhost:8000/acceptOrder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+localStorage.getItem("token") // Replace with your actual JWT token
                },
                body: JSON.stringify({
                    order_id: orderId // Send orderId to the backend
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Order accepted:', data);
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error accepting order:', error);
                });
        },
        showOrderDetails(order) {
            this.selectedOrder = order; // Set selected order for details view
        },
        confirmAcceptance(orderId) {
            // Make an API request to confirm order acceptance
            // Similar to your acceptOrder method but with necessary changes
            // ...

            // Example:
            // Simulate action and clear selectedOrder afterwards
            console.log('Confirmed acceptance of order:', orderId);
            this.selectedOrder = null; // Reset selected order to hide details
        },

        cancelAcceptance() {
            this.selectedOrder = null; // Clear selected order to hide details
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

  