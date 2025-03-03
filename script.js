// 存儲數據
let calorieRecords = [];
let bmrSetting = 0; // 基礎代謝卡路里設定

// 格式化日期為 M/D 格式 - 全局函數
function formatDate(dateString) {
    let date;
    
    if (dateString instanceof Date) {
        // 如果已經是日期對象
        date = dateString;
    } else {
        // 嘗試創建日期對象
        date = new Date(dateString);
        
        // 檢查日期是否有效
        if (isNaN(date.getTime())) {
            console.error('無效的日期:', dateString);
            return '無效日期';
        }
    }
    
    // 獲取月份和日期
    const month = date.getMonth() + 1; // getMonth() 返回 0-11
    const day = date.getDate();
    return `${month}/${day}`;
}

// 當頁面加載完成時初始化
window.addEventListener('load', function() {
    console.log('頁面載入完成');
    
    // 輸出今天的日期，用於調試
    const today = getTodayDate();
    console.log('今天的日期:', today, formatDate(today));
    
    // 初始化圖表
    initializeChart();
    
    // 載入本地儲存的記錄
    loadRecords();
    
    // 載入基礎代謝卡路里設定
    loadBMRSetting();
    
    // 設置當前日期和時間
    setCurrentDateTime();
    
    // 綁定添加記錄按鈕事件
    document.getElementById('add-record-btn').addEventListener('click', function() {
        addCalorieRecord();
    });
    
    // 設定按鈕事件
    document.getElementById('settings-btn').addEventListener('click', openSettingsModal);
    
    // 關閉彈窗按鈕事件
    document.getElementById('close-modal').addEventListener('click', closeSettingsModal);
    
    // 保存設定按鈕事件
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    
    // 點擊彈窗外部區域關閉彈窗
    document.getElementById('settings-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSettingsModal();
        }
    });
});

// 打開設定彈出視窗
function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.classList.add('active');
    
    // 設置當前BMR值
    document.getElementById('bmr-input').value = bmrSetting;
}

// 關閉設定彈出視窗
function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.classList.remove('active');
}

// 保存設定
function saveSettings() {
    const bmrInput = document.getElementById('bmr-input').value;
    
    // 驗證輸入
    if (bmrInput && !isNaN(bmrInput)) {
        bmrSetting = parseFloat(bmrInput);
        
        // 保存到本地儲存
        saveBMRSetting();
        
        // 顯示成功訊息
        alert('基礎代謝卡路里設定已保存！');
        
        // 關閉彈窗
        closeSettingsModal();
        
        // 更新顯示
        updateBMRDisplay();
    } else {
        alert('請輸入有效的數值');
    }
}

// 保存BMR設定到本地儲存
function saveBMRSetting() {
    try {
        localStorage.setItem('bmrSetting', bmrSetting.toString());
        console.log('BMR設定已保存:', bmrSetting);
    } catch (error) {
        console.error('無法保存BMR設定:', error);
    }
}

// 從本地儲存載入BMR設定
function loadBMRSetting() {
    try {
        const savedBMR = localStorage.getItem('bmrSetting');
        if (savedBMR) {
            bmrSetting = parseFloat(savedBMR);
            console.log('載入BMR設定:', bmrSetting);
            updateBMRDisplay();
        }
    } catch (error) {
        console.error('無法載入BMR設定:', error);
        bmrSetting = 0;
    }
}

// 更新BMR顯示
function updateBMRDisplay() {
    // 在這裡可以添加BMR相關的顯示邏輯
    // 例如：顯示剩餘可食用卡路里、顯示今日消耗百分比等
    console.log('更新BMR顯示');
}

// 設置當前日期和時間
function setCurrentDateTime() {
    // 創建一個新的日期對象，確保獲取當前日期
    const now = new Date();
    
    // 設置日期 (YYYY-MM-DD 格式)
    // 使用本地時間而不是UTC時間
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
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
    
    console.log('日期和時間已設置:', dateString);
    return dateString; // 返回設置的日期，以便其他函數使用
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
    
    // 更新攝取記錄顯示
    displayAllRecords();
    
    // 更新圖表
    updateChart();
    
    // 清空卡路里輸入
    document.getElementById('calories').value = '';
    
    // 重新設置日期時間
    setCurrentDateTime();
    
    console.log('記錄已添加並更新顯示');
}

