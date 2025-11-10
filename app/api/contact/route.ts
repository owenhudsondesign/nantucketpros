import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { withRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function contactFormEmail(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; }
          .field { margin-bottom: 20px; }
          .field-label { font-weight: 600; color: #666; margin-bottom: 5px; }
          .field-value { color: #333; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">From:</div>
              <div class="field-value">${data.name}</div>
            </div>
            <div class="field">
              <div class="field-label">Email:</div>
              <div class="field-value">${data.email}</div>
            </div>
            <div class="field">
              <div class="field-label">Subject:</div>
              <div class="field-value">${data.subject}</div>
            </div>
            <div class="field">
              <div class="field-label">Message:</div>
              <div class="field-value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            <p>This message was sent from the NantucketPros contact form.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    RATE_LIMITS.EMAIL,
    async () => {
      try {
        const body: ContactFormData = await request.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
          return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
          );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return NextResponse.json(
            { error: "Invalid email address" },
            { status: 400 }
          );
        }

        // Send email to support
        const emailHtml = contactFormEmail({ name, email, subject, message });
        const result = await sendEmail({
          to: "support@nantucketpros.com",
          subject: `Contact Form: ${subject}`,
          html: emailHtml,
          replyTo: email,
        });

        if (!result.success) {
          console.error("Failed to send contact email:", result.error);
          return NextResponse.json(
            { error: "Failed to send message. Please try again later." },
            { status: 500 }
          );
        }

        // Send confirmation email to user
        const confirmationHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #000; color: #fff; padding: 20px; text-align: center; }
                .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #666; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank You for Contacting Us</h1>
                </div>
                <div class="content">
                  <p>Hi ${name},</p>
                  <p>Thank you for reaching out to NantucketPros. We've received your message and our support team will get back to you as soon as possible, typically within 1-2 business days.</p>
                  <p>In the meantime, you might find answers to common questions in our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/faq">Help Center</a>.</p>
                  <p>Best regards,<br>The NantucketPros Team</p>
                </div>
                <div class="footer">
                  <p>NantucketPros - Nantucket's Trusted Service Marketplace</p>
                </div>
              </div>
            </body>
          </html>
        `;

        await sendEmail({
          to: email,
          subject: "We received your message - NantucketPros",
          html: confirmationHtml,
        });

        return NextResponse.json({
          success: true,
          message: "Message sent successfully. We'll get back to you soon!",
        });
      } catch (error: any) {
        console.error("Contact API error:", error);
        return NextResponse.json(
          { error: "An unexpected error occurred. Please try again later." },
          { status: 500 }
        );
      }
    }
  );
}
