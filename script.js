// 初始化数据存储
let records = JSON.parse(localStorage.getItem('temperatureRecords')) || [];

// 分页配置
const PAGE_SIZE = 10;
let currentPage = 1;

// 获取DOM元素
const form = document.getElementById('temperatureForm');
const table = document.getElementById('recordsTable').getElementsByTagName('tbody')[0];

// 初始化图表
let chart;

// 更新图表数据
function updateChart() {
    const sortedRecords = [...records].sort((a, b) => {
        return new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`);
    });

    const labels = sortedRecords.map(record => `${record.date} ${record.time}`);
    chart.data.labels = labels;
    chart.data.datasets[0].data = sortedRecords.map(record => record.temperature);
    chart.data.datasets[1].data = new Array(labels.length).fill(37);
    chart.update();
}

// 更新表格
function updateTable() {
    table.innerHTML = '';
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageRecords = records.slice(startIndex, endIndex);

    // 更新分页控件
    updatePagination();

    pageRecords.forEach((record, pageIndex) => {
        const index = startIndex + pageIndex;
        const row = table.insertRow();
        const tempClass = record.temperature >= 37 ? 'high-temperature' : '';
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.time}</td>
            <td class="${tempClass}">${record.temperature}</td>
            <td class="editable" onclick="startEditing(this, ${index})">${record.medication || '-'}</td>
            <td>
                <button class="delete-btn" onclick="deleteRecord(${index})">删除</button>
            </td>
        `;
    });
}

function startEditing(cell, index) {
    if (cell.classList.contains('editing')) return;
    
    const currentValue = records[index].medication || '';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;
    
    cell.classList.add('editing');
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();
    
    input.addEventListener('blur', () => finishEditing(cell, index, input.value));
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
    });
}

function finishEditing(cell, index, value) {
    cell.classList.remove('editing');
    records[index].medication = value;
    localStorage.setItem('temperatureRecords', JSON.stringify(records));
    cell.textContent = value || '-';
}

// 删除记录
function deleteRecord(index) {
    records.splice(index, 1);
    localStorage.setItem('temperatureRecords', JSON.stringify(records));
    updateTable();
    updateChart();
}

// 表单提交处理
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newRecord = {
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        temperature: parseFloat(document.getElementById('temperature').value),
        medication: document.getElementById('medication').value
    };

    records.push(newRecord);
    localStorage.setItem('temperatureRecords', JSON.stringify(records));

    updateTable();
    updateChart();
    form.reset();

    // 设置默认日期和时间
    const now = new Date();
    document.getElementById('date').value = now.toISOString().split('T')[0];
    document.getElementById('time').value = now.toTimeString().slice(0, 5);
});

// 更新分页控件
function updatePagination() {
    const totalPages = Math.ceil(records.length / PAGE_SIZE);
    const paginationDiv = document.querySelector('.pagination');
    if (!paginationDiv) {
        const newPaginationDiv = document.createElement('div');
        newPaginationDiv.className = 'pagination';
        document.querySelector('.data-container').appendChild(newPaginationDiv);
    }

    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>上一页</button>
        <span>第 ${currentPage} 页 / 共 ${totalPages} 页</span>
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>下一页</button>
    `;
}

// 切换页面
function changePage(page) {
    currentPage = page;
    updateTable();
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    
    // 初始化图表
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '体温变化',
                data: [],
                borderColor: '#3498db',
                tension: 0.1,
                fill: false
            }, {
                label: '发烧线',
                data: [],
                borderColor: 'red',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    min: 35,
                    max: 42,
                    ticks: {
                        stepSize: 0.1
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `体温: ${context.parsed.y}℃`;
                        }
                    }
                }
            }
        }
    });

    updateTable();
    updateChart();

    // 设置默认日期和时间
    const now = new Date();
    document.getElementById('date').value = now.toISOString().split('T')[0];
    document.getElementById('time').value = now.toTimeString().slice(0, 5);
});
