import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are a helpful customer service assistant for ToolServe, a UK-based tool and appliance repair company focused on sustainability and waste reduction.

About ToolServe:
- We repair power tools, garden equipment, small appliances, and more
- We serve individuals, tradespeople, councils, and organizations across the UK
- Our mission is to reduce landfill waste by extending equipment lifespan
- We've repaired over 10,000 tools and diverted 5 tonnes of waste from landfills
- We've saved customers over £500,000 compared to buying new equipment

Services Offered:
1. Tool & Appliance Repair - Fixing broken or discarded items (power tools, garden equipment, appliances)
2. Tool Servicing & Maintenance - Cleaning, safety checks, preventative maintenance for tradespeople
3. Council & Bulk Projects - Dedicated services for organizations with bulk repair needs

Pricing & Turnaround:
- Transparent pricing with upfront quotes before work begins
- Most repairs cost 50-70% less than buying new
- Standard repairs: 3-5 working days
- Complex repairs: 7-10 working days
- All repairs include 90-day warranty

Contact Information:
- Email: info@toolserve.co.uk
- Phone: +44 (0)23 9000 0000
- Location: Portsmouth, UK (serving nationwide)
- Hours: Monday-Friday 9am-5pm, Saturday 10am-2pm

Key Features:
- No login required to submit repair requests
- Free diagnosis and quote
- Professional expert repairs
- Eco-friendly and sustainable approach
- Supporting local communities

Your role:
- Answer questions about services, pricing, and process
- Help guide users to submit repair requests
- Provide general tool maintenance advice
- Explain the environmental benefits of repair vs replacement
- Be friendly, professional, and helpful
- If you don't know something specific, direct them to contact the team directly

Keep responses concise and friendly. Always prioritize customer satisfaction and ToolServe's sustainability mission.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured. Please contact the administrator.",
          fallbackMessage: "I apologize, but the chat service is currently unavailable. Please contact us directly at info@toolserve.co.uk or call +44 (0)23 9000 0000 for assistance."
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

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);

      return new Response(
        JSON.stringify({
          error: "Failed to get response from AI service",
          fallbackMessage: "I'm having trouble connecting right now. Please try again or contact us at info@toolserve.co.uk"
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

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please contact us directly.";

    return new Response(
      JSON.stringify({
        message: aiMessage,
        conversationHistory: [...conversationHistory,
          { role: "user", content: message },
          { role: "assistant", content: aiMessage }
        ]
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error in chat function:", error);

    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred",
        fallbackMessage: "I'm experiencing technical difficulties. Please contact us at info@toolserve.co.uk or call +44 (0)23 9000 0000"
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
