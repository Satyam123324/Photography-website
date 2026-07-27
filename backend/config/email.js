const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendOTPEmail = async (to, name, otp) => {
  await transporter.sendMail({
    from: `"PhotoConnect" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Password Reset OTP — PhotoConnect",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#0a0a0f;color:#e8e6e1;padding:48px 40px;border-radius:20px;border:1px solid #1e1e2e">
        <div style="text-align:center;margin-bottom:32px">
          <div style="background:#c8a96e;width:52px;height:52px;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;font-weight:bold;color:#0a0a0f;font-size:20px">PC</div>
          <h1 style="color:#e8e6e1;margin:16px 0 4px;font-size:22px">Password Reset Request</h1>
          <p style="color:#4a4a6a;margin:0;font-size:14px">PhotoConnect Security</p>
        </div>
        <p style="color:#9a9890;line-height:1.7;margin-bottom:8px">Hi <strong style="color:#e8e6e1">${name}</strong>,</p>
        <p style="color:#9a9890;line-height:1.7;margin-bottom:28px">We received a request to reset your password. Use the OTP below — it expires in <strong style="color:#c8a96e">10 minutes</strong>.</p>
        <div style="background:#13131a;border:2px dashed #c8a96e33;border-radius:16px;padding:32px;text-align:center;margin:0 0 28px">
          <p style="color:#4a4a6a;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px">Your One-Time Password</p>
          <div style="font-size:48px;font-weight:900;letter-spacing:16px;color:#c8a96e;font-family:monospace">${otp}</div>
        </div>
        <p style="color:#4a4a6a;font-size:13px;text-align:center;border-top:1px solid #1e1e2e;padding-top:24px;margin:0">
          If you didn't request this, please ignore this email. Your account remains secure.<br/>
          <span style="color:#2a2a3a">— PhotoConnect Team</span>
        </p>
      </div>
    `,
  });
};

module.exports = { sendOTPEmail };
