import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NotificationRequest {
  type: 'repair_request' | 'contact_form' | 'blog_subscription' | 'chat_message';
  title: string;
  message: string;
  relatedId?: string;
  metadata?: Record<string, any>;
}

function generateAdminEmailHTML(data: NotificationRequest): { subject: string; html: string; text: string } {
  const { type, title, message, metadata } = data;

  const typeLabels: Record<string, string> = {
    repair_request: "New Repair Request",
    contact_form: "New Contact Form Submission",
    blog_subscription: "New Blog Subscription",
    chat_message: "New Chat Conversation"
  };

  const typeColors: Record<string, string> = {
    repair_request: "#f97316",
    contact_form: "#3b82f6",
    blog_subscription: "#10b981",
    chat_message: "#8b5cf6"
  };

  const subject = `${typeLabels[type]} - ToolServe`;
  const color = typeColors[type] || "#f97316";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #334155; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${color}; color: white; padding: 25px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e2e8f0; }
    .badge { background: #fff7ed; border: 2px solid ${color}; color: ${color}; padding: 8px 16px; border-radius: 16px; display: inline-block; font-weight: bold; font-size: 14px; margin: 10px 0; }
    .info-box { background: #f8fafc; border-left: 4px solid ${color}; padding: 15px; margin: 20px 0; }
    .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: ${color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
    .metadata-row { margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .metadata-label { font-weight: bold; color: #475569; display: inline-block; min-width: 120px; }
    .metadata-value { color: #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">🔔 Admin Notification</h1>
      <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">ToolServe Platform</p>
    </div>

    <div class="content">
      <div style="text-align: center;">
        <div class="badge">${typeLabels[type]}</div>
      </div>

      <h2 style="color: #1e293b; margin-top: 20px;">${title}</h2>

      <p style="font-size: 16px; color: #475569;">${message}</p>

      ${metadata && Object.keys(metadata).length > 0 ? `
      <div class="info-box">
        <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">Details:</h3>
        ${Object.entries(metadata).map(([key, value]) => `
          <div class="metadata-row">
            <span class="metadata-label">${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
            <span class="metadata-value">${typeof value === 'object' ? JSON.stringify(value) : value}</span>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://app.supabase.com" class="button" style="color: white;">View in Dashboard</a>
      </div>

      <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
        This is an automated notification from your ToolServe platform. You received this because you are an administrator.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 10px 0;"><strong>ToolServe Admin System</strong></p>
      <p style="margin: 5px 0;">Automated notification - do not reply</p>
      <p style="margin: 5px 0;">${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
${typeLabels[type]} - ToolServe

${title}

${message}

${metadata && Object.keys(metadata).length > 0 ? `
Details:
${Object.entries(metadata).map(([key, value]) => `${key.replace(/_/g, ' ')}: ${typeof value === 'object' ? JSON.stringify(value) : value}`).join('\n')}
` : ''}

This is an automated notification from your ToolServe platform.
Timestamp: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}
  `;

  return { subject, html, text };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const notificationData: NotificationRequest = await req.json();
    const { type, title, message, relatedId, metadata } = notificationData;

    if (!type || !title || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: type, title, message" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase credentials not configured");
      return new Response(
        JSON.stringify({ error: "Service configuration error" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from('admin_notifications')
      .insert({
        type,
        title,
        message,
        related_id: relatedId,
        metadata: metadata || {}
      });

    if (dbError) {
      console.error("Database error:", dbError);
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.log("Resend API key not configured - skipping email");
      return new Response(
        JSON.stringify({
          success: true,
          notificationCreated: !dbError,
          emailSent: false,
          message: "Notification created but email not sent (API key not configured)"
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailContent = generateAdminEmailHTML(notificationData);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ToolServe Notifications <onboarding@resend.dev>",
        to: ["ronchimbo@gmail.com"],
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();
      console.error("Resend API error:", error);

      return new Response(
        JSON.stringify({
          success: true,
          notificationCreated: !dbError,
          emailSent: false,
          emailError: error
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailResult = await resendResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        notificationCreated: !dbError,
        emailSent: true,
        emailId: emailResult.id
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error in notify-admin function:", error);

    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
