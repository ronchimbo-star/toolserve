import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SiteSettings {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  copyright_text: string;
}

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('company_name, company_email, company_phone, company_address, copyright_text')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }

  const companyAddress = settings?.company_address || '56 Craydene Road, Erith, Kent, DA8 2HA';
  const companyPhone = settings?.company_phone || '01892-336-315';
  const companyEmail = settings?.company_email || 'info@toolserve.co.uk';
  const addressParts = companyAddress.split(',').map(part => part.trim());

  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img
                src="/toolserve-logo-white.svg"
                alt="ToolServe - Tool Repair and Servicing"
                className="h-10 w-auto mb-3"
              />
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Authorised service centre for premium and industrial tools.
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Authorised Service Centre</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Award className="w-4 h-4 text-orange-400" />
                <span>100% Genuine OEM Parts</span>
              </div>
            </div>
            <div className="space-y-1 text-sm text-slate-300">
              {addressParts.map((part, index) => (
                <p key={index} className={index === 0 ? 'font-medium' : ''}>
                  {part}
                </p>
              ))}
              <p className="mt-3">
                <a
                  href={`tel:+44${companyPhone.replace(/\s/g, '')}`}
                  className="text-orange-400 hover:text-orange-300 font-medium"
                  aria-label={`Call us at ${companyPhone}`}
                >
                  {companyPhone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${companyEmail}`}
                  className="text-orange-400 hover:text-orange-300"
                >
                  {companyEmail}
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/services"
                  className="text-slate-300 hover:text-orange-400 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/sustainability"
                  className="text-slate-300 hover:text-orange-400 transition-colors"
                >
                  Sustainability Impact
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-slate-300 hover:text-orange-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/repair-request"
                  className="text-slate-300 hover:text-orange-400 transition-colors"
                >
                  Request Repair
                </Link>
              </li>
              <li>
                <Link
                  to="/track-repair"
                  className="text-slate-300 hover:text-orange-400 transition-colors"
                >
                  Track Repair
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="text-slate-300 hover:text-orange-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-slate-300 hover:text-orange-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/service-coverage"
                  className="text-slate-300 hover:text-orange-400 transition-colors"
                >
                  Service Coverage
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Business Hours</h3>
            <div className="space-y-1 text-sm text-slate-300">
              <p>Monday - Friday: 9:00am - 5:00pm</p>
              <p>Saturday: 10:00am - 2:00pm</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col gap-4 text-sm text-slate-400">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p>{settings?.copyright_text || '© 2026 ToolServe. All rights reserved.'}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/terms"
                  className="text-slate-400 hover:text-orange-400 transition-colors"
                >
                  Terms & Conditions
                </Link>
                <Link
                  to="/privacy"
                  className="text-slate-400 hover:text-orange-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/cookies"
                  className="text-slate-400 hover:text-orange-400 transition-colors"
                >
                  Cookies
                </Link>
                <Link
                  to="/admin/login"
                  className="text-slate-600 hover:text-slate-400 transition-colors"
                >
                  Admin
                </Link>
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center">
              ToolServe is a trading name of Circular Horizons International Ltd, registered in England and Wales under company number 15821509. Registered office: Unit A 82 James Carter Road, Mildenhall, United Kingdom, IP28 7DE
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
