import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="my-12 p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
      <div className="max-w-xl mx-auto text-center">
        <Mail className="text-yellow-600 mx-auto mb-4" size={40} />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Subscribe for Tool Tips & Guides
        </h3>
        <p className="text-gray-600 mb-6">
          Get expert maintenance advice, safety tips, and exclusive offers delivered to your inbox.
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
            <CheckCircle size={20} />
            <span>Thanks for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-xs text-gray-500 mt-3">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default NewsletterSignup;
