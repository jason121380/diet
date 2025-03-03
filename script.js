// 存儲數據
let calorieRecords = [];

// 當頁面加載完成時初始化
window.addEventListener('load', function() {
    // 初始化圖表
    initializeChart();
    
    // 載入本地儲存的記錄
    loadRecords();
    
    // 設置當前日期和時間
    setCurrentDateTime();
    
    // 綁定添加記錄按鈕事件
    document.getElementById('add-record-btn').addEventListener('click', function() {
        addCalorieRecord();
    });
    
    console.log('頁面載入完成，事件已綁定');
});

// 設置當前日期和時間
function setCurrentDateTime() {
    const now = new Date();
    
    // 設置日期 (YYYY-MM-DD 格式)
    const dateString = now.toISOString().split('T')[0];
    document.getElementById('date').value = dateString;
    
    // 設置時間 (HH:MM 格式)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('time').value = `${hours}:${minutes}`;
    
    // 根據時間選擇餐別
    const hour = now.getHours();
    let mealType;
    if (hour < 11) {
        mealType = '早餐';
    } else if (hour < 16) {
        mealType = '中餐';
    } else {
        mealType = '晚餐';
    }
    
    // 選中相應的餐別
    document.querySelector(`input[name="mealType"][value="${mealType}"]`).checked = true;
    
    console.log('日期和時間已設置');
}

// 添加卡路里記錄
function addCalorieRecord() {
    console.log('添加記錄函數被調用');
    
    // 獲取表單值
    const calories = document.getElementById('calories').value;
    const mealType = document.querySelector('input[name="mealType"]:checked').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    console.log('獲取表單數據:', { calories, mealType, date, time });
    
    // 驗證表單
    if (!calories) {
        alert('請輸入卡路里數值');
        return;
    }
    
    // 創建記錄對象
    const record = {
        calories: parseFloat(calories),
        mealType: mealType,
        date: date,
        time: time
    };
    
    console.log('新記錄:', record);
    
    // 添加到記錄陣列
    calorieRecords.push(record);
    
    // 保存到本地儲存
    saveRecords();
    
    // 更新今日攝取記錄
    displayTodayRecords();
    
    // 更新圖表
    updateChart();
    
    // 清空卡路里輸入
    document.getElementById('calories').value = '';
    
    // 重新設置日期時間
    setCurrentDateTime();
    
    console.log('記錄已添加並更新顯示');
}

