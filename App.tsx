import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SystemProvider } from './context/SystemContext';
import { ContentProvider } from './context/ContentContext';
import { BusinessProvider } from './context/BusinessContext';
import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';
import { SyncProvider } from './context/SyncContext';

// Lazy load all pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const ReviewDetailsPage = lazy(() => import('./pages/ReviewDetailsPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-slate-400 font-bold text-sm">جاري التحميل...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <SystemProvider>
        <ContentProvider>
          <BusinessProvider>
            <UIProvider>
              <SyncProvider>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard/*" element={<DashboardPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<ArticlePage />} />
                    <Route path="/reviews" element={<ReviewsPage />} />
                    <Route path="/reviews/:id" element={<ReviewDetailsPage />} />
                  </Routes>
                </Suspense>
              </SyncProvider>
            </UIProvider>
          </BusinessProvider>
        </ContentProvider>
      </SystemProvider>
    </AuthProvider>
  );
}

export default App;
