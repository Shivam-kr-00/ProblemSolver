export const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    return otp
}

export const getOtpHtml = (otp) => {
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: #333;
        }

        .container {
            background: #ffffff;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 450px;
            width: 100%;
            padding: 40px;
            text-align: center;
            animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .logo {
            width: 80px;
            margin-bottom: 20px;
        }

        .title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #2c3e50;
        }

        .subtitle {
            color: #64748b;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.6;
        }

        .otp-box {
            background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 25px 40px;
            border-radius: 12px;
            border: 2px dashed #cbd5e1;
            margin-bottom: 25px;
            display: inline-block;
        }

        .otp-code {
            font-size: 48px;
            font-weight: 800;
            color: #667eea;
            letter-spacing: 8px;
            text-shadow: 2px 2px 4px rgba(102, 126, 234, 0.2);
        }

        .info-text {
            font-size: 14px;
            color: #94a3b8;
            margin-bottom: 20px;
            font-style: italic;
        }

        .security-note {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 25px;
            text-align: left;
        }

        .security-note h4 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #475569;
            font-weight: 700;
        }

        .security-note ul {
            margin: 0;
            padding-left: 20px;
            font-size: 13px;
            color: #64748b;
            line-height: 1.7;
        }

        .footer {
            margin-top: 20px;
        }

        .footer-logo {
            font-size: 18px;
            font-weight: 800;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .footer-text {
            font-size: 12px;
            color: #94a3b8;
            margin: 0;
        }

        @media (max-width: 480px) {
            .container {
                padding: 20px;
                margin: 15px;
            }

            .otp-code {
                font-size: 36px;
                letter-spacing: 6px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="logo">🔐</div>

        <h1 class="title">Verify Your Email Address</h1>
        <p class="subtitle">
            We sent a verification code to your email address.
            Please enter the 6-digit code below to complete your registration.
        </p>

        <div class="otp-box">
            <span class="otp-code">${otp}</span>
        </div>

        <p class="info-text">
            This code will expire in <strong>10 minutes</strong>
        </p>

        <div class="security-note">
            <h4>Why do you need this?</h4>
            <ul>
                <li>To verify that you own this email address</li>
                <li>To protect your account from unauthorized access</li>
                <li>To ensure secure communication</li>
            </ul>
        </div>

        <div class="footer">
            <div class="footer-logo">ProTech</div>
            <p class="footer-text">
                Your security is our priority
            </p>
        </div>
    </div>
</body>

</html>
    `   
}