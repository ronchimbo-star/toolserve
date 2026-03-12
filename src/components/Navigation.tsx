import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from './Button';
import { supabase } from '../lib/supabase';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [companyPhone, setCompanyPhone] = useState('01892-336-315');
  const location = useLocation();

  useEffect(() => {
    async function fetchPhone() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('company_phone')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data?.company_phone) {
          setCompanyPhone(data.company_phone);
        }
      } catch (error) {
        console.error('Error fetching phone:', error);
      }
    }

    fetchPhone();
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Track Repair', path: '/track-repair' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center cursor-pointer">
            <img
              src="/toolserve-logo.svg"
              alt="ToolServe - Tool Repair and Servicing"
              className="h-10 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-orange-600'
                    : 'text-slate-600 hover:text-orange-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <a
              href={`tel:+44${companyPhone.replace(/\D/g, '')}`}
              className="hidden lg:flex items-center text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
              aria-label={`Call us at ${companyPhone}`}
            >
              <Phone className="w-4 h-4 mr-1" />
              <span>{companyPhone}</span>
            </a>
            <Link to="/repair-request">
              <Button size="sm">
                Request Repair
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 rounded-lg ${
                  isActive(item.path)
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <a
              href={`tel:+44${companyPhone.replace(/\D/g, '')}`}
              className="flex items-center w-full text-left px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
              aria-label={`Call us at ${companyPhone}`}
            >
              <Phone className="w-4 h-4 mr-2" />
              <span>{companyPhone}</span>
            </a>
            <Link to="/repair-request" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">
                Request Repair
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
