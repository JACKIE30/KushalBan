'use client'

import { useState } from 'react';
// Remove Next.js imports
import {
  MapPin,
  FileText,
  TreePine,
  BarChart3,
  Upload,
  Search,
  Bell,
  Settings,
  User,
  Menu,
  X,
  PlusCircle,
  LogOut,
  ArrowLeft,
  Scan
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../components/ui/alert-dialog';

type Page =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'submit-claim'
  | 'claims'
  | 'allotments'
  | 'documents'
  | 'ocr-processing';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: Page;
  onNavigate?: (page: Page) => void;
}

export function Layout({ children, activeTab, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const navItems: { id: Page; label: string; icon: any }[] = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: BarChart3 },
    { id: 'submit-claim', label: t('sidebar.submitClaim'), icon: PlusCircle },
    { id: 'claims', label: t('sidebar.claims'), icon: FileText },
    { id: 'allotments', label: t('sidebar.allotments'), icon: TreePine },
    { id: 'documents', label: t('sidebar.documents'), icon: Upload },
    { id: 'ocr-processing', label: t('sidebar.ocrProcessing'), icon: Scan },
  ];

  const currentTab = activeTab || 'dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-green-50/30 flex">
      {/* Background decorative elements - more subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-green-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-50/40 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white/98 backdrop-blur-xl border-r border-gray-200 shadow-lg
        transform transition-all duration-300 ease-in-out overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:z-auto lg:shadow-none lg:flex lg:flex-shrink-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-md">
                  <TreePine className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{t('nav.portal')}</h1>
                  <p className="text-xs text-gray-600">{t('nav.subtitle')}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        onNavigate?.(item.id);
                      }}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden
                        ${currentTab === item.id
                          ? 'bg-green-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-green-50 hover:text-green-800 hover:shadow-sm'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 transition-all duration-300 ${
                        currentTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-green-600'
                      }`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:shadow-sm transition-all duration-300">
              <Avatar className="w-10 h-10 ring-2 ring-green-200 ring-offset-1">
                <AvatarImage src="" />
                <AvatarFallback className="bg-green-600 text-white text-sm font-bold">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'FA'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Forest Admin'}</p>
                <p className="text-xs text-gray-600 truncate">{user?.email || 'admin@fra.gov.in'}</p>
                <p className="text-xs text-green-600 capitalize truncate">{user?.role || 'admin'}</p>
              </div>
              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-green-100 hover:text-green-700 transition-colors duration-200 rounded-lg p-2"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-100 hover:text-red-700 transition-colors duration-200 rounded-lg p-2"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('auth.logout')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('auth.logoutConfirm')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          logout();
                          onNavigate?.('landing');
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {t('auth.logout')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10 lg:ml-0">
        {/* Top bar */}
        <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 lg:px-6 py-4 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between max-w-none">
            <div className="flex items-center space-x-4 flex-1">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-green-50 hover:text-green-700 transition-colors duration-200 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-green-50 hover:text-green-700 transition-colors duration-200 rounded-lg"
                title={t('nav.backToHome')}
                onClick={() => onNavigate?.('landing')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="relative group flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                <Input
                  placeholder={t('search.placeholder')}
                  className="pl-10 w-full h-10 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-green-50 hover:text-green-700 transition-colors duration-200 rounded-lg p-2"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold shadow-sm text-[10px]">3</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-green-50 hover:text-green-700 transition-colors duration-200 rounded-lg p-2"
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto bg-gray-50/30">
          <div className="max-w-full mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}