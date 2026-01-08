/**
 * Vercel Serverless Function for Email Notifications
 * Uses Resend API for sending emails
 */

export default async function handler(req: any, res: any) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { to, subject, title, message, actionUrl, actionText } = req.body;

        // Validate required fields
        if (!to || !subject || !title || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Generate HTML email
        const html = generateEmailHTML({ title, message, actionUrl, actionText });

        // Send email using Resend API
        // Note: You need to set RESEND_API_KEY in environment variables
        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        if (!RESEND_API_KEY) {
            console.warn('RESEND_API_KEY not configured');
            return res.status(200).json({
                success: false,
                message: 'Email service not configured'
            });
        }

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'NR-OS <notifications@nr-os.com>',
                to: to,
                subject: subject,
                html: html
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send email');
        }

        return res.status(200).json({
            success: true,
            messageId: data.id
        });

    } catch (error: any) {
        console.error('Email notification error:', error);
        return res.status(500).json({
            error: 'Failed to send email notification',
            message: error.message
        });
    }
}

function generateEmailHTML(params: {
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
}): string {
    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #0f172a;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
      font-weight: 900;
    }
    .content {
      padding: 40px 32px;
      color: #e2e8f0;
    }
    .content h2 {
      color: white;
      font-size: 24px;
      margin-bottom: 16px;
      font-weight: 800;
    }
    .content p {
      line-height: 1.8;
      font-size: 16px;
      color: #cbd5e1;
    }
    .action-button {
      display: inline-block;
      margin-top: 24px;
      padding: 16px 32px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
    }
    .footer {
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: #64748b;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>NR-OS</h1>
    </div>
    <div class="content">
      <h2>${params.title}</h2>
      <p>${params.message}</p>
      ${params.actionUrl ? `
        <a href="${params.actionUrl}" class="action-button">
          ${params.actionText || 'عرض في لوحة التحكم'}
        </a>
      ` : ''}
    </div>
    <div class="footer">
      <p>هذا إشعار تلقائي من نظام NR-OS</p>
      <p>© ${new Date().getFullYear()} NR-OS. جميع الحقوق محفوظة.</p>
    </div>
  </div>
</body>
</html>
  `;
}
