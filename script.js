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

// 获取体温对应的颜色
function getTemperatureColor(temp) {
    if (temp >= 38.5) return 'rgb(255, 99, 132)';
    if (temp >= 37) return 'rgb(255, 205, 86)';
    return 'rgb(54, 162, 235)';
}

// 更新图表数据
function updateChart() {
    const sortedRecords = [...records].sort((a, b) => {
        return new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`);
    });

    const labels = sortedRecords.map(record => `${record.date} ${record.time}`);
    const temperatures = sortedRecords.map(record => record.temperature);
    const colors = temperatures.map(temp => getTemperatureColor(temp));

    if (!chart) {
        const ctx = document.getElementById('temperatureChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '体温',
                    data: temperatures,
                    borderColor: colors,
                    segment: {
                        borderColor: ctx => getTemperatureColor(ctx.p1.parsed.y)
                    },
                    tension: 0.1
                }, {
                    label: '37℃参考线',
                    data: Array(labels.length).fill(37),
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
                        beginAtZero: false,
                        min: 35,
                        max: 42
                    }
                }
            }
        });
    } else {
        chart.data.labels = labels;
        chart.data.datasets[0].data = temperatures;
        chart.data.datasets[0].borderColor = colors;
        chart.data.datasets[1].data = Array(labels.length).fill(37);
        chart.update();
    }
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
        const tempStyle = record.temperature >= 37 ? 'style="color: red; font-weight: bold;"' : '';
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.time}</td>
            <td ${tempStyle}>${record.temperature}</td>
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
                label: '37℃参考线',
                data: [],
                borderColor: 'rgba(255, 0, 0, 0.5)',
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
                    grid: {
                        color: function(context) {
                            if (context.tick.value >= 39) return 'rgba(255, 0, 0, 0.1)';
                            if (context.tick.value >= 37) return 'rgba(255, 165, 0, 0.1)';
                            return 'rgba(54, 162, 235, 0.1)';
                        }
                    },
                    ticks: {
                        stepSize: 0.1,
                        color: function(context) {
                            if (context.tick.value >= 39) return '#ff4444';
                            if (context.tick.value >= 37) return '#ffa500';
                            return '#3498db';
                        }
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