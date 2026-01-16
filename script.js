// 注意：GitHub Pages 是 HTTPS，所以这里必须也是 HTTPS
const API_BASE = "https://8.222.254.248:5000/api";

const msgBox = document.getElementById('msg');
const bookList = document.getElementById('bookList');

/**
 * 登录函数
 */
async function doLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    
    msgBox.innerText = "正在安全连接服务器...";
    msgBox.style.color = "#666";

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            mode: 'cors', // 允许跨域请求
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });

        const result = await res.json();
        
        if (result.code === 0) {
            msgBox.innerText = "登录成功！欢迎回来 " + (result.data.RealName || "");
            msgBox.style.color = "green";
            loadBooks(); // 登录成功后拉取书籍
        } else {
            msgBox.innerText = "登录失败：" + result.msg;
            msgBox.style.color = "red";
        }
    } catch (e) {
        console.error("Fetch Error:", e);
        // 如果连接失败，通常是自签名证书没被浏览器信任
        msgBox.innerHTML = `
            <div class="ssl-warning">
                ⚠️ 连接被浏览器拦截！<br>
                由于使用自签名证书，请点击下方链接授权访问：<br>
                <a href="${API_BASE}/books" target="_blank" style="font-weight:bold;color:#007bff">【点击此处授权安全访问】</a><br>
                在新页面点“高级”->“继续前往”，完成后刷新本页。
            </div>`;
    }
}

/**
 * 加载书籍列表
 */
async function loadBooks() {
    try {
        const res = await fetch(`${API_BASE}/books`);
        const result = await res.json();

        if (result.code === 0) {
            bookList.innerHTML = '';
            
            if (result.data.length === 0) {
                bookList.innerHTML = '<p style="text-align:center; width:100%">暂时没有在售的书籍</p>';
                return;
            }

            result.data.forEach(item => {
                const li = document.createElement('li');
                li.className = 'book-item';
                // 适配你提供的 SQL 视图中的中文字段
                li.innerHTML = `
                    <h3>${item.书名 || '未知书籍'}</h3>
                    <p>作者：${item.作者 || '未知'}</p>
                    <div class="price">¥${item.售价 || '0.00'}</div>
                    <div class="seller-info">
                        卖家：${item.卖家 || '匿名学生'}<br>
                        学院：${item.卖家学院 || '未知学院'}<br>
                        发布：${item.发布时间 || '刚刚'}
                    </div>
                    <button class="buy-btn" onclick="alert('已加入购物车')">立即购买</button>
                `;
                bookList.appendChild(li);
            });
        }
    } catch (e) {
        console.error("Load Books Error:", e);
    }
}

// 自动尝试加载一次，若证书未信任会触发报错提示
window.onload = loadBooks;
