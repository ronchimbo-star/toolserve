import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, FileText, Wrench, Eye, Trash2, Bell, X, PoundSterling, BarChart3, Download, Users, Settings as SettingsIcon, Shield, HelpCircle, Image as ImageIcon, Search, Filter, CheckSquare, Square, AlertCircle, Book, Clock, Activity, TrendingUp } from 'lucide-react';
import { Button } from '../components/Button';
import { QuoteManager } from '../components/QuoteManager';
import { TestimonialsManager } from '../components/TestimonialsManager';
import { PolicyPagesManager } from '../components/PolicyPagesManager';
import { SettingsManager } from '../components/SettingsManager';
import { FAQManager } from '../components/FAQManager';
import { MediaLibrary } from '../components/MediaLibrary';
import { BlogManager } from '../components/BlogManager';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import FaultCodesManager from '../components/FaultCodesManager';
import ServiceGuidesWiki from '../components/ServiceGuidesWiki';
import TimeTracker from '../components/TimeTracker';
import DiagnosticAssistant from '../components/DiagnosticAssistant';
import FaultAnalyticsDashboard from '../components/FaultAnalyticsDashboard';
import { supabase } from '../lib/supabase';
import { exportToCSV, exportAnalyticsReport } from '../utils/exportData';
import type { Database } from '../types/database';

