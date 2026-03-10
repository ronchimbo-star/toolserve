import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, CreditCard as Edit2, Trash2, Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface FaultCode {
  id: string;
  code: string;
  title: string;
  description: string;
  category_id: string | null;
  tool_model_id: string | null;
  common_symptoms: string;
  common_causes: string;
  common_fixes: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  estimated_time_minutes: number;
  frequency_count: number;
  created_at: string;
}

interface ToolCategory {
  id: string;
  name: string;
}

interface ToolModel {
  id: string;
  make: string;
  model: string;
}

export default function FaultCodesManager() {
  const [faultCodes, setFaultCodes] = useState<FaultCode[]>([]);
  const [categories, setCategories] = useState<ToolCategory[]>([]);
  const [toolModels, setToolModels] = useState<ToolModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    category_id: '',
    tool_model_id: '',
    common_symptoms: '',
    common_causes: '',
    common_fixes: '',
    difficulty_level: 'medium' as 'easy' | 'medium' | 'hard',
    estimated_time_minutes: 30,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [faultCodesRes, categoriesRes, modelsRes] = await Promise.all([
        supabase.from('fault_codes').select('*').order('frequency_count', { ascending: false }),
        supabase.from('tool_categories').select('id, name').order('name'),
        supabase.from('tool_models').select('id, make, model').order('make, model'),
      ]);

      if (faultCodesRes.data) setFaultCodes(faultCodesRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (modelsRes.data) setToolModels(modelsRes.data);
    } catch (error) {
      console.error('Error fetching fault codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('fault_codes')
          .update({
            ...formData,
            category_id: formData.category_id || null,
            tool_model_id: formData.tool_model_id || null,
          })
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('fault_codes').insert([{
          ...formData,
          category_id: formData.category_id || null,
          tool_model_id: formData.tool_model_id || null,
        }]);
        if (error) throw error;
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving fault code:', error);
      alert('Failed to save fault code');
    }
  };

  const handleEdit = (faultCode: FaultCode) => {
    setFormData({
      code: faultCode.code,
      title: faultCode.title,
      description: faultCode.description,
      category_id: faultCode.category_id || '',
      tool_model_id: faultCode.tool_model_id || '',
      common_symptoms: faultCode.common_symptoms,
      common_causes: faultCode.common_causes,
      common_fixes: faultCode.common_fixes,
      difficulty_level: faultCode.difficulty_level,
      estimated_time_minutes: faultCode.estimated_time_minutes,
    });
    setEditingId(faultCode.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fault code?')) return;
    try {
      const { error } = await supabase.from('fault_codes').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting fault code:', error);
      alert('Failed to delete fault code');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      category_id: '',
      tool_model_id: '',
      common_symptoms: '',
      common_causes: '',
      common_fixes: '',
      difficulty_level: 'medium',
      estimated_time_minutes: 30,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredFaultCodes = faultCodes.filter((fc) =>
    fc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fc.common_symptoms.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading fault codes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Fault Codes Database</h2>
          <p className="text-slate-600 mt-1">Manage diagnostic fault codes and repair procedures</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <Plus className="w-4 h-4" />
          Add Fault Code
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search fault codes, symptoms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 my-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              {editingId ? 'Edit Fault Code' : 'Add New Fault Code'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., MOTOR_NO_START"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Short description"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Specific Tool Model (Optional)
                  </label>
                  <select
                    value={formData.tool_model_id}
                    onChange={(e) => setFormData({ ...formData, tool_model_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">All Models</option>
                    {toolModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.make} {model.model}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Common Symptoms
                </label>
                <textarea
                  value={formData.common_symptoms}
                  onChange={(e) => setFormData({ ...formData, common_symptoms: e.target.value })}
                  placeholder="What the customer typically reports..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Common Causes
                </label>
                <textarea
                  value={formData.common_causes}
                  onChange={(e) => setFormData({ ...formData, common_causes: e.target.value })}
                  placeholder="Likely root causes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Common Fixes
                </label>
                <textarea
                  value={formData.common_fixes}
                  onChange={(e) => setFormData({ ...formData, common_fixes: e.target.value })}
                  placeholder="Standard repair procedures..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Estimated Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.estimated_time_minutes}
                    onChange={(e) => setFormData({ ...formData, estimated_time_minutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  {editingId ? 'Update Fault Code' : 'Create Fault Code'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {filteredFaultCodes.map((faultCode) => (
          <div key={faultCode.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-slate-800 text-white text-sm font-mono rounded">
                    {faultCode.code}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(faultCode.difficulty_level)}`}>
                    {faultCode.difficulty_level}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    {faultCode.estimated_time_minutes} min
                  </span>
                  {faultCode.frequency_count > 0 && (
                    <span className="flex items-center gap-1 text-sm text-slate-600">
                      <AlertCircle className="w-4 h-4" />
                      {faultCode.frequency_count} occurrences
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-800">{faultCode.title}</h3>
                {faultCode.description && (
                  <p className="text-slate-600 mt-1">{faultCode.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(faultCode)}
                  className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faultCode.id)}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {faultCode.common_symptoms && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Symptoms
                </h4>
                <p className="text-sm text-slate-600">{faultCode.common_symptoms}</p>
              </div>
            )}

            {faultCode.common_causes && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-slate-700 mb-1">Causes</h4>
                <p className="text-sm text-slate-600">{faultCode.common_causes}</p>
              </div>
            )}

            {faultCode.common_fixes && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Fixes
                </h4>
                <p className="text-sm text-slate-600">{faultCode.common_fixes}</p>
              </div>
            )}
          </div>
        ))}

        {filteredFaultCodes.length === 0 && (
          <div className="text-center py-12 text-slate-600">
            No fault codes found. Add your first fault code to get started.
          </div>
        )}
      </div>
    </div>
  );
}
