export const otpEmailTemplate = (otp: string, userName?: string) => `
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mã OTP của bạn</title>
<style>
  body, html { margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f5f7fa; }
  a { color: inherit; text-decoration: none; }

  .email-container {
    max-width: 600px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .email-header {
    background: linear-gradient(90deg, #4f46e5, #6366f1);
    color: #ffffff;
    text-align: center;
    padding: 24px 16px;
  }
  .email-header h1 { margin: 0; font-size: 24px; font-weight: 600; }

  .email-body {
    padding: 32px 24px;
    text-align: center;
  }
  .email-body p { font-size: 16px; color: #333333; margin: 16px 0; }
  .otp-code {
    display: inline-block;
    font-size: 28px;
    letter-spacing: 4px;
    font-weight: 700;
    padding: 16px 32px;
    border-radius: 8px;
    background-color: #f0f4ff;
    color: #1e40af;
    margin: 24px 0;
  }

  .email-footer {
    background-color: #f9fafb;
    padding: 16px 24px;
    font-size: 12px;
    color: #888888;
    text-align: center;
  }

  @media (max-width: 480px) {
    .email-body { padding: 24px 16px; }
    .otp-code { font-size: 24px; padding: 12px 24px; }
  }
</style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Mã OTP của bạn</h1>
    </div>
    <div class="email-body">
      <p>Xin chào ${userName || 'bạn'},</p>
      <p>Vui lòng sử dụng mã OTP dưới đây để hoàn tất hành động. Mã sẽ hết hạn sau <b>5 phút</b>.</p>
      <div class="otp-code">${otp}</div>
      <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
    </div>
    <div class="email-footer">
      &copy; ${new Date().getFullYear()} Smart Task Manager App. Bản quyền thuộc về chúng tôi.
    </div>
  </div>
</body>
</html>
`;