let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let myChart;

const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total-amount');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const item = {
        id: Date.now(),
        name: document.getElementById('name').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value
    };
    expenses.push(item);
    updateApp();
    form.reset();
});

function updateApp() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderList();
    updateChart();
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    totalDisplay.innerText = total.toLocaleString('en-IN');
}

function renderList() {
    list.innerHTML = expenses.map(item => `
        <li class="expense-item">
            <div>
                <strong>${item.name}</strong><br>
                <small style="color: #64748b">${item.category}</small>
            </div>
            <div style="text-align: right">
                <div style="font-weight: bold">₹${item.amount}</div>
                <button onclick="deleteItem(${item.id})" class="delete-btn">Remove</button>
            </div>
        </li>
    `).reverse().join(''); 
}

function deleteItem(id) {
    expenses = expenses.filter(item => item.id !== id);
    updateApp();
}

function updateChart() {
    
    const categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Education'];
    
    const data = categories.map(cat => 
        expenses.filter(item => item.category === cat).reduce((sum, item) => sum + item.amount, 0)
    );

    const ctx = document.getElementById('expenseChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{ 
                data: data, 
                
                backgroundColor: [
                    '#3b82f6', // Blue (Food)
                    '#10b981', // Green (Rent)
                    '#f59e0b', // Orange (Transport)
                    '#6366f1', // Indigo (Entertainment)
                    '#ec4899', // Pink (Shopping)
                    '#8b5cf6', // Purple (Health)
                    '#06b6d4'  // Cyan (Education)
                ],
                borderWidth: 0
            }]
        },
        options: { 
            plugins: { 
                legend: { 
                    position: 'bottom',
                    labels: { color: '#e5e7eb' }
                } 
            } 
        }
    });
}

updateApp();