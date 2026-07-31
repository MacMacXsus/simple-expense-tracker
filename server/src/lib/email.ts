export const sendOtpEmail = async (toEmail: string, name: string, otp: string) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    throw new Error('Brevo API key or Sender Email is missing in environment variables.');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Trackily', email: senderEmail },
      to: [{ email: toEmail, name }],
      subject: `${otp} is your Trackily password reset code`,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #0f172a; margin-bottom: 8px;">Password Reset Request</h2>
          <p style="color: #475569; font-size: 14px;">Hello ${name},</p>
          <p style="color: #475569; font-size: 14px;">You requested to reset your Trackily password. Use the code below to complete the reset process:</p>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563eb;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 12px;">This code is valid for <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send OTP via Brevo');
  }
};