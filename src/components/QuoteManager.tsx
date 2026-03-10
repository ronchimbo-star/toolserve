import { useState, useEffect } from 'react';
import { Plus, Send, Trash2, X, Calendar, PoundSterling, FileText, ExternalLink } from 'lucide-react';
import { Button } from './Button';
import { supabase } from '../lib/supabase';
import { showToast } from './Toast';
import type { Database } from '../types/database';

type Quote = Database['public']['Tables']['quotes']['Row'];
type RepairRequest = Database['public']['Tables']['repair_requests']['Row'];

interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface QuoteManagerProps {
  repairRequestId?: string;
  onClose?: () => void;
}

export function QuoteManager({ repairRequestId, onClose }: QuoteManagerProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(null);
  const [requests, setRequests] = useState<RepairRequest[]>([]);

  const [formData, setFormData] = useState({
    repair_request_id: repairRequestId || '',
    customer_name: '',
    customer_email: '',
    equipment_type: '',
    issue_description: '',
    notes: '',
    valid_days: '30'
  });

  const [items, setItems] = useState<QuoteItem[]>([
    { description: '', quantity: 1, unit_price: 0, total: 0 }
  ]);

  useEffect(() => {
    fetchQuotes();
    if (!repairRequestId) {
      fetchRepairRequests();
    }
  }, [repairRequestId]);

  useEffect(() => {
    if (repairRequestId) {
      loadRequestData(repairRequestId);
    }
  }, [repairRequestId]);

  const fetchQuotes = async () => {
    try {
      let query = supabase.from('quotes').select('*').order('created_at', { ascending: false });

      if (repairRequestId) {
        query = query.eq('repair_request_id', repairRequestId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const fetchRepairRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('repair_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching repair requests:', error);
    }
  };

  const loadRequestData = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('repair_requests')
        .select('*')
        .eq('id', requestId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSelectedRequest(data);
        setFormData(prev => ({
          ...prev,
          repair_request_id: requestId,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          equipment_type: data.equipment_type,
          issue_description: data.issue_description || ''
        }));
      }
    } catch (error) {
      console.error('Error loading request:', error);
    }
  };

  const handleRequestSelect = (requestId: string) => {
    loadRequestData(requestId);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total = newItems[index].quantity * newItems[index].unit_price;
    }

    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const vat = subtotal * 0.2;
    const total = subtotal + vat;
    return { subtotal, vat, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { subtotal, vat, total } = calculateTotals();
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + parseInt(formData.valid_days));

      const { data: quoteNumberData } = await supabase.rpc('generate_quote_number');
      const quoteNumber = quoteNumberData;

      const { data, error } = await supabase
        .from('quotes')
        .insert({
          repair_request_id: formData.repair_request_id || null,
          quote_number: quoteNumber,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          equipment_type: formData.equipment_type,
          issue_description: formData.issue_description || null,
          items: items,
          subtotal,
          vat,
          total,
          notes: formData.notes || null,
          valid_until: validUntil.toISOString().split('T')[0],
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      const quoteApiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-quote`;
      await fetch(quoteApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteId: data.id,
          quoteNumber: data.quote_number,
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          equipmentType: data.equipment_type,
          issueDescription: data.issue_description,
          items: items,
          subtotal,
          vat,
          total,
          notes: data.notes,
          validUntil: data.valid_until
        })
      });

      try {
        const notifyApiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-admin`;
        await fetch(notifyApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'quote_sent',
            title: `Quote ${quoteNumber} Sent`,
            message: `Quote sent to ${formData.customer_name} for ${formData.equipment_type} - Total: £${total.toFixed(2)}`,
            metadata: {
              quote_number: quoteNumber,
              customer_name: formData.customer_name,
              customer_email: formData.customer_email,
              total: total.toFixed(2)
            }
          })
        });
      } catch (notifyError) {
        console.error('Admin notification failed:', notifyError);
      }

      setShowCreateForm(false);
      resetForm();
      fetchQuotes();
    } catch (error) {
      console.error('Error creating quote:', error);
      showToast.error('Failed to create quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      repair_request_id: repairRequestId || '',
      customer_name: '',
      customer_email: '',
      equipment_type: '',
      issue_description: '',
      notes: '',
      valid_days: '30'
    });
    setItems([{ description: '', quantity: 1, unit_price: 0, total: 0 }]);
    setSelectedRequest(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      accepted: 'bg-green-100 text-green-700',
      declined: 'bg-red-100 text-red-700',
      expired: 'bg-slate-100 text-slate-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const { subtotal, vat, total } = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Quote Management</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Quote
        </Button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-800">Create New Quote</h3>
              <button onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {!repairRequestId && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Link to Repair Request (Optional)
                  </label>
                  <select
                    value={formData.repair_request_id}
                    onChange={(e) => handleRequestSelect(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select a repair request or create standalone quote</option>
                    {requests.map(req => (
                      <option key={req.id} value={req.id}>
                        {req.customer_name} - {req.equipment_type} ({formatDate(req.created_at)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Customer Name *</label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Customer Email *</label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Equipment Type *</label>
                  <input
                    type="text"
                    value={formData.equipment_type}
                    onChange={(e) => setFormData({ ...formData, equipment_type: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Valid For (Days) *</label>
                  <input
                    type="number"
                    value={formData.valid_days}
                    onChange={(e) => setFormData({ ...formData, valid_days: e.target.value })}
                    required
                    min="1"
                    max="90"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Issue Description</label>
                <textarea
                  value={formData.issue_description}
                  onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-slate-700">Quote Items *</label>
                  <button type="button" onClick={addItem} className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                    + Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          required
                          min="1"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="number"
                          placeholder="Unit Price"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="w-28 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-right">
                        £{item.total.toFixed(2)}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-slate-100 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-medium">£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">VAT (20%):</span>
                    <span className="font-medium">£{vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-orange-600 border-t border-slate-300 pt-2">
                    <span>Total:</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Include warranty info, payment terms, etc."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Creating & Sending...' : 'Create & Send Quote'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {quotes.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <PoundSterling className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No quotes yet. Create your first quote to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Quote #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Equipment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Valid Until</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-medium text-sm">{quote.quote_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-800">{quote.customer_name}</div>
                      <div className="text-xs text-slate-500">{quote.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{quote.equipment_type}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">£{quote.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {quote.valid_until ? formatDate(quote.valid_until) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(quote.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const invoiceUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-invoice?quoteId=${quote.id}`;
                            window.open(invoiceUrl, '_blank');
                          }}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="View Invoice"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this quote?')) {
                              try {
                                const { error } = await supabase
                                  .from('quotes')
                                  .delete()
                                  .eq('id', quote.id);

                                if (error) throw error;
                                showToast('Quote deleted successfully', 'success');
                                fetchQuotes();
                              } catch (error) {
                                console.error('Error deleting quote:', error);
                                showToast('Failed to delete quote', 'error');
                              }
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Quote"
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
    </div>
  );
}
