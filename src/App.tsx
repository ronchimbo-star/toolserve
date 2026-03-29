import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { CookieConsent } from './components/CookieConsent';
import { ToastContainer } from './components/Toast';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { useEffect, useState, lazy, Suspense } from 'react';
import { supabase } from './lib/supabase';

const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const RepairRequestPage = lazy(() => import('./pages/RepairRequestPage').then(m => ({ default: m.RepairRequestPage })));
const SustainabilityPage = lazy(() => import('./pages/SustainabilityPage').then(m => ({ default: m.SustainabilityPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const TrackRepairPage = lazy(() => import('./pages/TrackRepairPage').then(m => ({ default: m.TrackRepairPage })));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminSetupPage = lazy(() => import('./pages/AdminSetupPage').then(m => ({ default: m.AdminSetupPage })));
const AdminRecoveryPage = lazy(() => import('./pages/AdminRecoveryPage').then(m => ({ default: m.AdminRecoveryPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const CookiesPage = lazy(() => import('./pages/CookiesPage').then(m => ({ default: m.CookiesPage })));
const ServiceCoveragePage = lazy(() => import('./pages/ServiceCoveragePage').then(m => ({ default: m.ServiceCoveragePage })));
const ServiceAreaPage = lazy(() => import('./pages/ServiceAreaPage').then(m => ({ default: m.ServiceAreaPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then(m => ({ default: m.FAQPage })));
const AuthTestPage = lazy(() => import('./pages/AuthTestPage').then(m => ({ default: m.AuthTestPage })));

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-slate-600">Loading...</p>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <Chatbot />
      <CookieConsent />
      <ToastContainer />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

function NotFoundPage() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
          <p className="text-xl text-slate-600 mb-8">Page Not Found</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    </Layout>
  );
}

function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <img
          src="/toolserve-logo.svg"
          alt="ToolServe"
          className="h-24 mx-auto mb-8"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          We're Tinkering and Will be Back Soon
        </h1>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<MaintenancePage />} />
          <Route path="/services" element={<MaintenancePage />} />
          <Route path="/repair-request" element={<MaintenancePage />} />
          <Route path="/sustainability" element={<MaintenancePage />} />
          <Route path="/blog" element={<MaintenancePage />} />
          <Route path="/blog/:slug" element={<MaintenancePage />} />
          <Route path="/contact" element={<MaintenancePage />} />
          <Route path="/track-repair" element={<MaintenancePage />} />
          <Route path="/service-coverage" element={<MaintenancePage />} />
          <Route path="/service-area/:slug" element={<MaintenancePage />} />
          <Route path="/faq" element={<MaintenancePage />} />
          <Route path="/terms" element={<MaintenancePage />} />
          <Route path="/privacy" element={<MaintenancePage />} />
          <Route path="/cookies" element={<MaintenancePage />} />

          <Route path="/admin/setup" element={<AdminSetupPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/recovery" element={<AdminRecoveryPage />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/auth-test" element={<AuthTestPage />} />

          <Route path="*" element={<MaintenancePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
