import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY

let resend: Resend | null = null

if (resendApiKey) {
  resend = new Resend(resendApiKey)
}

export function isResendConfigured() {
  return !!resendApiKey
}

export async function sendWelcomeEmail(email: string, unsubscribeToken: string) {
  if (!resend) {
    throw new Error("Resend is not configured")
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${unsubscribeToken}`

  try {
    const { data, error } = await resend.emails.send({
      from: "n0t.bot <noreply@n0t.bot>",
      to: [email],
      subject: "Welcome to n0t.bot Newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Welcome to n0t.bot!</h1>
          
          <p>Thank you for subscribing to our newsletter. You'll receive the latest updates on:</p>
          
          <ul>
            <li>Invisible CAPTCHA technology</li>
            <li>Web security insights</li>
            <li>Privacy-focused solutions</li>
            <li>Industry trends and analysis</li>
          </ul>
          
          <p>We respect your privacy and will never spam you. You can unsubscribe at any time.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Visit n0t.bot
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; text-align: center;">
            If you no longer wish to receive these emails, you can 
            <a href="${unsubscribeUrl}" style="color: #666;">unsubscribe here</a>.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Email sending error:", error)
    return { success: false, error: "Failed to send email" }
  }
}
