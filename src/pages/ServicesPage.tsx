import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Settings, Building2, CheckCircle, Award, Star, Shield, Zap, Package } from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumb } from '../components/Breadcrumb';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

export function ServicesPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, name, role, content')
        .eq('is_active', true)
        .eq('page', 'services')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  }
  return (
    <div className="min-h-screen">
      <SEO
        title="Authorised Tool Repair Services | Industrial & CNC Tooling | ToolServe"
        description="Authorised service centre for Milwaukee, Makita, DeWalt. Industrial cutting tool reconditioning, CNC tooling, site equipment. 48-hour turnaround. Genuine OEM parts only."
        canonical="https://toolserve.co.uk/services"
      />
      <StructuredData type="Service" />
      <StructuredData type="Breadcrumb" items={[
        { name: 'Home', url: 'https://toolserve.co.uk/' },
        { name: 'Services', url: 'https://toolserve.co.uk/services' }
      ]} />
      <Breadcrumb items={[
        { name: 'Home', path: '/' },
        { name: 'Services' }
      ]} />
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            <h1 className="text-5xl font-bold">Professional Repair Services</h1>
            <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold">
              <Shield className="w-5 h-5" />
              <span>Authorised Service Centre</span>
            </div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
            Specialists in premium power tools, industrial cutting equipment, and site machinery.
            Serving B2B clients, fleets, and trade professionals with OEM-quality repairs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-slate-700/70 text-white px-4 py-2 rounded-full">
              <Package className="w-4 h-4" />
              <span className="text-sm">Genuine OEM Parts</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-700/70 text-white px-4 py-2 rounded-full">
              <Award className="w-4 h-4" />
              <span className="text-sm">48-Hour Turnaround</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-700/70 text-white px-4 py-2 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Safety Certified</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Our Three Service Pillars
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-8 rounded-2xl flex flex-col border-2 border-blue-200">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Authorised Power Tool Repairs</h3>
              <p className="text-slate-600 mb-4">
                Official service centre for leading professional tool brands. Warranty repairs handled directly with manufacturer-approved processes.
              </p>
              <div className="bg-white/70 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">Authorised Brands:</p>
                <p className="text-sm text-slate-600">Milwaukee • Makita • DeWalt • Bosch Professional • Hilti</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Warranty-safe repairs maintaining coverage</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">100% genuine OEM parts – no counterfeits</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Manufacturer diagnostic software</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Safety compliance guaranteed</span>
                </li>
              </ul>
              <div className="bg-orange-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-slate-700"><strong>Safety First:</strong> Using non-genuine parts can void warranties and create serious safety risks. We never compromise.</p>
              </div>
              <div className="mt-auto">
                <Link to="/repair-request">
                  <Button className="w-full">Request Warranty Repair</Button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl flex flex-col border-2 border-orange-200">
              <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Industrial Cutting Tool Reconditioning</h3>
              <p className="text-slate-600 mb-4">
                Regrinding and reconditioning services that save up to 60% compared to buying new tooling. Professional results for manufacturing and engineering.
              </p>
              <div className="bg-white/70 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">Industries Served:</p>
                <p className="text-sm text-slate-600">Aerospace • Automotive • Engineering • Oil & Gas</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">End mills, taps, drills, slot drills</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Indexable tools and carbide inserts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Live/driven tooling for CNC machines</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">PCD tooling and precision spindles</span>
                </li>
              </ul>
              <div className="bg-emerald-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-slate-700"><strong>Cost Savings:</strong> Regrinding extends tool life by 3-5x while maintaining precision tolerances.</p>
              </div>
              <div className="mt-auto">
                <Link to="/contact">
                  <Button className="w-full">Discuss Tooling Needs</Button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl flex flex-col border-2 border-emerald-200">
              <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Site Equipment & Fleet Services</h3>
              <p className="text-slate-600 mb-4">
                Annual service contracts for construction firms and rental companies. Quick turnaround to minimise downtime and keep projects on schedule.
              </p>
              <div className="bg-white/70 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">Fleet Services Include:</p>
                <p className="text-sm text-slate-600">Collection/Delivery • 48hr Priority • 30-Day Invoicing</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Hammer breakers, compressors, breakers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Excavator attachments and lifting gear</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Safety certification checks (PAT testing)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Bulk repair discounts for trade accounts</span>
                </li>
              </ul>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-slate-700"><strong>Minimise Downtime:</strong> Priority 48-hour turnaround keeps your operations running smoothly.</p>
              </div>
              <div className="mt-auto">
                <Link to="/contact">
                  <Button className="w-full">Setup Trade Account</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
            Tools We Commonly Repair
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
            We specialise in professional and industrial equipment where quality repair delivers real value.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-blue-500">
                Premium Power Tools
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">Plunge Saws (Track Saws)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">Drywall Sanders</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">Rotary Hammers (SDS Max)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">Petrol Cut-Off Saws</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">½" Routers & Trim Routers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">Breakers & Demolition Hammers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">Professional Mitre Saws</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">Cordless Impact Wrenches</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-orange-500">
                Industrial Tooling
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">End Mills & Slot Drills</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">Indexable Milling Cutters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">Live Tooling for CNC Lathes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">Precision Drill Bits</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">Taps & Reamers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">Carbide Inserts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">PCD Tooling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">•</span>
                  <span className="text-slate-700">Tool Holders & Adapters</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-800 text-white p-6 rounded-xl mt-8 max-w-3xl mx-auto">
            <p className="text-center text-slate-300">
              <strong className="text-white">Please Note:</strong> We do not repair low-value disposable tools (e.g., entry-level drills, basic angle grinders under £50). Our focus is on professional equipment where quality repair delivers real value and extends operational life.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Submit Request</h3>
              <p className="text-slate-600">
                Fill out our simple online form or contact us directly with details about your equipment
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Diagnosis</h3>
              <p className="text-slate-600">
                Our experts assess the issue and provide a transparent quote for the repair
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Repair</h3>
              <p className="text-slate-600">
                We repair your equipment using quality parts and professional techniques
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Return</h3>
              <p className="text-slate-600">
                Your repaired equipment is returned to you, tested and ready for use
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
            Pricing & Turnaround
          </h2>
          <div className="bg-slate-50 p-8 rounded-xl">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Transparent Pricing</h3>
                <p className="text-slate-600">
                  We provide clear, upfront quotes before any work begins. No hidden fees or surprise charges.
                  Most repairs cost 50-70% less than buying new equipment.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Fast Turnaround</h3>
                <p className="text-slate-600">
                  Standard repairs: 3-5 working days. Complex repairs: 7-10 working days.
                  Bulk projects have custom timelines based on scope.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Quality Guarantee</h3>
                <p className="text-slate-600">
                  All repairs come with a 90-day warranty. If something goes wrong, we'll fix it free of charge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
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

      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Get a Free Quote?
          </h2>
          <p className="text-xl mb-8 text-emerald-50">
            <Link to="/repair-request" className="text-white hover:text-emerald-100 underline">Request a repair</Link> and discover how ToolServe can help you save money
            and reduce waste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/repair-request">
              <Button size="lg" variant="secondary">
                Get a Free Quote
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-emerald-600"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
