/**
 * Email Notification Service
 * Sends email notifications for critical system events
 */

interface EmailNotification {
    to: string;
    subject: string;
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
}

/**
 * Send email notification via Supabase Edge Function
 */
export async function sendEmailNotification(notification: EmailNotification): Promise<boolean> {
    try {
        // This would call a Supabase Edge Function
        // For now, we'll use a simple fetch to a serverless function
        const response = await fetch('/api/send-notification-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(notification)
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to send email notification:', error);
        return false;
    }
}

/**
 * Generate HTML email template
 */
export function generateEmailHTML(notification: EmailNotification): string {
    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${notification.subject}</title>
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
      box-shadow: 0 10px 30px rgba(79, 70, 229, 0.3);
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
      <h2>${notification.title}</h2>
      <p>${notification.message}</p>
      ${notification.actionUrl ? `
        <a href="${notification.actionUrl}" class="action-button">
          ${notification.actionText || 'عرض في لوحة التحكم'}
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

/**
 * Check if notification should trigger email
 */
export function shouldSendEmail(type: string, metadata?: any): boolean {
    // Send email for critical notifications only
    const criticalTypes = ['error', 'crm', 'finance'];
    return criticalTypes.includes(type) || metadata?.critical === true;
}
