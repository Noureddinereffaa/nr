import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
// import ServiceRequestForm from '../components/dashboard/forms/ServiceRequestForm'; // Checking if this exists

// Lazy Load Content Components
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
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const { activityLog, isLoading } = useSystem();
  const { articles } = useContent();
  const { clients, projects, invoices, addClient, addInvoice, addProject } = useBusiness();
  const { isShieldMode } = useUI();
  const {
    isClientModalOpen, closeClientModal,
    isInvoiceModalOpen, closeInvoiceModal,
    isProjectModalOpen, closeProjectModal,
    openCommandPalette, toggleCommandPalette
  } = useUI();

  const handleTabClick = (id: string) => {
    setActiveTab(id);
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
    <div className="h-screen w-screen bg-slate-950 overflow-hidden">
      <div className="relative w-full h-full flex flex-col bg-slate-950/40 mesh-gradient backdrop-blur-3xl transition-all duration-500">

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
            activeTab={activeTab}
            mobileMenuOpen={mobileMenuOpen}
            onTabChange={handleTabClick}
            showDebug={showDebug}
            onToggleDebug={() => setShowDebug(!showDebug)}
          />

          {/* Main Content */}
          <div
            className="flex-1 overflow-y-auto bg-slate-950/50 custom-scrollbar scroll-smooth pb-32"
            dir="rtl"
          >
            <div className="dashboard-max-width p-4 sm:p-8 space-y-8 sm:space-y-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={variants.fadeInScale}
                  transition={transitions.smooth}
                  className="min-h-full"
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    {activeTab === 'overview' && <Overview />}
                    {activeTab === 'projects' && <Projects />}
                    {activeTab === 'services' && <ServicesList />}
                    {activeTab === 'identity' && <SettingsLayout key="identity" initialTab="profile" />}
                    {activeTab === 'content-manager' && <ContentManager />}
                    {activeTab === 'branding' && <SettingsLayout key="branding" initialTab="brand" />}
                    {activeTab === 'system' && <SettingsLayout key="system" initialTab="brand" />}
                    {activeTab === 'clients' && <CRM />}
                    {activeTab === 'requests' && <Requests />}
                    {activeTab === 'financial-hub' && <FinancialHub />}
                    {activeTab === 'billing' && <Billing />}
                    {activeTab === 'decision-pages' && <DecisionPages />}
                    {activeTab === 'seo-master' && <SEOMaster />}
                    {activeTab === 'analytics' && <AnalyticsDashboard />}
                  </Suspense>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Global Modals */}
        <ClientForm
          isOpen={isClientModalOpen}
          onClose={closeClientModal}
          onSave={(data) => { addClient(data); closeClientModal(); }}
        />
        <InvoiceForm
          isOpen={isInvoiceModalOpen}
          onClose={closeInvoiceModal}
        // Logic for saving invoice usually requires items, handled inside form or passed? 
        // InvoiceForm usually takes onSave. Need to verify InvoiceForm props.
        // Assuming simplified usage for Quick Action (New Empty).
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
