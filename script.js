const API_BASE = "https://8.222.254.248:5000/api"; // 必须是 https

async function doLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const msg = document.getElementById('msg');
    
    msg.innerText = "正在发起安全连接...";

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
        // 自签名证书 fetch 失败时，提示用户手动信任
        msg.innerHTML = `<span style="color:red">连接受阻！</span><br>请先点击：<a href="${API_BASE}/books" target="_blank">信任此连接</a><br>点击后选择“高级”->“继续前往”，然后返回刷新此页。`;
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
                // 适配 SQL 视图中文键名
                li.innerHTML = `
                    <h3>${item.书名 || '未知书籍'}</h3>
                    <p>作者：${item.作者 || '未知'}</p>
                    <p style="color:red">¥${item.售价 || '0.00'}</p>
                    <p style="font-size:12px">卖家学院：${item.卖家学院 || '通用'}</p>
                `;
                list.appendChild(li);
            });
        }
    } catch (e) {
        console.error("加载失败", e);
    }
}
