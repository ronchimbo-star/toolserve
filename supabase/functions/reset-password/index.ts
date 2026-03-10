import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ResetPasswordRequest {
  recoveryCode: string;
  email: string;
  newPassword: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { recoveryCode, email, newPassword }: ResetPasswordRequest = await req.json();

    if (!recoveryCode || !email || !newPassword) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: tokenData, error: tokenError } = await supabase
      .from('admin_recovery_tokens')
      .select('*')
      .eq('code', recoveryCode.trim())
      .eq('email', email.toLowerCase().trim())
      .eq('used', false)
      .maybeSingle();

    if (tokenError) {
      console.error('Token lookup error:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Failed to validate recovery code' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!tokenData) {
      return new Response(
        JSON.stringify({ error: 'Invalid recovery code or email' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const expiryDate = new Date(tokenData.expires_at);
    if (expiryDate < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Recovery code has expired' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('List users error:', listError);
      return new Response(
        JSON.stringify({ error: 'Failed to find user account' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'No account found with this email' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Update password error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update password' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { error: markUsedError } = await supabase
      .from('admin_recovery_tokens')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', tokenData.id);

    if (markUsedError) {
      console.error('Mark token as used error:', markUsedError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Password reset successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (err: any) {
    console.error('Reset password error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
