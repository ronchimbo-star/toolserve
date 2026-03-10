import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const requestBody = await req.json();
    const { action, bypass_token, request_id, status, post_id, published, published_at, notification_id } = requestBody;

    if (!bypass_token) {
      return new Response(
        JSON.stringify({ error: "Bypass token required" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: tokenData, error: tokenError } = await supabase
      .from('admin_tokens')
      .select('user_id, expires_at')
      .eq('token', bypass_token)
      .maybeSingle();

    if (tokenError || !tokenData) {
      return new Response(
        JSON.stringify({ error: "Invalid bypass token" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "Token has expired" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    let result;

    switch (action) {
      case 'get_repair_requests': {
        const { data, error } = await supabase
          .from('repair_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        result = { data };
        break;
      }

      case 'get_blog_posts': {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        result = { data };
        break;
      }

      case 'get_notifications': {
        const { data, error } = await supabase
          .from('admin_notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        result = { data };
        break;
      }

      case 'update_request_status': {
        const { request_id, status } = await req.json();
        const { error } = await supabase
          .from('repair_requests')
          .update({ status })
          .eq('id', request_id);

        if (error) throw error;
        result = { success: true };
        break;
      }

      case 'update_blog_status': {
        const { post_id, published, published_at } = await req.json();
        const { error } = await supabase
          .from('blog_posts')
          .update({ published, published_at })
          .eq('id', post_id);

        if (error) throw error;
        result = { success: true };
        break;
      }

      case 'mark_notification_read': {
        const { notification_id } = await req.json();
        const { error } = await supabase
          .from('admin_notifications')
          .update({ is_read: true })
          .eq('id', notification_id);

        if (error) throw error;
        result = { success: true };
        break;
      }

      case 'mark_all_notifications_read': {
        const { error } = await supabase
          .from('admin_notifications')
          .update({ is_read: true })
          .eq('is_read', false);

        if (error) throw error;
        result = { success: true };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error in admin-data function:", error);

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
