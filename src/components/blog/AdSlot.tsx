import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Advertisement {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string;
  position: string;
  click_count: number;
  impression_count: number;
}

interface AdSlotProps {
  position: 'top' | 'middle' | 'bottom';
}

const AdSlot: React.FC<AdSlotProps> = ({ position }) => {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAd();
  }, [position]);

  const fetchAd = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('position', position)
        .eq('active', true)
        .maybeSingle();

      if (error) throw error;
      setAd(data);

      if (data) {
        await supabase
          .from('advertisements')
          .update({ impression_count: data.impression_count + 1 })
          .eq('id', data.id);
      }
    } catch (error) {
      console.error('Error fetching advertisement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (ad) {
      await supabase
        .from('advertisements')
        .update({ click_count: ad.click_count + 1 })
        .eq('id', ad.id);
    }
  };

  if (loading || !ad) {
    return null;
  }

  const isInternal = ad.link_url.startsWith('/');

  return (
    <div className="my-8">
      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider text-center">Advertisement</p>
      {isInternal ? (
        <Link
          to={ad.link_url}
          onClick={handleClick}
          className="block bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <img
                src={ad.image_url}
                alt={ad.title}
                className="h-16 w-auto"
              />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {ad.title}
            </h3>
            {ad.description && (
              <p className="text-gray-300 text-sm md:text-base mb-4 max-w-2xl mx-auto">
                {ad.description}
              </p>
            )}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-colors">
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="bg-yellow-500 py-2 px-4 flex items-center justify-center gap-4 text-slate-900 text-xs font-semibold">
            <span>✓ 90-Day Warranty</span>
            <span>•</span>
            <span>✓ Free Diagnosis</span>
            <span>•</span>
            <span>✓ Fast Turnaround</span>
          </div>
        </Link>
      ) : (
        <a
          href={ad.link_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <img
                src={ad.image_url}
                alt={ad.title}
                className="h-16 w-auto"
              />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {ad.title}
            </h3>
            {ad.description && (
              <p className="text-gray-300 text-sm md:text-base mb-4 max-w-2xl mx-auto">
                {ad.description}
              </p>
            )}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-colors">
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="bg-yellow-500 py-2 px-4 flex items-center justify-center gap-4 text-slate-900 text-xs font-semibold">
            <span>✓ 90-Day Warranty</span>
            <span>•</span>
            <span>✓ Free Diagnosis</span>
            <span>•</span>
            <span>✓ Fast Turnaround</span>
          </div>
        </a>
      )}
    </div>
  );
};

export default AdSlot;
