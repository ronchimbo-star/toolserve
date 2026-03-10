import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, CreditCard as Edit2, Trash2, Search, Book, Clock, Eye, Tag } from 'lucide-react';

interface ServiceGuide {
  id: string;
  tool_model_id: string | null;
  title: string;
  content: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  estimated_time_minutes: number;
  required_tools: string;
  special_notes: string;
  torque_specs: string;
  diagram_url: string;
  video_url: string;
  tags: string[];
  view_count: number;
  created_at: string;
}

interface ToolModel {
  id: string;
  make: string;
  model: string;
}

export default function ServiceGuidesWiki() {
  const [guides, setGuides] = useState<ServiceGuide[]>([]);
  const [toolModels, setToolModels] = useState<ToolModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<ServiceGuide | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tool_model_id: '',
    title: '',
    content: '',
    difficulty_level: 'medium' as 'easy' | 'medium' | 'hard',
    estimated_time_minutes: 60,
    required_tools: '',
    special_notes: '',
    torque_specs: '',
    diagram_url: '',
    video_url: '',
    tags: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [guidesRes, modelsRes] = await Promise.all([
        supabase.from('service_guides').select('*').order('created_at', { ascending: false }),
        supabase.from('tool_models').select('id, make, model').order('make, model'),
      ]);

      if (guidesRes.data) setGuides(guidesRes.data);
      if (modelsRes.data) setToolModels(modelsRes.data);
    } catch (error) {
      console.error('Error fetching service guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const dataToSubmit = {
        ...formData,
        tool_model_id: formData.tool_model_id || null,
        tags: tagsArray,
      };

      if (editingId) {
        const { error } = await supabase
          .from('service_guides')
          .update(dataToSubmit)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('service_guides').insert([dataToSubmit]);
        if (error) throw error;
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving service guide:', error);
      alert('Failed to save service guide');
    }
  };

  const handleEdit = (guide: ServiceGuide) => {
    setFormData({
      tool_model_id: guide.tool_model_id || '',
      title: guide.title,
      content: guide.content,
      difficulty_level: guide.difficulty_level,
      estimated_time_minutes: guide.estimated_time_minutes,
      required_tools: guide.required_tools,
      special_notes: guide.special_notes,
      torque_specs: guide.torque_specs,
      diagram_url: guide.diagram_url,
      video_url: guide.video_url,
      tags: guide.tags.join(', '),
    });
    setEditingId(guide.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service guide?')) return;
    try {
      const { error } = await supabase.from('service_guides').delete().eq('id', id);
      if (error) throw error;
      if (selectedGuide?.id === id) setSelectedGuide(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting service guide:', error);
      alert('Failed to delete service guide');
    }
  };

  const handleView = async (guide: ServiceGuide) => {
    setSelectedGuide(guide);
    await supabase
      .from('service_guides')
      .update({ view_count: guide.view_count + 1 })
      .eq('id', guide.id);
    fetchData();
  };

  const resetForm = () => {
    setFormData({
      tool_model_id: '',
      title: '',
      content: '',
      difficulty_level: 'medium',
      estimated_time_minutes: 60,
      required_tools: '',
      special_notes: '',
      torque_specs: '',
      diagram_url: '',
      video_url: '',
      tags: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredGuides = guides.filter((guide) =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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
    return <div className="p-6 text-center">Loading service guides...</div>;
  }

  if (selectedGuide) {
    const toolModel = toolModels.find(m => m.id === selectedGuide.tool_model_id);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedGuide(null)}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to guides
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(selectedGuide)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-8">
          <div className="mb-6">
            {toolModel && (
              <div className="text-sm text-slate-600 mb-2">
                {toolModel.make} {toolModel.model}
              </div>
            )}
            <h1 className="text-3xl font-bold text-slate-800 mb-4">{selectedGuide.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 text-sm font-medium rounded ${getDifficultyColor(selectedGuide.difficulty_level)}`}>
                {selectedGuide.difficulty_level}
              </span>
              <span className="flex items-center gap-1 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                {selectedGuide.estimated_time_minutes} minutes
              </span>
              <span className="flex items-center gap-1 text-sm text-slate-600">
                <Eye className="w-4 h-4" />
                {selectedGuide.view_count} views
              </span>
            </div>
            {selectedGuide.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedGuide.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {selectedGuide.required_tools && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-2">Required Tools</h3>
              <p className="text-slate-700 whitespace-pre-line">{selectedGuide.required_tools}</p>
            </div>
          )}

          {selectedGuide.special_notes && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-2">Special Notes & Safety</h3>
              <p className="text-slate-700 whitespace-pre-line">{selectedGuide.special_notes}</p>
            </div>
          )}

          <div className="prose max-w-none mb-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Procedure</h3>
            <div className="text-slate-700 whitespace-pre-line leading-relaxed">
              {selectedGuide.content}
            </div>
          </div>

          {selectedGuide.torque_specs && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-2">Torque Specifications</h3>
              <p className="text-slate-700 whitespace-pre-line font-mono text-sm">{selectedGuide.torque_specs}</p>
            </div>
          )}

          {selectedGuide.diagram_url && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-800 mb-2">Diagram</h3>
              <img src={selectedGuide.diagram_url} alt="Service diagram" className="rounded-lg border border-slate-200 max-w-2xl" />
            </div>
          )}

          {selectedGuide.video_url && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-800 mb-2">Video Tutorial</h3>
              <a
                href={selectedGuide.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 underline"
              >
                {selectedGuide.video_url}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Service Guides Wiki</h2>
          <p className="text-slate-600 mt-1">Step-by-step repair and servicing procedures</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <Plus className="w-4 h-4" />
          New Guide
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search guides, tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 my-8 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              {editingId ? 'Edit Service Guide' : 'Create New Service Guide'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tool Model
                  </label>
                  <select
                    value={formData.tool_model_id}
                    onChange={(e) => setFormData({ ...formData, tool_model_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">General Guide</option>
                    {toolModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.make} {model.model}
                      </option>
                    ))}
                  </select>
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
                    placeholder="e.g., Brush Replacement Procedure"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Content *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Step-by-step instructions..."
                  rows={10}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Required Tools
                </label>
                <textarea
                  value={formData.required_tools}
                  onChange={(e) => setFormData({ ...formData, required_tools: e.target.value })}
                  placeholder="List of tools needed..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Special Notes & Safety Warnings
                </label>
                <textarea
                  value={formData.special_notes}
                  onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
                  placeholder="Safety precautions, common pitfalls..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Torque Specifications
                </label>
                <textarea
                  value={formData.torque_specs}
                  onChange={(e) => setFormData({ ...formData, torque_specs: e.target.value })}
                  placeholder="Torque values for reassembly..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Diagram URL
                  </label>
                  <input
                    type="url"
                    value={formData.diagram_url}
                    onChange={(e) => setFormData({ ...formData, diagram_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="brush replacement, motor, electrical"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  {editingId ? 'Update Guide' : 'Create Guide'}
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGuides.map((guide) => {
          const toolModel = toolModels.find(m => m.id === guide.tool_model_id);
          return (
            <div
              key={guide.id}
              className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleView(guide)}
            >
              <div className="flex items-start justify-between mb-3">
                <Book className="w-8 h-8 text-orange-600 flex-shrink-0" />
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(guide); }}
                    className="p-1 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(guide.id); }}
                    className="p-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {toolModel && (
                <div className="text-xs text-slate-600 mb-1">
                  {toolModel.make} {toolModel.model}
                </div>
              )}

              <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
                {guide.title}
              </h3>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(guide.difficulty_level)}`}>
                  {guide.difficulty_level}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-600">
                  <Clock className="w-3 h-3" />
                  {guide.estimated_time_minutes}m
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-600">
                  <Eye className="w-3 h-3" />
                  {guide.view_count}
                </span>
              </div>

              {guide.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {guide.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                  {guide.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-slate-500 text-xs">
                      +{guide.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredGuides.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-600">
            No service guides found. Create your first guide to get started.
          </div>
        )}
      </div>
    </div>
  );
}
