# 导入必要的库
from flask import Flask, request, jsonify
import pymysql
import pymysql.cursors

# 初始化Flask应用
app = Flask(__name__)

# 数据库配置（密码已改为123456，无需再改）
DB_CONFIG = {
    "host": "localhost",          
    "user": "root",               
    "password": "123456",  # 已设置为你的MySQL密码
    "database": "校园二手书交易平台",  
    "charset": "utf8mb4"          
}

# 解决跨域问题（前端访问必备）
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'  
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

# 连接数据库的工具函数
def get_db_connection():
    try:
        conn = pymysql.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database=DB_CONFIG['database'],
            charset=DB_CONFIG['charset'],
            cursorclass=pymysql.cursors.DictCursor
        )
        return conn
    except Exception as e:
        print(f"数据库连接失败：{e}")
        return None

# 接口1：用户登录验证
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"code": -1, "msg": "用户名或密码不能为空"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"code": -2, "msg": "数据库连接失败"}), 500
    
    try:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM User WHERE Username = %s AND Password = %s"
            cursor.execute(sql, (username, password))
            user = cursor.fetchone()
            
            if user:
                return jsonify({
                    "code": 0,
                    "msg": "登录成功",
                    "data": {
                        "userId": user['UserID'],
                        "username": user['Username'],
                        "role": user['Role']
                    }
                })
            else:
                return jsonify({"code": -3, "msg": "用户名或密码错误"}), 401
    except Exception as e:
        return jsonify({"code": -4, "msg": f"查询失败：{str(e)}"}), 500
    finally:
        conn.close()

# 接口2：获取所有书籍列表
@app.route('/api/books', methods=['GET'])
def get_books():
    conn = get_db_connection()
    if not conn:
        return jsonify({"code": -2, "msg": "数据库连接失败"}), 500
    
    try:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM Book"
            cursor.execute(sql)
            books = cursor.fetchall()
            
            return jsonify({
                "code": 0,
                "msg": "获取书籍成功",
                "data": books
            })
    except Exception as e:
        return jsonify({"code": -4, "msg": f"查询失败：{str(e)}"}), 500
    finally:
        conn.close()

# 接口3：获取用户的订单列表
@app.route('/api/orders/<int:user_id>', methods=['GET'])
def get_orders(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"code": -2, "msg": "数据库连接失败"}), 500
    
    try:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM Orders WHERE UserID = %s"
            cursor.execute(sql, (user_id,))
            orders = cursor.fetchall()
            
            return jsonify({
                "code": 0,
                "msg": "获取订单成功",
                "data": orders
            })
    except Exception as e:
        return jsonify({"code": -4, "msg": f"查询失败：{str(e)}"}), 500
    finally:
        conn.close()

# 接口4：获取用户的收藏列表
@app.route('/api/favorites/<int:user_id>', methods=['GET'])
def get_favorites(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"code": -2, "msg": "数据库连接失败"}), 500
    
    try:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM Favorite WHERE UserID = %s"
            cursor.execute(sql, (user_id,))
            favorites = cursor.fetchall()
            
            return jsonify({
                "code": 0,
                "msg": "获取收藏成功",
                "data": favorites
            })
    except Exception as e:
        return jsonify({"code": -4, "msg": f"查询失败：{str(e)}"}), 500
    finally:
        conn.close()

# 启动应用（允许外网访问）
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
