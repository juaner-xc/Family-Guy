// 必须使用 http，且端口为 5000
const API_BASE = "http://8.222.254.248:5000/api";

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
            loadBooks(); // 登录成功后加载书籍
        } else {
            msg.innerText = result.msg;
        }
    } catch (e) {
        msg.innerText = "错误：无法连接到服务器，请检查防火墙 5000 端口";
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
                // 这里的 item 字段名必须与 SQL 视图中的中文字段名完全一致
                li.innerHTML = `
                    <h3>${item.书名 || '未知书名'}</h3>
                    <p>作者：${item.作者 || '未知'}</p>
                    <p style="color:red">售价：¥${item.售价 || '0'}</p>
                    <p style="font-size:12px">卖家学院：${item.卖家学院 || '通用'}</p>
                `;
                list.appendChild(li);
            });
        }
    } catch (e) {
        console.error("加载数据失败", e);
    }
}

