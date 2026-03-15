import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, TrendingDown, Users, Award, Star } from 'lucide-react';
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

export function SustainabilityPage() {
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
        .eq('page', 'sustainability')
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
        title="Sustainability | Repairing Tools, Reducing Waste | ToolServe"
        description="ToolServe reduces waste by repairing tools instead of replacing them. Supporting the circular economy, reducing landfill and lowering carbon footprints across the UK."
        canonical="https://toolserve.co.uk/sustainability"
      />
      <StructuredData type="Breadcrumb" items={[
        { name: 'Home', url: 'https://toolserve.co.uk/' },
        { name: 'Sustainability', url: 'https://toolserve.co.uk/sustainability' }
      ]} />
      <Breadcrumb items={[
        { name: 'Home', path: '/' },
        { name: 'Sustainability' }
      ]} />
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Leaf className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">ToolServe's Environmental Impact</h1>
          <p className="text-xl text-emerald-50 max-w-3xl mx-auto">
            Every repair we complete is a step toward a more sustainable future.
            See how we're making a difference together.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl text-center">
              <div className="text-5xl font-bold text-emerald-600 mb-2">10,000+</div>
              <div className="text-slate-700 font-medium">Tools Repaired</div>
              <p className="text-sm text-slate-600 mt-2">
                Equipment saved from landfill
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-8 rounded-2xl text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-slate-700 font-medium">Tonnes of Waste</div>
              <p className="text-sm text-slate-600 mt-2">
                Diverted from landfill sites
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl text-center">
              <div className="text-5xl font-bold text-amber-600 mb-2">50+</div>
              <div className="text-slate-700 font-medium">Council Partners</div>
              <p className="text-sm text-slate-600 mt-2">
                Across the UK
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">£500K+</div>
              <div className="text-slate-700 font-medium">Savings Generated</div>
              <p className="text-sm text-slate-600 mt-2">
                For our customers
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Why Repair Matters
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <TrendingDown className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Reduce Waste</h3>
              <p className="text-slate-600 leading-relaxed">
                The UK generates millions of tonnes of electrical waste annually. By repairing
                instead of replacing, we keep valuable materials in circulation and reduce the
                burden on landfills and recycling facilities. Our <Link to="/services" className="text-orange-600 hover:text-orange-700 underline">tool repair services</Link> help extend equipment life.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <Leaf className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Lower Carbon Footprint</h3>
              <p className="text-slate-600 leading-relaxed">
                Manufacturing new tools requires significant energy and raw materials. Repairing
                existing equipment uses a fraction of the resources, reducing carbon emissions
                and environmental impact.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <Users className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Support Communities</h3>
              <p className="text-slate-600 leading-relaxed">
                Our repair services help individuals and organizations save money, creating
                economic benefits for communities while promoting sustainable consumption
                and responsible resource use.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Case Studies
          </h2>
          <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-xl">
              <div className="flex items-start space-x-4 mb-4">
                <Award className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    Portsmouth City Council Partnership
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">Local Government Collaboration</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                In partnership with Portsmouth City Council, we established a comprehensive tool
                repair program for municipal equipment. Over 18 months, we repaired more than
                500 pieces of equipment including power tools, garden machinery, and small appliances.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg">
                <div>
                  <p className="text-3xl font-bold text-emerald-600">£75,000</p>
                  <p className="text-sm text-slate-600">Budget Saved</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-600">500+</p>
                  <p className="text-sm text-slate-600">Items Repaired</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-600">2 Tonnes</p>
                  <p className="text-sm text-slate-600">Waste Diverted</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl">
              <div className="flex items-start space-x-4 mb-4">
                <Award className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    Community Workshop Initiative
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">Education & Outreach</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                We partnered with local community centers to run repair workshops, teaching residents
                basic tool maintenance and simple repairs. This empowered community members to extend
                the life of their equipment and reduce waste independently.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg">
                <div>
                  <p className="text-3xl font-bold text-blue-600">200+</p>
                  <p className="text-sm text-slate-600">People Trained</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-slate-600">Workshops Held</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">85%</p>
                  <p className="text-sm text-slate-600">Success Rate</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl">
              <div className="flex items-start space-x-4 mb-4">
                <Award className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    Trade Business Support Programme
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">Supporting Local Tradespeople</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed mb-4">
                We developed a preventative maintenance program for local tradespeople, helping them
                keep their professional tools in optimal condition. Regular servicing extends tool
                lifespan and prevents costly breakdowns during critical jobs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg">
                <div>
                  <p className="text-3xl font-bold text-amber-600">150+</p>
                  <p className="text-sm text-slate-600">Trade Clients</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-600">30%</p>
                  <p className="text-sm text-slate-600">Cost Reduction</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-600">95%</p>
                  <p className="text-sm text-slate-600">Satisfaction Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            What Our Partners Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-slate-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-emerald-600 text-emerald-600" />
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

      <section className="py-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Join the Repair Movement
          </h2>
          <p className="text-lg text-slate-300 text-center mb-8 leading-relaxed">
            Every repair contributes to a more sustainable future. Whether you're an individual
            with a broken tool or an organization looking to reduce waste, we're here to help.
            <Link to="/repair-request" className="text-white hover:text-slate-200 underline ml-1">Request a repair</Link> today or <Link to="/faq" className=\"text-white hover:text-slate-200 underline">learn more</Link> about our process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/repair-request">
              <Button size="lg">Get a Free Quote</Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-slate-800"
              >
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
