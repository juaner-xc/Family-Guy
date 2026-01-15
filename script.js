const API_BASE_URL = "https://8.222.254.248:5000/api";

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loadBooksBtn = document.getElementById('loadBooksBtn');
    const loginStatus = document.getElementById('loginStatus');
    const bookList = document.getElementById('bookList');
    const authFields = document.getElementById('authFields');

    // 1. 登录逻辑
    loginBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            updateStatus('请输入完整信息', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (data.code === 0) {
                updateStatus(`登录成功！欢迎 ${data.data.realName}`, 'success');
                toggleUI(true);
                fetchBooks(); // 登录后自动加载
            } else {
                updateStatus(`失败: ${data.msg}`, 'error');
            }
        } catch (error) {
            updateStatus('无法连接到服务器，请检查公网IP或HTTPS配置', 'error');
        }
    });

    // 2. 加载书籍 (对应 SQL 中的 '学生视图_可购书籍')
    async function fetchBooks() {
        bookList.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">正在同步校园数据...</p>';
        try {
            const response = await fetch(`${API_BASE_URL}/books`);
            const result = await response.json();

            if (result.code === 0) {
                bookList.innerHTML = '';
                if (result.data.length === 0) {
                    bookList.innerHTML = '<p>当前暂无在售书籍</p>';
                    return;
                }
                
                result.data.forEach(book => {
                    const li = document.createElement('li');
                    li.className = 'book-card';
                    // 字段名必须匹配 SQL 视图别名: 书名, 作者, 售价, 原价, 折扣率, 卖家学院
                    li.innerHTML = `
                        <h4>${book.书名}</h4>
                        <p><strong>作者:</strong> ${book.作者}</p>
                        <div class="price-row">
                            <span class="sale-price">¥${book.售价}</span>
                            <span class="original-price">¥${book.原价}</span>
                            <span class="badge">${book.折扣率}% 折</span>
                        </div>
                        <p><small>卖家: ${book.卖家用户名} | 学院: ${book.卖家学院}</small></p>
                        <p><small>信用分: <b style="color:green">${book.卖家信用分}</b></small></p>
                        <button class="btn btn-primary" style="height:35px; padding:0;">查看详情</button>
                    `;
                    bookList.appendChild(li);
                });
            }
        } catch (error) {
            updateStatus('加载书籍失败', 'error');
        }
    }

    loadBooksBtn.addEventListener('click', fetchBooks);

    // 3. 退出登录
    logoutBtn.addEventListener('click', () => {
        toggleUI(false);
        bookList.innerHTML = '';
        updateStatus('已退出登录', 'normal');
    });

    // 辅助函数
    function updateStatus(msg, type) {
        loginStatus.textContent = msg;
        loginStatus.className = type;
    }

    function toggleUI(loggedIn) {
        authFields.style.display = loggedIn ? 'none' : 'block';
        logoutBtn.style.display = loggedIn ? 'block' : 'none';
        loadBooksBtn.style.display = loggedIn ? 'inline-block' : 'none';
    }
});


