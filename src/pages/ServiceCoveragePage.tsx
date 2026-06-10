import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Package, Mail, Clock, Phone, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumb } from '../components/Breadcrumb';
import { supabase } from '../lib/supabase';

interface ServiceArea {
  id: string;
  area_name: string;
  slug: string;
  county: string;
  description: string;
  postcode_prefix: string;
  additional_postcodes: string[];
  response_time_hours: number;
  callout_fee: number;
  is_active: boolean;
  display_order: number;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

export function ServiceCoveragePage() {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactPhone, setContactPhone] = useState<string>('');

  useEffect(() => {
    fetchServiceAreas();
    fetchSettings();
    fetchTestimonials();
  }, []);

  async function fetchServiceAreas() {
    try {
      const { data, error } = await supabase
        .from('service_areas')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServiceAreas(data || []);
    } catch (error) {
      console.error('Error fetching service areas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('contact_phone')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data?.contact_phone) {
        setContactPhone(data.contact_phone);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }

  async function fetchTestimonials() {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, name, role, content')
        .eq('is_active', true)
        .eq('page', 'service-coverage')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Service Coverage | ToolServe UK"
        description="ToolServe serves customers across Greater London and Kent. Collection, delivery and postal repair services available. Check our service areas."
        canonical="https://toolserve.co.uk/service-coverage"
      />
      <StructuredData type="Breadcrumb" items={[
        { name: 'Home', url: 'https://toolserve.co.uk/' },
        { name: 'Service Coverage', url: 'https://toolserve.co.uk/service-coverage' }
      ]} />
      <Breadcrumb items={[
        { name: 'Home', path: '/' },
        { name: 'Service Coverage' }
      ]} />
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Service Coverage</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto text-center">
            We proudly serve customers across Greater London and Kent with flexible collection,
            delivery, and mail-in options.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Service Areas</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We offer professional tool and appliance repair services across the following areas.
              If you're outside these regions, we also accept mail-in repairs from anywhere in the UK.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-slate-600">Loading service areas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {serviceAreas.map((area) => (
                <Link
                  key={area.id}
                  to={`/service-area/${area.slug}`}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center">
                      <MapPin className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0" />
                      {area.area_name}
                    </h3>
                    {area.display_order === 1 && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                        Main Area
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{area.county}</p>
                  <p className="text-slate-600 mb-4">{area.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-600">
                      <Package className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
                      <span>Postcodes: {area.postcode_prefix}</span>
                    </div>
                    {area.additional_postcodes && area.additional_postcodes.length > 0 && (
                      <p className="text-xs text-slate-500 ml-6">
                        Also: {area.additional_postcodes.slice(0, 4).join(', ')}
                        {area.additional_postcodes.length > 4 && ` +${area.additional_postcodes.length - 4} more`}
                      </p>
                    )}
                    <div className="flex items-center text-slate-600">
                      <Clock className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                      <span>Response: {area.response_time_hours < 24 ? `${area.response_time_hours}hrs` : `${area.response_time_hours / 24} day${area.response_time_hours > 24 ? 's' : ''}`}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <span className="text-orange-600 text-sm font-medium hover:text-orange-700">
                      Learn more →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <Package className="w-10 h-10 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-slate-800">Collection & Delivery</h2>
              </div>
              <p className="text-slate-700 mb-6">
                For customers within our service areas, we offer convenient collection and
                delivery services. Simply request a repair online, and we'll arrange a time
                to collect your equipment.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Submit Your Request</h4>
                    <p className="text-sm text-slate-600">Fill out our online repair form with equipment details</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Schedule Collection</h4>
                    <p className="text-sm text-slate-600">We'll arrange a convenient collection time</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Repair & Return</h4>
                    <p className="text-sm text-slate-600">We repair your equipment and deliver it back to you</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link to="/repair-request">
                  <Button className="w-full">Request a Repair</Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <Mail className="w-10 h-10 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-slate-800">Mail-In Service</h2>
                </div>
                <p className="text-slate-700 mb-6">
                  Located outside our collection area? No problem! We accept mail-in repairs
                  from anywhere in the UK. Simply package your equipment securely and send it
                  to our workshop.
                </p>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-slate-800 mb-2">Mail-In Address:</h4>
                  <p className="text-sm text-slate-600">
                    ToolServe Repairs<br />
                    Unit 2 Capital Industrial Estate<br />
                    Crabtree Manorway<br />
                    South Belvedere, DA17 6BJ
                  </p>
                </div>
                <p className="text-sm text-slate-600">
                  Please contact us first to discuss your repair and receive a reference number
                  before sending your equipment.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Questions About Coverage?</h3>
                <p className="text-slate-600 mb-4">
                  Not sure if we service your area? Get in touch with us and we'll be happy to
                  discuss your options.
                </p>
                <div className="flex items-center text-slate-700 mb-4">
                  <Phone className="w-5 h-5 text-orange-600 mr-2" />
                  <a href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`} className="font-semibold hover:text-orange-600">
                    {contactPhone || '01892-336-315'}
                  </a>
                </div>
                <Link to="/contact">
                  <Button className="w-full">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Local Customers Love Our Service
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
          </div>
        </div>
      </section>
    </div>
  );
}
