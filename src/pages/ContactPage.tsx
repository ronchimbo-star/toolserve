import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumb } from '../components/Breadcrumb';
import { supabase } from '../lib/supabase';

interface SiteSettings {
  company_email: string;
  company_phone: string;
  company_address: string;
}

export function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('company_email, company_phone, company_address')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }

  const companyEmail = settings?.company_email || 'info@toolserve.co.uk';
  const companyPhone = settings?.company_phone || '+44 (01322) 879 713';
  const companyAddress = settings?.company_address || '56 Craydene Road, Erith, Kent, DA8 2HA';

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Contact ToolServe | Get a Free Repair Quote"
        description="Contact ToolServe for a free tool repair quote. Based in Erith, Kent, serving the UK. Call 01322 879 713 or submit an online request."
        canonical="https://toolserve.co.uk/contact"
      />
      <StructuredData type="LocalBusiness" />
      <StructuredData type="Breadcrumb" items={[
        { name: 'Home', url: 'https://toolserve.co.uk/' },
        { name: 'Contact', url: 'https://toolserve.co.uk/contact' }
      ]} />
      <Breadcrumb items={[
        { name: 'Home', path: '/' },
        { name: 'Contact' }
      ]} />
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Contact ToolServe — Free Tool Repair Quotes</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Have questions? Need a quote? We're here to help.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                    <a
                      href={`mailto:${companyEmail}`}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      {companyEmail}
                    </a>
                    <p className="text-sm text-slate-600 mt-1">
                      We respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
                    <a
                      href={`tel:+44${companyPhone.replace(/\D/g, '')}`}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      {companyPhone}
                    </a>
                    <p className="text-sm text-slate-600 mt-1">
                      Monday to Friday, 9am-5pm
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Location</h3>
                    <p className="text-slate-600">
                      {companyAddress}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Serving the UK nationwide
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Business Hours</h3>
                    <div className="text-slate-600 space-y-1 text-sm">
                      <p>Monday - Friday: 9:00am - 5:00pm</p>
                      <p>Saturday: 10:00am - 2:00pm</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border-2 border-emerald-200">
                <div className="flex items-start space-x-4">
                  <MessageCircle className="w-8 h-8 text-emerald-600 flex-shrink-0 animate-pulse" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      AI Chat Assistant Available Now
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Get instant answers about our services, pricing, turnaround times, and
                      sustainability initiatives. Our AI-powered chatbot is ready to help!
                    </p>
                    <p className="text-sm font-medium text-emerald-700">
                      Click the chat button in the bottom-right corner to start a conversation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Quick Actions</h2>

              <div className="space-y-6">
                <div className="border-2 border-emerald-600 rounded-xl p-6 hover:bg-emerald-50 transition-colors">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Submit a Repair Request
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Need something fixed? Fill out our detailed repair request form and we'll
                    get back to you with a quote.
                  </p>
                  <Link to="/repair-request">
                    <Button className="w-full">Request Repair</Button>
                  </Link>
                </div>

                <div className="border-2 border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition-colors">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Council & Bulk Enquiries
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Interested in partnering with us for bulk repairs or council projects?
                    Get in touch to discuss custom solutions.
                  </p>
                  <a
                    href={`mailto:${companyEmail}?subject=Council%20Partnership%20Enquiry`}
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      Email Us
                    </Button>
                  </a>
                </div>

                <div className="border-2 border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition-colors">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    General Enquiries
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Have a question about our <Link to="/services" className="text-orange-600 hover:text-orange-700 underline">services</Link>, pricing, or sustainability initiatives?
                    We're happy to help. Check our <Link to="/faq" className="text-orange-600 hover:text-orange-700 underline">frequently asked questions</Link> first.
                  </p>
                  <a
                    href={`mailto:${companyEmail}`}
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      Send Email
                    </Button>
                  </a>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">How long do repairs take?</p>
                    <p className="text-slate-600">Standard repairs: 3-5 days. Complex repairs: 7-10 days.</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Do you offer warranties?</p>
                    <p className="text-slate-600">Yes, all repairs include a 90-day warranty.</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">What areas do you serve?</p>
                    <p className="text-slate-600">We serve customers across the UK nationwide.</p>
                  </div>
                  <div className="mt-4">
                    <Link to="/faq" className="text-orange-600 hover:text-orange-700 font-medium">
                      View All FAQs →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            Ready to Get a Free Quote?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Choose repair over replacement and join our sustainability mission today. Track your repair status <Link to="/track-repair" className="text-orange-600 hover:text-orange-700 underline">here</Link>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/repair-request">
              <Button size="lg">Get a Free Quote</Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline">View Our Services</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
