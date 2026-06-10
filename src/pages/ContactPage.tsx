import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, CheckCircle, Send } from 'lucide-react';
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
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (dbError) throw dbError;

      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-admin`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'contact_form',
            title: `New Contact Form: ${formData.subject}`,
            message: `${formData.name} has sent a contact form enquiry.`,
            metadata: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone || 'Not provided',
              subject: formData.subject,
              message: formData.message
            }
          })
        });
      } catch (notifyError) {
        console.error('Admin notification failed:', notifyError);
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to send your message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const companyEmail = settings?.company_email || 'info@toolserve.co.uk';
  const companyPhone = settings?.company_phone || '+44 (01892) 336 315';
  const companyAddress = settings?.company_address || 'Unit 2 Capital Industrial Estate, Crabtree Manorway, South Belvedere, DA17 6BJ';

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Contact ToolServe | Get a Free Repair Quote"
        description={`Contact ToolServe for a free tool repair quote. Based in Erith, Kent, serving the UK. Call ${companyPhone} or submit an online request.`}
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
          <h1 className="text-5xl font-bold mb-6">Contact ToolServe</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
            Professional repair quotes for your business tools and equipment. Trade accounts available with 30-day invoicing.
          </p>
          <p className="text-lg text-slate-400">
            Authorised service centre • Genuine OEM parts • Fleet management
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left column — contact info */}
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                    <a href={`mailto:${companyEmail}`} className="text-emerald-600 hover:text-emerald-700">
                      {companyEmail}
                    </a>
                    <p className="text-sm text-slate-600 mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
                    <a href={`tel:+44${companyPhone.replace(/\D/g, '')}`} className="text-emerald-600 hover:text-emerald-700">
                      {companyPhone}
                    </a>
                    <p className="text-sm text-slate-600 mt-1">Monday to Friday, 9am–5pm</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Location</h3>
                    <p className="text-slate-600">{companyAddress}</p>
                    <p className="text-sm text-slate-600 mt-1">Serving the UK nationwide</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Business Hours</h3>
                    <div className="text-slate-600 space-y-1 text-sm">
                      <p>Monday – Friday: 9:00am – 5:00pm</p>
                      <p>Saturday: 10:00am – 2:00pm</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border-2 border-emerald-200">
                <div className="flex items-start space-x-4">
                  <MessageCircle className="w-8 h-8 text-emerald-600 flex-shrink-0 animate-pulse" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">AI Chat Assistant Available Now</h3>
                    <p className="text-slate-600 mb-4">
                      Get instant answers about our services, pricing, turnaround times, and sustainability initiatives.
                    </p>
                    <p className="text-sm font-medium text-emerald-700">
                      Click the chat button in the bottom-right corner to start a conversation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Need a Repair Instead?</h3>
                <p className="text-slate-600 text-sm mb-4">
                  For equipment repairs, use our dedicated repair request form so we can capture all the details needed to help you quickly.
                </p>
                <Link to="/repair-request">
                  <Button className="w-full">Submit Repair Request</Button>
                </Link>
              </div>
            </div>

            {/* Right column — contact form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-3">Message Sent!</h2>
                  <p className="text-slate-600 mb-6 max-w-sm">
                    Thanks for getting in touch. We've received your message and will respond within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Send Us a Message</h2>
                  <p className="text-slate-500 mb-8">We'll get back to you within 24 hours.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Jane Smith"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="jane@example.com"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+44 7700 900000"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      >
                        <option value="">Select a subject...</option>
                        <option value="General Enquiry">General Enquiry</option>
                        <option value="Repair Quote">Repair Quote</option>
                        <option value="Council / Bulk Enquiry">Council / Bulk Enquiry</option>
                        <option value="Trade Account">Trade Account</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Ready to Get a Free Quote?</h2>
          <p className="text-lg text-slate-600 mb-8">
            Choose repair over replacement and join our sustainability mission today. Track your repair status{' '}
            <Link to="/track-repair" className="text-orange-600 hover:text-orange-700 underline">here</Link>.
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
