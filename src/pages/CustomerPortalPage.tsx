import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle, AlertCircle, Calendar, Mail, Phone, Wrench } from 'lucide-react';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type RepairRequest = Database['public']['Tables']['repair_requests']['Row'];

export function CustomerPortalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [error, setError] = useState('');
  const [contactPhone, setContactPhone] = useState<string>('01892-336-315');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('contact_phone')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data?.contact_phone) {
        setContactPhone(data.contact_phone);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRequest(null);

    try {
      const { data, error: searchError } = await supabase
        .from('repair_requests')
        .select('*')
        .or(`customer_email.eq.${searchQuery},id.eq.${searchQuery}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (searchError) throw searchError;

      if (!data) {
        setError('No repair request found with that email or reference number.');
      } else {
        setRequest(data);
      }
    } catch (err) {
      setError('Failed to search for repair request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusInfo: Record<string, { icon: any; color: string; label: string; description: string }> = {
      received: {
        icon: Package,
        color: 'blue',
        label: 'Request Received',
        description: 'Your repair request has been received and is awaiting review.'
      },
      diagnosing: {
        icon: Search,
        color: 'yellow',
        label: 'Diagnosing',
        description: 'Our technician is examining your equipment to determine the issue.'
      },
      in_repair: {
        icon: Wrench,
        color: 'orange',
        label: 'In Repair',
        description: 'Your equipment is currently being repaired by our technician.'
      },
      completed: {
        icon: CheckCircle,
        color: 'green',
        label: 'Completed',
        description: 'Your repair is complete! Please contact us for collection or delivery.'
      },
      cancelled: {
        icon: AlertCircle,
        color: 'red',
        label: 'Cancelled',
        description: 'This repair request has been cancelled.'
      }
    };

    return statusInfo[status] || statusInfo.received;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Track Your Repair</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Enter your email address or reference number to view your repair status
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address or Reference Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                    className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your email or reference number"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Use the email address you provided when submitting your repair request
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || !searchQuery}
                className="w-full"
              >
                {loading ? 'Searching...' : 'Track Repair'}
              </Button>
            </form>

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{error}</p>
                  <p className="text-sm mt-1">
                    Need help?{' '}
                    <Link to="/contact" className="underline hover:text-red-800">
                      Contact us
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>

          {request && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      Repair Request Details
                    </h2>
                    <p className="text-sm text-slate-500">
                      Reference: <span className="font-mono font-medium">{request.id.slice(0, 8).toUpperCase()}</span>
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  {['received', 'diagnosing', 'in_repair', 'completed'].map((status, index) => {
                    const currentStatusIndex = ['received', 'diagnosing', 'in_repair', 'completed'].indexOf(request.status);
                    const isActive = index <= currentStatusIndex;
                    const isCurrent = status === request.status;

                    return (
                      <div key={status} className="flex items-start mb-4 last:mb-0">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          isCurrent ? 'bg-orange-600 text-white' :
                          isActive ? 'bg-green-600 text-white' :
                          'bg-slate-200 text-slate-400'
                        }`}>
                          {isActive && status !== request.status ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <div className="w-3 h-3 bg-current rounded-full"></div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <p className={`font-semibold ${isCurrent ? 'text-orange-600' : isActive ? 'text-green-600' : 'text-slate-400'}`}>
                            {getStatusInfo(status).label}
                          </p>
                          {isCurrent && (
                            <p className="text-sm text-slate-600 mt-1">
                              {getStatusInfo(status).description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-slate-800 mb-4">Equipment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Equipment Type</p>
                      <p className="font-medium text-slate-800">{request.equipment_type || 'N/A'}</p>
                    </div>
                    {request.equipment_make && (
                      <div>
                        <p className="text-sm text-slate-600">Make/Brand</p>
                        <p className="font-medium text-slate-800">{request.equipment_make}</p>
                      </div>
                    )}
                    {request.equipment_model && (
                      <div>
                        <p className="text-sm text-slate-600">Model</p>
                        <p className="font-medium text-slate-800">{request.equipment_model}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-slate-600">Service Type</p>
                      <p className="font-medium text-slate-800 capitalize">{request.service_type}</p>
                    </div>
                  </div>

                  {request.issue_description && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-600 mb-1">Issue Description</p>
                      <p className="text-slate-800 bg-slate-50 p-3 rounded-lg text-sm">
                        {request.issue_description}
                      </p>
                    </div>
                  )}

                  {request.photo_urls && request.photo_urls.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-600 mb-2">Uploaded Photos ({request.photo_urls.length})</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {request.photo_urls.map((url: string, index: number) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aspect-square rounded-lg overflow-hidden border-2 border-slate-200 hover:border-orange-500 transition-colors"
                          >
                            <img
                              src={url}
                              alt={`Equipment photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-6 mt-6">
                  <h3 className="font-semibold text-slate-800 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-orange-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-600">Email</p>
                        <p className="font-medium text-slate-800">{request.customer_email}</p>
                      </div>
                    </div>
                    {request.customer_phone && (
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-orange-600 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-slate-600">Phone</p>
                          <p className="font-medium text-slate-800">{request.customer_phone}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-orange-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-600">Submitted</p>
                        <p className="font-medium text-slate-800">{formatDate(request.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-orange-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-600">Last Updated</p>
                        <p className="font-medium text-slate-800">{formatDate(request.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6">
                <h3 className="font-bold text-slate-800 mb-2">Need More Help?</h3>
                <p className="text-slate-600 mb-4">
                  If you have questions about your repair or need to update any information, we're here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="mailto:info@toolserve.co.uk" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Us
                    </Button>
                  </a>
                  <a href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Us
                    </Button>
                  </a>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setRequest(null);
                    setSearchQuery('');
                    setError('');
                  }}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  ← Search Again
                </button>
              </div>
            </div>
          )}

          {!request && !error && (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 text-center">
              <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Track Your Repair</h3>
              <p className="text-slate-600 mb-6">
                Enter your email or reference number above to view the status of your repair request
              </p>
              <p className="text-sm text-slate-500">
                Don't have a repair request yet?{' '}
                <Link
                  to="/repair-request"
                  className="text-orange-600 hover:text-orange-700 font-medium underline"
                >
                  Submit one now
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
