import React, { useState, useEffect } from 'react';
import { Wrench, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface CTABlockProps {
  variant?: 'primary' | 'inline';
}

const CTABlock: React.FC<CTABlockProps> = ({ variant = 'primary' }) => {
  const [phone, setPhone] = useState('01892-336-315');

  useEffect(() => {
    const fetchPhone = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('contact_phone')
        .single();

      if (data?.contact_phone) {
        setPhone(data.contact_phone.replace(/\+44\s*\(0\)|[\(\)\s]/g, '').replace(/^44/, '0'));
      }
    };

    fetchPhone();
  }, []);
  if (variant === 'inline') {
    return (
      <div className="my-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-r-lg">
        <div className="flex items-start gap-4">
          <Wrench className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-bold text-slate-800 mb-2">Need Professional Repair?</h4>
            <p className="text-gray-700 mb-3">
              Don't risk expensive equipment. Get expert service from qualified technicians.
            </p>
            <Link
              to="/repair-request"
              className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
            >
              Book Service <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-12 p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl">
      <div className="text-center max-w-2xl mx-auto">
        <Wrench className="text-yellow-500 mx-auto mb-4" size={48} />
        <h3 className="text-2xl font-bold text-white mb-3">
          Need Professional Tool Servicing?
        </h3>
        <p className="text-gray-300 mb-6 leading-relaxed">
          Don't risk costly breakdowns or safety hazards. Our UK-based technicians specialize in industrial and trade equipment.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link
            to="/repair-request"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-colors"
          >
            Book a Service <ArrowRight size={18} />
          </Link>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
          >
            <Phone size={18} /> Call Us: {phone}
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            UK-wide service
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Fast turnaround
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Trusted workshops
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTABlock;
