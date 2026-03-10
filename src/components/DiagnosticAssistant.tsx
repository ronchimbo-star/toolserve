import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, AlertCircle, CheckCircle, Wrench, Book, TrendingUp } from 'lucide-react';

interface FaultCode {
  id: string;
  code: string;
  title: string;
  description: string;
  common_symptoms: string;
  common_causes: string;
  common_fixes: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  estimated_time_minutes: number;
  frequency_count: number;
}

interface ServiceGuide {
  id: string;
  title: string;
  difficulty_level: string;
  estimated_time_minutes: number;
}

interface DiagnosticResult {
  fault: FaultCode;
  matchScore: number;
  guides: ServiceGuide[];
}

export default function DiagnosticAssistant() {
  const [symptoms, setSymptoms] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('repair_requests')
      .select('id, job_number, customer_name, equipment_type, equipment_make, equipment_model, status')
      .in('status', ['received', 'diagnosing', 'in_repair'])
      .order('created_at', { ascending: false });
    if (data) setJobs(data);
  };

  const handleSearch = async () => {
    if (!symptoms.trim()) {
      alert('Please describe the symptoms');
      return;
    }

    setSearching(true);
    try {
      const { data: faultCodes } = await supabase
        .from('fault_codes')
        .select('*')
        .order('frequency_count', { ascending: false });

      if (!faultCodes) {
        setResults([]);
        return;
      }

      const searchTerms = symptoms.toLowerCase().split(' ').filter(t => t.length > 2);
      const makeModel = `${make} ${model}`.toLowerCase();

      const scoredResults: DiagnosticResult[] = [];

      for (const fault of faultCodes) {
        let score = 0;
        const faultText = `${fault.title} ${fault.description} ${fault.common_symptoms} ${fault.common_causes}`.toLowerCase();

        searchTerms.forEach(term => {
          if (faultText.includes(term)) {
            score += 10;
          }
          if (fault.title.toLowerCase().includes(term)) {
            score += 20;
          }
          if (fault.common_symptoms.toLowerCase().includes(term)) {
            score += 15;
          }
        });

        if (fault.frequency_count > 0) {
          score += fault.frequency_count * 2;
        }

        if (score > 0) {
          const { data: guides } = await supabase
            .from('service_guides')
            .select('id, title, difficulty_level, estimated_time_minutes')
            .or(`tool_model_id.is.null,tags.cs.{${fault.code.toLowerCase()}}`)
            .limit(3);

          scoredResults.push({
            fault,
            matchScore: score,
            guides: guides || [],
          });
        }
      }

      scoredResults.sort((a, b) => b.matchScore - a.matchScore);
      setResults(scoredResults.slice(0, 5));
    } catch (error) {
      console.error('Error searching faults:', error);
      alert('Failed to search faults');
    } finally {
      setSearching(false);
    }
  };

  const logFaultToJob = async (faultCodeId: string) => {
    if (!selectedJobId) {
      alert('Please select a job to log this fault to');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('job_fault_codes').insert([{
        job_id: selectedJobId,
        fault_code_id: faultCodeId,
        confirmed: false,
        diagnosed_by: user.id,
      }]);

      if (error) throw error;
      alert('Fault logged to job successfully');
    } catch (error) {
      console.error('Error logging fault:', error);
      alert('Failed to log fault to job');
    }
  };

  const confirmFault = async (faultCodeId: string) => {
    if (!selectedJobId) {
      alert('Please select a job first');
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('job_fault_codes')
        .select('id')
        .eq('job_id', selectedJobId)
        .eq('fault_code_id', faultCodeId)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('job_fault_codes')
          .update({ confirmed: true })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('job_fault_codes').insert([{
          job_id: selectedJobId,
          fault_code_id: faultCodeId,
          confirmed: true,
          diagnosed_by: user.id,
        }]);
        if (error) throw error;
      }

      await supabase
        .from('repair_requests')
        .update({ status: 'diagnosing' })
        .eq('id', selectedJobId);

      alert('Fault confirmed and logged');
    } catch (error) {
      console.error('Error confirming fault:', error);
      alert('Failed to confirm fault');
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">AI Diagnostic Assistant</h2>
        <p className="text-slate-600 mt-1">Describe symptoms to find probable faults and solutions</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Link to Job (Optional)
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="">No job selected</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.job_number} - {job.customer_name} ({job.equipment_type})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Make (Optional)
              </label>
              <input
                type="text"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g., Makita, Bosch, DeWalt"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Model (Optional)
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., DHR202Z, GBH 2-28"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Describe the Symptoms *
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., Tool does not turn on, humming sound, burning smell, no power, motor stops..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={searching}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            <Search className="w-5 h-5" />
            {searching ? 'Analyzing...' : 'Find Probable Faults'}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800">Diagnostic Results</h3>
          <p className="text-sm text-slate-600">Results are ranked by match confidence and historical frequency</p>

          {results.map((result, index) => (
            <div key={result.fault.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 font-bold rounded-full flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-slate-800 text-white text-sm font-mono rounded">
                        {result.fault.code}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(result.fault.difficulty_level)}`}>
                        {result.fault.difficulty_level}
                      </span>
                      {result.fault.frequency_count > 0 && (
                        <span className="flex items-center gap-1 text-xs text-slate-600">
                          <TrendingUp className="w-3 h-3" />
                          {result.fault.frequency_count}x seen
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">{result.fault.title}</h4>
                    {result.fault.description && (
                      <p className="text-slate-600 mb-3">{result.fault.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => logFaultToJob(result.fault.id)}
                    disabled={!selectedJobId}
                    className="px-3 py-1 text-sm border border-orange-600 text-orange-600 rounded hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Log to Job
                  </button>
                  <button
                    onClick={() => confirmFault(result.fault.id)}
                    disabled={!selectedJobId}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Fault
                  </button>
                </div>
              </div>

              {result.fault.common_symptoms && (
                <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <h5 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Symptoms
                  </h5>
                  <p className="text-sm text-slate-700">{result.fault.common_symptoms}</p>
                </div>
              )}

              {result.fault.common_causes && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <h5 className="text-sm font-semibold text-slate-700 mb-1">Causes</h5>
                  <p className="text-sm text-slate-700">{result.fault.common_causes}</p>
                </div>
              )}

              {result.fault.common_fixes && (
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded">
                  <h5 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Fixes
                  </h5>
                  <p className="text-sm text-slate-700">{result.fault.common_fixes}</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-slate-600 pt-2 border-t border-slate-200">
                <Wrench className="w-4 h-4" />
                <span>Estimated repair time: {result.fault.estimated_time_minutes} minutes</span>
              </div>

              {result.guides.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h5 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                    <Book className="w-4 h-4" />
                    Related Service Guides
                  </h5>
                  <div className="space-y-2">
                    {result.guides.map((guide) => (
                      <div key={guide.id} className="flex items-center justify-between text-sm">
                        <span className="text-orange-600 hover:text-orange-700 cursor-pointer">
                          {guide.title}
                        </span>
                        <span className="text-slate-500">{guide.estimated_time_minutes}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!searching && results.length === 0 && symptoms && (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600">No matching faults found. Try describing the symptoms differently or check the fault codes database.</p>
        </div>
      )}
    </div>
  );
}
