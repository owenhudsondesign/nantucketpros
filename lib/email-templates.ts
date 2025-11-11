import { APP_NAME, APP_URL } from './email';

// Base email wrapper with consistent styling
function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: #ffffff;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      margin: -30px -30px 30px -30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #1e3a8a;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 600;
    }
    .button:hover {
      background-color: #1e40af;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    .info-box {
      background-color: #f0f9ff;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p>This email was sent by ${APP_NAME}<br>
      <a href="${APP_URL}" style="color: #3b82f6; text-decoration: none;">Visit our website</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

// Booking request notification for vendor
export function newBookingRequestEmail(data: {
  vendorName: string;
  customerName: string;
  serviceType: string;
  preferredDate: string;
  description: string;
  bookingId: string;
}): string {
  const content = `
    <div class="header">
      <h1>New Booking Request</h1>
    </div>
    <p>Hi ${data.vendorName},</p>
    <p>You have received a new booking request from <strong>${data.customerName}</strong>.</p>

    <div class="info-box">
      <p><strong>Service:</strong> ${data.serviceType}</p>
      <p><strong>Preferred Date:</strong> ${new Date(data.preferredDate).toLocaleDateString()}</p>
      <p><strong>Details:</strong> ${data.description}</p>
    </div>

    <p>Please review this request and respond promptly.</p>

    <a href="${APP_URL}/vendor/bookings" class="button">View Booking Request</a>

    <p>Best regards,<br>The ${APP_NAME} Team</p>
  `;
  return baseTemplate(content);
}

// Booking confirmed notification for customer
export function bookingConfirmedEmail(data: {
  customerName: string;
  vendorName: string;
  serviceType: string;
  price: number;
  bookingId: string;
}): string {
  const content = `
    <div class="header">
      <h1>Booking Confirmed!</h1>
    </div>
    <p>Hi ${data.customerName},</p>
    <p>Great news! <strong>${data.vendorName}</strong> has accepted your booking request.</p>

    <div class="info-box">
      <p><strong>Service:</strong> ${data.serviceType}</p>
      <p><strong>Price:</strong> $${data.price.toFixed(2)}</p>
      <p><strong>Vendor:</strong> ${data.vendorName}</p>
    </div>

    <p>To proceed with this booking, please complete your payment.</p>

    <a href="${APP_URL}/homeowner/bookings" class="button">Pay Now</a>

    <p>Best regards,<br>The ${APP_NAME} Team</p>
  `;
  return baseTemplate(content);
}

// Payment received notification for vendor
export function paymentReceivedEmail(data: {
  vendorName: string;
  customerName: string;
  serviceType: string;
  price: number;
  vendorEarnings: number;
}): string {
  const content = `
    <div class="header">
      <h1>Payment Received</h1>
    </div>
    <p>Hi ${data.vendorName},</p>
    <p>Payment has been received for your booking with <strong>${data.customerName}</strong>.</p>

    <div class="info-box">
      <p><strong>Service:</strong> ${data.serviceType}</p>
      <p><strong>Total Payment:</strong> $${data.price.toFixed(2)}</p>
      <p><strong>Your Earnings:</strong> $${data.vendorEarnings.toFixed(2)}</p>
      <p style="font-size: 12px; color: #6b7280;">Platform fee (10%): $${(data.price - data.vendorEarnings).toFixed(2)}</p>
    </div>

    <p>You can now proceed with providing the service. Once completed, mark the booking as complete to receive your payment.</p>

    <a href="${APP_URL}/vendor/bookings" class="button">View Booking</a>

    <p>Best regards,<br>The ${APP_NAME} Team</p>
  `;
  return baseTemplate(content);
}

// Booking completed - request review
export function bookingCompletedEmail(data: {
  customerName: string;
  vendorName: string;
  serviceType: string;
  bookingId: string;
}): string {
  const content = `
    <div class="header">
      <h1>Service Completed</h1>
    </div>
    <p>Hi ${data.customerName},</p>
    <p>Your service with <strong>${data.vendorName}</strong> has been marked as completed.</p>

    <div class="info-box">
      <p><strong>Service:</strong> ${data.serviceType}</p>
      <p><strong>Vendor:</strong> ${data.vendorName}</p>
    </div>

    <p>We hope you&apos;re satisfied with the service! Please take a moment to leave a review and help other homeowners make informed decisions.</p>

    <a href="${APP_URL}/homeowner/bookings/${data.bookingId}/review" class="button">Leave a Review</a>

    <p>Thank you for using ${APP_NAME}!</p>

    <p>Best regards,<br>The ${APP_NAME} Team</p>
  `;
  return baseTemplate(content);
}

// New message notification
export function newMessageEmail(data: {
  recipientName: string;
  senderName: string;
  messagePreview: string;
  bookingId: string;
}): string {
  const content = `
    <div class="header">
      <h1>New Message</h1>
    </div>
    <p>Hi ${data.recipientName},</p>
    <p>You have received a new message from <strong>${data.senderName}</strong>.</p>

    <div class="info-box">
      <p style="font-style: italic;">&quot;${data.messagePreview.substring(0, 100)}${data.messagePreview.length > 100 ? '...' : ''}&quot;</p>
    </div>

    <a href="${APP_URL}/homeowner/messages" class="button">View Message</a>

    <p>Best regards,<br>The ${APP_NAME} Team</p>
  `;
  return baseTemplate(content);
}

// Vendor verification approved
export function vendorVerifiedEmail(data: {
  vendorName: string;
  businessName: string;
}): string {
  const content = `
    <div class="header">
      <h1>Congratulations! You&apos;re Verified</h1>
    </div>
    <p>Hi ${data.vendorName},</p>
    <p>Great news! Your vendor profile for <strong>${data.businessName}</strong> has been verified by our team.</p>

    <div class="info-box">
      <p>✓ Your business is now listed in our public vendor directory</p>
      <p>✓ You can start receiving and accepting booking requests</p>
      <p>✓ Your verified badge will be displayed on your profile</p>
    </div>

    <p>Welcome to the ${APP_NAME} community! We&apos;re excited to have you on board.</p>

    <a href="${APP_URL}/vendor/dashboard" class="button">Go to Dashboard</a>

    <p>Best regards,<br>The ${APP_NAME} Team</p>
  `;
  return baseTemplate(content);
}

// Booking cancelled notification
export function bookingCancelledEmail(data: {
  recipientName: string;
  serviceType: string;
  reason: string;
  isCustomer: boolean;
}): string {
  const content = `
    <div class="header">
      <h1>Booking Cancelled</h1>
    </div>
    <p>Hi ${data.recipientName},</p>
    <p>A booking has been cancelled.</p>

    <div class="info-box">
      <p><strong>Service:</strong> ${data.serviceType}</p>
      <p><strong>Reason:</strong> ${data.reason}</p>
    </div>

    ${data.isCustomer
      ? '<p>If you have any questions about this cancellation, please contact our support team.</p>'
      : '<p>No action is required from you at this time.</p>'
    }

    <a href="${APP_URL}/${data.isCustomer ? 'homeowner' : 'vendor'}/bookings" class="button">View Bookings</a>

    <p>Best regards,<br>The ${APP_NAME} Team</p>
  `;
  return baseTemplate(content);
}
