import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle, XCircle, Calendar, Mail, Phone, Wrench } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumb } from '../components/Breadcrumb';
import type { Database } from '../types/database';

type RepairRequest = Database['public']['Tables']['repair_requests']['Row'];

export function TrackRepairPage() {
  const [searchType, setSearchType] = useState<'id' | 'email'>('id');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [request, setRequest] = useState<RepairRequest | null>(null);

  const statusConfig = {
    received: { label: 'Received', icon: Package, color: 'blue', description: 'We have received your repair request and will review it shortly' },
    diagnosing: { label: 'Diagnosing', icon: Search, color: 'yellow', description: 'Our technicians are examining your equipment to identify the issue' },
    in_repair: { label: 'In Repair', icon: Wrench, color: 'orange', description: 'Your equipment is currently being repaired by our team' },
    completed: { label: 'Completed', icon: CheckCircle, color: 'green', description: 'Repair completed! We will contact you for collection' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: 'red', description: 'This repair request has been cancelled' }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRequest(null);
    setLoading(true);

    try {
      let query = supabase.from('repair_requests').select('*');

      if (searchType === 'id') {
        query = query.eq('id', searchValue.trim());
      } else {
        query = query.eq('customer_email', searchValue.trim().toLowerCase());
      }

      const { data, error: fetchError } = await query.maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        setError(searchType === 'id'
          ? 'No repair request found with this ID. Please check and try again.'
          : 'No repair request found with this email address.'
        );
        return;
      }

      setRequest(data);
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const status = request?.status as keyof typeof statusConfig | undefined;
  const statusInfo = status ? statusConfig[status] : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50">
      <SEO
        title="Track Your Repair | ToolServe"
        description="Track the status of your tool repair with ToolServe. Enter your repair reference number to see real-time updates on your repair progress."
        canonical="https://toolserve.co.uk/track-repair"
      />
      <StructuredData type="Breadcrumb" items={[
        { name: 'Home', url: 'https://toolserve.co.uk/' },
        { name: 'Track Repair', url: 'https://toolserve.co.uk/track-repair' }
      ]} />
      <Breadcrumb items={[
        { name: 'Home', path: '/' },
        { name: 'Track Repair' }
      ]} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="mb-6 text-slate-600 hover:text-orange-600 transition-colors flex items-center gap-2"
        >
          ← Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Track Your Repair</h1>
            <p className="text-slate-600 text-sm sm:text-base">Check the status of your repair request</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-4">
              <button
                type="button"
                onClick={() => setSearchType('id')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  searchType === 'id'
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Search by ID
              </button>
              <button
                type="button"
                onClick={() => setSearchType('email')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  searchType === 'email'
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Search by Email
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {searchType === 'id' ? 'Request ID' : 'Email Address'}
              </label>
              <input
                type={searchType === 'email' ? 'email' : 'text'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchType === 'id' ? 'Enter your request ID' : 'Enter your email address'}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
              <p className="mt-2 text-sm text-slate-500">
                {searchType === 'id'
                  ? 'Your request ID was sent to your email when you submitted the repair request'
                  : 'Use the email address you provided when submitting the repair request'
                }
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !searchValue.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Track Repair
                </>
              )}
            </Button>
          </form>
        </div>

        {request && statusInfo && StatusIcon && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className={`bg-gradient-to-r from-${statusInfo.color}-500 to-${statusInfo.color}-600 px-6 sm:px-8 py-6 text-white`}
              style={{
                background: statusInfo.color === 'blue' ? 'linear-gradient(to right, #3b82f6, #2563eb)' :
                           statusInfo.color === 'yellow' ? 'linear-gradient(to right, #eab308, #ca8a04)' :
                           statusInfo.color === 'orange' ? 'linear-gradient(to right, #f97316, #ea580c)' :
                           statusInfo.color === 'green' ? 'linear-gradient(to right, #10b981, #059669)' :
                           'linear-gradient(to right, #ef4444, #dc2626)'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <StatusIcon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Current Status</p>
                  <h2 className="text-2xl font-bold">{statusInfo.label}</h2>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-orange-500">
                <p className="text-slate-700 text-sm sm:text-base">{statusInfo.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-600" />
                    Equipment Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-600">Type:</span>
                      <span className="ml-2 font-medium text-slate-900">{request.equipment_type}</span>
                    </div>
                    {request.equipment_make && (
                      <div>
                        <span className="text-slate-600">Make:</span>
                        <span className="ml-2 font-medium text-slate-900">{request.equipment_make}</span>
                      </div>
                    )}
                    {request.equipment_model && (
                      <div>
                        <span className="text-slate-600">Model:</span>
                        <span className="ml-2 font-medium text-slate-900">{request.equipment_model}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-600">Service:</span>
                      <span className="ml-2 font-medium text-slate-900 capitalize">{request.service_type}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    Request Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-600">Submitted:</span>
                      <span className="ml-2 font-medium text-slate-900">{formatDate(request.created_at)}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Request ID:</span>
                      <span className="ml-2 font-mono text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        {request.id.substring(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Issue Description</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 whitespace-pre-wrap">{request.issue_description}</p>
                </div>
              </div>

              {request.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Technician Notes</h3>
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                    <p className="text-blue-900 whitespace-pre-wrap">{request.notes}</p>
                  </div>
                </div>
              )}

              {request.photo_urls && Array.isArray(request.photo_urls) && (request.photo_urls as string[]).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Uploaded Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(request.photo_urls as string[]).map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-square rounded-lg overflow-hidden bg-slate-100 hover:ring-2 hover:ring-orange-500 transition-all"
                      >
                        <img
                          src={url}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Need Help?</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:contact@toolserve.co.uk"
                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Email Us</span>
                  </a>
                  <a
                    href="tel:+441234567890"
                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
