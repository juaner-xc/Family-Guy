const API_BASE = "https://8.222.254.248:5000/api"; // 必须带 s

async function doLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const msg = document.getElementById('msg');
    
    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });
        const result = await res.json();
        if (result.code === 0) {
            msg.innerText = "登录成功！";
            loadBooks();
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
                li.className = 'book-card';
                // 【核心】这里全部换成中文键名，适配你的 SQL 视图
                li.innerHTML = `
                    <h3>${item.书名 || '未知'}</h3>
                    <p>作者：${item.作者 || '匿名'}</p>
                    <p style="color:red">¥${item.售价 || '0.00'}</p>
                    <p style="font-size:12px">来自：${item.卖家学院 || '本校'}</p>
                `;
                list.appendChild(li);
            });
        }
    } catch (e) {
        console.error("加载失败", e);
    }
}
