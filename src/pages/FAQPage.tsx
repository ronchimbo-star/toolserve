import { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumb } from '../components/Breadcrumb';
import { supabase } from '../lib/supabase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

export function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchFAQs();
  }, []);

  async function fetchFAQs() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('id, question, answer, category')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  }

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean)))];

  const filteredFAQs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  function toggleFAQ(id: string) {
    setExpandedId(expandedId === id ? null : id);
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
        title="FAQ | Professional Tool Repair & Industrial Services | ToolServe"
        description="Common questions about authorised warranty repairs, industrial tooling reconditioning, fleet management, trade accounts, OEM parts, and B2B services. 48-hour turnaround for business-critical equipment."
        canonical="https://toolserve.co.uk/faq"
      />
      {faqs.length > 0 && (
        <StructuredData
          type="FAQ"
          faqs={faqs.map(faq => ({ question: faq.question, answer: faq.answer }))}
        />
      )}
      <StructuredData type="Breadcrumb" items={[
        { name: 'Home', url: 'https://toolserve.co.uk/' },
        { name: 'FAQ', url: 'https://toolserve.co.uk/faq' }
      ]} />
      <Breadcrumb items={[
        { name: 'Home', path: '/' },
        { name: 'FAQ' }
      ]} />
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <HelpCircle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Professional Tool Repair FAQ
          </h1>
          <p className="text-xl text-slate-300 text-center">
            Answers about authorised warranty repairs, industrial tooling, fleet management, and B2B services
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">No FAQs available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-lg font-semibold text-slate-800 pr-8">
                      {faq.question}
                    </span>
                    {expandedId === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {expandedId === faq.id && (
                    <div className="px-6 pb-5 pt-2">
                      <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {faq.answer}
                      </div>
                      {faq.category && (
                        <div className="mt-4">
                          <span className="inline-block bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full font-medium">
                            {faq.category}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Still have questions?
            </h3>
            <p className="text-slate-600 mb-6">
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
