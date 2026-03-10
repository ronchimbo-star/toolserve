import { Link } from 'react-router-dom';
import { Wrench, Settings, Building2, CheckCircle, Award } from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumb } from '../components/Breadcrumb';

export function ServicesPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Tool Repair Services | Power Tools, Garden Equipment | ToolServe"
        description="Professional tool repair services for power tools, garden equipment, hand tools and industrial machinery. Fast 3-5 day turnaround with 90-day warranty."
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
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-5xl font-bold">Our Services</h1>
            <div className="hidden sm:flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-full font-semibold">
              <Award className="w-5 h-5" />
              <span>90-Day Warranty</span>
            </div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Professional repair and maintenance solutions for tools, appliances, and equipment.
            We serve individuals, tradespeople, councils, and organizations across the UK.
          </p>
          <div className="sm:hidden flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-full font-semibold mt-4 inline-flex mx-auto">
            <Award className="w-5 h-5" />
            <span>90-Day Warranty</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl flex flex-col">
              <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Tool & Appliance Repair</h2>
              <p className="text-slate-600 mb-6">
                Expert repair services for broken or discarded tools and appliances. We fix what
                others throw away, saving you money and reducing waste. Have questions? Check our{' '}
                <Link to="/faq" className="text-orange-600 hover:text-orange-700 underline">
                  common questions
                </Link>{' '}
                or{' '}
                <Link to="/contact" className="text-orange-600 hover:text-orange-700 underline">
                  contact us
                </Link>{' '}
                for details.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Power tools (drills, saws, sanders)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Garden equipment (mowers, trimmers)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Small appliances (vacuums, mixers)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Hand tools and specialist equipment</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Link to="/repair-request">
                  <Button className="w-full">Request a Repair</Button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-8 rounded-2xl flex flex-col">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Tool Servicing & Maintenance</h2>
              <p className="text-slate-600 mb-6">
                Regular servicing and maintenance to keep your tools in peak condition. Ideal for
                tradespeople and businesses with professional equipment.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Cleaning and lubrication</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Safety inspections and testing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Preventative maintenance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Performance optimization</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Link to="/repair-request">
                  <Button className="w-full">Request a Repair</Button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl flex flex-col">
              <div className="w-16 h-16 bg-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Council & Bulk Projects</h2>
              <p className="text-slate-600 mb-6">
                Dedicated services for councils, schools, and organizations. Bulk repair projects
                with custom solutions and competitive pricing.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Bulk equipment repairs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Contract maintenance programs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Sustainability partnerships</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Custom reporting and analytics</span>
                </li>
              </ul>
              <div className="mt-auto">
                <Link to="/contact">
                  <Button className="w-full">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
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
