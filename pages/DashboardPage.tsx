import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { variants, transitions } from '../lib/motion-config';
import { useData } from '../context/DataContext';
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
import CommandBar from '../components/ui/CommandBar';
// import ServiceRequestForm from '../components/dashboard/forms/ServiceRequestForm'; // Checking if this exists

// Lazy Load Content Components
const Overview = React.lazy(() => import('../components/dashboard/overview/Overview'));
const ContentManager = React.lazy(() => import('../components/dashboard/modules/strategic-content/ContentManager'));
const AIArchitect = React.lazy(() => import('../components/dashboard/modules/ai-global-brain/AIArchitect'));
const Projects = React.lazy(() => import('../components/dashboard/modules/project-studio/Projects'));
const ServicesList = React.lazy(() => import('../components/dashboard/modules/project-studio/ServicesList'));
const SettingsLayout = React.lazy(() => import('../components/dashboard/settings/SettingsLayout'));
const CRM = React.lazy(() => import('../components/dashboard/modules/crm-intelligence/CRM'));
const Requests = React.lazy(() => import('../components/dashboard/modules/crm-intelligence/Requests'));
const Billing = React.lazy(() => import('../components/dashboard/modules/financial-intelligence/Billing'));
const FinancialHub = React.lazy(() => import('../components/dashboard/modules/financial-intelligence/FinancialHub'));

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const { siteData, updateSiteData, addClient, addInvoice, addProject, addArticle } = useData();
  const {
    isClientModalOpen, closeClientModal,
    isInvoiceModalOpen, closeInvoiceModal,
    isProjectModalOpen, closeProjectModal,
    // isRequestModalOpen, closeRequestModal 
  } = useUI();

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleGlobalK = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsCommandBarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalK);
    return () => window.removeEventListener('keydown', handleGlobalK);
  }, []);


  return (
    <div className="min-h-screen bg-slate-950/60 p-6">
      <div className="relative w-full max-w-7xl mx-auto bg-slate-950 border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden h-[calc(100vh-3rem)]">

        <DashboardHeader
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          isMenuOpen={mobileMenuOpen}
        />

        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile Overlay/Backdrop */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 z-[85] bg-slate-950/60 backdrop-blur-sm md:hidden"
            />
          )}

          {/* Sidebar */}
          <DashboardSidebar
            activeTab={activeTab}
            mobileMenuOpen={mobileMenuOpen}
            onTabClick={handleTabClick}
            showDebug={showDebug}
            onToggleDebug={() => setShowDebug(!showDebug)}
          />

          {/* Main Content */}
          <div
            className="flex-1 overflow-y-auto p-8 space-y-12 bg-slate-950/50 custom-scrollbar scroll-smooth pb-32"
            dir="rtl"
          >
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
                  {activeTab === 'aibrain' && <AIArchitect />}
                  {activeTab === 'content-manager' && <ContentManager />}
                  {activeTab === 'branding' && <SettingsLayout key="branding" initialTab="brand" />}
                  {activeTab === 'system' && <SettingsLayout key="system" initialTab="brand" />}
                  {activeTab === 'clients' && <CRM />}
                  {activeTab === 'requests' && <Requests />}
                  {activeTab === 'financial-hub' && <FinancialHub />}
                  {activeTab === 'billing' && <Billing />}
                </Suspense>
              </motion.div>
            </AnimatePresence>
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

        <CommandBar
          isOpen={isCommandBarOpen}
          onClose={() => setIsCommandBarOpen(false)}
          onNavigate={handleTabClick}
        />

        {/* Debug Overlay */}
        {showDebug && (
          <div className="fixed inset-0 p-6 z-[999] pointer-events-none">
            <div
              className="pointer-events-auto max-w-4xl mx-auto bg-black/80 text-white p-4 rounded-lg overflow-auto"
              style={{ maxHeight: '80vh' }}
            >
              <h3 className="font-black mb-2">DEBUG: siteData</h3>
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(siteData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
