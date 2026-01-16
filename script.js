// 必须是 https，且 IP 和端口需准确
const API_BASE = "https://8.222.254.248:5000/api";

async function doLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const msg = document.getElementById('msg');
    
    msg.innerText = "正在安全连接服务器...";

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            mode: 'cors', // 允许跨域
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });

        const result = await res.json();
        if (result.code === 0) {
            msg.innerText = "登录成功！欢迎 " + (result.data.RealName || "");
            msg.style.color = "green";
            loadBooks(); // 成功后加载书籍
        } else {
            msg.innerText = "错误：" + result.msg;
            msg.style.color = "red";
        }
    } catch (e) {
        // 如果这里报错，说明你还没执行“第一步”的手动授权
        msg.innerHTML = `连接失败！<br>
            <small style="color:orange">请先点击此链接并选择“高级-继续前往”：</small><br>
            <a href="${API_BASE}/books" target="_blank">点击此处手动授权</a>`;
        console.error("详细错误:", e);
    }
}

async function loadBooks() {
    try {
        const res = await fetch(`${API_BASE}/books`);
        const result = await res.json();
        const list = document.getElementById('bookList');
        if (result.code === 0) {
            list.innerHTML = result.data.map(item => `
                <li style="background:white; padding:15px; margin-bottom:10px; border-radius:8px; list-style:none; box-shadow:0 2px 4px rgba(0,0,0,0.1)">
                    <h3 style="margin:0">${item.书名}</h3>
                    <p style="color:#e4393c; font-weight:bold">价格：¥${item.售价}</p>
                    <p style="font-size:12px; color:#666">作者：${item.作者} | 卖家：${item.卖家}</p>
                </li>
            `).join('');
        }
    } catch (e) {
        console.error("加载书籍失败", e);
    }
}
