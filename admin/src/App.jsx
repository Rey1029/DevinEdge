import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Calendar as CalendarIcon, 
  Users, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus, 
  Trash2, 
  MessageSquare, 
  ShieldAlert, 
  LogOut, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:5000/api`;

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('admin-token') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('admin-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('crm'); // 'crm' | 'projects' | 'calendar'
  const [inquiries, setInquiries] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [serverOnline, setServerOnline] = useState(true);
  const [loading, setLoading] = useState(false);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Calendar States
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState('call');
  const [newEventDate, setNewEventDate] = useState('');

  // Fetch Data
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Fetch Inquiries
      const inqRes = await fetch(`${API_BASE}/inquiries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!inqRes.ok) throw new Error('Failed to fetch inquiries');
      const inqData = await inqRes.json();
      setInquiries(inqData);

      // Fetch Events
      const evRes = await fetch(`${API_BASE}/events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!evRes.ok) throw new Error('Failed to fetch calendar events');
      const evData = await evRes.json();
      setEvents(evData);

      setServerOnline(true);
    } catch (err) {
      console.error('Data fetch error:', err.message);
      setServerOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
      // Poll every 10 seconds to keep fresh
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  // Auth Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role !== 'admin') {
        throw new Error('Access denied: You are not authorized as admin');
      }

      localStorage.setItem('admin-token', data.token);
      localStorage.setItem('admin-user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setServerOnline(true);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    setToken('');
    setUser(null);
  };

  // Inquiry CRM Operations
  const handleUpdateStatus = async (inqId, updates) => {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${inqId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      // Update locally
      setInquiries(prev => prev.map(i => i.id === inqId ? data.inquiry : i));
      if (selectedInquiry && selectedInquiry.id === inqId) {
        setSelectedInquiry(data.inquiry);
      }
    } catch (err) {
      alert(`Update error: ${err.message}`);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedInquiry) return;
    try {
      const res = await fetch(`${API_BASE}/inquiries/${selectedInquiry.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newNoteText })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add note');

      // Update locally
      setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? { ...i, notes: data.notes } : i));
      setSelectedInquiry(prev => ({ ...prev, notes: data.notes }));
      setNewNoteText('');
    } catch (err) {
      alert(`Note error: ${err.message}`);
    }
  };

  // Calendar Operations
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;
    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newEventTitle,
          type: newEventType,
          date: newEventDate
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');

      setEvents(prev => [...prev, data.event]);
      setNewEventTitle('');
      setNewEventDate('');
    } catch (err) {
      alert(`Event creation error: ${err.message}`);
    }
  };

  const handleDeleteEvent = async (evId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`${API_BASE}/events/${evId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete event');

      setEvents(prev => prev.filter(e => e.id !== evId));
    } catch (err) {
      alert(`Event deletion error: ${err.message}`);
    }
  };

  // Helper Stats Calculation
  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    active: inquiries.filter(i => ['discovery', 'design', 'dev'].includes(i.status)).length,
    live: inquiries.filter(i => i.status === 'live').length,
    revenue: inquiries
      .filter(i => i.paymentStatus === 'fully_paid')
      .reduce((sum, i) => {
        // extract estimate numeric
        const match = i.budget.match(/\d+/);
        return sum + (match ? parseInt(match[0], 10) * 1000 : 0);
      }, 0)
  };

  // RENDER LOGIN SCREEN IF NOT AUTHENTICATED
  if (!token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg-deep p-6 relative overflow-hidden select-none">
        {/* Glowing Background Vectors */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-brand-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-brand-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="glass-panel border border-brand-border/60 max-w-md w-full p-8 md:p-10 rounded-xl shadow-2xl glow-gold relative z-10">
          <div className="flex flex-col items-center gap-4 mb-8 text-center">
            {/* Logo assembly mark */}
            <div className="w-12 h-12 flex items-center justify-center border border-brand-accent-gold/40 rounded-lg bg-brand-accent-gold/5 mb-2">
              <span className="text-brand-accent-gold font-bold text-xl">Ω</span>
            </div>
            <h1 className="font-display font-semibold text-2xl tracking-widest text-brand-text-primary uppercase">
              DEVIN<span className="text-brand-accent-gold">EDGE</span> ADMIN
            </h1>
            <p className="text-brand-text-secondary text-xs uppercase tracking-wider">
              Control Center Portal Authentication
            </p>
          </div>

          {loginError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded flex items-center gap-2">
              <ShieldAlert size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5 text-left">
            <div>
              <label className="text-[10px] text-brand-text-secondary/50 tracking-widest uppercase block mb-2 font-bold">Admin Email</label>
              <input 
                type="email"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="admin@devinedge.com"
                className="w-full bg-[#07070a] border border-brand-border/80 px-4 py-3 rounded text-sm text-brand-text-primary focus:outline-none focus:border-brand-accent-gold focus:ring-1 focus:ring-brand-accent-gold/20 transition-all duration-300"
              />
            </div>

            <div>
              <label className="text-[10px] text-brand-text-secondary/50 tracking-widest uppercase block mb-2 font-bold">Secret Key Code</label>
              <input 
                type="password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#07070a] border border-brand-border/80 px-4 py-3 rounded text-sm text-brand-text-primary focus:outline-none focus:border-brand-accent-gold focus:ring-1 focus:ring-brand-accent-gold/20 transition-all duration-300"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-brand-accent-gold text-brand-bg-deep font-bold text-xs uppercase tracking-widest hover:bg-brand-accent-gold-light transition-all duration-300 rounded shadow-lg shadow-brand-accent-gold/15 mt-3 cursor-pointer"
            >
              Secure Login
            </button>
          </form>

          <div className="mt-8 border-t border-brand-border/40 pt-4 text-center">
            <p className="text-[10px] text-brand-text-secondary/40 tracking-wider flex items-center justify-center gap-1.5 uppercase font-medium">
              <Info size={11} className="text-brand-accent-gold" />
              Credentials Hint: admin@devinedge.com / admin
            </p>
          </div>
        </div>
      </div>
    );
  }

  // CORE ADMIN DASHBOARD INTERFACE
  return (
    <div className="min-h-screen bg-brand-bg-deep flex text-left relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent-purple/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-accent-gold/2 rounded-full blur-[150px] pointer-events-none" />

      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-brand-border/60 bg-[#07070b]/80 backdrop-blur-xl flex flex-col justify-between relative z-10 shrink-0">
        <div>
          {/* Logo assembly header */}
          <div className="h-20 border-b border-brand-border/40 px-6 flex items-center gap-3">
            <div className="w-7 h-7 flex items-center justify-center border border-brand-accent-gold/40 rounded bg-brand-accent-gold/5">
              <span className="text-brand-accent-gold font-bold text-sm">Ω</span>
            </div>
            <span className="font-display font-semibold text-lg tracking-wider text-brand-text-primary">
              DEVIN<span className="text-brand-accent-gold">EDGE</span>
            </span>
            <span className="text-[9px] bg-brand-accent-purple/20 text-brand-accent-cyan px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1">
            <button
              onClick={() => { setActiveTab('crm'); setSelectedInquiry(null); }}
              className={`w-full py-3.5 px-4 rounded text-xs uppercase tracking-widest font-semibold flex items-center gap-3 transition-all duration-300 cursor-pointer ${
                activeTab === 'crm'
                  ? 'bg-brand-accent-gold text-brand-bg-deep shadow shadow-brand-accent-gold/15'
                  : 'text-brand-text-secondary hover:bg-brand-border/40 hover:text-brand-text-primary'
              }`}
            >
              <Users size={16} />
              CRM inquiries
              {inquiries.filter(i => i.status === 'pending').length > 0 && (
                <span className={`ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'crm' ? 'bg-brand-bg-deep text-brand-accent-gold' : 'bg-brand-accent-gold text-brand-bg-deep'
                }`}>
                  {inquiries.filter(i => i.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('projects'); setSelectedInquiry(null); }}
              className={`w-full py-3.5 px-4 rounded text-xs uppercase tracking-widest font-semibold flex items-center gap-3 transition-all duration-300 cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-brand-accent-gold text-brand-bg-deep shadow shadow-brand-accent-gold/15'
                  : 'text-brand-text-secondary hover:bg-brand-border/40 hover:text-brand-text-primary'
              }`}
            >
              <Briefcase size={16} />
              Active Projects
            </button>

            <button
              onClick={() => { setActiveTab('calendar'); setSelectedInquiry(null); }}
              className={`w-full py-3.5 px-4 rounded text-xs uppercase tracking-widest font-semibold flex items-center gap-3 transition-all duration-300 cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-brand-accent-gold text-brand-bg-deep shadow shadow-brand-accent-gold/15'
                  : 'text-brand-text-secondary hover:bg-brand-border/40 hover:text-brand-text-primary'
              }`}
            >
              <CalendarIcon size={16} />
              Deadlines Calendar
            </button>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-brand-border/40 bg-brand-bg-deep/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-brand-text-primary uppercase tracking-wider truncate w-40">{user.name}</p>
              <p className="text-[10px] text-brand-text-secondary tracking-wide truncate w-40">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full py-2.5 border border-brand-border hover:border-red-500/40 text-brand-text-secondary hover:text-red-400 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 rounded transition-all duration-300 cursor-pointer"
          >
            <LogOut size={14} />
            Logout Portal
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Workspace Top Header */}
        <header className="h-20 border-b border-brand-border/60 bg-[#07070b]/60 backdrop-blur-xl px-8 flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-lg text-brand-text-primary tracking-widest uppercase">
              {activeTab === 'crm' && 'CRM Booking Requests'}
              {activeTab === 'projects' && 'Active Project Pipelines'}
              {activeTab === 'calendar' && 'Schedule & Deadlines Board'}
            </h2>
            <p className="text-[10px] text-brand-text-secondary tracking-wider uppercase mt-1">
              DevinEdge Management Platform Console
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Server Online Badge */}
            <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded border flex items-center gap-2 ${
              serverOnline 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse'
            }`}>
              <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-green-400' : 'bg-red-400'}`} />
              {serverOnline ? 'Server Online' : 'Server Offline'}
            </span>

            {/* Quick Sync Button */}
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 border border-brand-border/85 text-brand-text-secondary hover:text-brand-accent-gold hover:border-brand-accent-gold/40 rounded transition-all duration-300 cursor-pointer disabled:opacity-50"
              title="Sync Database Now"
            >
              Sync
            </button>
          </div>
        </header>

        {/* Offline Critical Warning */}
        {!serverOnline && (
          <div className="bg-red-500/15 border-b border-red-500/30 text-red-400 py-3 px-8 text-xs flex items-center gap-3 font-semibold">
            <ShieldAlert size={16} />
            <span>Connection error: Cannot reach the backend API server. Make sure the Node.js process is active.</span>
          </div>
        )}

        {/* Content View Routing */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* TAB VIEW 1: CRM INBOX */}
          {activeTab === 'crm' && (
            <div className="flex-1 flex overflow-hidden">
              {/* Left Inquiries Column */}
              <div className="flex-1 p-8 overflow-y-auto">
                {/* Stats Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="glass-panel border border-brand-border/40 p-5 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-brand-text-secondary/60 block font-bold">Total Enquiries</span>
                      <span className="font-display text-2xl font-bold text-brand-text-primary mt-1 block">{stats.total}</span>
                    </div>
                    <FileText size={24} className="text-brand-text-secondary/30" />
                  </div>

                  <div className="glass-panel border border-brand-border/40 p-5 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-brand-accent-gold block font-bold">Pending Review</span>
                      <span className="font-display text-2xl font-bold text-brand-accent-gold mt-1 block">{stats.pending}</span>
                    </div>
                    <Clock size={24} className="text-brand-accent-gold/30" />
                  </div>

                  <div className="glass-panel border border-brand-border/40 p-5 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-brand-accent-purple block font-bold">In pipeline</span>
                      <span className="font-display text-2xl font-bold text-brand-accent-purple mt-1 block">{stats.active}</span>
                    </div>
                    <TrendingUp size={24} className="text-brand-accent-purple/30" />
                  </div>

                  <div className="glass-panel border border-brand-border/40 p-5 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-brand-accent-cyan block font-bold">Revenue Target</span>
                      <span className="font-display text-2xl font-bold text-brand-accent-cyan mt-1 block">${(stats.revenue / 1000).toFixed(0)}k</span>
                    </div>
                    <DollarSign size={24} className="text-brand-accent-cyan/30" />
                  </div>
                </div>

                {/* Table Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs uppercase tracking-widest text-brand-text-secondary font-bold">Recent Booking Requests</h3>
                  <span className="text-[10px] text-brand-text-secondary/40 font-semibold">{inquiries.length} requests registered</span>
                </div>

                {/* Table Body */}
                <div className="glass-panel border border-brand-border/40 rounded-lg overflow-hidden">
                  {inquiries.length === 0 ? (
                    <div className="py-20 text-center text-brand-text-secondary/40 uppercase tracking-widest text-xs">
                      No inquiries submitted yet.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-brand-border bg-[#0a0a10] text-brand-text-secondary uppercase tracking-wider text-[9px] font-bold">
                          <th className="py-4 px-6">Client / Company</th>
                          <th className="py-4 px-6">Service Type</th>
                          <th className="py-4 px-6">Budget Range</th>
                          <th className="py-4 px-6">Submitted Date</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/40 text-brand-text-primary">
                        {inquiries.map(inq => (
                          <tr 
                            key={inq.id} 
                            onClick={() => setSelectedInquiry(inq)}
                            className={`hover:bg-brand-border/20 cursor-pointer transition-colors duration-200 ${
                              selectedInquiry && selectedInquiry.id === inq.id ? 'bg-brand-border/30' : ''
                            }`}
                          >
                            <td className="py-4 px-6">
                              <span className="font-bold text-brand-text-primary block">{inq.clientName}</span>
                              <span className="text-[10px] text-brand-text-secondary/60">{inq.clientCompany || 'Personal Project'}</span>
                            </td>
                            <td className="py-4 px-6 uppercase tracking-wider font-semibold text-brand-accent-purple">
                              {inq.service}
                            </td>
                            <td className="py-4 px-6 font-mono font-bold text-brand-text-primary">
                              {inq.budget}
                            </td>
                            <td className="py-4 px-6 text-brand-text-secondary/80">
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-widest ${
                                inq.status === 'pending' && 'bg-brand-accent-gold/15 text-brand-accent-gold border border-brand-accent-gold/20'
                              } ${
                                ['discovery', 'design', 'dev'].includes(inq.status) && 'bg-brand-accent-purple/15 text-brand-accent-purple border border-brand-accent-purple/20'
                              } ${
                                inq.status === 'live' && 'bg-green-500/15 text-green-400 border border-green-500/20'
                              } ${
                                inq.status === 'rejected' && 'bg-red-500/15 text-red-400 border border-red-500/20'
                              }`}>
                                {inq.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right" onClick={e => e.stopPropagation()}>
                              <button 
                                onClick={() => setSelectedInquiry(inq)}
                                className="text-brand-accent-gold hover:text-brand-accent-gold-light font-semibold uppercase tracking-widest text-[10px] flex items-center gap-1.5 ml-auto cursor-pointer"
                              >
                                Manage <ChevronRight size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Right Details Drawer */}
              {selectedInquiry && (
                <div className="w-[450px] border-l border-brand-border/60 bg-[#07070b]/90 backdrop-blur-xl p-8 overflow-y-auto shrink-0 flex flex-col justify-between relative z-20">
                  <div className="text-left">
                    {/* Drawer Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-brand-text-secondary/50 font-bold">Client profile drawer</span>
                        <h3 className="font-display font-semibold text-lg text-brand-text-primary mt-1 uppercase truncate w-72">{selectedInquiry.clientName}</h3>
                      </div>
                      <button 
                        onClick={() => setSelectedInquiry(null)}
                        className="p-1 border border-brand-border hover:border-brand-accent-gold text-brand-text-secondary hover:text-brand-accent-gold rounded cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    <div className="h-[1px] bg-brand-border/40 my-4" />

                    {/* Client Metadata Card */}
                    <div className="flex flex-col gap-4 text-xs">
                      <div>
                        <span className="text-[9px] text-brand-text-secondary/50 uppercase tracking-widest block font-bold">Company connection</span>
                        <span className="text-brand-text-primary font-semibold text-sm mt-0.5 block">{selectedInquiry.clientCompany || 'None (Individual)'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-brand-text-secondary/50 uppercase tracking-widest block font-bold">Email address</span>
                        <a href={`mailto:${selectedInquiry.clientEmail}`} className="text-brand-accent-cyan hover:underline font-semibold mt-0.5 block">{selectedInquiry.clientEmail}</a>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] text-brand-text-secondary/50 uppercase tracking-widest block font-bold">Budget estimate</span>
                          <span className="text-brand-text-primary font-mono font-bold text-sm mt-0.5 block">{selectedInquiry.budget}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-brand-text-secondary/50 uppercase tracking-widest block font-bold">Timeline scope</span>
                          <span className="text-brand-text-primary font-semibold mt-0.5 block">{selectedInquiry.timeline}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-brand-text-secondary/50 uppercase tracking-widest block font-bold">Description of proposal</span>
                        <p className="text-brand-text-secondary leading-relaxed bg-[#0b0b10] border border-brand-border/40 p-4 rounded mt-1 overflow-y-auto max-h-40 whitespace-pre-wrap">
                          {selectedInquiry.message}
                        </p>
                      </div>
                    </div>

                    <div className="h-[1px] bg-brand-border/40 my-6" />

                    {/* Pipeline Controls */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="text-[9px] text-brand-text-secondary/50 uppercase tracking-widest block mb-2 font-bold">Workflow pipeline stage</label>
                        <select
                          value={selectedInquiry.status}
                          onChange={e => handleUpdateStatus(selectedInquiry.id, { status: e.target.value })}
                          className="w-full bg-brand-bg-deep border border-brand-border py-2.5 px-3 text-xs text-brand-text-primary focus:outline-none focus:border-brand-accent-gold rounded uppercase tracking-wider font-semibold"
                        >
                          <option value="pending">Pending Review</option>
                          <option value="discovery">Discovery phase</option>
                          <option value="design">Design concept</option>
                          <option value="dev">Active Development</option>
                          <option value="live">Live / Launch</option>
                          <option value="rejected">Rejected / Archived</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] text-brand-text-secondary/50 uppercase tracking-widest block mb-2 font-bold">Invoice & Billing status</label>
                        <select
                          value={selectedInquiry.paymentStatus}
                          onChange={e => handleUpdateStatus(selectedInquiry.id, { paymentStatus: e.target.value })}
                          className="w-full bg-brand-bg-deep border border-brand-border py-2.5 px-3 text-xs text-brand-text-primary focus:outline-none focus:border-brand-accent-gold rounded uppercase tracking-wider font-semibold"
                        >
                          <option value="unpaid">Unpaid / No Invoice</option>
                          <option value="deposit_paid">Deposit Paid (50%)</option>
                          <option value="fully_paid">Fully Settled (100%)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] text-brand-text-secondary/50 uppercase tracking-widest block mb-2 font-bold">Set Timeline Deadline</label>
                        <input
                          type="text"
                          value={selectedInquiry.timeline === 'TBD' ? '' : selectedInquiry.timeline}
                          onChange={e => handleUpdateStatus(selectedInquiry.id, { timeline: e.target.value || 'TBD' })}
                          placeholder="e.g. 4 Weeks (July 2026)"
                          className="w-full bg-brand-bg-deep border border-brand-border py-2.5 px-3 text-xs text-brand-text-primary focus:outline-none focus:border-brand-accent-gold rounded"
                        />
                      </div>
                    </div>

                    <div className="h-[1px] bg-brand-border/40 my-6" />

                    {/* Notes Manager */}
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-brand-text-secondary font-bold mb-3">Internal Project Audit Notes</h4>
                      <div className="flex flex-col gap-2 mb-4 max-h-36 overflow-y-auto pr-1">
                        {selectedInquiry.notes.length === 0 ? (
                          <p className="text-[10px] text-brand-text-secondary/40 uppercase tracking-wider">No comments logged yet.</p>
                        ) : (
                          selectedInquiry.notes.map(note => (
                            <div key={note.id} className="bg-[#0b0b10] border border-brand-border/20 p-2.5 rounded text-[11px]">
                              <p className="text-brand-text-secondary leading-relaxed">{note.text}</p>
                              <div className="flex justify-between items-center mt-1.5 text-[8px] text-brand-text-secondary/40 uppercase tracking-wider font-bold">
                                <span>By: {note.author}</span>
                                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <form onSubmit={handleAddNote} className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={newNoteText}
                          onChange={e => setNewNoteText(e.target.value)}
                          placeholder="Add progress comment..."
                          className="flex-1 bg-brand-bg-deep border border-brand-border px-3 py-2 text-xs text-brand-text-primary focus:outline-none focus:border-brand-accent-gold rounded"
                        />
                        <button 
                          type="submit"
                          className="px-3 bg-brand-accent-gold text-brand-bg-deep font-bold text-xs rounded hover:bg-brand-accent-gold-light transition-all duration-300 cursor-pointer"
                        >
                          Add
                        </button>
                      </form>
                    </div>
                  </div>
                  
                  {/* Status Shortcut Action buttons */}
                  <div className="mt-8 border-t border-brand-border/40 pt-4 flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, { status: 'discovery' })}
                      disabled={selectedInquiry.status !== 'pending'}
                      className="flex-1 py-2.5 bg-brand-accent-purple text-brand-text-primary text-[10px] uppercase tracking-widest font-semibold rounded hover:bg-brand-accent-purple/80 disabled:opacity-30 disabled:hover:bg-brand-accent-purple transition-all duration-300 cursor-pointer"
                    >
                      Accept Inquiry
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, { status: 'rejected' })}
                      disabled={selectedInquiry.status === 'rejected'}
                      className="py-2.5 px-4 border border-red-500/30 hover:border-red-500/60 text-red-400 text-[10px] uppercase tracking-widest font-semibold rounded transition-all duration-300 cursor-pointer"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB VIEW 2: ACTIVE PROJECTS */}
          {activeTab === 'projects' && (
            <div className="flex-1 p-8 overflow-y-auto">
              <h3 className="text-xs uppercase tracking-widest text-brand-text-secondary font-bold mb-6">Active Development Pipeline</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['discovery', 'design', 'dev'].map(stage => {
                  const stageProjects = inquiries.filter(i => i.status === stage);
                  return (
                    <div key={stage} className="glass-panel border border-brand-border/40 p-6 rounded-lg flex flex-col gap-4 min-h-[400px]">
                      {/* Column Header */}
                      <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
                        <h4 className="font-display font-semibold text-sm uppercase tracking-widest text-brand-text-primary">
                          {stage === 'discovery' && '🔍 Discovery Stage'}
                          {stage === 'design' && '🎨 Design Wireframes'}
                          {stage === 'dev' && '💻 Live Engineering'}
                        </h4>
                        <span className="text-xs font-mono font-bold text-brand-accent-gold px-2.5 py-0.5 rounded bg-brand-accent-gold/10">
                          {stageProjects.length}
                        </span>
                      </div>

                      {/* Projects Cards list */}
                      <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                        {stageProjects.length === 0 ? (
                          <div className="py-10 text-center text-brand-text-secondary/30 text-[10px] uppercase tracking-wider">
                            No projects in stage
                          </div>
                        ) : (
                          stageProjects.map(proj => (
                            <div 
                              key={proj.id} 
                              onClick={() => { setSelectedInquiry(proj); setActiveTab('crm'); }}
                              className="bg-[#0b0b10] border border-brand-border/60 hover:border-brand-accent-gold/40 p-4 rounded cursor-pointer transition-all duration-300 hover:-translate-y-0.5 text-xs text-left"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-brand-text-primary truncate w-36 uppercase tracking-wider">{proj.clientName}</span>
                                <span className="font-mono text-[10px] text-brand-accent-cyan font-bold">{proj.budget}</span>
                              </div>
                              <p className="text-[10px] text-brand-text-secondary truncate font-semibold mb-3">{proj.clientCompany || 'Personal Project'}</p>
                              
                              <div className="flex justify-between items-center border-t border-brand-border/20 pt-2.5 mt-2 text-[9px] tracking-wider uppercase text-brand-text-secondary/50 font-bold">
                                <span className="flex items-center gap-1">
                                  <Clock size={10} className="text-brand-accent-gold" />
                                  {proj.timeline || 'TBD'}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded ${
                                  proj.paymentStatus === 'fully_paid' && 'bg-green-500/10 text-green-400'
                                } ${
                                  proj.paymentStatus === 'deposit_paid' && 'bg-brand-accent-purple/10 text-brand-accent-purple'
                                } ${
                                  proj.paymentStatus === 'unpaid' && 'bg-red-500/10 text-red-400'
                                }`}>
                                  {proj.paymentStatus === 'fully_paid' ? 'Paid' : proj.paymentStatus === 'deposit_paid' ? 'Deposit' : 'Unpaid'}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB VIEW 3: DEADLINES CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="flex-1 p-8 overflow-y-auto flex flex-col md:flex-row gap-8">
              
              {/* Calendar Grid Section */}
              <div className="flex-1 glass-panel border border-brand-border/40 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-6 border-b border-brand-border/40 pb-4">
                  <h3 className="font-display font-semibold text-base uppercase tracking-widest text-brand-text-primary">
                    {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() - 1)))}
                      className="px-3 py-1 border border-brand-border hover:border-brand-accent-gold text-brand-text-secondary hover:text-brand-accent-gold rounded text-xs cursor-pointer"
                    >
                      Prev
                    </button>
                    <button 
                      onClick={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() + 1)))}
                      className="px-3 py-1 border border-brand-border hover:border-brand-accent-gold text-brand-text-secondary hover:text-brand-accent-gold rounded text-xs cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-brand-text-secondary/50 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2">{day}</div>
                  ))}
                </div>

                {/* Calendar Date Numbers */}
                <div className="grid grid-cols-7 gap-2">
                  {(() => {
                    const year = calendarDate.getFullYear();
                    const month = calendarDate.getMonth();
                    const firstDayIdx = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    
                    const cells = [];
                    // Pad empty cells
                    for (let i = 0; i < firstDayIdx; i++) {
                      cells.push(<div key={`empty-${i}`} className="aspect-[4/3] rounded border border-transparent" />);
                    }
                    
                    // Add day cells
                    for (let day = 1; day <= daysInMonth; day++) {
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const dayEvents = events.filter(e => e.date === dateStr);
                      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                      
                      cells.push(
                        <div 
                          key={day} 
                          className={`aspect-[4/3] rounded border p-1 text-left flex flex-col justify-between transition-colors duration-200 ${
                            isToday 
                              ? 'border-brand-accent-gold bg-brand-accent-gold/5' 
                              : 'border-brand-border/40 bg-brand-bg-card/20 hover:border-brand-accent-gold/30'
                          }`}
                        >
                          <span className={`text-[10px] font-bold ${isToday ? 'text-brand-accent-gold' : 'text-brand-text-primary'}`}>{day}</span>
                          <div className="flex flex-col gap-0.5 overflow-hidden">
                            {dayEvents.slice(0, 2).map(ev => (
                              <div 
                                key={ev.id}
                                className={`text-[7px] truncate px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border ${
                                  ev.type === 'call' && 'bg-brand-accent-gold/10 text-brand-accent-gold border-brand-accent-gold/10'
                                } ${
                                  ev.type === 'deadline' && 'bg-red-500/10 text-red-400 border-red-500/10'
                                } ${
                                  ev.type === 'milestone' && 'bg-brand-accent-purple/10 text-brand-accent-cyan border-brand-accent-purple/10'
                                }`}
                                title={ev.title}
                              >
                                {ev.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-[6px] text-brand-text-secondary/50 font-bold text-center">+{dayEvents.length - 2} more</div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return cells;
                  })()}
                </div>
              </div>

              {/* Sidebar Action / Events List Section */}
              <div className="w-full md:w-80 flex flex-col gap-8 shrink-0">
                {/* 1. Add Event Form */}
                <div className="glass-panel border border-brand-border/40 p-6 rounded-lg text-left">
                  <h3 className="text-xs uppercase tracking-widest text-brand-text-secondary font-bold mb-4 flex items-center gap-1.5">
                    <Plus size={14} className="text-brand-accent-gold" /> Add Schedule Event
                  </h3>
                  <form onSubmit={handleAddEvent} className="flex flex-col gap-4 text-xs">
                    <div>
                      <label className="text-[9px] text-brand-text-secondary/50 uppercase tracking-widest block mb-1.5 font-bold">Event Title</label>
                      <input 
                        type="text" 
                        required
                        value={newEventTitle}
                        onChange={e => setNewEventTitle(e.target.value)}
                        placeholder="e.g. Call with Client"
                        className="w-full bg-[#0b0b10] border border-brand-border px-3 py-2 rounded text-brand-text-primary focus:outline-none focus:border-brand-accent-gold"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-brand-text-secondary/50 uppercase tracking-widest block mb-1.5 font-bold">Event Type</label>
                        <select
                          value={newEventType}
                          onChange={e => setNewEventType(e.target.value)}
                          className="w-full bg-[#0b0b10] border border-brand-border px-3 py-2 rounded text-brand-text-primary focus:outline-none focus:border-brand-accent-gold font-semibold uppercase tracking-wider text-[10px]"
                        >
                          <option value="call">Call</option>
                          <option value="deadline">Deadline</option>
                          <option value="milestone">Milestone</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-brand-text-secondary/50 uppercase tracking-widest block mb-1.5 font-bold">Target Date</label>
                        <input 
                          type="date" 
                          required
                          value={newEventDate}
                          onChange={e => setNewEventDate(e.target.value)}
                          className="w-full bg-[#0b0b10] border border-brand-border px-3 py-2 rounded text-brand-text-primary focus:outline-none focus:border-brand-accent-gold font-mono"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-brand-accent-gold text-brand-bg-deep font-bold text-xs uppercase tracking-widest hover:bg-brand-accent-gold-light transition-all duration-300 rounded shadow cursor-pointer mt-1"
                    >
                      Save Event
                    </button>
                  </form>
                </div>

                {/* 2. Chronological Upcoming Events List */}
                <div className="glass-panel border border-brand-border/40 p-6 rounded-lg flex-1 flex flex-col text-left">
                  <h3 className="text-xs uppercase tracking-widest text-brand-text-secondary font-bold mb-4">Upcoming Schedule</h3>
                  <div className="flex flex-col gap-3 overflow-y-auto flex-1 max-h-[300px] pr-1">
                    {events.length === 0 ? (
                      <p className="text-[10px] text-brand-text-secondary/30 uppercase tracking-wider py-10 text-center">No upcoming events scheduled.</p>
                    ) : (
                      events
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map(ev => (
                          <div key={ev.id} className="bg-[#0b0b10] border border-brand-border/20 p-3 rounded flex items-center justify-between text-xs">
                            <div className="text-left w-48">
                              <span className={`text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border inline-block mb-1.5 ${
                                ev.type === 'call' && 'bg-brand-accent-gold/10 text-brand-accent-gold border-brand-accent-gold/10'
                              } ${
                                ev.type === 'deadline' && 'bg-red-500/10 text-red-400 border-red-500/10'
                              } ${
                                ev.type === 'milestone' && 'bg-brand-accent-purple/10 text-brand-accent-cyan border-brand-accent-purple/10'
                              }`}>
                                {ev.type}
                              </span>
                              <h4 className="font-semibold text-brand-text-primary truncate">{ev.title}</h4>
                              <p className="text-[9px] text-brand-text-secondary/50 font-mono mt-0.5 font-bold">{new Date(ev.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteEvent(ev.id)}
                              className="p-1.5 text-brand-text-secondary hover:text-red-400 border border-transparent hover:border-red-500/25 rounded transition-all duration-300 cursor-pointer"
                              title="Delete Event"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
