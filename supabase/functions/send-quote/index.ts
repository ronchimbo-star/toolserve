import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface QuoteData {
  quoteId: string;
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  equipmentType: string;
  issueDescription?: string;
  items: QuoteItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes?: string;
  validUntil: string;
}

function generateQuoteEmailHTML(data: QuoteData): { subject: string; html: string; text: string } {
  const subject = `Quote ${data.quoteNumber} from ToolServe - ${data.equipmentType}`;

  const formatCurrency = (amount: number) => `£${amount.toFixed(2)}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #334155; background: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 700px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 40px 30px; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.95; }
    .content { padding: 40px 30px; }
    .quote-info { background: #fff7ed; border-left: 4px solid #f97316; padding: 20px; margin: 25px 0; }
    .quote-info h2 { margin: 0 0 15px 0; color: #ea580c; font-size: 20px; }
    .info-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #fed7aa; }
    .info-label { font-weight: bold; color: #9a3412; }
    .info-value { color: #1e293b; }
    .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    .items-table th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: bold; color: #475569; border-bottom: 2px solid #cbd5e1; }
    .items-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
    .items-table tr:hover { background: #f8fafc; }
    .text-right { text-align: right; }
    .totals { margin: 30px 0; background: #f8fafc; padding: 20px; border-radius: 8px; }
    .total-row { display: flex; justify-content: space-between; margin: 10px 0; font-size: 16px; }
    .total-row.grand { font-size: 24px; font-weight: bold; color: #ea580c; border-top: 2px solid #cbd5e1; padding-top: 15px; margin-top: 15px; }
    .notes { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; }
    .notes h3 { margin: 0 0 10px 0; color: #92400e; font-size: 16px; }
    .notes p { margin: 0; color: #78350f; }
    .actions { text-align: center; margin: 30px 0; }
    .button { display: inline-block; background: #f97316; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 0 10px; }
    .button.secondary { background: #64748b; }
    .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
    .footer p { margin: 8px 0; }
    .validity { background: #fef2f2; border: 2px solid #fecaca; padding: 15px; text-align: center; margin: 20px 0; border-radius: 8px; }
    .validity strong { color: #991b1b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔧 ToolServe Quote</h1>
      <p>Professional Tool & Equipment Repair Services</p>
    </div>

    <div class="content">
      <div class="quote-info">
        <h2>Quote Details</h2>
        <div class="info-row">
          <span class="info-label">Quote Number:</span>
          <span class="info-value">${data.quoteNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date:</span>
          <span class="info-value">${formatDate(new Date().toISOString())}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Customer:</span>
          <span class="info-value">${data.customerName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Equipment:</span>
          <span class="info-value">${data.equipmentType}</span>
        </div>
        ${data.issueDescription ? `
        <div class="info-row">
          <span class="info-label">Issue:</span>
          <span class="info-value">${data.issueDescription}</span>
        </div>
        ` : ''}
      </div>

      <h2 style="color: #1e293b; margin-top: 40px;">Quote Breakdown</h2>

      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td>${item.description}</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">${formatCurrency(item.unit_price)}</td>
              <td class="text-right"><strong>${formatCurrency(item.total)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(data.subtotal)}</span>
        </div>
        <div class="total-row">
          <span>VAT (20%):</span>
          <span>${formatCurrency(data.vat)}</span>
        </div>
        <div class="total-row grand">
          <span>Total:</span>
          <span>${formatCurrency(data.total)}</span>
        </div>
      </div>

      ${data.notes ? `
      <div class="notes">
        <h3>Additional Notes</h3>
        <p>${data.notes}</p>
      </div>
      ` : ''}

      <div class="validity">
        <strong>⏰ This quote is valid until ${formatDate(data.validUntil)}</strong>
      </div>

      <div class="actions">
        <a href="mailto:info@toolserve.co.uk?subject=Accept%20Quote%20${data.quoteNumber}" class="button">
          Accept Quote
        </a>
        <a href="mailto:info@toolserve.co.uk?subject=Query%20Quote%20${data.quoteNumber}" class="button secondary">
          Ask Questions
        </a>
      </div>

      <p style="text-align: center; color: #64748b; margin: 30px 0;">
        To accept this quote, click the button above or reply to this email with your acceptance.
        We'll proceed with your repair once we receive your confirmation.
      </p>
    </div>

    <div class="footer">
      <p><strong>ToolServe - Professional Tool & Equipment Repair</strong></p>
      <p>Portsmouth, United Kingdom</p>
      <p>📧 info@toolserve.co.uk | 📞 +44 (0)23 9000 0000</p>
      <p style="margin-top: 20px; font-size: 12px;">
        All repairs come with a 90-day warranty. Terms and conditions apply.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
TOOLSERVE QUOTE

Quote Number: ${data.quoteNumber}
Date: ${formatDate(new Date().toISOString())}
Customer: ${data.customerName}
Equipment: ${data.equipmentType}
${data.issueDescription ? `Issue: ${data.issueDescription}` : ''}

QUOTE BREAKDOWN
${data.items.map(item =>
  `${item.description} - Qty: ${item.quantity} x ${formatCurrency(item.unit_price)} = ${formatCurrency(item.total)}`
).join('\n')}

Subtotal: ${formatCurrency(data.subtotal)}
VAT (20%): ${formatCurrency(data.vat)}
TOTAL: ${formatCurrency(data.total)}

${data.notes ? `\nADDITIONAL NOTES\n${data.notes}\n` : ''}

VALID UNTIL: ${formatDate(data.validUntil)}

To accept this quote, please reply to this email or contact us at info@toolserve.co.uk

ToolServe - Professional Tool & Equipment Repair
Portsmouth, United Kingdom
info@toolserve.co.uk | +44 (0)23 9000 0000

All repairs come with a 90-day warranty.
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
    const quoteData: QuoteData = await req.json();

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("Resend API key not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email service not configured"
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

    const emailContent = generateQuoteEmailHTML(quoteData);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ToolServe Quotes <onboarding@resend.dev>",
        to: [quoteData.customerEmail],
        bcc: ["ronchimbo@gmail.com"],
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
          success: false,
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

    const emailResult = await resendResponse.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase
        .from('quotes')
        .update({ sent_at: new Date().toISOString() })
        .eq('id', quoteData.quoteId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailId: emailResult.id,
        message: "Quote sent successfully"
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error in send-quote function:", error);

    return new Response(
      JSON.stringify({
        success: false,
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
