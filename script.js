// 注意：这里必须是 https，且 IP 要对应
const API_BASE = "https://8.222.254.248:5000/api";

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
        // 如果这里报错，请先在浏览器打开 https://8.222.254.248:5000/api/books 点击“高级-继续前往”
        msg.innerText = "连接失败，请确认已在浏览器点击‘高级-继续访问’解除SSL警告";
    }
}

async function loadBooks() {
    const res = await fetch(`${API_BASE}/books`);
    const result = await res.json();
    const list = document.getElementById('bookList');
    list.innerHTML = '';

    if (result.code === 0) {
        result.data.forEach(item => {
            const li = document.createElement('li');
            li.className = 'book-card';
            // 严格匹配 SQL 视图字段
            li.innerHTML = `
                <h3>${item.书名 || '未知'}</h3>
                <p>作者：${item.作者 || '未知'}</p>
                <p style="color:red">¥${item.售价 || '0'}</p>
                <p style="font-size:12px">学院：${item.卖家学院 || '通用'}</p>
            `;
            list.appendChild(li);
        });
    }
}
