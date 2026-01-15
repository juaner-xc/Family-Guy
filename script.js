// 注意：如果你的服务器没配SSL证书，请先将 https 改为 http 测试
const API_URL = "http://8.222.254.248:5000/api"; 

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const bookList = document.getElementById('bookList');
    const statusMsg = document.getElementById('statusMsg');
    const loginSection = document.getElementById('loginSection');

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
                statusMsg.innerHTML = `<span style="color:green">欢迎，${result.data.realName}！正在载入书籍...</span>`;
                loginSection.style.display = 'none';
                logoutBtn.style.display = 'inline-block';
                loadBooksData(); // 登录成功直接加载
            } else {
                statusMsg.innerHTML = `<span style="color:red">登录失败：${result.msg}</span>`;
            }
        } catch (e) {
            statusMsg.innerHTML = `<span style="color:red">错误：无法连接后端服务。请检查5000端口是否开放。</span>`;
        }
    });

    // 2. 加载书籍列表 (匹配 SQL 视图字段)
    async function loadBooksData() {
        try {
            const res = await fetch(`${API_BASE_URL}/books`);
            const result = await res.json();

            if (result.code === 0) {
                bookList.innerHTML = '';
                const dataArray = result.data;

                if (dataArray.length === 0) {
                    bookList.innerHTML = '<p style="text-align:center; width:100%;">广场上还没有人卖书哦~</p>';
                    return;
                }

                dataArray.forEach(item => {
                    // 调试输出：如果依然显示未知，请按F12在控制台查看这个打印结果
                    console.log("当前书籍对象:", item);

                    const card = document.createElement('li');
                    card.className = 'book-card';
                    
                    // 核心映射：item.书名, item.售价 等必须与数据库视图别名一致
                    card.innerHTML = `
                        <div class="discount-tag">${item.折扣率 || '9'}折</div>
                        <div class="book-cover">${(item.书名 || '书').charAt(0)}</div>
                        <div class="book-info">
                            <div class="book-title">${item.书名 || '未命名书籍'}</div>
                            <p style="margin:5px 0; font-size:13px; color:#666;">作者：${item.作者 || '未知'}</p>
                            <div class="price-row">
                                <span class="price-now">¥${item.售价}</span>
                                <span class="price-old">¥${item.原价}</span>
                            </div>
                            <div class="seller-info">
                                🏫 ${item.卖家学院} | 👤 ${item.卖家用户名}<br>
                                ⭐ 信用分：${item.卖家信用分} | 状态：${item.新旧程度}
                            </div>
                            <button class="btn btn-blue" style="margin-top:10px; font-size:12px; height:35px; padding:0;">联系卖家</button>
                        </div>
                    `;
                    bookList.appendChild(card);
                });
            }
        } catch (e) {
            console.error("加载数据异常", e);
            statusMsg.innerHTML = '<span style="color:red">书籍加载失败，请检查API响应</span>';
        }
    }

    // 3. 退出逻辑
    logoutBtn.addEventListener('click', () => {
        loginSection.style.display = 'block';
        logoutBtn.style.display = 'none';
        bookList.innerHTML = '';
        statusMsg.innerHTML = '已安全退出登录';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    });
});
