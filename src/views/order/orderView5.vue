<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>User ID</th>
                    <th>Maintenance Personnel ID</th>
                    <th>Company ID</th>
                    <th>Order Status</th>
                    <th>Urgency Level</th>
                    <th>Device ID</th>
                    <th>Created At</th>
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
            fetch('http://localhost:8081/maintanenceOrders', {
                method: 'Post', // Assuming you are making a POST request
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb21wYW55SWQiOi0xLCJ1c2VyVHlwZSI6Im1haW50ZW5hbmNlX3BlcnNvbm5lbCIsImV4cCI6MTcwMjI4NjYyNSwidXNlcklkIjoyMn0.fSpTMKKi0w8FRO5pQchWhM5MRjUOBPAFyqCWB9bSggw' // Replace with your actual JWT token
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

  