import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, Package, Clock, DollarSign, Users, MessageSquare, FileText, ArrowUp, ArrowDown } from 'lucide-react';

interface AnalyticsData {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  avgTurnaroundTime: number;
  requestsByStatus: Record<string, number>;
  requestsByService: Record<string, number>;
  recentTrends: {
    thisWeek: number;
    lastWeek: number;
    change: number;
  };
  topEquipmentTypes: Array<{ type: string; count: number }>;
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  async function fetchAnalytics() {
    try {
      setLoading(true);

      const dateFilter = getDateFilter(timeRange);

      const { data: requests, error } = await supabase
        .from('repair_requests')
        .select('*')
        .gte('created_at', dateFilter);

      if (error) throw error;

      if (requests) {
        const requestsByStatus = requests.reduce((acc, req) => {
          acc[req.status] = (acc[req.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const requestsByService = requests.reduce((acc, req) => {
          acc[req.service_type] = (acc[req.service_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const topEquipment = Object.entries(
          requests.reduce((acc, req) => {
            acc[req.equipment_type] = (acc[req.equipment_type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        )
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([type, count]) => ({ type, count }));

        const completed = requests.filter(r => r.status === 'completed');
        const avgTime = completed.length > 0
          ? completed.reduce((sum, r) => {
              const created = new Date(r.created_at).getTime();
              const updated = new Date(r.updated_at).getTime();
              return sum + (updated - created) / (1000 * 60 * 60 * 24);
            }, 0) / completed.length
          : 0;

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const thisWeek = requests.filter(r => new Date(r.created_at) >= weekAgo).length;
        const lastWeek = requests.filter(r =>
          new Date(r.created_at) >= twoWeeksAgo && new Date(r.created_at) < weekAgo
        ).length;
        const change = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;

        setAnalytics({
          totalRequests: requests.length,
          pendingRequests: requests.filter(r => r.status === 'pending').length,
          completedRequests: completed.length,
          avgTurnaroundTime: Math.round(avgTime),
          requestsByStatus,
          requestsByService,
          recentTrends: { thisWeek, lastWeek, change },
          topEquipmentTypes: topEquipment
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  function getDateFilter(range: string): string {
    const now = new Date();
    switch (range) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return '2020-01-01T00:00:00Z';
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No analytics data available</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-blue-500',
    diagnosing: 'bg-yellow-500',
    in_repair: 'bg-orange-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Requests</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{analytics.totalRequests}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {analytics.recentTrends.change >= 0 ? (
              <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className={analytics.recentTrends.change >= 0 ? 'text-green-600' : 'text-red-600'}>
              {Math.abs(analytics.recentTrends.change).toFixed(1)}%
            </span>
            <span className="text-slate-500 ml-1">vs last week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{analytics.pendingRequests}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-slate-500">
              Awaiting action
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{analytics.completedRequests}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${(analytics.completedRequests / analytics.totalRequests) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Avg. Turnaround</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{analytics.avgTurnaroundTime}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500">days</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Status Distribution</h3>
          <div className="space-y-4">
            {Object.entries(analytics.requestsByStatus).map(([status, count]) => {
              const percentage = (count / analytics.totalRequests) * 100;
              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {status.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{count}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`${statusColors[status] || 'bg-slate-500'} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Service Type Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(analytics.requestsByService).map(([service, count]) => {
              const percentage = (count / analytics.totalRequests) * 100;
              return (
                <div key={service}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700 capitalize">{service}</span>
                    <span className="text-sm font-semibold text-slate-800">{count}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Equipment Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {analytics.topEquipmentTypes.map((item, index) => (
            <div key={index} className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600 mb-1">{item.count}</p>
              <p className="text-sm text-slate-600">{item.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
