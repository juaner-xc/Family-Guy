const API_BASE = "https://8.222.254.248:5000/api"; 

// 1. 核心修复：手动绑定点击事件
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', doLogin);
    }
});

async function doLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const msg = document.getElementById('statusMsg'); // 对应 HTML 中的 ID
    
    if (!u || !p) {
        msg.innerText = "请输入账号和密码";
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });
        const result = await res.json();
        
        if (result.code === 0) {
            msg.innerText = "登录成功！欢迎 " + result.data.realName;
            document.getElementById('loginForm').style.display = 'none'; // 隐藏登录框
            document.getElementById('logoutBtn').style.display = 'block'; // 显示退出按钮
            loadBooks(); // 加载书籍列表
        } else {
            msg.innerText = result.msg;
        }
    } catch (e) {
        msg.innerHTML = `连接失败。请先<a href="${API_BASE}/books" target="_blank">点击此处信任证书</a>，然后刷新重试。`;
    }
}

async function loadBooks() {
    try {
        const res = await fetch(`${API_BASE}/books`);
        const result = await res.json();
        const list = document.getElementById('bookList');
        list.innerHTML = '';

        if (result.code === 0) {
            result.data.forEach(item => {
                const li = document.createElement('li');
                li.className = 'book-item'; // 使用 HTML 中的样式类名
                // 适配 SQL 视图返回的中文键名
                li.innerHTML = `
                    <div class="book-cover">📖</div>
                    <div class="book-info">
                        <div class="book-title">${item.书名 || '未知书名'}</div>
                        <div class="price-now">¥${item.售价 || '0.00'}</div>
                        <div class="price-old">原价: ¥${item.原价 || '0.00'}</div>
                        <div class="seller-info">
                            卖家学院：${item.卖家学院 || '未知'}<br>
                            信用分：${item.卖家信用分 || '100'}
                        </div>
                    </div>
                `;
                list.appendChild(li);
            });
        }
    } catch (e) {
        console.error("加载失败", e);
    }
}
