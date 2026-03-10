import { useState } from 'react';
import { Lock, Wrench, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';

interface AdminBypassLoginPageProps {
  onLoginSuccess: () => void;
}

export function AdminBypassLoginPage({ onLoginSuccess }: AdminBypassLoginPageProps) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: queryError } = await supabase
        .from('admin_tokens')
        .select('user_id, expires_at')
        .eq('token', token)
        .maybeSingle();

      if (queryError) throw queryError;

      if (!data) {
        throw new Error('Invalid token');
      }

      if (new Date(data.expires_at) < new Date()) {
        throw new Error('Token has expired');
      }

      localStorage.setItem('admin_bypass_token', token);
      localStorage.setItem('admin_user_id', data.user_id);
      onLoginSuccess();
    } catch (err: any) {
      console.error('Bypass login error:', err);
      setError(err.message || 'Failed to validate token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wrench className="w-10 h-10 text-emerald-400" />
            <span className="text-3xl font-bold text-white">ToolServe</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-300">Bypass login with admin token</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 text-sm mb-1">
                Temporary Bypass Login
              </h3>
              <p className="text-yellow-800 text-sm">
                This is a temporary solution while the Supabase Auth service is experiencing issues.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Admin Token
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                placeholder="admin_bypass_token_..."
              />
              <p className="mt-2 text-xs text-slate-500">
                Use token: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">admin_bypass_token_5d2e3386-0171-402b-8ce6-e3d391183761</span>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Validating...' : 'Access Dashboard'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            <p>Authorized access only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
