import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { variants, transitions } from '../lib/motion-config';
import { useSystem } from '../context/SystemContext';
import { useContent } from '../context/ContentContext';
import { useBusiness } from '../context/BusinessContext';
import { useUI } from '../context/UIContext';

// Layout Components
import DashboardHeader from '../components/dashboard/layout/DashboardHeader';
import DashboardSidebar from '../components/dashboard/layout/DashboardSidebar';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Forms (Global Modals)
import ClientForm from '../components/dashboard/forms/ClientForm';
import InvoiceForm from '../components/dashboard/forms/InvoiceForm';
import ProjectForm from '../components/dashboard/forms/ProjectForm';
import ArticleModal from '../components/dashboard/modals/ArticleModal';
import UnifiedCommand from '../components/dashboard/shared/UnifiedCommand';

// Lazy Load Content Components
const MobileNav = React.lazy(() => import('../components/dashboard/layout/MobileNav'));
const Overview = React.lazy(() => import('../components/dashboard/overview/Overview'));
const ContentManager = React.lazy(() => import('../components/dashboard/modules/strategic-content/ContentManager'));
const Projects = React.lazy(() => import('../components/dashboard/modules/project-studio/Projects'));
const ServicesList = React.lazy(() => import('../components/dashboard/modules/project-studio/ServicesList'));
const SettingsLayout = React.lazy(() => import('../components/dashboard/settings/SettingsLayout'));
const CRM = React.lazy(() => import('../components/dashboard/modules/crm-intelligence/CRM'));
const Requests = React.lazy(() => import('../components/dashboard/modules/crm-intelligence/Requests'));
const Billing = React.lazy(() => import('../components/dashboard/modules/financial-intelligence/Billing'));
const FinancialHub = React.lazy(() => import('../components/dashboard/modules/financial-intelligence/FinancialHub'));
const DecisionPages = React.lazy(() => import('../components/dashboard/modules/decision-pages/DecisionPages'));
const AnalyticsDashboard = React.lazy(() => import('../components/dashboard/analytics/AnalyticsDashboard'));
const SEOMaster = React.lazy(() => import('../components/dashboard/modules/seo-master/SEOMaster'));

const DashboardPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { activityLog } = useSystem();
  const { articles } = useContent();
  const { clients, projects, invoices, addClient } = useBusiness();
  const {
    isClientModalOpen, closeClientModal,
    isInvoiceModalOpen, closeInvoiceModal,
    isProjectModalOpen, closeProjectModal,
    toggleCommandPalette
  } = useUI();

  // Determine active tab from URL
  const activeTabFromUrl = location.pathname.split('/').pop() || 'overview';
  const currentTab = activeTabFromUrl === 'dashboard' ? 'overview' : activeTabFromUrl;

  const handleTabClick = (id: string) => {
    navigate(id === 'overview' ? '/dashboard' : `/dashboard/${id}`);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleGlobalK = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    const handleNav = (e: any) => {
      if (e.detail) handleTabClick(e.detail);
    };

    window.addEventListener('keydown', handleGlobalK);
    window.addEventListener('dashboard-nav', handleNav);
    return () => {
      window.removeEventListener('keydown', handleGlobalK);
      window.removeEventListener('dashboard-nav', handleNav);
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-[var(--bg-primary)] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="aurora-bg" />
      <div className="noise-overlay" />

      <div className="relative w-full h-full flex flex-col backdrop-blur-3xl transition-all duration-500">

        <DashboardHeader
          onOpenSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
          isMenuOpen={mobileMenuOpen}
        />

        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile Overlay/Backdrop */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="absolute inset-0 z-[var(--z-nav)] bg-slate-950/60 backdrop-blur-sm md:hidden"
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <DashboardSidebar
            activeTab={currentTab}
            mobileMenuOpen={mobileMenuOpen}
            onTabChange={handleTabClick}
            showDebug={showDebug}
            onToggleDebug={() => setShowDebug(!showDebug)}
          />

          {/* Main Content */}
          <div
            className="flex-1 overflow-y-auto bg-transparent custom-scrollbar scroll-smooth pb-32"
            dir="rtl"
          >
            <div className="dashboard-max-width p-4 sm:p-8 space-y-8 sm:space-y-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={variants.fadeInScale}
                  transition={transitions.smooth}
                  className="min-h-full"
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route index element={<Overview />} />
                      <Route path="projects" element={<Projects />} />
                      <Route path="services" element={<ServicesList />} />
                      <Route path="identity" element={<SettingsLayout key="identity" initialTab="profile" />} />
                      <Route path="content-manager" element={<ContentManager />} />
                      <Route path="branding" element={<SettingsLayout key="branding" initialTab="brand" />} />
                      <Route path="system" element={<SettingsLayout key="system" initialTab="brand" />} />
                      <Route path="clients" element={<CRM />} />
                      <Route path="requests" element={<Requests />} />
                      <Route path="financial-hub" element={<FinancialHub />} />
                      <Route path="billing" element={<Billing />} />
                      <Route path="decision-pages" element={<DecisionPages />} />
                      <Route path="seo-master" element={<SEOMaster />} />
                      <Route path="analytics" element={<AnalyticsDashboard />} />
                    </Routes>
                  </Suspense>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Global Nav for Mobile */}
        <Suspense fallback={null}>
          <MobileNav
            activeTab={currentTab}
            onTabChange={handleTabClick}
            onOpenMenu={() => setMobileMenuOpen(true)}
          />
        </Suspense>

        {/* Mobile Quick Search FAB */}
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleCommandPalette}
          className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-[var(--z-nav)] active:scale-95 border border-white/20"
        >
          <Search size={22} />
        </motion.button>

        {/* Global Modals */}
        <ClientForm
          isOpen={isClientModalOpen}
          onClose={closeClientModal}
          onSave={(data) => { addClient(data); closeClientModal(); }}
        />
        <InvoiceForm
          isOpen={isInvoiceModalOpen}
          onClose={closeInvoiceModal}
        />
        <ProjectForm
          isOpen={isProjectModalOpen}
          onClose={closeProjectModal}
        />
        <ArticleModal />
        <UnifiedCommand />

        {/* Debug Overlay */}
        {showDebug && (
          <div className="fixed inset-0 p-6 z-[999] pointer-events-none">
            <div
              className="pointer-events-auto max-w-4xl mx-auto bg-black/80 text-white p-4 rounded-lg overflow-auto"
              style={{ maxHeight: '80vh' }}
            >
              <h3 className="font-black mb-2">DEBUG: siteData</h3>
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify({ activityLog, articles, clients, projects, invoices }, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
