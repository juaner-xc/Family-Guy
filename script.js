// 注意：请确保 API_BASE 的 IP 地址与你阿里云服务器的公网 IP 一致
const API_BASE = "https://8.222.254.248:5000/api";

/**
 * 加载书籍列表函数
 * 严格匹配 SQL 视图「学生视图_可购书籍」中的中文列名
 */
async function loadBooks() {
    const bookList = document.getElementById('bookList');
    
    // 显示加载中状态
    bookList.innerHTML = '<p style="text-align:center; width:100%">正在从校园服务器获取书籍信息...</p>';

    try {
        const res = await fetch(`${API_BASE}/books`);
        const result = await res.json();

        if (result.code === 0) {
            bookList.innerHTML = ''; // 清空加载提示

            if (result.data.length === 0) {
                bookList.innerHTML = '<p style="text-align:center; width:100%">暂无可售书籍（请检查视图过滤条件）</p>';
                return;
            }

            result.data.forEach(item => {
                const li = document.createElement('li');
                li.className = 'book-item';
                
                // 这里的 item.xxx 必须与 SQL 视图中的别名（AS）完全一致
                li.innerHTML = `
                    <div style="background:white; padding:20px; margin-bottom:15px; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.1); border-left: 5px solid #007bff;">
                        <h3 style="margin:0; color:#007bff; font-size:1.2em;">${item.书名}</h3>
                        <p style="color:#666; font-size:14px; margin: 5px 0;">作者：${item.作者} | ISBN: ${item.ISBN}</p>
                        
                        <div style="margin:10px 0;">
                            <span style="color:#e4393c; font-size:22px; font-weight:bold">¥${item.售价}</span>
                            <del style="color:#999; margin-left:10px; font-size:14px">原价: ¥${item.原价}</del>
                            <span style="background:#fff0f0; color:#e4393c; font-size:12px; padding:2px 5px; border-radius:4px; margin-left:10px">
                                ${item.折扣率}折
                            </span>
                        </div>

                        <div style="font-size:13px; color:#555; background:#f9f9f9; padding:10px; border-radius:6px; margin-bottom:10px;">
                            <strong>商品描述：</strong>${item.商品描述 || '卖家很懒，什么都没写~'}
                        </div>

                        <div style="font-size:12px; color:#888; display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                            <span>卖家：${item.卖家用户名}</span>
                            <span>学院：${item.卖家学院}</span>
                            <span>信用分：<b style="color:#28a745">${item.卖家信用分}</b></span>
                            <span>品相：${item.新旧程度}</span>
                            <span>库存：${item.库存} 本</span>
                            <span>浏览：${item.浏览次数} 次</span>
                        </div>

                        <button onclick="handleBuy('${item.商品编号}')" style="width:100%; margin-top:15px; background:#28a745; color:white; border:none; padding:10px; border-radius:6px; cursor:pointer; font-weight:bold; transition: 0.3s;">
                            立即咨询/购买
                        </button>
                    </div>
                `;
                bookList.appendChild(li);
            });
        }
    } catch (e) {
        console.error("加载失败:", e);
        bookList.innerHTML = `
            <div style="color:red; text-align:center; width:100%; padding:20px;">
                连接服务器失败。请确保您已点击下方授权链接并选择“高级->继续前往”：<br><br>
                <a href="${API_BASE}/books" target="_blank" style="color:#007bff; font-weight:bold;">[ 点击此处手动授权 HTTPS 访问 ]</a>
            </div>`;
    }
}

/**
 * 模拟购买处理
 */
function handleBuy(productId) {
    alert("正在联系卖家，商品编号：" + productId);
}

/**
 * 登录函数（维持原逻辑）
 */
async function doLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const msg = document.getElementById('msg');
    
    msg.innerText = "正在验证登录信息...";

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });

        const result = await res.json();
        if (result.code === 0) {
            msg.innerText = "登录成功！欢迎 " + (result.data.RealName || result.data.Username);
            msg.style.color = "green";
            loadBooks(); // 登录成功后刷新书籍列表
        } else {
            msg.innerText = "错误：" + result.msg;
            msg.style.color = "red";
        }
    } catch (e) {
        msg.innerHTML = '登录失败，请检查服务器连接。';
        console.error(e);
    }
}

// 页面加载完成后自动运行
window.onload = loadBooks;
