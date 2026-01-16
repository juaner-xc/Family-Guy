// 确保 IP 和 端口 准确无误
const API_BASE = "https://8.222.254.248:5000/api"; 

const loginBtn = document.getElementById('loginBtn'); 
const msg = document.getElementById('msg'); 
const bookList = document.getElementById('bookList'); 

async function doLogin() { 
    const u = document.getElementById('username').value; 
    const p = document.getElementById('password').value; 

    msg.innerText = "正在验证..."; 
    msg.style.color = "#666"; 

    try { 
        const res = await fetch(`${API_BASE}/login`, { 
            method: 'POST', 
            mode: 'cors', // 必须开启跨域
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ username: u, password: p }) 
        }); 

        const result = await res.json(); 

        if (result.code === 0) { 
            // 兼容后端返回的不同命名格式
            const name = result.data.RealName || result.data.realName || result.data.Username;
            msg.innerText = "登录成功！欢迎 " + name; 
            msg.style.color = "green"; 
            loadBooks(); 
        } else { 
            msg.innerText = "错误：" + (result.msg || "用户名或密码错误"); 
            msg.style.color = "red"; 
        } 
    } catch (e) { 
        msg.innerHTML = "连接失败！请确认已手动访问 API 地址并点击‘信任’。"; 
        console.error("Fetch Error:", e); 
    } 
} 

async function loadBooks() { 
    try { 
        const res = await fetch(`${API_BASE}/books`); 
        const result = await res.json(); 

        if (result.code === 0) { 
            bookList.innerHTML = ''; 

            if (!result.data || result.data.length === 0) { 
                bookList.innerHTML = '<li style="text-align:center;">暂无可购书籍</li>'; 
                return; 
            } 

            result.data.forEach(item => { 
                const li = document.createElement('li'); 
                li.className = 'book-item'; 
                // 这里的字段名必须严格对应 SQL 视图 [学生视图_可购书籍] 中的名称
                li.innerHTML = `
                    <h3>${item.书名 || '未知书籍'}</h3>
                    <p>作者：${item.作者 || '未知'}</p>
                    <p class="price">¥${item.售价 || 0}</p>
                    <p>卖家：${item.卖家 || '未知'}</p>
                    <p>学院：${item.卖家学院 || '未知'}</p>
                    <button style="margin-top:10px; background:#28a745; color:white; border:none; padding:5px 10px; border-radius:4px;">立即购买</button>
                `; 
                bookList.appendChild(li); 
            }); 
        } 
    } catch (e) { 
        console.error("加载数据失败:", e); 
    } 
} 

if(loginBtn) loginBtn.addEventListener('click', doLogin);
