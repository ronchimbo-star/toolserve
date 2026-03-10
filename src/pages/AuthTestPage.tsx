import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';

export function AuthTestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const testResults: Record<string, any> = {};

    try {
      testResults.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      testResults.hasAnonKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;

      const sessionTest = await supabase.auth.getSession();
      testResults.getSession = {
        success: !sessionTest.error,
        error: sessionTest.error?.message,
        hasSession: !!sessionTest.data.session
      };

      const userTest = await supabase.auth.getUser();
      testResults.getUser = {
        success: !userTest.error,
        error: userTest.error?.message,
        hasUser: !!userTest.data.user
      };

      const publicQuery = await supabase
        .from('blog_posts')
        .select('count')
        .limit(1);
      testResults.publicQuery = {
        success: !publicQuery.error,
        error: publicQuery.error?.message
      };

      const healthCheck = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        }
      });
      testResults.restApiHealth = {
        status: healthCheck.status,
        ok: healthCheck.ok
      };

    } catch (err: any) {
      testResults.unexpectedError = err.message;
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Supabase Connection Diagnostics
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Button onClick={runTests} disabled={loading}>
            {loading ? 'Running Tests...' : 'Run Diagnostic Tests'}
          </Button>
        </div>

        {Object.keys(results).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <pre className="bg-slate-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">About This Error</h3>
          <p className="text-blue-800 mb-4">
            The "Database error querying schema" with 500 status typically indicates:
          </p>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>Temporary Supabase service issue</li>
            <li>Auth service degradation</li>
            <li>Network connectivity problems</li>
          </ul>
          <p className="mt-4 text-blue-800">
            Run the diagnostic tests above to check the current status of your Supabase connection.
          </p>
        </div>
      </div>
    </div>
  );
}
