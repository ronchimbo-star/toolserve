import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  type: 'repair_confirmation' | 'status_update' | 'completion';
  to: string;
  customerName: string;
  requestData?: {
    referenceNumber?: string;
    equipmentType?: string;
    serviceType?: string;
    status?: string;
    estimatedCompletion?: string;
    notes?: string;
  };
}

function generateConfirmationEmail(data: EmailRequest): { subject: string; html: string; text: string } {
  const { customerName, requestData } = data;
  const subject = "Repair Request Confirmed - ToolServe";
  const trackingUrl = requestData?.referenceNumber
    ? `https://toolserve.co.uk/track?ref=${encodeURIComponent(requestData.referenceNumber)}`
    : 'https://toolserve.co.uk/track';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #334155; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .logo { max-width: 150px; height: auto; margin-bottom: 10px; }
    .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e2e8f0; }
    .reference { background: #fff7ed; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .reference-number { font-size: 24px; font-weight: bold; color: #ea580c; }
    .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #f97316; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 15px 0; font-weight: 600; }
    .button:hover { background: #ea580c; }
    .info-row { margin: 10px 0; }
    .info-label { font-weight: bold; color: #475569; }
    .divider { border-top: 1px solid #e2e8f0; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://toolserve.co.uk/toolserve-logo-white.svg" alt="ToolServe" class="logo" />
      <h1 style="margin: 10px 0 0 0; font-size: 28px;">Repair Request Confirmed</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Repairing tools, reducing waste</p>
    </div>

    <div class="content">
      <h2 style="color: #ea580c; margin-top: 0;">Thank You for Your Request!</h2>

      <p>Dear ${customerName},</p>

      <p>We've received your repair request and our team will review it shortly. You'll hear from us within 24 hours.</p>

      ${requestData?.referenceNumber ? `
      <div class="reference">
        <p style="margin: 0 0 5px 0; font-size: 12px; color: #64748b;">Your Reference Number:</p>
        <div class="reference-number">${requestData.referenceNumber}</div>
        <p style="margin: 10px 0 0 0; font-size: 13px; color: #475569;">Save this number to track your repair</p>
      </div>
      ` : ''}

      <div style="margin: 25px 0;">
        <h3 style="color: #1e293b; margin-bottom: 15px;">Request Details:</h3>
        ${requestData?.equipmentType ? `<div class="info-row"><span class="info-label">Equipment:</span> ${requestData.equipmentType}</div>` : ''}
        ${requestData?.serviceType ? `<div class="info-row"><span class="info-label">Service Type:</span> ${requestData.serviceType}</div>` : ''}
      </div>

      <h3 style="color: #1e293b; margin-top: 30px;">What Happens Next?</h3>
      <ol style="padding-left: 20px;">
        <li>Our technician will review your request and photos (if provided)</li>
        <li>We'll contact you within 24 hours with a quote and timeline</li>
        <li>Once approved, we'll begin the repair</li>
        <li>You'll receive updates as your repair progresses</li>
      </ol>

      ${requestData?.referenceNumber ? `
      <div class="divider"></div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${trackingUrl}" class="button">Track Your Repair</a>
        <p style="margin: 10px 0 0 0; font-size: 13px; color: #64748b;">Check the status of your repair anytime</p>
      </div>
      <div class="divider"></div>
      ` : ''}

      <p style="margin-top: 30px;">If you have any questions, feel free to reach out:</p>
      <p style="margin: 5px 0;">📧 <a href="mailto:info@toolserve.co.uk" style="color: #f97316; text-decoration: none;">info@toolserve.co.uk</a></p>
      <p style="margin: 5px 0;">📞 +44 (0)23 9000 0000</p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 10px 0;"><strong>ToolServe</strong></p>
      <p style="margin: 5px 0;">Repairing tools, reducing waste, serving communities</p>
      <p style="margin: 5px 0;">Portsmouth, UK • www.toolserve.co.uk</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
ToolServe - Repair Request Confirmed

Dear ${customerName},

We've received your repair request and our team will review it shortly. You'll hear from us within 24 hours.

${requestData?.referenceNumber ? `Your Reference Number: ${requestData.referenceNumber}\nSave this number to track your repair.\n\nTrack Your Repair: ${trackingUrl}\n` : ''}

Request Details:
${requestData?.equipmentType ? `Equipment: ${requestData.equipmentType}\n` : ''}
${requestData?.serviceType ? `Service Type: ${requestData.serviceType}\n` : ''}

What Happens Next?
1. Our technician will review your request and photos (if provided)
2. We'll contact you within 24 hours with a quote and timeline
3. Once approved, we'll begin the repair
4. You'll receive updates as your repair progresses

If you have any questions, feel free to reach out:
Email: info@toolserve.co.uk
Phone: +44 (0)23 9000 0000

--
ToolServe
Repairing tools, reducing waste, serving communities
Portsmouth, UK • www.toolserve.co.uk
  `;

  return { subject, html, text };
}

function generateStatusUpdateEmail(data: EmailRequest): { subject: string; html: string; text: string } {
  const { customerName, requestData } = data;
  const subject = `Repair Status Update - ${requestData?.referenceNumber || 'ToolServe'}`;
  const trackingUrl = requestData?.referenceNumber
    ? `https://toolserve.co.uk/track?ref=${encodeURIComponent(requestData.referenceNumber)}`
    : 'https://toolserve.co.uk/track';

  const statusMessages: Record<string, { title: string; message: string }> = {
    diagnosing: {
      title: "We're Diagnosing Your Equipment",
      message: "Our technician is currently examining your equipment to determine the issue and provide an accurate quote."
    },
    in_repair: {
      title: "Repair In Progress",
      message: "Great news! We've started working on your repair. Our technician is actively fixing your equipment."
    },
    completed: {
      title: "Repair Completed!",
      message: "Excellent news! Your repair is complete and your equipment is ready for collection or delivery."
    }
  };

  const statusInfo = statusMessages[requestData?.status || 'diagnosing'] || statusMessages.diagnosing;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #334155; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .logo { max-width: 150px; height: auto; margin-bottom: 10px; }
    .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e2e8f0; }
    .status-badge { background: #fff7ed; border: 2px solid #f97316; color: #ea580c; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold; margin: 15px 0; }
    .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #f97316; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 15px 0; font-weight: 600; }
    .button:hover { background: #ea580c; }
    .divider { border-top: 1px solid #e2e8f0; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://toolserve.co.uk/toolserve-logo-white.svg" alt="ToolServe" class="logo" />
      <h1 style="margin: 10px 0 0 0; font-size: 28px;">Status Update</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your repair progress</p>
    </div>

    <div class="content">
      <h2 style="color: #ea580c; margin-top: 0;">${statusInfo.title}</h2>

      <p>Dear ${customerName},</p>

      ${requestData?.referenceNumber ? `<p><strong>Reference:</strong> ${requestData.referenceNumber}</p>` : ''}

      <div style="text-align: center; margin: 25px 0;">
        <div class="status-badge">${requestData?.status?.replace('_', ' ').toUpperCase()}</div>
      </div>

      <p>${statusInfo.message}</p>

      ${requestData?.estimatedCompletion ? `<p><strong>Estimated Completion:</strong> ${requestData.estimatedCompletion}</p>` : ''}
      ${requestData?.notes ? `
      <div style="background: #f8fafc; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0;"><strong>Additional Notes:</strong></p>
        <p style="margin: 10px 0 0 0;">${requestData.notes}</p>
      </div>
      ` : ''}

      ${requestData?.referenceNumber ? `
      <div class="divider"></div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${trackingUrl}" class="button">View Full Status</a>
        <p style="margin: 10px 0 0 0; font-size: 13px; color: #64748b;">Track your repair in real-time</p>
      </div>
      <div class="divider"></div>
      ` : ''}

      <p style="margin-top: 30px;">Questions? Contact us:</p>
      <p style="margin: 5px 0;">📧 <a href="mailto:info@toolserve.co.uk" style="color: #f97316; text-decoration: none;">info@toolserve.co.uk</a></p>
      <p style="margin: 5px 0;">📞 +44 (0)23 9000 0000</p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 10px 0;"><strong>ToolServe</strong></p>
      <p style="margin: 5px 0;">Portsmouth, UK • www.toolserve.co.uk</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
ToolServe - Status Update

Dear ${customerName},

${statusInfo.title}

${requestData?.referenceNumber ? `Reference: ${requestData.referenceNumber}\n` : ''}

Status: ${requestData?.status?.replace('_', ' ').toUpperCase()}

${statusInfo.message}

${requestData?.estimatedCompletion ? `Estimated Completion: ${requestData.estimatedCompletion}\n` : ''}
${requestData?.notes ? `\nAdditional Notes:\n${requestData.notes}\n` : ''}

${requestData?.referenceNumber ? `View Full Status: ${trackingUrl}\n\n` : ''}

Questions? Contact us:
Email: info@toolserve.co.uk
Phone: +44 (0)23 9000 0000

--
ToolServe
Portsmouth, UK • www.toolserve.co.uk
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
    const emailData: EmailRequest = await req.json();
    const { type, to, customerName, requestData } = emailData;

    if (!to || !customerName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, customerName" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.warn("Resend API key not configured - email will not be sent");
      return new Response(
        JSON.stringify({
          success: false,
          skipped: true,
          message: "Email service not configured. Request saved successfully but confirmation email not sent."
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    let emailContent;
    if (type === 'repair_confirmation') {
      emailContent = generateConfirmationEmail(emailData);
    } else if (type === 'status_update' || type === 'completion') {
      emailContent = generateStatusUpdateEmail(emailData);
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid email type" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ToolServe <onboarding@resend.dev>",
        to: [to],
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
          error: "Failed to send email",
          details: error
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

    const result = await resendResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.id
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error in send-email function:", error);

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
