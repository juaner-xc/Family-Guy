const API_URL = "https://8.222.254.248:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const bookList = document.getElementById('bookList');
    const statusDiv = document.getElementById('loginStatus');
    const loginFields = document.getElementById('loginFields');

    // 1. 登录功能
    loginBtn.addEventListener('click', async () => {
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: u, password: p })
            });
            const result = await res.json();

            if (result.code === 0) {
                statusDiv.innerHTML = `<span style="color:green">欢迎，${result.data.realName}！正在获取最新书讯...</span>`;
                loginFields.style.display = 'none';
                logoutBtn.style.display = 'inline-block';
                loadBooks(); // 登录成功自动加载
            } else {
                statusDiv.innerHTML = `<span style="color:red">错误：${result.msg}</span>`;
            }
        } catch (e) {
            statusDiv.innerHTML = `<span style="color:red">无法连接后端服务器，请检查IP或端口</span>`;
        }
    });

    // 2. 加载书籍（精准对应 SQL 视图：学生视图_可购书籍）
    async function loadBooks() {
        try {
            const res = await fetch(`${API_URL}/books`);
            const result = await res.json();

            if (result.code === 0) {
                bookList.innerHTML = '';
                const books = result.data;

                if (books.length === 0) {
                    bookList.innerHTML = '<li>暂无正在出售的书籍</li>';
                    return;
                }

                books.forEach(item => {
                    const card = document.createElement('li');
                    card.className = 'book-card';
                    
                    // 这里的 item.书名, item.售价 等必须与后端返回的 JSON 键名完全一致
                    // 如果后端返回的是英文，请把这里的中文改为对应的英文键名
                    card.innerHTML = `
                        <div class="discount-badge">${item.折扣率 || '9'}折</div>
                        <div class="book-cover">${(item.书名 || '书').charAt(0)}</div>
                        <div class="book-info">
                            <div class="book-title">${item.书名 || '未知书名'}</div>
                            <p style="font-size:13px; color:#666; margin:5px 0;">作者：${item.作者 || '未知'}</p>
                            <div class="price-row">
                                <span class="price-now">¥${item.售价}</span>
                                <span class="price-old">¥${item.原价}</span>
                            </div>
                            <div class="seller-tag">
                                🏫 ${item.卖家学院} | ⭐ 信用:${item.卖家信用分}
                            </div>
                            <button class="btn btn-login" style="margin-top:15px; font-size:12px; padding:8px;">联系卖家</button>
                        </div>
                    `;
                    bookList.appendChild(card);
                });
            }
        } catch (e) {
            console.error("加载失败", e);
        }
    }

    // 3. 退出功能
    logoutBtn.addEventListener('click', () => {
        loginFields.style.display = 'block';
        logoutBtn.style.display = 'none';
        bookList.innerHTML = '';
        statusDiv.innerHTML = '请先登录查看全校在售书籍';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    });
});


