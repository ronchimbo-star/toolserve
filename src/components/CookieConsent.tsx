import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';
import { Button } from './Button';
import { supabase } from '../lib/supabase';

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.');

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShow(true);
      fetchConsentMessage();
    }
  }, []);

  async function fetchConsentMessage() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('cookie_consent_message')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data?.cookie_consent_message) {
        setMessage(data.cookie_consent_message);
      }
    } catch (error) {
      console.error('Error fetching cookie consent message:', error);
    }
  }

  function handleAccept() {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
  }

  function handleDecline() {
    localStorage.setItem('cookieConsent', 'declined');
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t-2 border-orange-600 shadow-2xl animate-slide-up">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">Cookie Notice</h3>
              <p className="text-sm text-slate-600">
                {message}{' '}
                <Link
                  to="/cookies"
                  className="text-orange-600 hover:text-orange-700 underline font-medium"
                >
                  Learn more
                </Link>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              onClick={handleAccept}
              className="flex-1 md:flex-none"
            >
              Accept
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              className="flex-1 md:flex-none"
            >
              Decline
            </Button>
            <button
              onClick={handleDecline}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