// 顯示今日攝取記錄
function displayTodayRecords() {
    const recordsContainer = document.getElementById('calorie-records');
    
    // 獲取今天的日期
    const today = new Date().toISOString().split('T')[0];
    
    // 過濾今天的記錄
    const todayRecords = calorieRecords.filter(record => record.date === today);
    
    // 如果沒有記錄
    if (todayRecords.length === 0) {
        recordsContainer.innerHTML = '<div class="record-item"><p>今日尚無記錄</p></div>';
        return;
    }
    
    // 按餐別分組
    const meals = {
        '早餐': 0,
        '中餐': 0,
        '晚餐': 0
    };
    
    // 計算每餐卡路里總和並記錄是否有值
    const hasMealValue = {
        '早餐': false,
        '中餐': false,
        '晚餐': false
    };
    
    todayRecords.forEach(record => {
        meals[record.mealType] += record.calories;
        hasMealValue[record.mealType] = true;
    });
    
    // 計算總和
    const totalCalories = Object.values(meals).reduce((sum, cal) => sum + cal, 0);
    
    // 創建表格
    const table = document.createElement('table');
    table.className = 'meal-table';
    
    // 添加表頭
    table.innerHTML = `
        <tr>
            <th>日期</th>
            <th>早餐</th>
            <th>中餐</th>
            <th>晚餐</th>
            <th>總計</th>
        </tr>
    `;
    
    // 創建餐別單元格
    const createMealCell = (mealType) => {
        const value = meals[mealType];
        const hasValue = hasMealValue[mealType];
        return `
            <td class="meal-calories">
                <div class="meal-cell">
                    <span class="meal-value">${hasValue ? value : '-'}</span>
                    <button class="edit-btn" data-meal="${mealType}" title="編輯${mealType}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.4745 5.40768L18.5924 7.52552M17.8358 3.54L9.17584 12.2C8.80058 12.5753 8.55845 13.0605 8.50245 13.589L8 17L11.411 16.4976C11.9395 16.4416 12.4247 16.1994 12.8 15.8242L21.46 7.16421C22.1186 6.50561 22.1186 5.44621 21.46 4.78761L19.2124 2.54C18.5538 1.88139 17.4944 1.88139 16.8358 2.54L17.8358 3.54Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </td>
        `;
    };
    
    // 添加數據行
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${today}</td>
        ${createMealCell('早餐')}
        ${createMealCell('中餐')}
        ${createMealCell('晚餐')}
        <td class="total-calories">${totalCalories}</td>
    `;
    table.appendChild(row);
    
    // 顯示表格
    recordsContainer.innerHTML = '';
    recordsContainer.appendChild(table);
    
    // 綁定編輯按鈕事件
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mealType = this.getAttribute('data-meal');
            editMealCalories(mealType);
        });
    });
}

// 編輯餐別卡路里
function editMealCalories(mealType) {
    // 獲取當前值
    const today = new Date().toISOString().split('T')[0];
    const mealRecords = calorieRecords.filter(record => 
        record.date === today && record.mealType === mealType
    );
    
    let currentValue = 0;
    if (mealRecords.length > 0) {
        // 計算當前餐別的總卡路里
        currentValue = mealRecords.reduce((sum, record) => sum + record.calories, 0);
    }
    
    // 彈出輸入框
    const newValue = prompt(`編輯${mealType}卡路里數值:`, currentValue);
    
    // 檢查用戶是否取消
    if (newValue === null) return;
    
    // 驗證輸入
    const calories = parseFloat(newValue);
    if (isNaN(calories)) {
        alert('請輸入有效的數值');
        return;
    }
    
    // 刪除該餐別的所有記錄
    const otherRecords = calorieRecords.filter(record => 
        !(record.date === today && record.mealType === mealType)
    );
    
    // 如果新值不為零，創建新記錄
    if (calories > 0) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const newRecord = {
            date: today,
            time: `${hours}:${minutes}`,
            mealType: mealType,
            calories: calories
        };
        
        otherRecords.push(newRecord);
    }
    
    // 更新記錄
    calorieRecords = otherRecords;
    
    // 保存並更新顯示
    saveRecords();
    displayTodayRecords();
    updateChart();
}

// 初始化圖表
function initializeChart() {
    const ctx = document.getElementById('calorieChart').getContext('2d');
    
    // 創建圖表
    window.calorieChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '每日卡路里攝取',
                data: [],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 更新圖表
function updateChart() {
    // 按日期分組卡路里
    const dailyCalories = {};
    
    calorieRecords.forEach(record => {
        if (!dailyCalories[record.date]) {
            dailyCalories[record.date] = 0;
        }
        dailyCalories[record.date] += record.calories;
    });
    
    // 轉換為陣列並排序
    const sortedDates = Object.keys(dailyCalories).sort();
    const calories = sortedDates.map(date => dailyCalories[date]);
    
    // 更新圖表數據
    window.calorieChart.data.labels = sortedDates;
    window.calorieChart.data.datasets[0].data = calories;
    window.calorieChart.update();
}

// 保存記錄到本地儲存
function saveRecords() {
    try {
        localStorage.setItem('calorieRecords', JSON.stringify(calorieRecords));
    } catch (error) {
        console.error('無法保存記錄:', error);
    }
}

// 從本地儲存載入記錄
function loadRecords() {
    try {
        const records = localStorage.getItem('calorieRecords');
        if (records) {
            calorieRecords = JSON.parse(records);
            
            // 初始顯示
            displayTodayRecords();
            updateChart();
        }
    } catch (error) {
        console.error('無法載入記錄:', error);
        calorieRecords = [];
    }
} 