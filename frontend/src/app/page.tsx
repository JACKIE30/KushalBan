'use client'

import { JSX, useEffect, useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginSignup } from './pages/LoginSignup';
import { Dashboard } from './pages/Dashboard';
import { ClaimSubmission } from './pages/ClaimSubmission';
import { ClaimsManagement } from './pages/ClaimsManagement';
import { Allotments } from './pages/Allotments';
import { DocumentCenter } from './pages/DocumentCenter';
import { OCRProcessor } from './pages/OCRProcessor';
import { Layout } from './pages/Layout';
import { LanguageProvider } from './pages/LanguageContext';
import { AuthProvider, useAuth } from './pages/AuthContext';
import FRAAtlasMap from './pages/fra-atlas';

type Page =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'submit-claim'
  | 'claims'
  | 'allotments'
  | 'documents'
  | 'ocr-processing'
  | 'atlas';

// Map URL → Page
const pathToPage: Record<string, Page> = {
  '/': 'landing',
  '/auth': 'auth',
  '/dashboard': 'dashboard',
  '/dashboard/submit-claim': 'submit-claim',
  '/dashboard/claims': 'claims',
  '/dashboard/allotments': 'allotments',
  '/dashboard/documents': 'documents',
  '/dashboard/ocr-processing': 'ocr-processing',
  '/dashboard/fra-atlas': 'atlas'
};

// Map Page → URL
const pageToPath: Record<Page, string> = {
  landing: '/',
  auth: '/auth',
  dashboard: '/dashboard',
  'submit-claim': '/dashboard/submit-claim',
  claims: '/dashboard/claims',
  allotments: '/dashboard/allotments',
  documents: '/dashboard/documents',
  'ocr-processing': '/dashboard/ocr-processing',
  'atlas': '/dashboard/atlas',
};
function getPageFromPath(path: string): Page {
  // Try to match exact path first
  if (pathToPage[path]) return pathToPage[path];

  // Fallback for `/dashboard/...`
  if (path.startsWith('/dashboard')) return 'dashboard';

  return 'landing';
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { isAuthenticated, loading } = useAuth();

  // Initialize from URL
  useEffect(() => {
    setCurrentPage(getPageFromPath(window.location.pathname));
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    window.history.pushState({}, '', pageToPath[page]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Landing & Auth
  if (currentPage === 'landing') {
    return <LandingPage onGetStarted={() => handlePageChange('auth')} />;
  }

  if (currentPage === 'auth') {
    return <LoginSignup onSuccess={() => handlePageChange('dashboard')} />;
  }

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return <LoginSignup onSuccess={() => handlePageChange('dashboard')} />;
  }

  // Dashboard pages mapping
  const dashboardContent: Partial<Record<Page, JSX.Element>> = {
    dashboard: <Dashboard />,
    'submit-claim': <ClaimSubmission />,
    claims: <ClaimsManagement />,
    allotments: <Allotments />,
    documents: <DocumentCenter />,
    'ocr-processing': <OCRProcessor />,
    landing: <Dashboard />, // fallback
    auth: <Dashboard />,
    atlas: <FRAAtlasMap/> // fallback
  };

  return (
    <Layout
      activeTab={currentPage === 'dashboard' ? 'dashboard' : currentPage}
      onNavigate={handlePageChange}
    >
      {dashboardContent[currentPage] ?? <Dashboard />}
    </Layout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
