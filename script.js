// 修改为你的实际后端地址
const API_URL = "http://8.222.254.248:5000/api"; 

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const statusMsg = document.getElementById('statusMsg');
    const bookList = document.getElementById('bookList');
    const loginForm = document.getElementById('loginForm');

    // 1. 登录逻辑
    loginBtn.addEventListener('click', async () => {
        const u = document.getElementById('username').value.trim();
        const p = document.getElementById('password').value.trim();

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: u, password: p })
            });
            const result = await res.json();

            if (result.code === 0) {
                statusMsg.innerHTML = `<span style="color:green">欢迎，${result.data.realName}！正在加载数据...</span>`;
                loginForm.style.display = 'none';
                logoutBtn.style.display = 'block';
                loadBooks(); // 登录成功自动调用
            } else {
                statusMsg.innerHTML = `<span style="color:red">失败：${result.msg}</span>`;
            }
        } catch (e) {
            statusMsg.innerHTML = `<span style="color:red">无法连接服务器，请检查5000端口</span>`;
        }
    });

    // 2. 加载书籍逻辑（字段名严格匹配 SQL 视图别名）
    async function loadBooks() {
        try {
            const res = await fetch(`${API_URL}/books`);
            const result = await res.json();

            if (result.code === 0) {
                bookList.innerHTML = '';
                const data = result.data;

                if (data.length === 0) {
                    bookList.innerHTML = '<p style="text-align:center;width:100%">暂无符合条件的可购书籍</p>';
                    return;
                }

                data.forEach(item => {
                    // 调试打印：如果页面还显示未知，请按 F12 查看 Console 里的对象属性名
                    console.log("后端返回对象:", item);

                    const li = document.createElement('li');
                    li.className = 'book-item';
                    
                    // 映射 SQL 视图字段
                    const title = item.书名 || "未知书名";
                    const author = item.作者 || "未知作者";
                    const price = item.售价 || "0.00";
                    const oldPrice = item.原价 || "0.00";
                    const discount = item.折扣率 || "0";
                    const college = item.卖家学院 || "未知学院";
                    const credit = item.卖家信用分 || "100";

                    li.innerHTML = `
                        <div class="badge">${discount}折</div>
                        <div class="book-cover">${title.charAt(0)}</div>
                        <div class="book-info">
                            <div class="book-title">${title}</div>
                            <p style="font-size:13px;color:#666;margin:5px 0;">作者：${author}</p>
                            <div class="price-row">
                                <span class="price-now">¥${price}</span>
                                <span class="price-old">¥${oldPrice}</span>
                            </div>
                            <div class="seller-info">
                                🏫 ${college} | ⭐ 信用:${credit}
                            </div>
                            <button class="btn btn-primary" style="margin-top:10px;height:35px;padding:0;">立即咨询</button>
                        </div>
                    `;
                    bookList.appendChild(li);
                });
            }
        } catch (e) {
            statusMsg.innerHTML = `<span style="color:red">书籍载入异常</span>`;
        }
    }

    // 3. 退出登录
    logoutBtn.addEventListener('click', () => {
        loginForm.style.display = 'block';
        logoutBtn.style.display = 'none';
        bookList.innerHTML = '';
        statusMsg.innerHTML = '已安全退出';
    });
});
