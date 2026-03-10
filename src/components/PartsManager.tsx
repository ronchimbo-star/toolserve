import { useState, useEffect } from 'react';
import { Plus, Trash2, CreditCard as Edit2, Save, X } from 'lucide-react';
import { Button } from './Button';
import { supabase } from '../lib/supabase';
import { showToast } from './Toast';

interface RepairPart {
  id: string;
  repair_request_id: string;
  part_name: string;
  part_number: string | null;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  supplier: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface PartsManagerProps {
  repairRequestId: string;
  onPartsUpdate?: () => void;
}

export function PartsManager({ repairRequestId, onPartsUpdate }: PartsManagerProps) {
  const [parts, setParts] = useState<RepairPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    part_name: '',
    part_number: '',
    quantity: 1,
    unit_cost: 0,
    supplier: '',
    notes: ''
  });

  useEffect(() => {
    fetchParts();
  }, [repairRequestId]);

  async function fetchParts() {
    try {
      const { data, error } = await supabase
        .from('repair_parts')
        .select('*')
        .eq('repair_request_id', repairRequestId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setParts(data || []);
    } catch (error) {
      console.error('Error fetching parts:', error);
      showToast('Failed to load parts', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!formData.part_name.trim()) {
      showToast('Part name is required', 'error');
      return;
    }

    if (formData.quantity <= 0) {
      showToast('Quantity must be greater than 0', 'error');
      return;
    }

    if (formData.unit_cost < 0) {
      showToast('Unit cost cannot be negative', 'error');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('repair_parts')
          .update({
            part_name: formData.part_name,
            part_number: formData.part_number || null,
            quantity: formData.quantity,
            unit_cost: formData.unit_cost,
            supplier: formData.supplier || null,
            notes: formData.notes || null
          })
          .eq('id', editingId);

        if (error) throw error;
        showToast('Part updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('repair_parts')
          .insert({
            repair_request_id: repairRequestId,
            part_name: formData.part_name,
            part_number: formData.part_number || null,
            quantity: formData.quantity,
            unit_cost: formData.unit_cost,
            supplier: formData.supplier || null,
            notes: formData.notes || null
          });

        if (error) throw error;
        showToast('Part added successfully', 'success');
      }

      resetForm();
      await fetchParts();
      onPartsUpdate?.();
    } catch (error) {
      console.error('Error saving part:', error);
      showToast('Failed to save part', 'error');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this part?')) return;

    try {
      const { error } = await supabase
        .from('repair_parts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Part deleted successfully', 'success');
      await fetchParts();
      onPartsUpdate?.();
    } catch (error) {
      console.error('Error deleting part:', error);
      showToast('Failed to delete part', 'error');
    }
  }

  function handleEdit(part: RepairPart) {
    setEditingId(part.id);
    setFormData({
      part_name: part.part_name,
      part_number: part.part_number || '',
      quantity: part.quantity,
      unit_cost: part.unit_cost,
      supplier: part.supplier || '',
      notes: part.notes || ''
    });
    setIsAdding(true);
  }

  function resetForm() {
    setFormData({
      part_name: '',
      part_number: '',
      quantity: 1,
      unit_cost: 0,
      supplier: '',
      notes: ''
    });
    setEditingId(null);
    setIsAdding(false);
  }

  const totalCost = parts.reduce((sum, part) => sum + parseFloat(part.total_cost.toString()), 0);

  if (loading) {
    return <div className="text-center py-8">Loading parts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Parts Used</h3>
          {parts.length > 0 && (
            <p className="text-sm text-slate-600">
              Total Parts Cost: <span className="font-semibold text-emerald-600">£{totalCost.toFixed(2)}</span>
            </p>
          )}
        </div>
        {!isAdding && (
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Part
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="font-medium text-slate-800 mb-3">
            {editingId ? 'Edit Part' : 'Add New Part'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Part Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.part_name}
                onChange={(e) => setFormData({ ...formData, part_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., Motor Assembly"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Part Number
              </label>
              <input
                type="text"
                value={formData.part_number}
                onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., MT-12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Quantity <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Unit Cost (£) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.unit_cost}
                onChange={(e) => setFormData({ ...formData, unit_cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Supplier
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., Bosch Direct"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Total: £{(formData.quantity * formData.unit_cost).toFixed(2)}
              </label>
              <div className="h-10"></div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows={2}
                placeholder="Additional notes about the part..."
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              {editingId ? 'Update' : 'Add'} Part
            </Button>
            <Button onClick={resetForm} variant="secondary" size="sm">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {parts.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-slate-600">No parts added yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {parts.map((part) => (
            <div
              key={part.id}
              className="bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-slate-800">{part.part_name}</h4>
                    {part.part_number && (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {part.part_number}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                    <span>Qty: {part.quantity}</span>
                    <span>Unit: £{parseFloat(part.unit_cost.toString()).toFixed(2)}</span>
                    <span className="font-medium text-emerald-600">
                      Total: £{parseFloat(part.total_cost.toString()).toFixed(2)}
                    </span>
                    {part.supplier && <span>Supplier: {part.supplier}</span>}
                  </div>
                  {part.notes && (
                    <p className="text-sm text-slate-500 mt-1">{part.notes}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(part)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit part"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(part.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete part"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
