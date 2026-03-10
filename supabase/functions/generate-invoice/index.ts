import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  quoteId: string;
  invoiceNumber?: string;
  date?: string;
  dueDate?: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes?: string;
}

function generateInvoiceHTML(data: InvoiceData): string {
  const invoiceDate = data.date || new Date().toLocaleDateString('en-GB');
  const dueDate = data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${data.invoiceNumber || data.quoteId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background: white;
      padding: 40px 20px;
    }
    .container { max-width: 800px; margin: 0 auto; background: white; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #f97316;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #f97316;
    }
    .logo-subtitle {
      font-size: 12px;
      color: #64748b;
      font-weight: normal;
      margin-top: 4px;
    }
    .invoice-details {
      text-align: right;
    }
    .invoice-number {
      font-size: 24px;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 8px;
    }
    .invoice-date {
      font-size: 14px;
      color: #64748b;
    }
    .parties {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .party h3 {
      font-size: 12px;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }
    .party p {
      font-size: 14px;
      margin-bottom: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    thead {
      background: #f1f5f9;
    }
    th {
      padding: 12px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      color: #475569;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    th:last-child, td:last-child {
      text-align: right;
    }
    td {
      padding: 16px 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    tbody tr:last-child td {
      border-bottom: 2px solid #cbd5e1;
    }
    .totals {
      margin-left: auto;
      width: 300px;
      margin-bottom: 40px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      font-size: 14px;
    }
    .total-row.subtotal, .total-row.vat {
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
    }
    .total-row.grand-total {
      font-size: 20px;
      font-weight: bold;
      color: #1e293b;
      border-top: 3px solid #f97316;
      padding-top: 16px;
      margin-top: 8px;
    }
    .notes {
      background: #f8fafc;
      padding: 20px;
      border-left: 4px solid #f97316;
      margin-bottom: 40px;
      border-radius: 4px;
    }
    .notes h3 {
      font-size: 14px;
      margin-bottom: 12px;
      color: #1e293b;
    }
    .notes p {
      font-size: 13px;
      color: #475569;
      line-height: 1.8;
    }
    .footer {
      text-align: center;
      padding-top: 30px;
      border-top: 1px solid #e2e8f0;
      color: #94a3b8;
      font-size: 12px;
    }
    .footer p { margin-bottom: 8px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      background: #f97316;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 1000;
    }
    .print-button:hover {
      background: #ea580c;
    }
  </style>
</head>
<body>
  <button class="print-button no-print" onclick="window.print()">Print / Save PDF</button>

  <div class="container">
    <div class="header">
      <div>
        <div class="logo">
          ⚙️ ToolServe
        </div>
        <div class="logo-subtitle">Professional Tool Repair & Servicing</div>
      </div>
      <div class="invoice-details">
        <div class="invoice-number">Invoice ${data.invoiceNumber || data.quoteId}</div>
        <div class="invoice-date">Date: ${invoiceDate}</div>
        <div class="invoice-date">Due: ${dueDate}</div>
      </div>
    </div>

    <div class="parties">
      <div class="party">
        <h3>From</h3>
        <p><strong>ToolServe</strong></p>
        <p>Professional Tool Repairs</p>
        <p>Portsmouth, United Kingdom</p>
        <p>contact@toolserve.co.uk</p>
        <p>+44 (0) 1234 567890</p>
      </div>
      <div class="party">
        <h3>Bill To</h3>
        <p><strong>${data.customerName}</strong></p>
        <p>${data.customerEmail}</p>
        ${data.customerAddress ? `<p>${data.customerAddress}</p>` : ''}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 50%">Description</th>
          <th style="width: 15%">Quantity</th>
          <th style="width: 17.5%">Unit Price</th>
          <th style="width: 17.5%">Total</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>£${item.unitPrice.toFixed(2)}</td>
            <td>£${item.total.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row subtotal">
        <span>Subtotal</span>
        <span>£${data.subtotal.toFixed(2)}</span>
      </div>
      <div class="total-row vat">
        <span>VAT (20%)</span>
        <span>£${data.vat.toFixed(2)}</span>
      </div>
      <div class="total-row grand-total">
        <span>Total Due</span>
        <span>£${data.total.toFixed(2)}</span>
      </div>
    </div>

    ${data.notes ? `
    <div class="notes">
      <h3>Payment Terms & Notes</h3>
      <p>${data.notes.replace(/\n/g, '<br>')}</p>
    </div>
    ` : ''}

    <div class="notes">
      <h3>Payment Information</h3>
      <p>
        Payment is due within 30 days of invoice date.<br>
        Please include invoice number ${data.invoiceNumber || data.quoteId} with your payment.<br>
        For payment queries, contact us at accounts@toolserve.co.uk
      </p>
    </div>

    <div class="footer">
      <p><strong>Thank you for your business!</strong></p>
      <p>ToolServe - Committed to Quality Repairs & Sustainable Practices</p>
      <p>www.toolserve.co.uk | contact@toolserve.co.uk</p>
    </div>
  </div>
</body>
</html>
  `;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const quoteId = url.searchParams.get("quoteId");

    if (!quoteId) {
      return new Response(
        JSON.stringify({ error: "quoteId parameter is required" }),
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

    const { data: quote, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .maybeSingle();

    if (error || !quote) {
      return new Response(
        JSON.stringify({ error: "Quote not found" }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const items = Array.isArray(quote.items) ? quote.items as InvoiceItem[] : [];

    const invoiceData: InvoiceData = {
      quoteId: quote.quote_number,
      invoiceNumber: `INV-${quote.quote_number}`,
      customerName: quote.customer_name,
      customerEmail: quote.customer_email,
      items,
      subtotal: parseFloat(quote.subtotal.toString()),
      vat: parseFloat(quote.vat.toString()),
      total: parseFloat(quote.total.toString()),
      notes: quote.notes || undefined,
    };

    const html = generateInvoiceHTML(invoiceData);

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
    });

  } catch (error) {
    console.error("Error in generate-invoice function:", error);

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
