import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, type } = await request.json()

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Resend API key not configured" }, { status: 500 })
    }

    let emailContent = ""

    switch (type) {
      case "signup_confirmation":
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2B2B2B;">Welcome to Stitch POP!</h2>
            <p>Thank you for signing up. Please click the link below to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${html}" style="background-color: #2B2B2B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Verify Email</a>
            </div>
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #D4D4D4;">
            <p style="color: #B3B3B3; font-size: 14px;">Best regards,<br>The Stitch POP Team</p>
          </div>
        `
        break
      case "password_reset":
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2B2B2B;">Reset Your Password</h2>
            <p>You requested to reset your password. Click the link below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${html}" style="background-color: #2B2B2B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
            </div>
            <p>This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #D4D4D4;">
            <p style="color: #B3B3B3; font-size: 14px;">Best regards,<br>The Stitch POP Team</p>
          </div>
        `
        break
      default:
        emailContent = html
    }

    const { data, error } = await resend.emails.send({
      from: "Stitch POP <noreply@stitchpop.in>",
      to: [to],
      subject,
      html: emailContent,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
