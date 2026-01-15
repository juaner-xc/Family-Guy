<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>校园二手书交易平台</title>
    <style>
        body { max-width: 1000px; margin: 20px auto; padding: 0 20px; font-family: "Microsoft YaHei", sans-serif; background-color: #f5f7fa; }
        .login-container { border: none; padding: 25px; border-radius: 12px; background: white; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 8px; font-weight: 600; }
        input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        .btn { padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: 0.3s; }
        .btn-primary { background-color: #007bff; color: white; width: 100%; }
        .btn-primary:hover { background-color: #0056b3; }
        .btn-secondary { background-color: #6c757d; color: white; display: none; margin: 0 auto; }
        #loginStatus { margin: 15px 0; font-weight: 600; text-align: center; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        
        /* 书籍卡片展示区 */
        #bookList { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
            gap: 20px; 
            list-style: none; 
            padding: 0; 
        }
        .book-card { 
            background: white; 
            padding: 20px; 
            border-radius: 10px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.05); 
            transition: 0.3s;
        }
        .book-card:hover { transform: translateY(-5px); }
        .book-card h4 { margin: 0 0 10px 0; color: #007bff; }
        .price-row { display: flex; align-items: baseline; gap: 10px; margin: 10px 0; }
        .sale-price { color: #e4393c; font-size: 22px; font-weight: bold; }
        .original-price { text-decoration: line-through; color: #999; font-size: 14px; }
        .badge { background: #e1f5fe; color: #01579b; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <h1 style="text-align: center; color: #333;">校园二手书交易平台</h1>

    <div class="login-container">
        <div id="authFields">
            <div class="form-group">
                <label>用户名 / 邮箱</label>
                <input type="text" id="username" placeholder="请输入账号">
            </div>
            <div class="form-group">
                <label>密码</label>
                <input type="password" id="password" placeholder="请输入密码">
            </div>
            <button class="btn btn-primary" id="loginBtn">登录</button>
        </div>
        <button class="btn btn-secondary" id="logoutBtn">退出登录</button>
        <div id="loginStatus">请登录以查看更多书籍</div>
    </div>

    <div style="text-align: center; margin-bottom: 20px;">
        <button class="btn btn-primary" id="loadBooksBtn" style="display:none; width:auto;">刷新书籍广场</button>
    </div>

    <ul id="bookList"></ul>

    <script src="script.js"></script>
</body>
</html>

