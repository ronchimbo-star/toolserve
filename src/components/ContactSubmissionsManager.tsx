import { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, Archive, RotateCcw, Eye, X, Search, Filter, MessageSquare } from 'lucide-react';
import { Button } from './Button';
import { supabase } from '../lib/supabase';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'pending' | 'actioned' | 'archived';
  notes: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-700',
  actioned: 'bg-emerald-100 text-emerald-700',
  archived: 'bg-slate-100 text-slate-500',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  actioned: 'Actioned',
  archived: 'Archived',
};

export function ContactSubmissionsManager() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching contact submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: ContactSubmission['status']) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status } as any)
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : prev);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Delete this contact submission permanently?')) return;
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error('Error deleting submission:', err);
    }
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ notes: notesInput } as any)
        .eq('id', selected.id);

      if (error) throw error;
      setSubmissions(prev => prev.map(s => s.id === selected.id ? { ...s, notes: notesInput } : s));
      setSelected(prev => prev ? { ...prev, notes: notesInput } : prev);
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const openDetail = (s: ContactSubmission) => {
    setSelected(s);
    setNotesInput(s.notes || '');
    if (s.status === 'pending') updateStatus(s.id, 'pending');
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const filtered = submissions.filter(s => {
    const matchSearch =
      !searchTerm ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    pending: submissions.filter(s => s.status === 'pending').length,
    actioned: submissions.filter(s => s.status === 'actioned').length,
    archived: submissions.filter(s => s.status === 'archived').length,
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {(['pending', 'actioned', 'archived'] as const).map(key => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`bg-white rounded-xl shadow-sm border-2 p-5 text-left transition-all ${statusFilter === key ? 'border-orange-500' : 'border-transparent hover:border-slate-200'}`}
          >
            <p className="text-sm font-medium text-slate-500 capitalize mb-1">{STATUS_LABELS[key]}</p>
            <p className="text-3xl font-bold text-slate-800">{counts[key]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, subject or message..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="actioned">Actioned</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {['Name', 'Subject', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{s.name}</div>
                      <div className="text-sm text-slate-500">{s.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-slate-800 font-medium">{s.subject}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">{s.message.substring(0, 80)}…</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[s.status]}`}>
                        {STATUS_LABELS[s.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                      {formatDate(s.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetail(s)}
                          title="View details"
                          className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {s.status !== 'actioned' && (
                          <button
                            onClick={() => updateStatus(s.id, 'actioned')}
                            title="Mark as actioned"
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {s.status !== 'archived' ? (
                          <button
                            onClick={() => updateStatus(s.id, 'archived')}
                            title="Archive"
                            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(s.id, 'pending')}
                            title="Restore"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteSubmission(s.id)}
                          title="Delete"
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selected.subject}</h2>
                <p className="text-sm text-slate-500">{formatDate(selected.created_at)}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</label>
                  <p className="text-slate-800 font-medium mt-1">{selected.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                  <a href={`mailto:${selected.email}`} className="text-orange-600 hover:underline block mt-1">
                    {selected.email}
                  </a>
                </div>
                {selected.phone && (
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</label>
                    <a href={`tel:${selected.phone}`} className="text-orange-600 hover:underline block mt-1">
                      {selected.phone}
                    </a>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selected.status]}`}>
                      {STATUS_LABELS[selected.status]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Message</label>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-800 whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>

              {/* Internal notes */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Internal Notes</label>
                <textarea
                  value={notesInput}
                  onChange={e => setNotesInput(e.target.value)}
                  rows={3}
                  placeholder="Add internal notes..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm resize-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap gap-2 justify-between">
              <div className="flex gap-2">
                {selected.status !== 'actioned' && (
                  <Button size="sm" onClick={() => updateStatus(selected.id, 'actioned')}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Mark Actioned
                  </Button>
                )}
                {selected.status !== 'archived' ? (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, 'archived')}>
                    <Archive className="w-4 h-4 mr-1" />
                    Archive
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, 'pending')}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Restore
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => deleteSubmission(selected.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={saveNotes} disabled={savingNotes}>
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </Button>
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}>
                  <Button size="sm">
                    <Mail className="w-4 h-4 mr-1" />
                    Reply by Email
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
