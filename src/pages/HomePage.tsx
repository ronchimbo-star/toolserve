import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Leaf, Users, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image_url: string | null;
}

interface SiteSettings {
  site_meta_title: string | null;
  site_meta_description: string | null;
  site_meta_keywords: string | null;
}

export function HomePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchTestimonials();
    fetchSettings();
  }, []);

  async function fetchTestimonials() {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, name, role, content, image_url')
        .eq('is_active', true)
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

  function getInitials(name: string) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  const metaTitle = settings?.site_meta_title || "ToolServe | Tool Repair & Sustainability UK";
  const metaDescription = settings?.site_meta_description || "Expert tool repair, servicing and calibration in Erith, Kent. Power tools, garden equipment & industrial machinery. 90-day warranty. Get a free quote today.";

  return (
    <div className="min-h-screen">
      <SEO
        title={metaTitle}
        description={metaDescription}
        canonical="https://toolserve.co.uk/"
      />
      <StructuredData type="LocalBusiness" />
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
                Repairing Tools, Reducing Waste
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8">
                Serving communities with sustainable tool and appliance repair services across the UK
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/repair-request">
                  <Button size="lg">
                    Request a Repair
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline">
                    View Services
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                src="/toolserve-multiple-tools1.png"
                alt="Professional power tools including drills, saws, and other equipment"
                className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 w-full"
                width="800"
                height="600"
                loading="eager"
              />
            </div>
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
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Expert Repairs</h3>
              <p className="text-slate-600">
                Professional repair services for all types of tools and appliances
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Eco-Friendly</h3>
              <p className="text-slate-600">
                Reducing landfill waste by extending the life of your equipment
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Community Focused</h3>
              <p className="text-slate-600">
                Supporting local tradespeople, councils, and organizations
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Fast Turnaround</h3>
              <p className="text-slate-600">
                Quick diagnosis and repair to get your tools back in action
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
                Our Mission
              </h2>
              <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                At ToolServe, we believe every tool deserves a second chance. Rather than contributing
                to landfill waste, we <Link to="/services" className="text-orange-600 hover:text-orange-700 underline">repair, restore, and maintain</Link> equipment to extend its lifespan
                and reduce environmental impact.
              </p>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                We work with individuals, tradespeople, <Link to="/service-coverage" className="text-orange-600 hover:text-orange-700 underline">councils, schools, and community organizations</Link> to provide affordable, sustainable repair solutions that save money and protect our planet.
              </p>
              <Link to="/sustainability">
                <Button>Learn About Our Impact</Button>
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

      <section className="py-16 bg-gradient-to-br from-orange-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Equipment We Repair & Service
            </h2>
            <p className="text-xl text-orange-50 max-w-3xl mx-auto">
              From power tools to garden equipment, we repair and service a comprehensive range of tools and appliances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img src="/power-tools.svg" alt="Power tools repair service icon" className="w-12 h-12" loading="lazy" width="48" height="48" />
              </div>
              <h3 className="text-xl font-bold mb-3">Power Tools</h3>
              <ul className="space-y-2 text-orange-50">
                <li>• Drills & Impact Drivers</li>
                <li>• Saws (Circular, Jigsaw, Reciprocating)</li>
                <li>• Sanders & Grinders</li>
                <li>• Planers & Routers</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img src="/garden-outdoor.svg" alt="Garden and outdoor equipment repair service icon" className="w-12 h-12" loading="lazy" width="48" height="48" />
              </div>
              <h3 className="text-xl font-bold mb-3">Garden & Outdoor</h3>
              <ul className="space-y-2 text-orange-50">
                <li>• Lawn Mowers (Electric, Petrol, Cordless)</li>
                <li>• Hedge & Grass Trimmers</li>
                <li>• Chainsaws & Leaf Blowers</li>
                <li>• Pressure Washers</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img src="/hand-tools.svg" alt="Hand tools repair service icon" className="w-12 h-12" loading="lazy" width="48" height="48" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hand Tools</h3>
              <ul className="space-y-2 text-orange-50">
                <li>• Construction Hand Tools</li>
                <li>• Measuring & Leveling Tools</li>
                <li>• Cutting Tools & Saws</li>
                <li>• Specialist Tools & Clamps</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img src="/tradesperson.svg" alt="Tradesperson equipment repair service icon" className="w-12 h-12" loading="lazy" width="48" height="48" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tradesperson Equipment</h3>
              <ul className="space-y-2 text-orange-50">
                <li>• Plumbing Tools & Pipe Cutters</li>
                <li>• Electrical Testing Equipment</li>
                <li>• Carpentry & Woodworking Tools</li>
                <li>• Metalworking Tools</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img src="/small_appliances.svg" alt="Small appliances repair service icon" className="w-12 h-12" loading="lazy" width="48" height="48" />
              </div>
              <h3 className="text-xl font-bold mb-3">Small Appliances</h3>
              <ul className="space-y-2 text-orange-50">
                <li>• Kitchen Appliances</li>
                <li>• Vacuum Cleaners & Steam Cleaners</li>
                <li>• Sewing Machines</li>
                <li>• Personal Care Appliances</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img src="/batteries-chargers.svg" alt="Batteries and chargers repair service icon" className="w-12 h-12" loading="lazy" width="48" height="48" />
              </div>
              <h3 className="text-xl font-bold mb-3">Batteries & Chargers</h3>
              <ul className="space-y-2 text-orange-50">
                <li>• All Major Brands (Makita, DeWalt, Milwaukee)</li>
                <li>• Battery Cell Replacement</li>
                <li>• Battery Reconditioning</li>
                <li>• Charger Repairs</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img src="/workshop-industrial.svg" alt="Workshop and industrial equipment repair service icon" className="w-12 h-12" loading="lazy" width="48" height="48" />
              </div>
              <h3 className="text-xl font-bold mb-3">Workshop & Industrial</h3>
              <ul className="space-y-2 text-orange-50">
                <li>• Table Saws & Band Saws</li>
                <li>• Drill Presses & Lathes</li>
                <li>• Dust Extractors</li>
                <li>• Material Handling Equipment</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img src="/diy-home-improvement.svg" alt="DIY and home improvement tools repair service icon" className="w-12 h-12" loading="lazy" width="48" height="48" />
              </div>
              <h3 className="text-xl font-bold mb-3">DIY & Home Improvement</h3>
              <ul className="space-y-2 text-orange-50">
                <li>• Painting Equipment & Sprayers</li>
                <li>• Flooring Tools & Sanders</li>
                <li>• Decorating Tools</li>
                <li>• Multi-tools & Work Lights</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img src="/council-community.svg" alt="Council and community services repair icon" className="w-12 h-12" loading="lazy" width="48" height="48" />
              </div>
              <h3 className="text-xl font-bold mb-3">Council & Community</h3>
              <ul className="space-y-2 text-orange-50">
                <li>• Community Tool Libraries</li>
                <li>• Street Maintenance Equipment</li>
                <li>• Educational Workshop Tools</li>
                <li>• Charity & Donation Equipment</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-xl text-orange-50 mb-6">
              Not sure if we can repair your equipment?
            </p>
            <Link to="/contact">
              <Button variant="secondary" size="lg">
                Contact Us to Ask
              </Button>
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
              <div key={testimonial.id} className="bg-slate-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  {testimonial.image_url ? (
                    <div className="relative p-1 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-xl">
                      <img
                        src={testimonial.image_url}
                        alt={testimonial.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        loading="lazy"
                        width="96"
                        height="96"
                      />
                    </div>
                  ) : (
                    <div className="relative p-1 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-xl">
                      <div className="w-24 h-24 bg-orange-200 rounded-full flex items-center justify-center text-orange-800 font-bold text-2xl border-4 border-white shadow-lg">
                        {getInitials(testimonial.name)}
                      </div>
                    </div>
                  )}
                  <div className="ml-4">
                    <p className="font-semibold text-slate-800">{testimonial.name}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 italic">
                  "{testimonial.content}"
                </p>
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

      <section className="py-16 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Repair Instead of Replace?
          </h2>
          <p className="text-xl mb-8 text-emerald-50">
            Submit a <Link to="/repair-request" className="text-white hover:text-emerald-100 underline">repair request</Link> today and join thousands of satisfied customers
            choosing sustainability over waste.
          </p>
          <Link to="/repair-request">
            <Button size="lg" variant="secondary">
              Get a Free Quote
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
