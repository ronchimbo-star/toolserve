import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, Users, Clock, ChevronDown, ChevronUp, Star, Package, Zap } from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

interface SiteSettings {
  site_meta_title: string | null;
  site_meta_description: string | null;
  site_meta_keywords: string | null;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function HomePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
    fetchSettings();
    fetchFaqs();
  }, []);

  async function fetchTestimonials() {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, name, role, content')
        .eq('is_active', true)
        .eq('page', 'home')
        .order('display_order', { ascending: true })
        .limit(3);

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  }

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('site_meta_title, site_meta_description, site_meta_keywords')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }

  async function fetchFaqs() {
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
    }
  }

  function groupFaqsByCategory(faqs: FAQ[]) {
    const grouped = faqs.reduce((acc, faq) => {
      const category = faq.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(faq);
      return acc;
    }, {} as Record<string, FAQ[]>);

    const categoryOrder = ['Technical Support', 'Repair Guides', 'Our Services', 'Pricing'];
    return categoryOrder
      .filter(cat => grouped[cat])
      .map(cat => ({ category: cat, faqs: grouped[cat] }));
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  const metaTitle = settings?.site_meta_title || "ToolServe | Authorised Repair Centre | Industrial & CNC Tooling";
  const metaDescription = settings?.site_meta_description || "Authorised service centre for Milwaukee, Makita, DeWalt. Specialists in premium power tools, industrial cutting tool reconditioning, CNC tooling. Genuine OEM parts. 48-hour turnaround. B2B fleet services.";

  return (
    <div className="min-h-screen">
      <SEO
        title={metaTitle}
        description={metaDescription}
        canonical="https://toolserve.co.uk/"
      />
      <StructuredData type="LocalBusiness" />
      <section className="relative bg-orange-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-600/95 to-transparent z-10"></div>
          <img
            src="/master-repairs-broken-electrical-device_96336-604.jpg"
            alt="Professional tool repair technician working on electrical device"
            className="absolute right-0 top-0 h-full w-auto object-cover object-left"
            loading="eager"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Authorised Repair Centre for Premium & Industrial Tools
              </h1>
              <p className="text-xl md:text-2xl text-orange-50 mb-8">
                Specialists in high-value power tools, CNC tooling, and site equipment. Fully authorised service centre for Milwaukee, Makita, DeWalt, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/repair-request">
                  <button className="bg-white hover:bg-orange-50 text-orange-600 font-bold px-8 py-4 rounded-lg transition-colors text-lg shadow-lg">
                    Book a Repair
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="bg-slate-700 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg border-2 border-white/20">
                    Become a Trade Partner
                  </button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Why Choose ToolServe?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Authorised Warranty Repairs</h3>
              <p className="text-slate-600">
                Approved service centre for leading brands. Your warranty stays intact.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Industrial & CNC Specialists</h3>
              <p className="text-slate-600">
                From plunge saws to live tooling – we repair the tools that keep your business running.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Fleet & Trade Management</h3>
              <p className="text-slate-600">
                Annual service contracts, bulk repairs, and priority turnaround for trade accounts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">100% Genuine Parts</h3>
              <p className="text-slate-600">
                Safety first – only OEM components used. No shortcuts, no counterfeit parts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Who We Are
              </h2>
              <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                ToolServe is an <strong>authorised service centre</strong> specialising in high-end power tools, industrial cutting equipment, and site machinery. We bridge the gap between manufacturer warranty support and the needs of trade professionals.
              </p>
              <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                <strong>Our Mission:</strong> To extend the life of premium tools, reduce waste, and keep your business productive. We believe quality tools deserve quality repairs – performed by qualified technicians using genuine parts.
              </p>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                <strong>Why Choose Us:</strong> Authorised by leading brands, qualified technicians trained in electronics and CNC tooling, B2B focus for fleets and industrial clients, and safety-first approach ensuring compliance.
              </p>
              <Link to="/services">
                <Button>View Our Services</Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl opacity-10"></div>
              <div className="relative bg-gradient-to-br from-orange-500/90 to-orange-700/90 backdrop-blur-sm rounded-2xl p-8 sm:p-12 text-white overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-32 h-32 opacity-10 animate-spin-slow">
                  <img src="/gears.svg" alt="" className="w-full h-full" loading="lazy" width="128" height="128" />
                </div>
                <div className="absolute bottom-1/4 left-1/4 w-24 h-24 opacity-10 animate-spin-slower">
                  <img src="/gears.svg" alt="" className="w-full h-full" loading="lazy" width="96" height="96" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-5 animate-spin-slowest">
                  <img src="/gears.svg" alt="" className="w-full h-full" loading="lazy" width="160" height="160" />
                </div>
                <div className="relative z-10 space-y-8">
                  <div>
                    <p className="text-5xl font-bold mb-2">10,000+</p>
                    <p className="text-orange-100 text-lg">Tools Repaired</p>
                  </div>
                  <div>
                    <p className="text-5xl font-bold mb-2">5 Tonnes</p>
                    <p className="text-orange-100 text-lg">Waste Diverted from Landfill</p>
                  </div>
                  <div>
                    <p className="text-5xl font-bold mb-2">50+</p>
                    <p className="text-orange-100 text-lg">Council Partnerships</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-500">
              Professional & Industrial Equipment
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Specialising in high-value, precision tools and equipment across four key categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-700 transition-all">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img src="/power-tools.svg" alt="Professional power tools repair service icon" className="w-12 h-12 brightness-0 invert sepia saturate-[500%] hue-rotate-[-15deg]" loading="lazy" width="48" height="48" />
              </div>
              <h3 className="text-xl font-bold mb-3">Professional Power Tools</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Plunge Saws</li>
                <li>• Drywall Sanders</li>
                <li>• Rotary Hammers (SDS Max)</li>
                <li>• Petrol Cut-Off Saws</li>
                <li>• ½" Routers</li>
              </ul>
            </div>

            <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-700 transition-all">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <Zap className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Industrial Cutting Tooling</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• End Mills & Slot Drills</li>
                <li>• Indexable Milling Cutters</li>
                <li>• Live Tooling for CNC</li>
                <li>• Precision Drill Bits</li>
                <li>• Taps & Reamers</li>
              </ul>
            </div>

            <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-700 transition-all">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img src="/workshop-industrial.svg" alt="Site and heavy equipment repair service icon" className="w-12 h-12 brightness-0 invert sepia saturate-[500%] hue-rotate-[-15deg]" loading="lazy" width="48" height="48" />
              </div>
              <h3 className="text-xl font-bold mb-3">Site & Heavy Equipment</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Hammer Breakers</li>
                <li>• Compressors</li>
                <li>• Excavator Attachments</li>
                <li>• Lifting Gear</li>
                <li>• Site Power Tools</li>
              </ul>
            </div>

            <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-700 transition-all">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img src="/gears.svg" alt="CNC machine tooling repair service icon" className="w-12 h-12 brightness-0 invert sepia saturate-[500%] hue-rotate-[-15deg]" loading="lazy" width="48" height="48" />
              </div>
              <h3 className="text-xl font-bold mb-3">CNC Machine Tooling</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Live/Driven Tooling</li>
                <li>• Tool Holders</li>
                <li>• Precision Spindle Repairs</li>
                <li>• Carbide Inserts</li>
                <li>• PCD Tooling</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center mt-12">
            <div className="bg-slate-700/70 rounded-xl p-6 mb-8 max-w-4xl">
              <p className="text-sm text-slate-300 italic text-center">
                We focus on professional-grade equipment where quality repair delivers real value. We do not repair low-value disposable tools (e.g., entry-level drills, basic angle grinders).
              </p>
            </div>
            <p className="text-xl text-white mb-6">
              Need a repair for your fleet or business equipment?
            </p>
            <Link to="/contact">
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg">
                Request Trade Account
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-slate-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-slate-700 italic mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-slate-800">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <div className="col-span-full text-center py-8 text-slate-500">
                No testimonials available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Ready to Repair Instead of Replace?
          </h2>
          <p className="text-xl mb-8 text-white text-center">
            Submit a <Link to="/repair-request" className="text-white hover:text-orange-100 underline font-semibold">repair request</Link> today and join thousands of satisfied customers
            choosing sustainability over waste.
          </p>
          <Link to="/repair-request">
            <button className="bg-slate-700 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg">
              Get a Free Quote
            </button>
          </Link>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Expert answers to common tool repair questions
            </p>
          </div>

          {groupFaqsByCategory(faqs).map(({ category, faqs: categoryFaqs }) => (
            <div key={category} className="mb-12 last:mb-0">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-orange-500">
                {category}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {categoryFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-slate-200 rounded-lg overflow-hidden hover:border-orange-300 transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 text-left bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800 pr-4 text-sm lg:text-base">
                        {faq.question}
                      </span>
                      {openFaqId === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFaqId === faq.id && (
                      <div className="px-6 py-4 bg-white">
                        <p className="text-slate-600 leading-relaxed text-sm lg:text-base">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {faqs.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p>No FAQs available at the moment.</p>
            </div>
          )}

          <div className="flex flex-col items-center mt-12">
            <p className="text-lg text-slate-600 mb-6">
              Have a question not answered here?
            </p>
            <Link to="/contact">
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
