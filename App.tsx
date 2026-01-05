import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';

import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/dashboard/auth/ProtectedRoute';

// Lazy Load Pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const Dashboard = React.lazy(() => import('./pages/DashboardPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const PortfolioPage = React.lazy(() => import('./pages/PortfolioPage'));
const FaqPage = React.lazy(() => import('./pages/FaqPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const ResetData = React.lazy(() => import('./pages/ResetData'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const ReviewsPage = React.lazy(() => import('./pages/ReviewsPage'));

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <UIProvider>
          <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-slate-950"><LoadingSpinner /></div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/en/reviews" element={<ReviewsPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/reset-data" element={<ResetData />} />
            </Routes>
          </Suspense>
        </UIProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
