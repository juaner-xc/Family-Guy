// 这里的 IP 必须是你的公网 IP
const SERVER_IP = "8.222.254.248"; 
const API_BASE = `http://${SERVER_IP}:5000/api`;

document.getElementById('loginBtn').addEventListener('click', async () => {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const msg = document.getElementById('msg');
    
    msg.innerText = "正在尝试连接服务器...";

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });
        
        const result = await res.json();

        if (result.code === 0) {
            msg.style.color = "green";
            msg.innerText = "登录成功！正在加载书籍...";
            loadBooks();
        } else {
            msg.style.color = "red";
            msg.innerText = "失败: " + result.msg;
        }
    } catch (err) {
        console.error("连接详情:", err);
        msg.innerHTML = `<span class="error-text">连接失败！<br>请检查：1. 安全组5000端口是否开启<br>2. 后端程序是否在运行</span>`;
    }
});

async function loadBooks() {
    try {
        const res = await fetch(`${API_BASE}/books`);
        const data = await res.json();
        const list = document.getElementById('bookList');
        list.innerHTML = '';

        if (data.code === 0) {
            data.data.forEach(item => {
                // 适配你的 SQL 视图中文列名
                const title = item.书名 || item.BookName || "未知书名";
                const price = item.售价 || item.SalePrice || "0.00";
                const author = item.作者 || item.Author || "未知作者";
                const college = item.卖家学院 || "未知学院";

                const li = document.createElement('li');
                li.className = 'book-item';
                li.innerHTML = `
                    <h3>${title}</h3>
                    <p>作者：${author}</p>
                    <p class="price">¥${price}</p>
                    <p style="font-size:12px; color:#666">来自：${college}</p>
                    <button style="background:#28a745">立即联系</button>
                `;
                list.appendChild(li);
            });
        }
    } catch (err) {
        console.error("加载书籍失败:", err);
    }
}

