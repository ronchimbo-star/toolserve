import { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';
import { Button } from './Button';
import { ImageUpload } from './ImageUpload';
import { supabase } from '../lib/supabase';
import { showToast } from './Toast';

interface SiteSettings {
  id: string;
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  copyright_text: string;
  favicon_url: string | null;
  header_logo_url: string | null;
  footer_logo_url: string | null;
  cookie_consent_message: string | null;
  google_analytics_id: string | null;
  site_meta_title: string | null;
  site_meta_description: string | null;
  site_meta_keywords: string | null;
}

export function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    copyright_text: '',
    favicon_url: '',
    header_logo_url: '',
    footer_logo_url: '',
    cookie_consent_message: '',
    google_analytics_id: '',
    site_meta_title: '',
    site_meta_description: '',
    site_meta_keywords: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
        setFormData({
          company_name: data.company_name || '',
          company_email: data.company_email || '',
          company_phone: data.company_phone || '',
          company_address: data.company_address || '',
          copyright_text: data.copyright_text || '',
          favicon_url: data.favicon_url || '',
          header_logo_url: data.header_logo_url || '',
          footer_logo_url: data.footer_logo_url || '',
          cookie_consent_message: data.cookie_consent_message || '',
          google_analytics_id: data.google_analytics_id || '',
          site_meta_title: data.site_meta_title || '',
          site_meta_description: data.site_meta_description || '',
          site_meta_keywords: data.site_meta_keywords || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          company_name: formData.company_name,
          company_email: formData.company_email,
          company_phone: formData.company_phone,
          company_address: formData.company_address,
          copyright_text: formData.copyright_text,
          favicon_url: formData.favicon_url,
          header_logo_url: formData.header_logo_url,
          footer_logo_url: formData.footer_logo_url,
          cookie_consent_message: formData.cookie_consent_message,
          google_analytics_id: formData.google_analytics_id,
          site_meta_title: formData.site_meta_title,
          site_meta_description: formData.site_meta_description,
          site_meta_keywords: formData.site_meta_keywords,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;

      showToast.success('Settings saved successfully!');
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-orange-600" />
        <h2 className="text-2xl font-bold text-slate-800">Site Settings</h2>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.company_email}
                  onChange={(e) => setFormData({ ...formData, company_email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.company_phone}
                  onChange={(e) => setFormData({ ...formData, company_phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Address
                </label>
                <input
                  type="text"
                  value={formData.company_address}
                  onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Favicon (PNG)
                </label>
                <ImageUpload
                  onUploadComplete={(url) => setFormData({ ...formData, favicon_url: url })}
                  currentImageUrl={formData.favicon_url}
                  accept="image/png"
                />
                <p className="mt-2 text-xs text-slate-500">Recommended: 32x32px or 64x64px PNG</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Header Logo (SVG/PNG)
                </label>
                <ImageUpload
                  onUploadComplete={(url) => setFormData({ ...formData, header_logo_url: url })}
                  currentImageUrl={formData.header_logo_url}
                  accept="image/svg+xml,image/png"
                />
                <p className="mt-2 text-xs text-slate-500">Displayed in the navigation bar</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Footer Logo (SVG/PNG)
                </label>
                <ImageUpload
                  onUploadComplete={(url) => setFormData({ ...formData, footer_logo_url: url })}
                  currentImageUrl={formData.footer_logo_url}
                  accept="image/svg+xml,image/png"
                />
                <p className="mt-2 text-xs text-slate-500">Displayed in the footer</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">SEO & Analytics</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Google Analytics Measurement ID
                </label>
                <input
                  type="text"
                  value={formData.google_analytics_id}
                  onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="mt-2 text-xs text-slate-500">Your GA4 measurement ID (starts with G-)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Site Meta Title
                </label>
                <input
                  type="text"
                  value={formData.site_meta_title}
                  onChange={(e) => setFormData({ ...formData, site_meta_title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="ToolServe - Professional Tool Repair & Servicing"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Default title for pages without specific meta titles (50-60 characters optimal)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Site Meta Description
                </label>
                <textarea
                  value={formData.site_meta_description}
                  onChange={(e) => setFormData({ ...formData, site_meta_description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Professional tool repair and servicing across the UK..."
                />
                <p className="mt-2 text-xs text-slate-500">
                  Default meta description for search engines (150-160 characters optimal)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Site Meta Keywords
                </label>
                <input
                  type="text"
                  value={formData.site_meta_keywords}
                  onChange={(e) => setFormData({ ...formData, site_meta_keywords: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="tool repair, power tools, garden equipment"
                />
                <p className="mt-2 text-xs text-slate-500">Comma-separated keywords</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Legal & Messages</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Copyright Text
                </label>
                <input
                  type="text"
                  value={formData.copyright_text}
                  onChange={(e) => setFormData({ ...formData, copyright_text: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="© 2024 ToolServe. All rights reserved."
                />
                <p className="mt-2 text-xs text-slate-500">Displayed in the footer</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cookie Consent Message
                </label>
                <textarea
                  value={formData.cookie_consent_message}
                  onChange={(e) => setFormData({ ...formData, cookie_consent_message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="We use cookies to enhance your browsing experience..."
                />
                <p className="mt-2 text-xs text-slate-500">Message shown in the cookie consent popup</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
