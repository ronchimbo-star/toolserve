import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Play, Pause, Clock, Calendar, DollarSign, Filter } from 'lucide-react';

interface TimeLog {
  id: string;
  job_id: string;
  technician_id: string;
  activity_type: 'diagnostic' | 'repair' | 'testing' | 'admin' | 'waiting';
  start_time: string;
  end_time: string | null;
  duration_minutes: number;
  notes: string;
  billable: boolean;
  created_at: string;
}

interface Job {
  id: string;
  job_number: string;
  customer_name: string;
  equipment_type: string;
  status: string;
}

interface TimeTrackerProps {
  jobId?: string;
  compact?: boolean;
}

export default function TimeTracker({ jobId, compact = false }: TimeTrackerProps) {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTimer, setActiveTimer] = useState<TimeLog | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    job_id: jobId || '',
    activity_type: 'repair' as TimeLog['activity_type'],
    notes: '',
    billable: true,
  });

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [jobId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const query = supabase
        .from('time_logs')
        .select('*')
        .eq('technician_id', user.id)
        .order('start_time', { ascending: false });

      if (jobId) {
        query.eq('job_id', jobId);
      }

      const [logsRes, jobsRes] = await Promise.all([
        query,
        supabase.from('repair_requests').select('id, job_number, customer_name, equipment_type, status'),
      ]);

      if (logsRes.data) {
        setTimeLogs(logsRes.data);
        const active = logsRes.data.find(log => log.end_time === null);
        if (active) setActiveTimer(active);
      }
      if (jobsRes.data) setJobs(jobsRes.data);
    } catch (error) {
      console.error('Error fetching time logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = async () => {
    if (!formData.job_id) {
      alert('Please select a job');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('time_logs')
        .insert([{
          job_id: formData.job_id,
          technician_id: user.id,
          activity_type: formData.activity_type,
          notes: formData.notes,
          billable: formData.billable,
          start_time: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) setActiveTimer(data);
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error starting timer:', error);
      alert('Failed to start timer');
    }
  };

  const stopTimer = async () => {
    if (!activeTimer) return;

    try {
      const { error } = await supabase
        .from('time_logs')
        .update({ end_time: new Date().toISOString() })
        .eq('id', activeTimer.id);

      if (error) throw error;
      setActiveTimer(null);
      fetchData();
    } catch (error) {
      console.error('Error stopping timer:', error);
      alert('Failed to stop timer');
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getElapsedTime = () => {
    if (!activeTimer) return '0h 0m';
    const start = new Date(activeTimer.start_time);
    const elapsed = (currentTime.getTime() - start.getTime()) / 1000 / 60;
    return formatDuration(elapsed);
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'diagnostic': return 'bg-blue-100 text-blue-700';
      case 'repair': return 'bg-green-100 text-green-700';
      case 'testing': return 'bg-purple-100 text-purple-700';
      case 'admin': return 'bg-slate-100 text-slate-700';
      case 'waiting': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const totalBillableTime = timeLogs
    .filter(log => log.billable && log.end_time)
    .reduce((sum, log) => sum + log.duration_minutes, 0);

  const totalNonBillableTime = timeLogs
    .filter(log => !log.billable && log.end_time)
    .reduce((sum, log) => sum + log.duration_minutes, 0);

  if (loading) {
    return <div className="p-6 text-center">Loading time tracker...</div>;
  }

  if (compact) {
    return (
      <div className="space-y-4">
        {activeTimer ? (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold text-slate-800">Timer Running</span>
              </div>
              <button
                onClick={stopTimer}
                className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Pause className="w-4 h-4" />
                Stop
              </button>
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{getElapsedTime()}</div>
            <div className="text-sm text-slate-600">
              <span className={`px-2 py-0.5 rounded text-xs ${getActivityColor(activeTimer.activity_type)}`}>
                {activeTimer.activity_type}
              </span>
              {activeTimer.notes && <span className="ml-2">{activeTimer.notes}</span>}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Play className="w-5 h-5" />
            Start Timer
          </button>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Start Time Tracking</h3>
              <div className="space-y-4">
                {!jobId && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Job *
                    </label>
                    <select
                      required
                      value={formData.job_id}
                      onChange={(e) => setFormData({ ...formData, job_id: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select a job</option>
                      {jobs.filter(j => j.status !== 'completed').map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.job_number} - {job.customer_name} ({job.equipment_type})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Activity Type
                  </label>
                  <select
                    value={formData.activity_type}
                    onChange={(e) => setFormData({ ...formData, activity_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="diagnostic">Diagnostic</option>
                    <option value="repair">Repair</option>
                    <option value="testing">Testing</option>
                    <option value="admin">Admin</option>
                    <option value="waiting">Waiting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="billable"
                    checked={formData.billable}
                    onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="billable" className="text-sm text-slate-700">
                    Billable time
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={startTimer}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Start Timer
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold text-slate-800">Recent Time Logs</h4>
          {timeLogs.slice(0, 5).map((log) => {
            const job = jobs.find(j => j.id === log.job_id);
            return (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-slate-200">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">
                    {job?.job_number || 'Unknown Job'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className={`px-2 py-0.5 rounded ${getActivityColor(log.activity_type)}`}>
                      {log.activity_type}
                    </span>
                    <span>{new Date(log.start_time).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-800">
                    {log.end_time ? formatDuration(log.duration_minutes) : 'Running...'}
                  </div>
                  {log.billable && (
                    <div className="text-xs text-green-600">Billable</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Time Tracking</h2>
          <p className="text-slate-600 mt-1">Track time spent on repairs and jobs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{formatDuration(totalBillableTime + totalNonBillableTime)}</div>
          <div className="text-sm text-slate-600">Total Time Logged</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{formatDuration(totalBillableTime)}</div>
          <div className="text-sm text-slate-600">Billable Time</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{timeLogs.filter(l => l.end_time).length}</div>
          <div className="text-sm text-slate-600">Completed Sessions</div>
        </div>
      </div>

      {activeTimer ? (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xl font-semibold text-slate-800">Timer Running</span>
            </div>
            <button
              onClick={stopTimer}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Pause className="w-5 h-5" />
              Stop Timer
            </button>
          </div>
          <div className="text-4xl font-bold text-slate-800 mb-2">{getElapsedTime()}</div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded ${getActivityColor(activeTimer.activity_type)}`}>
              {activeTimer.activity_type}
            </span>
            {activeTimer.notes && <span className="text-slate-700">{activeTimer.notes}</span>}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-lg font-medium"
        >
          <Play className="w-6 h-6" />
          Start New Timer
        </button>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Start Time Tracking</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Job *
                </label>
                <select
                  required
                  value={formData.job_id}
                  onChange={(e) => setFormData({ ...formData, job_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select a job</option>
                  {jobs.filter(j => j.status !== 'completed').map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.job_number} - {job.customer_name} ({job.equipment_type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Activity Type
                </label>
                <select
                  value={formData.activity_type}
                  onChange={(e) => setFormData({ ...formData, activity_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="diagnostic">Diagnostic</option>
                  <option value="repair">Repair</option>
                  <option value="testing">Testing</option>
                  <option value="admin">Admin</option>
                  <option value="waiting">Waiting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="billable-full"
                  checked={formData.billable}
                  onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="billable-full" className="text-sm text-slate-700">
                  Billable time
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={startTimer}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Start Timer
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Time Log History</h3>
        <div className="space-y-3">
          {timeLogs.map((log) => {
            const job = jobs.find(j => j.id === log.job_id);
            return (
              <div key={log.id} className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0">
                <div className="flex-1">
                  <div className="font-medium text-slate-800 mb-1">
                    {job?.job_number || 'Unknown Job'} - {job?.customer_name}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className={`px-2 py-1 rounded text-xs ${getActivityColor(log.activity_type)}`}>
                      {log.activity_type}
                    </span>
                    <span>{new Date(log.start_time).toLocaleDateString()} {new Date(log.start_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                    {log.billable && <span className="text-green-600 font-medium">Billable</span>}
                  </div>
                  {log.notes && <div className="text-sm text-slate-600 mt-1">{log.notes}</div>}
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-semibold text-slate-800">
                    {log.end_time ? formatDuration(log.duration_minutes) : (
                      <span className="text-green-600">Running...</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {timeLogs.length === 0 && (
            <div className="text-center py-8 text-slate-600">
              No time logs yet. Start a timer to begin tracking.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
