import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, AlertTriangle, Package, Clock, BarChart3, Filter } from 'lucide-react';

interface FaultStats {
  fault_code: string;
  fault_title: string;
  occurrence_count: number;
  avg_repair_time: number;
  difficulty_level: string;
}

interface PartStats {
  part_name: string;
  total_used: number;
  total_cost: number;
  job_count: number;
}

interface CategoryStats {
  category_name: string;
  fault_count: number;
  avg_time: number;
}

export default function FaultAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [topFaults, setTopFaults] = useState<FaultStats[]>([]);
  const [topParts, setTopParts] = useState<PartStats[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [totalDiagnoses, setTotalDiagnoses] = useState(0);
  const [avgRepairTime, setAvgRepairTime] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const daysAgo = parseInt(dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      const { data: jobFaults } = await supabase
        .from('job_fault_codes')
        .select(`
          *,
          fault_codes (code, title, difficulty_level, estimated_time_minutes),
          repair_requests (created_at)
        `)
        .gte('diagnosed_at', cutoffDate.toISOString())
        .eq('confirmed', true);

      if (jobFaults) {
        setTotalDiagnoses(jobFaults.length);

        const faultMap = new Map<string, FaultStats>();
        jobFaults.forEach((jf: any) => {
          const fault = jf.fault_codes;
          if (!fault) return;

          const key = fault.code;
          if (faultMap.has(key)) {
            const existing = faultMap.get(key)!;
            existing.occurrence_count += 1;
            existing.avg_repair_time = ((existing.avg_repair_time * (existing.occurrence_count - 1)) + fault.estimated_time_minutes) / existing.occurrence_count;
          } else {
            faultMap.set(key, {
              fault_code: fault.code,
              fault_title: fault.title,
              occurrence_count: 1,
              avg_repair_time: fault.estimated_time_minutes || 0,
              difficulty_level: fault.difficulty_level,
            });
          }
        });

        const faultArray = Array.from(faultMap.values());
        faultArray.sort((a, b) => b.occurrence_count - a.occurrence_count);
        setTopFaults(faultArray.slice(0, 10));

        const totalTime = faultArray.reduce((sum, f) => sum + (f.avg_repair_time * f.occurrence_count), 0);
        const totalJobs = faultArray.reduce((sum, f) => sum + f.occurrence_count, 0);
        setAvgRepairTime(totalJobs > 0 ? totalTime / totalJobs : 0);
      }

      const { data: parts } = await supabase
        .from('repair_parts')
        .select(`
          *,
          repair_requests!inner (created_at)
        `)
        .gte('repair_requests.created_at', cutoffDate.toISOString());

      if (parts) {
        const partsMap = new Map<string, PartStats>();
        parts.forEach((part: any) => {
          const key = part.part_name;
          if (partsMap.has(key)) {
            const existing = partsMap.get(key)!;
            existing.total_used += part.quantity || 0;
            existing.total_cost += parseFloat(part.total_cost) || 0;
            existing.job_count += 1;
          } else {
            partsMap.set(key, {
              part_name: part.part_name,
              total_used: part.quantity || 0,
              total_cost: parseFloat(part.total_cost) || 0,
              job_count: 1,
            });
          }
        });

        const partsArray = Array.from(partsMap.values());
        partsArray.sort((a, b) => b.total_used - a.total_used);
        setTopParts(partsArray.slice(0, 10));
      }

      const { data: categories } = await supabase
        .from('tool_categories')
        .select(`
          *,
          fault_codes (id, estimated_time_minutes)
        `);

      if (categories) {
        const catStats: CategoryStats[] = categories.map((cat: any) => {
          const faults = cat.fault_codes || [];
          const avgTime = faults.length > 0
            ? faults.reduce((sum: number, f: any) => sum + (f.estimated_time_minutes || 0), 0) / faults.length
            : 0;
          return {
            category_name: cat.name,
            fault_count: faults.length,
            avg_time: avgTime,
          };
        });
        catStats.sort((a, b) => b.fault_count - a.fault_count);
        setCategoryStats(catStats);
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Fault & Parts Analytics</h2>
          <p className="text-slate-600 mt-1">Insights from repair diagnostics and parts usage</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-600" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{totalDiagnoses}</div>
          <div className="text-sm text-slate-600">Total Diagnoses</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{Math.round(avgRepairTime)} min</div>
          <div className="text-sm text-slate-600">Avg Repair Time</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{topFaults.length}</div>
          <div className="text-sm text-slate-600">Unique Fault Types</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Top Faults by Frequency
          </h3>
          <div className="space-y-3">
            {topFaults.map((fault, index) => (
              <div key={fault.fault_code} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 text-xs font-bold rounded">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-semibold text-slate-800">{fault.fault_code}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${getDifficultyColor(fault.difficulty_level)}`}>
                      {fault.difficulty_level}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">{fault.fault_title}</div>
                  <div className="text-xs text-slate-500">Avg repair: {Math.round(fault.avg_repair_time)} min</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-800">{fault.occurrence_count}</div>
                  <div className="text-xs text-slate-500">times</div>
                </div>
              </div>
            ))}
            {topFaults.length === 0 && (
              <div className="text-center py-8 text-slate-600">
                No fault data available for this period
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Most Used Parts
          </h3>
          <div className="space-y-3">
            {topParts.map((part, index) => (
              <div key={part.part_name} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 text-xs font-bold rounded">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{part.part_name}</div>
                  <div className="text-xs text-slate-600">Used in {part.job_count} jobs</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-800">{part.total_used}</div>
                  <div className="text-xs text-slate-500">£{part.total_cost.toFixed(2)}</div>
                </div>
              </div>
            ))}
            {topParts.length === 0 && (
              <div className="text-center py-8 text-slate-600">
                No parts data available for this period
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Faults by Tool Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryStats.map((cat) => (
            <div key={cat.category_name} className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 mb-2">{cat.category_name}</h4>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-800">{cat.fault_count}</div>
                  <div className="text-xs text-slate-600">known faults</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-orange-600">{Math.round(cat.avg_time)}m</div>
                  <div className="text-xs text-slate-600">avg time</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Insights & Recommendations</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          {topFaults.length > 0 && (
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>{topFaults[0].fault_code}</strong> is the most common fault ({topFaults[0].occurrence_count} occurrences).
                Consider creating a dedicated service guide or stocking related parts.
              </span>
            </li>
          )}
          {topParts.length > 0 && topParts[0].total_used > 10 && (
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>{topParts[0].part_name}</strong> is heavily used ({topParts[0].total_used} units).
                Ensure adequate stock levels to avoid delays.
              </span>
            </li>
          )}
          {avgRepairTime > 60 && (
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                Average repair time is {Math.round(avgRepairTime)} minutes.
                Consider creating more detailed service guides for complex repairs to improve efficiency.
              </span>
            </li>
          )}
          {totalDiagnoses === 0 && (
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                No diagnoses recorded in this period. Start using the Diagnostic Assistant to build your fault database.
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
