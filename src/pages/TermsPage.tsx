import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FileText } from 'lucide-react';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';

export function TermsPage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Terms and Conditions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicy();
  }, []);

  async function fetchPolicy() {
    try {
      const { data, error } = await supabase
        .from('policy_pages')
        .select('title, content')
        .eq('page_type', 'terms')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTitle(data.title);
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error fetching terms:', error);
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
        title="Terms & Conditions | ToolServe"
        description="Terms and conditions for ToolServe repair services. Important information about warranties, liabilities, and service agreements."
        canonical="https://toolserve.co.uk/terms"
        noindex={true}
      />
      <StructuredData type="Breadcrumb" items={[
        { name: 'Home', url: 'https://toolserve.co.uk/' },
        { name: 'Terms & Conditions', url: 'https://toolserve.co.uk/terms' }
      ]} />
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <FileText className="w-12 h-12" />
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
