// 必须是 https 才能匹配 GitHub Pages 的安全要求
const API_BASE = "https://8.222.254.248:5000/api";

const loginBtn = document.getElementById('loginBtn');
const msg = document.getElementById('msg');
const bookList = document.getElementById('bookList');

async function doLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    msg.innerText = "正在连接服务器...";
    
    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });

        const result = await res.json();
        if (result.code === 0) {
            msg.innerText = "登录成功！欢迎 " + (result.data.RealName || result.data.username || "");
            msg.style.color = "green";
            loadBooks();
        } else {
            msg.innerText = "登录失败：" + result.msg;
            msg.style.color = "red";
        }
    } catch (e) {
        // 由于是自签名证书，这里大概率会进 catch
        msg.innerHTML = `<span style="color:red">安全连接拦截！</span><br>
            <small>请先在浏览器打开并授权 API 地址：<br>
            <a href="${API_BASE}/books" target="_blank" style="color:blue">点击这里手动授权</a><br>
            点击后选择“高级” -> “继续前往”，然后回来刷新本页面。</small>`;
        console.error(e);
    }
}

async function loadBooks() {
    try {
        const res = await fetch(`${API_BASE}/books`);
        const result = await res.json();
        if (result.code === 0) {
            bookList.innerHTML = '';
            result.data.forEach(item => {
                const li = document.createElement('li');
                li.className = 'book-item';
                // 自动适配中英文字段名
                li.innerHTML = `
                    <h3>${item.书名 || item.BookName}</h3>
                    <p>作者：${item.作者 || item.Author}</p>
                    <p class="price">¥${item.售价 || item.Price}</p>
                    <p style="font-size:12px;color:grey">卖家：${item.卖家 || '学生'} (${item.卖家学院 || ''})</p>
                    <button style="width:100%;background:#28a745;color:white;border:none;padding:5px;border-radius:4px;">立即购买</button>
                `;
                bookList.appendChild(li);
            });
        }
    } catch (e) {
        console.error("加载列表失败", e);
    }
}

if(loginBtn) loginBtn.addEventListener('click', doLogin);