type RepairRequest = Database['public']['Tables']['repair_requests']['Row'];
type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type AdminNotification = Database['public']['Tables']['admin_notifications']['Row'];
type Technician = Database['public']['Tables']['technicians']['Row'];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'requests' | 'quotes' | 'blog' | 'analytics' | 'testimonials' | 'policies' | 'faqs' | 'media' | 'settings' | 'fault-codes' | 'service-guides' | 'time-tracking' | 'diagnostic' | 'fault-analytics'>('requests');
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<string>('');
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
      fetchTechnicians();
    } else if (activeTab === 'blog') {
      fetchBlogPosts();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const bypassToken = localStorage.getItem('admin_bypass_token');

      if (bypassToken) {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'get_repair_requests',
            bypass_token: bypassToken
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch repair requests');
        }

        const result = await response.json();
        setRequests(result.data || []);
      } else {
        const { data, error } = await supabase
          .from('repair_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setTechnicians(data || []);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const bypassToken = localStorage.getItem('admin_bypass_token');

      if (bypassToken) {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'get_blog_posts',
            bypass_token: bypassToken
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const result = await response.json();
        setBlogPosts(result.data || []);
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBlogPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const bypassToken = localStorage.getItem('admin_bypass_token');

      if (bypassToken) {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'get_notifications',
            bypass_token: bypassToken
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const result = await response.json();
        setNotifications(result.data || []);
        setUnreadCount((result.data || []).filter(n => !n.is_read).length);
      } else {
        const { data, error } = await supabase
          .from('admin_notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        setNotifications(data || []);
        setUnreadCount((data || []).filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const bypassToken = localStorage.getItem('admin_bypass_token');

      if (bypassToken) {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data`;
        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'mark_notification_read',
            bypass_token: bypassToken,
            notification_id: id
          })
        });
      } else {
        const { error } = await supabase
          .from('admin_notifications')
          .update({ is_read: true })
          .eq('id', id);

        if (error) throw error;
      }
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const bypassToken = localStorage.getItem('admin_bypass_token');

      if (bypassToken) {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data`;
        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'mark_all_notifications_read',
            bypass_token: bypassToken
          })
        });
      } else {
        const { error } = await supabase
          .from('admin_notifications')
          .update({ is_read: true })
          .eq('is_read', false);

        if (error) throw error;
      }
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const bypassToken = localStorage.getItem('admin_bypass_token');

      if (bypassToken) {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data`;
        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'update_request_status',
            bypass_token: bypassToken,
            request_id: id,
            status
          })
        });
      } else {
        const { error } = await supabase
          .from('repair_requests')
          .update({ status })
          .eq('id', id);

        if (error) throw error;
      }
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const toggleSelectRequest = (id: string) => {
    setSelectedRequests(prev =>
      prev.includes(id) ? prev.filter(reqId => reqId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map(req => req.id));
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedRequests.length === 0) return;

    try {
      const bypassToken = localStorage.getItem('admin_bypass_token');

      if (bypassToken) {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data`;
        for (const id of selectedRequests) {
          await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              action: 'update_request_status',
              bypass_token: bypassToken,
              request_id: id,
              status: bulkStatus
            })
          });
        }
      } else {
        for (const id of selectedRequests) {
          await supabase
            .from('repair_requests')
            .update({ status: bulkStatus })
            .eq('id', id);
        }
      }

      setSelectedRequests([]);
      setBulkStatus('');
      fetchRequests();
    } catch (error) {
      console.error('Error updating requests:', error);
    }
  };

  const assignTechnician = async (requestId: string, technicianId: string) => {
    try {
      const bypassToken = localStorage.getItem('admin_bypass_token');

      if (bypassToken) {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data`;
        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'assign_technician',
            bypass_token: bypassToken,
            request_id: requestId,
            technician_id: technicianId || null
          })
        });
      } else {
        await supabase
          .from('repair_requests')
          .update({ assigned_technician_id: technicianId || null })
          .eq('id', requestId);
      }

      fetchRequests();
    } catch (error) {
      console.error('Error assigning technician:', error);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' ||
      request.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.equipment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.reference_number && request.reference_number.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const bypassToken = localStorage.getItem('admin_bypass_token');

      if (bypassToken) {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-data`;
        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'update_blog_status',
            bypass_token: bypassToken,
            post_id: id,
            published: !currentStatus,
            published_at: !currentStatus ? new Date().toISOString() : null
          })
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            published: !currentStatus,
            published_at: !currentStatus ? new Date().toISOString() : null
          })
          .eq('id', id);

        if (error) throw error;
      }
      fetchBlogPosts();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleViewDetails = (request: RepairRequest) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: 'bg-blue-100 text-blue-700',
      diagnosing: 'bg-yellow-100 text-yellow-700',
      in_repair: 'bg-orange-100 text-orange-700',
      completed: 'bg-emerald-100 text-emerald-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const menuItems = [
    { id: 'requests', label: 'Repair Requests', icon: Wrench, count: requests.length },
    { id: 'quotes', label: 'Quotes', icon: PoundSterling },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'testimonials', label: 'Testimonials', icon: Users },
    { id: 'policies', label: 'Policies', icon: Shield },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'diagnostic', label: 'Diagnostic', icon: Activity },
    { id: 'fault-codes', label: 'Fault Codes', icon: AlertCircle },
    { id: 'service-guides', label: 'Service Guides', icon: Book },
    { id: 'time-tracking', label: 'Time Tracking', icon: Clock },
    { id: 'fault-analytics', label: 'Fault Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-gradient-to-br from-slate-800 to-slate-900 text-white fixed h-full overflow-y-auto shadow-2xl z-50">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3 mb-2">
            <img
              src="/toolserve-logo-white.svg"
              alt="ToolServe"
              className="h-10 w-auto"
            />
          </div>
          <p className="text-sm text-slate-400 mt-2">Admin Dashboard</p>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.count !== undefined && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  activeTab === item.id ? 'bg-orange-700' : 'bg-slate-700'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="w-full mb-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Site
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage and monitor your ToolServe platform
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-slate-700" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-slate-200 max-h-[600px] overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="font-bold text-slate-800">Notifications</h3>
                      <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                          <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => !notification.is_read && markAsRead(notification.id)}
                            className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                              !notification.is_read ? 'bg-orange-50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-semibold text-slate-800 text-sm">
                                {notification.title}
                              </h4>
                              {!notification.is_read && (
                                <span className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                            <p className="text-xs text-slate-400">
                              {formatDate(notification.created_at)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeTab === 'requests' && (
            <div>
              <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by customer, email, equipment, or reference number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="received">Received</option>
                        <option value="diagnosing">Diagnosing</option>
                        <option value="in_repair">In Repair</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(filteredRequests, `repair-requests-${new Date().toISOString().split('T')[0]}.csv`)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                {selectedRequests.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">
                        {selectedRequests.length} request{selectedRequests.length !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={bulkStatus}
                        onChange={(e) => setBulkStatus(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                      >
                        <option value="">Change Status...</option>
                        <option value="pending">Pending</option>
                        <option value="received">Received</option>
                        <option value="diagnosing">Diagnosing</option>
                        <option value="in_repair">In Repair</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <Button
                        size="sm"
                        onClick={handleBulkStatusUpdate}
                        disabled={!bulkStatus}
                      >
                        Update Selected
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequests([])}
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-600">
                      {requests.length === 0 ? 'No repair requests yet' : 'No requests match your search'}
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <button
                            onClick={toggleSelectAll}
                            className="text-slate-600 hover:text-orange-600 transition-colors"
                          >
                            {selectedRequests.length === filteredRequests.length ? (
                              <CheckSquare className="w-5 h-5" />
                            ) : (
                              <Square className="w-5 h-5" />
                            )}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Equipment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Service Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Technician
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4">
                            <button
                              onClick={() => toggleSelectRequest(request.id)}
                              className="text-slate-600 hover:text-orange-600 transition-colors"
                            >
                              {selectedRequests.includes(request.id) ? (
                                <CheckSquare className="w-5 h-5" />
                              ) : (
                                <Square className="w-5 h-5" />
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-slate-900">{request.customer_name}</div>
                              <div className="text-sm text-slate-500">{request.customer_email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">{request.equipment_type}</div>
                            <div className="text-sm text-slate-500">
                              {request.equipment_make} {request.equipment_model}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="capitalize text-sm text-slate-700">{request.service_type}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={request.status}
                              onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                              className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(request.status)}`}
                            >
                              <option value="received">Received</option>
                              <option value="diagnosing">Diagnosing</option>
                              <option value="in_repair">In Repair</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={request.assigned_technician_id || ''}
                              onChange={(e) => assignTechnician(request.id, e.target.value)}
                              className="text-sm px-3 py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                              <option value="">Unassigned</option>
                              {technicians.filter(t => t.status === 'active').map((tech) => (
                                <option key={tech.id} value={tech.id}>
                                  {tech.name} {tech.specialization ? `(${tech.specialization})` : ''}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {formatDate(request.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="text-orange-600 hover:text-orange-700 font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            </div>
          )}

          {activeTab === 'blog' && <BlogManager />}
          {activeTab === 'quotes' && <QuoteManager />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'testimonials' && <TestimonialsManager />}
          {activeTab === 'policies' && <PolicyPagesManager />}
          {activeTab === 'faqs' && <FAQManager />}
          {activeTab === 'media' && <MediaLibrary />}
          {activeTab === 'settings' && <SettingsManager />}
          {activeTab === 'diagnostic' && <DiagnosticAssistant />}
          {activeTab === 'fault-codes' && <FaultCodesManager />}
          {activeTab === 'service-guides' && <ServiceGuidesWiki />}
          {activeTab === 'time-tracking' && <TimeTracker />}
          {activeTab === 'fault-analytics' && <FaultAnalyticsDashboard />}
        </main>
      </div>

      {showRequestDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Repair Request Details</h2>
              <button
                onClick={() => setShowRequestDetails(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Name</label>
                      <p className="text-slate-900">{selectedRequest.customer_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Email</label>
                      <p className="text-slate-900">{selectedRequest.customer_email}</p>
                    </div>
                    {selectedRequest.customer_phone && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Phone</label>
                        <p className="text-slate-900">{selectedRequest.customer_phone}</p>
                      </div>
                    )}
                    {selectedRequest.customer_address && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Address</label>
                        <p className="text-slate-900">{selectedRequest.customer_address}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-slate-600">Preferred Contact</label>
                      <p className="text-slate-900 capitalize">{selectedRequest.preferred_contact_method}</p>
                    </div>
                    {selectedRequest.preferred_contact_time && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Preferred Time</label>
                        <p className="text-slate-900">{selectedRequest.preferred_contact_time}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Equipment Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Equipment Type</label>
                      <p className="text-slate-900">{selectedRequest.equipment_type}</p>
                    </div>
                    {selectedRequest.equipment_make && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Make</label>
                        <p className="text-slate-900">{selectedRequest.equipment_make}</p>
                      </div>
                    )}
                    {selectedRequest.equipment_model && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Model</label>
                        <p className="text-slate-900">{selectedRequest.equipment_model}</p>
                      </div>
                    )}
                    {selectedRequest.serial_number && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Serial Number</label>
                        <p className="text-slate-900 font-mono text-sm">{selectedRequest.serial_number}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-slate-600">Service Type</label>
                      <p className="text-slate-900 capitalize">{selectedRequest.service_type}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Issue Description</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-900 whitespace-pre-wrap">{selectedRequest.issue_description}</p>
                </div>
              </div>

              {selectedRequest.photo_urls && Array.isArray(selectedRequest.photo_urls) && (selectedRequest.photo_urls as string[]).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(selectedRequest.photo_urls as string[]).map((url: string, index: number) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={url}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Status & Assignment</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600 mb-2 block">Status</label>
                      <select
                        value={selectedRequest.status}
                        onChange={(e) => {
                          updateRequestStatus(selectedRequest.id, e.target.value);
                          setSelectedRequest({ ...selectedRequest, status: e.target.value as any });
                        }}
                        className={`w-full px-3 py-2 rounded-lg ${getStatusColor(selectedRequest.status)}`}
                      >
                        <option value="received">Received</option>
                        <option value="diagnosing">Diagnosing</option>
                        <option value="in_repair">In Repair</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    {selectedRequest.assigned_to && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Assigned To</label>
                        <p className="text-slate-900">{selectedRequest.assigned_to}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Timestamps</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Created</label>
                      <p className="text-slate-900">{formatDate(selectedRequest.created_at)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Last Updated</label>
                      <p className="text-slate-900">{formatDate(selectedRequest.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedRequest.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Internal Notes</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-slate-900 whitespace-pre-wrap">{selectedRequest.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRequestDetails(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  window.location.href = `mailto:${selectedRequest.customer_email}?subject=Re: Your Repair Request - ${selectedRequest.equipment_type}`;
                }}
              >
                Send Email
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