// 獲取今天的日期（YYYY-MM-DD格式）
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 顯示所有攝取記錄
function displayAllRecords() {
    const recordsContainer = document.getElementById('calorie-records');
    
    // 確保今天的日期已經存在
    const today = getTodayDate();
    console.log('顯示記錄，今天是:', today);
    
    // 如果沒有記錄
    if (calorieRecords.length === 0) {
        recordsContainer.innerHTML = '<div class="record-item"><p>尚無記錄</p></div>';
        return;
    }
    
    // 按日期分組記錄
    const recordsByDate = {};
    
    // 確保今天的日期存在於記錄中
    recordsByDate[today] = {
        '早餐': 0,
        '中餐': 0,
        '晚餐': 0,
        '早餐有值': false,
        '中餐有值': false,
        '晚餐有值': false
    };
    
    calorieRecords.forEach(record => {
        if (!recordsByDate[record.date]) {
            recordsByDate[record.date] = {
                '早餐': 0,
                '中餐': 0,
                '晚餐': 0,
                '早餐有值': false,
                '中餐有值': false,
                '晚餐有值': false
            };
        }
        
        recordsByDate[record.date][record.mealType] += record.calories;
        recordsByDate[record.date][`${record.mealType}有值`] = true;
    });
    
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
    
    // 創建日期陣列並按日期降序排序（最新的日期在前）
    const dates = Object.keys(recordsByDate).sort().reverse();
    
    // 創建餐別單元格
    const createMealCell = (mealType, date) => {
        const dayData = recordsByDate[date];
        const value = dayData[mealType];
        const hasValue = dayData[`${mealType}有值`];
        
        return `
            <td class="meal-calories">
                <div class="meal-cell">
                    <span class="meal-value">${hasValue ? value : '-'}</span>
                    <button class="edit-btn" data-meal="${mealType}" data-date="${date}" title="編輯${mealType}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.4745 5.40768L18.5924 7.52552M17.8358 3.54L9.17584 12.2C8.80058 12.5753 8.55845 13.0605 8.50245 13.589L8 17L11.411 16.4976C11.9395 16.4416 12.4247 16.1994 12.8 15.8242L21.46 7.16421C22.1186 6.50561 22.1186 5.44621 21.46 4.78761L19.2124 2.54C18.5538 1.88139 17.4944 1.88139 16.8358 2.54L17.8358 3.54Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </td>
        `;
    };
    
    // 添加所有日期的數據行
    dates.forEach(date => {
        const dayData = recordsByDate[date];
        const totalCalories = dayData['早餐'] + dayData['中餐'] + dayData['晚餐'];
        const isToday = date === today;
        
        const row = document.createElement('tr');
        
        // 如果是今天的記錄，添加特殊樣式
        if (isToday) {
            row.className = 'today-record';
        }
        
        row.innerHTML = `
            <td>${formatDate(date)}</td>
            ${createMealCell('早餐', date)}
            ${createMealCell('中餐', date)}
            ${createMealCell('晚餐', date)}
            <td class="total-calories">${totalCalories}</td>
        `;
        table.appendChild(row);
    });
    
    // 顯示表格
    recordsContainer.innerHTML = '';
    recordsContainer.appendChild(table);
    
    // 如果有設定BMR，只顯示今日的卡路里平衡
    if (bmrSetting > 0) {
        const todayData = recordsByDate[today];
        if (todayData) {
            const totalTodayCalories = todayData['早餐'] + todayData['中餐'] + todayData['晚餐'];
            const diff = bmrSetting - totalTodayCalories;
            const calorieBalance = diff >= 0 ? 
                `<div class="calorie-balance positive">今日還可攝取 ${diff.toFixed(0)} 卡路里</div>` : 
                `<div class="calorie-balance negative">今日超出 ${Math.abs(diff).toFixed(0)} 卡路里</div>`;
                
            const balanceElement = document.createElement('div');
            balanceElement.innerHTML = calorieBalance;
            recordsContainer.appendChild(balanceElement);
        }
    }
    
    // 綁定編輯按鈕事件（所有記錄都可以編輯）
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mealType = this.getAttribute('data-meal');
            const date = this.getAttribute('data-date');
            editMealCalories(mealType, date);
        });
    });
}

// 編輯餐別卡路里
function editMealCalories(mealType, date) {
    const today = getTodayDate();
    const isToday = date === today;
    
    // 獲取當前值
    const mealRecords = calorieRecords.filter(record => 
        record.date === date && record.mealType === mealType
    );
    
    let currentValue = 0;
    if (mealRecords.length > 0) {
        // 計算當前餐別的總卡路里
        currentValue = mealRecords.reduce((sum, record) => sum + record.calories, 0);
    }
    
    // 彈出輸入框，顯示日期和餐別
    const formattedDate = formatDate(date);
    const promptMessage = isToday ? 
        `編輯今日${mealType}卡路里數值:` : 
        `編輯 ${formattedDate} ${mealType}卡路里數值:`;
    
    const newValue = prompt(promptMessage, currentValue);
    
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
        !(record.date === date && record.mealType === mealType)
    );
    
    // 如果新值不為零，創建新記錄
    if (calories > 0) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const newRecord = {
            date: date,
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
    displayAllRecords();
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
    
    // 格式化日期為 M/D 格式
    const formattedDates = sortedDates.map(date => formatDate(date));
    
    // 更新圖表數據
    window.calorieChart.data.labels = formattedDates;
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
            
            // 確保今天的日期已經存在於記錄中
            ensureTodayExists();
            
            // 初始顯示
            displayAllRecords();
            updateChart();
        } else {
            // 如果沒有記錄，確保今天的日期已經存在
            ensureTodayExists();
            displayAllRecords();
        }
    } catch (error) {
        console.error('無法載入記錄:', error);
        calorieRecords = [];
        
        // 即使發生錯誤，也確保今天的日期已經存在
        ensureTodayExists();
        displayAllRecords();
    }
}

// 確保今天的日期已經存在於記錄中
function ensureTodayExists() {
    // 獲取今天的日期
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    // 檢查是否已經有今天的記錄
    const hasToday = calorieRecords.some(record => record.date === dateString);
    
    // 如果沒有今天的記錄，添加一個空的記錄
    if (!hasToday && calorieRecords.length > 0) {
        console.log('添加今天的空記錄:', dateString);
        // 我們不需要實際添加空記錄，因為 displayAllRecords 函數會自動顯示所有日期，
        // 即使某個日期沒有記錄也會顯示。這裡只是為了確保代碼邏輯正確。
    }
    
    console.log('確保今天的日期存在完成:', dateString);
    return dateString;
} 