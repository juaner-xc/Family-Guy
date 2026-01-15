// 后端API基础地址（已替换为你的服务器公网IP）
const API_BASE_URL = "http://8.222.254.248:5000/api";

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面元素
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loadBooksBtn = document.getElementById('loadBooksBtn');
    const loginStatus = document.getElementById('loginStatus');
    const bookList = document.getElementById('bookList');

    // 存储当前登录用户ID
    let currentUserId = null;

    // 显示登录按钮（页面加载后默认显示）
    loginBtn.style.display = 'block';

    // 1. 登录功能
    loginBtn.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // 验证输入
        if (!username) {
            showLoginStatus('请输入用户名', 'error');
            return;
        }
        if (!password) {
            showLoginStatus('请输入密码', 'error');
            return;
        }

        // 发送登录请求
        fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP错误，状态码：${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 0) {
                // 登录成功
                currentUserId = data.data.userId;
                showLoginStatus(`登录成功！欢迎 ${data.data.username}`, 'success');
                
                // 切换按钮显示状态
                loginBtn.style.display = 'none';
                logoutBtn.style.display = 'inline-block';
                loadBooksBtn.style.display = 'inline-block';
                
                // 清空输入框
                usernameInput.value = '';
                passwordInput.value = '';
            } else {
                // 登录失败
                showLoginStatus(`登录失败：${data.msg}`, 'error');
            }
        })
        .catch(error => {
            showLoginStatus(`登录失败：${error.message}`, 'error');
            console.error('登录请求异常：', error);
        });
    });

    // 2. 退出登录功能
    logoutBtn.addEventListener('click', function() {
        currentUserId = null;
        showLoginStatus('已退出登录，请重新登录', 'normal');
        
        // 切换按钮显示状态
        logoutBtn.style.display = 'none';
        loadBooksBtn.style.display = 'none';
        loginBtn.style.display = 'block';
        
        // 清空书籍列表
        bookList.innerHTML = '';
    });

    // 3. 加载书籍列表功能
    loadBooksBtn.addEventListener('click', function() {
        // 显示加载提示
        bookList.innerHTML = '<li style="text-align: center; padding: 20px;">正在加载书籍数据...</li>';

        // 发送获取书籍请求
        fetch(`${API_BASE_URL}/books`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP错误，状态码：${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 0) {
                // 渲染书籍列表
                if (data.data.length === 0) {
                    bookList.innerHTML = '<li style="text-align: center; padding: 20px; color: #666;">暂无书籍数据</li>';
                    return;
                }

                bookList.innerHTML = '';
                data.data.forEach(book => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <h4>${book.BookName || '未知书名'}</h4>
                        <p><strong>作者：</strong>${book.Author || '未知作者'}</p>
                        <p><strong>价格：</strong>¥${book.Price || 0.00}</p>
                        <p><strong>ISBN：</strong>${book.ISBN || '未知ISBN'}</p>
                        <p><strong>状态：</strong>${book.Status || '未知状态'}</p>
                        <p><strong>发布时间：</strong>${book.PublishTime || '未知时间'}</p>
                    `;
                    bookList.appendChild(li);
                });
            } else {
                bookList.innerHTML = `<li style="text-align: center; padding: 20px; color: #dc3545;">加载失败：${data.msg}</li>`;
            }
        })
        .catch(error => {
            bookList.innerHTML = `<li style="text-align: center; padding: 20px; color: #dc3545;">加载失败：${error.message}</li>`;
            console.error('加载书籍异常：', error);
        });
    });

    // 辅助函数：更新登录状态提示
    function showLoginStatus(message, type) {
        loginStatus.textContent = message;
        loginStatus.className = type;
    }

    // 监听回车键登录
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && loginBtn.style.display === 'block') {
            loginBtn.click();
        }
    });
});