import { useState, useEffect } from 'react';
import { FileText, Save, Shield, Cookie } from 'lucide-react';
import { Button } from './Button';
import { supabase } from '../lib/supabase';
import { showToast } from './Toast';

interface PolicyPage {
  id: string;
  page_type: string;
  title: string;
  content: string;
  updated_at: string;
}

export function PolicyPagesManager() {
  const [policies, setPolicies] = useState<PolicyPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<string>('terms');
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    const policy = policies.find(p => p.page_type === selectedPolicy);
    if (policy) {
      setFormData({
        title: policy.title,
        content: policy.content
      });
    }
  }, [selectedPolicy, policies]);

  async function fetchPolicies() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('policy_pages')
        .select('*')
        .in('page_type', ['terms', 'privacy', 'cookies']);

      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('policy_pages')
        .update({
          title: formData.title,
          content: formData.content,
          updated_at: new Date().toISOString()
        })
        .eq('page_type', selectedPolicy);

      if (error) throw error;

      showToast.success('Policy updated successfully!');
      fetchPolicies();
    } catch (error) {
      console.error('Error saving policy:', error);
      showToast.error('Error saving policy');
    } finally {
      setSaving(false);
    }
  }

  const policyTypes = [
    { value: 'terms', label: 'Terms & Conditions', icon: FileText },
    { value: 'privacy', label: 'Privacy Policy', icon: Shield },
    { value: 'cookies', label: 'Cookie Policy', icon: Cookie }
  ];

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
        <FileText className="w-6 h-6 text-orange-600" />
        <h2 className="text-2xl font-bold text-slate-800">Policy Pages Management</h2>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex gap-3 mb-6">
          {policyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setSelectedPolicy(type.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPolicy === type.value
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Page Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter page title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={20}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
              placeholder="Enter policy content..."
            />
            <p className="mt-2 text-xs text-slate-500">
              Content is displayed as plain text with preserved line breaks.
            </p>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
