import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Cookie } from 'lucide-react';
import { SEO } from '../components/SEO';

export function CookiesPage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Cookie Policy');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicy();
  }, []);

  async function fetchPolicy() {
    try {
      const { data, error } = await supabase
        .from('policy_pages')
        .select('title, content')
        .eq('page_type', 'cookies')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTitle(data.title);
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error fetching cookie policy:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Cookie Policy | ToolServe"
        description="Cookie policy for ToolServe"
        canonical="https://toolserve.co.uk/cookies"
        noindex={true}
      />
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Cookie className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center">{title}</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                {content}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
