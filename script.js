// ==========================================
// 1. 基础配置：请确保 IP 和 端口 与后端一致
// ==========================================
const API_BASE = "http://8.222.254.248:5000/api";

/**
 * 登录功能
 */
async function doLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const msg = document.getElementById('msg');
    
    // 清空旧提示
    msg.innerText = "正在登录...";
    msg.style.color = "blue";

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                username: u, 
                password: p 
            })
        });

        if (!res.ok) throw new Error('服务器响应异常');

        const result = await res.json();
        
        if (result.code === 0) {
            msg.innerText = "登录成功！正在加载书籍...";
            msg.style.color = "green";
            
            // 登录成功后，保存用户信息并跳转或加载数据
            localStorage.setItem('user', JSON.stringify(result.data));
            loadBooks(); 
        } else {
            msg.innerText = "错误：" + result.msg;
            msg.style.color = "red";
        }
    } catch (e) {
        msg.innerText = "连接失败：请检查后端程序是否启动，且 5000 端口已放行";
        msg.style.color = "red";
        console.error("Login Error:", e);
    }
}

/**
 * 加载书籍列表 (调用 SQL 视图)
 */
async function loadBooks() {
    const list = document.getElementById('bookList');
    if (!list) return;

    try {
        const res = await fetch(`${API_BASE}/books`);
        const result = await res.json();

        if (result.code === 0) {
            list.innerHTML = ''; // 清空现有列表
            
            if (result.data.length === 0) {
                list.innerHTML = '<li>暂无正在出售的书籍</li>';
                return;
            }

            result.data.forEach(item => {
                const li = document.createElement('li');
                li.className = 'book-card';
                // 这里的 item.xxx 必须匹配你在 Python 后端返回的中文字段名
                li.innerHTML = `
                    <div style="border:1px solid #ddd; padding:10px; margin-bottom:10px; border-radius:8px;">
                        <h3 style="margin:0">${item.书名 || '未知书名'}</h3>
                        <p style="margin:5px 0; color:#666;">作者：${item.作者 || '未知'}</p>
                        <p style="margin:5px 0; color:#e4393c; font-weight:bold;">售价：¥${item.售价 || '0.00'}</p>
                        <p style="margin:5px 0; font-size:12px; color:#999;">
                            卖家：${item.卖家学院 || '匿名'} | 发布时间：${item.发布时间 || '未知'}
                        </p>
                        <button onclick="buyBook(${item.书ID})">立即购买</button>
                    </div>
                `;
                list.appendChild(li);
            });
        }
    } catch (e) {
        console.error("Load Books Error:", e);
        list.innerHTML = '<li style="color:red">加载书籍失败，请刷新页面重试</li>';
    }
}

/**
 * 模拟购买
 */
function buyBook(id) {
    alert("点击了购买书籍ID: " + id + "。此功能需要对接订单接口。");
}

// 页面加载完成后自动尝试加载一次书籍（可选）
window.onload = () => {
    loadBooks();
};

