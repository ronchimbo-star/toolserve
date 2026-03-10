import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Clock, CheckCircle, Wrench, Package, ArrowRight, Mail } from 'lucide-react';
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
  meta_title: string;
  meta_description: string;
  keywords: string[];
  content_intro: string;
  services_offered: string[];
  equipment_types: string[];
  brands_serviced: string[];
}

export function ServiceAreaPage() {
  const { slug } = useParams<{ slug: string }>();
  const [area, setArea] = useState<ServiceArea | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchServiceArea(slug);
    }
  }, [slug]);

  async function fetchServiceArea(areaSlug: string) {
    try {
      const { data, error } = await supabase
        .from('service_areas')
        .select('*')
        .eq('slug', areaSlug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setNotFound(true);
      } else {
        setArea(data);
      }
    } catch (error) {
      console.error('Error fetching service area:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-slate-600">Loading service area...</p>
        </div>
      </div>
    );
  }

  if (notFound || !area) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Service Area Not Found</h1>
          <p className="text-slate-600 mb-8">The service area you're looking for doesn't exist.</p>
          <Link to="/service-coverage">
            <Button>View All Service Areas</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title={area.meta_title || `${area.area_name} Tool Repair | ToolServe`}
        description={area.meta_description || area.description}
        canonical={`https://toolserve.co.uk/service-area/${area.slug}`}
        keywords={area.keywords?.join(', ')}
      />
      <StructuredData
        type="Breadcrumb"
        items={[
          { name: 'Home', url: 'https://toolserve.co.uk/' },
          { name: 'Service Coverage', url: 'https://toolserve.co.uk/service-coverage' },
          { name: area.area_name, url: `https://toolserve.co.uk/service-area/${area.slug}` }
        ]}
      />
      <Breadcrumb items={[
        { name: 'Home', path: '/' },
        { name: 'Service Coverage', path: '/service-coverage' },
        { name: area.area_name }
      ]} />

      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Tool Repair in {area.area_name}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto text-center mb-8">
            {area.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
              <Package className="w-4 h-4 mr-2" />
              <span>Postcodes: {area.postcode_prefix}{area.additional_postcodes && area.additional_postcodes.length > 0 && `, ${area.additional_postcodes.slice(0, 2).join(', ')}`}</span>
            </div>
            <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              <span>Response: {area.response_time_hours < 24 ? `${area.response_time_hours}hrs` : `${area.response_time_hours / 24} day${area.response_time_hours > 24 ? 's' : ''}`}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Professional Tool Repair Services in {area.area_name}
                </h2>
                <p className="text-slate-600 text-lg mb-6">
                  {area.content_intro}
                </p>
                <p className="text-slate-600">
                  We understand how important your tools and equipment are to your work and home projects.
                  That's why we offer fast, reliable repair services that get your equipment back in working
                  order quickly and affordably. Whether you're a tradesperson, DIY enthusiast, or homeowner,
                  we're here to help keep your tools running smoothly.
                </p>
              </div>

              {area.services_offered && area.services_offered.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <div className="flex items-center mb-6">
                    <Wrench className="w-8 h-8 text-emerald-600 mr-3" />
                    <h2 className="text-2xl font-bold text-slate-800">Services We Offer in {area.area_name}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {area.services_offered.map((service, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {area.equipment_types && area.equipment_types.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Equipment We Repair</h2>
                  <p className="text-slate-600 mb-6">
                    Our experienced technicians can diagnose and repair a wide range of power tools,
                    garden equipment, and small appliances. Common items we service include:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {area.equipment_types.map((equipment, index) => (
                      <div key={index} className="flex items-center bg-slate-50 rounded-lg px-3 py-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                        <span className="text-sm text-slate-700">{equipment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {area.brands_serviced && area.brands_serviced.length > 0 && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">Brands We Service</h2>
                  <p className="text-slate-600 mb-6">
                    We work with all major tool and equipment brands. Whether you have professional-grade
                    tools or consumer models, our team has the expertise to repair them.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {area.brands_serviced.map((brand, index) => (
                      <span
                        key={index}
                        className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-700 font-medium"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {area.keywords && area.keywords.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Popular Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {area.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-block bg-white text-slate-600 text-sm px-3 py-1 rounded-full border border-slate-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 sticky top-4">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Get Your Repair Started</h3>
                <p className="text-slate-600 mb-6">
                  Ready to get your equipment fixed? Request a repair and we'll get back to you quickly
                  with a quote.
                </p>
                <Link to="/repair-request">
                  <Button className="w-full mb-4">
                    Request Repair
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <div className="border-t border-orange-200 pt-4 space-y-3">
                  <div className="flex items-center text-slate-700">
                    <Phone className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500">Call us</p>
                      <a href="tel:+441322879713" className="font-semibold hover:text-orange-600">
                        01322 879 713
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Mail className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500">Email us</p>
                      <a href="mailto:info@toolserve.co.uk" className="font-semibold hover:text-orange-600 break-all">
                        info@toolserve.co.uk
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Why Choose ToolServe?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600">Expert technicians with years of experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600">Honest pricing with no hidden fees</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600">Fast turnaround times</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600">Quality parts and workmanship</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600">Eco-friendly repair solutions</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800 text-white rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">Other Service Areas</h3>
                <p className="text-slate-300 text-sm mb-4">
                  We also serve surrounding areas. View all our coverage.
                </p>
                <Link to="/service-coverage">
                  <Button variant="secondary" className="w-full bg-white text-slate-800 hover:bg-slate-100">
                    View All Areas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
