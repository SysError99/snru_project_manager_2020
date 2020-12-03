const route = 'login'
module.exports = /*html*/`<html>
    <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0">
    <head>
		<title>ลงชื่อเข้าใช้</title>
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
        <style>
        {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "segoe ui", roboto, oxygen, ubuntu, cantarell, "fira sans", "droid sans", "helvetica neue", Arial, sans-serif;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        body {
            background-color: #435165;
        }
        .login {
            width: 400px;
            background-color: #ffffff;
            box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.3);
            margin: 100px auto;
        }
        .login h1 {
            text-align: center;
            color: #5b6574;
            font-size: 24px;
            padding: 20px 0 20px 0;
            border-bottom: 1px solid #dee0e4;
        }
        .login p {
            text-align: center;
            color: #5b6574;
            font-size: 12px;
            padding: 20px 0 20px 0;
        }
        .login form {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            padding-top: 20px;
        }
        .login form label {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            background-color: #3274d6;
            color: #ffffff;
        }
        .login form input[type="password"], .login form input[type="text"] {
            width: 310px;
            height: 50px;
            border: 1px solid #dee0e4;
            margin-bottom: 20px;
            padding: 0 15px;
        }
        .login form input[type="submit"] {
            width: 100%;
            padding: 15px;
            margin-top: 20px;
            background-color: #3274d6;
            border: 0;
            cursor: pointer;
            font-weight: bold;
            color: #ffffff;
            transition: background-color 0.2s;
        }
        .login form input[type="submit"]:hover {
            background-color: #2868c7;
            transition: background-color 0.2s;
        }
        </style>
	</head>
	<body>
		<div class="login">
			<h1>ลงชื่อเข้าใช้ระบบ</h1>
			<form action="${route}" method="post">
				<label for="username">
					<i class="fas fa-user"></i>
				</label>
				<input type="text" name="username" placeholder="ชื่อผู้ใช้งาน" id="username" oninvalid="this.setCustomValidity('กรุณากรอกชื่อผู้ใช้')" oninput="setCustomValidity('')" required>
                
                <label for="password">
					<i class="fas fa-lock"></i>
				</label>
				<input type="password" name="password" placeholder="รหัสผ่าน" id="password" oninvalid="this.setCustomValidity('กรุณากรอกรหัสผ่าน')" oninput="setCustomValidity('')" required>
                
                <p>สำหรับครู/อาจารย์ ต้องได้รับการยืนยันเสียก่อนจึงเข้าสู่ระบบได้</p>
				<input type="submit" value="เข้าสู่ระบบ">
            </form>
            <a style="text-align:center;" href="register">หากไม่มีบัญชี โปรดสมัครสมาชิก</a>
		</div>
	</body>
</html>`