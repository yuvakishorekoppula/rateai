const { Resend } = require('resend');

const resend = new Resend('re_g7ArtAfK_EzjTpo93HC5En6ozH9YDcv2Q');

async function sendTestEmail() {
  console.log("Attempting to send test email via Resend...");
  
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "yuvakishorekoppula@gmail.com", 
      subject: "Test Email from RateAI",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #2563eb;">Hello from RateAI</h1>
          <p>This is a test email to verify your Resend integration.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">This email was sent via the Resend API.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Email failed to send!");
      console.error("Error details:", error);
    } else {
      console.log("✅ Email SENT SUCCESSFULLY.");
      console.log("Message ID:", data.id);
      console.log("Note: Since you are using onboarding@resend.dev, the email will only be delivered if the 'to' address is verified in your Resend dashboard.");
    }
  } catch (err) {
    console.error("❌ A critical error occurred:");
    console.error(err);
  }
}

sendTestEmail();
