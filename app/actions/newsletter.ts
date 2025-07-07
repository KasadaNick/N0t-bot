"use server"

import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase"
import { sendWelcomeEmail, isResendConfigured } from "@/lib/resend"
import { z } from "zod"

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  try {
    // Check if services are configured
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: "Newsletter service is not configured. Please check environment variables.",
      }
    }

    if (!isResendConfigured()) {
      return {
        success: false,
        error: "Email service is not configured. Please check environment variables.",
      }
    }

    // Validate email
    const result = emailSchema.safeParse({
      email: formData.get("email"),
    })

    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0]?.message || "Invalid email address",
      }
    }

    const { email } = result.data

    if (!supabaseAdmin) {
      return {
        success: false,
        error: "Database connection not available",
      }
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabaseAdmin
      .from("subscribers")
      .select("email, status")
      .eq("email", email)
      .single()

    if (existingSubscriber) {
      if (existingSubscriber.status === "active") {
        return {
          success: false,
          error: "This email is already subscribed to our newsletter.",
        }
      } else {
        // Reactivate unsubscribed user
        const { error: updateError } = await supabaseAdmin
          .from("subscribers")
          .update({
            status: "active",
            subscribed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("email", email)

        if (updateError) {
          console.error("Error reactivating subscriber:", updateError)
          return {
            success: false,
            error: "Failed to reactivate subscription. Please try again.",
          }
        }

        return {
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
        }
      }
    }

    // Generate unsubscribe token
    const unsubscribeToken = crypto.randomUUID()

    // Add new subscriber
    const { error: insertError } = await supabaseAdmin.from("subscribers").insert({
      email,
      status: "active",
      source: "website",
      unsubscribe_token: unsubscribeToken,
      preferences: {},
      subscribed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error inserting subscriber:", insertError)
      return {
        success: false,
        error: "Failed to subscribe. Please try again.",
      }
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(email, unsubscribeToken)
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError)
      // Don't fail the subscription if email fails
    }

    return {
      success: true,
      message: "Successfully subscribed! Check your email for a welcome message.",
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function unsubscribeFromNewsletter(token: string) {
  try {
    const { data: subscriber, error: findError } = await supabaseAdmin
      .from("subscribers")
      .select("email")
      .eq("unsubscribe_token", token)
      .single()

    if (findError || !subscriber) {
      return {
        success: false,
        error: "Invalid unsubscribe link.",
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from("subscribers")
      .update({ status: "unsubscribed" })
      .eq("unsubscribe_token", token)

    if (updateError) {
      console.error("Unsubscribe error:", updateError)
      return {
        success: false,
        error: "Failed to unsubscribe. Please try again.",
      }
    }

    return {
      success: true,
      message: "Successfully unsubscribed from the newsletter.",
    }
  } catch (error) {
    console.error("Unsubscribe error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}
