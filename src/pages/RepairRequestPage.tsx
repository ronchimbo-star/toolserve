import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { ImageUpload } from '../components/ImageUpload';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumb } from '../components/Breadcrumb';
import { supabase } from '../lib/supabase';

export function RepairRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    preferred_contact_method: 'email',
    preferred_contact_time: '',
    equipment_type: '',
    equipment_make: '',
    equipment_model: '',
    serial_number: '',
    issue_description: '',
    service_type: 'repair' as 'repair' | 'servicing' | 'bulk'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('repair_requests')
        .insert([{
          ...formData,
          photo_urls: photoUrls
        }]);

      if (submitError) throw submitError;

      try {
        const emailApiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`;
        await fetch(emailApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'repair_confirmation',
            to: formData.customer_email,
            customerName: formData.customer_name,
            requestData: {
              equipmentType: formData.equipment_type,
              serviceType: formData.service_type
            }
          })
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      try {
        const notifyApiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-admin`;
        await fetch(notifyApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'repair_request',
            title: 'New Repair Request Submitted',
            message: `${formData.customer_name} has submitted a repair request for ${formData.equipment_type}.`,
            metadata: {
              customer_name: formData.customer_name,
              customer_email: formData.customer_email,
              customer_phone: formData.customer_phone,
              equipment_type: formData.equipment_type,
              equipment_make: formData.equipment_make,
              equipment_model: formData.equipment_model,
              service_type: formData.service_type,
              issue_description: formData.issue_description.substring(0, 100) + '...',
              photos_uploaded: photoUrls.length
            }
          })
        });
      } catch (notifyError) {
        console.error('Admin notification failed:', notifyError);
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit repair request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              Request Submitted Successfully!
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Thank you for choosing ToolServe. We've received your repair request and will
              contact you within 24 hours to discuss the next steps.
            </p>
            <div className="bg-slate-50 p-6 rounded-xl mb-8">
              <p className="text-slate-700 mb-2">
                A confirmation email has been sent to <strong>{formData.customer_email}</strong>
              </p>
              <p className="text-sm text-slate-600">
                Please check your spam folder if you don't see it in your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button>Return Home</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setPhotoUrls([]);
                  setFormData({
                    customer_name: '',
                    customer_email: '',
                    customer_phone: '',
                    customer_address: '',
                    preferred_contact_method: 'email',
                    preferred_contact_time: '',
                    equipment_type: '',
                    equipment_make: '',
                    equipment_model: '',
                    serial_number: '',
                    issue_description: '',
                    service_type: 'repair'
                  });
                }}
              >
                Submit Another Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <SEO
        title="Request Repair | ToolServe"
        description="Request a tool repair from ToolServe. Fill out our online form for a free quote. Fast turnaround, expert service and 90-day warranty on all repairs."
        canonical="https://toolserve.co.uk/repair-request"
      />
      <StructuredData type="Breadcrumb" items={[
        { name: 'Home', url: 'https://toolserve.co.uk/' },
        { name: 'Request Repair', url: 'https://toolserve.co.uk/repair-request' }
      ]} />
      <Breadcrumb items={[
        { name: 'Home', path: '/' },
        { name: 'Request Repair' }
      ]} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Submit Repair Request
          </h1>
          <p className="text-lg text-slate-600">
            Fill out the form below and we'll get back to you within 24 hours
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="+44 7700 900000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <select
                    name="preferred_contact_method"
                    value={formData.preferred_contact_method}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="either">Either</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address (Optional)
                </label>
                <input
                  type="text"
                  name="customer_address"
                  value={formData.customer_address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="123 Main Street, Portsmouth, PO1 1AA"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Contact Time
                </label>
                <input
                  type="text"
                  name="preferred_contact_time"
                  value={formData.preferred_contact_time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Weekdays 9am-5pm, Evenings after 6pm"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Equipment Details</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Type *
                </label>
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="repair">Repair (Something is broken)</option>
                  <option value="servicing">Servicing/Maintenance</option>
                  <option value="bulk">Bulk/Council Project</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Equipment Type *
                  </label>
                  <input
                    type="text"
                    name="equipment_type"
                    value={formData.equipment_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., Power Drill, Lawn Mower, Vacuum Cleaner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Make/Brand
                  </label>
                  <input
                    type="text"
                    name="equipment_make"
                    value={formData.equipment_make}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., Bosch, DeWalt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Model Number
                  </label>
                  <input
                    type="text"
                    name="equipment_model"
                    value={formData.equipment_model}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., XR18V-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Usually found on label or bottom"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Issue Description *
                </label>
                <textarea
                  name="issue_description"
                  value={formData.issue_description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Please describe the problem in detail. What happens when you try to use it? When did the issue start?"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Photos (Optional)
                </label>
                <p className="text-sm text-slate-600 mb-3">
                  Upload photos of your equipment to help us diagnose the issue faster.
                </p>
                <ImageUpload
                  onImagesChange={setPhotoUrls}
                  maxImages={5}
                  maxSizeMB={2}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
              <Link to="/" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
