'use client'

import { useState } from 'react';
import { TreePine, Shield, Users, Lock, Mail, User, Building, IdCard, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';

interface LoginSignupProps {
  onSuccess: () => void;
}

export function LoginSignup({ onSuccess }: LoginSignupProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { t } = useLanguage();
  const { login, signup, loading } = useAuth();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  type Role = "officer" | "admin" | "supervisor";

    interface SignupData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: Role; // ✅ now supports all roles
    department: string;
    employeeId: string;
    }
  // Signup form state
  const [signupData, setSignupData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: "officer",
    department: '',
    employeeId: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginData.email || !loginData.password) {
      setError(t('auth.fillAllFields'));
      return;
    }

    const success = await login(loginData.email, loginData.password);
    if (success) {
      onSuccess();
    } else {
      setError(t('auth.invalidCredentials'));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signupData.name || !signupData.email || !signupData.password ||
        !signupData.confirmPassword || !signupData.department || !signupData.employeeId) {
      setError(t('auth.fillAllFields'));
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (signupData.password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    const success = await signup(signupData);
    if (success) {
      setSuccess(t('auth.registrationSuccess'));
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setError(t('auth.userExists'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 flex items-center justify-center p-4 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-green-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-50/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-50/10 rounded-full blur-3xl"></div>
      </div>

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
              <TreePine className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('auth.portal')}
          </h1>
          <p className="text-gray-600">
            {isLogin ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
          </p>
        </div>

        {/* Auth Card */}
        <Card className="bg-white/95 backdrop-blur-xl border border-gray-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-semibold text-gray-900">
              {isLogin ? t('auth.signIn') : t('auth.createAccount')}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {isLogin ? t('auth.signInDescription') : t('auth.signUpDescription')}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {isLogin ? (
              // Login Form
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('auth.emailPlaceholder')}
                      className="pl-10 h-12"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.passwordPlaceholder')}
                      className="pl-10 pr-10 h-12"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? t('auth.signingIn') : t('auth.signIn')}
                </Button>
              </form>
            ) : (
              // Signup Form
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.fullName')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('auth.fullNamePlaceholder')}
                      className="pl-10 h-12"
                      value={signupData.name}
                      onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder={t('auth.emailPlaceholder')}
                      className="pl-10 h-12"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee-id">{t('auth.employeeId')}</Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="employee-id"
                      type="text"
                      placeholder={t('auth.employeeIdPlaceholder')}
                      className="pl-10 h-12"
                      value={signupData.employeeId}
                      onChange={(e) => setSignupData(prev => ({ ...prev, employeeId: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">{t('auth.role')}</Label>
                  <Select value={signupData.role} onValueChange={(value: 'admin' | 'officer' | 'supervisor') =>
                    setSignupData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('auth.selectRole')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t('auth.roles.admin')}</SelectItem>
                      <SelectItem value="officer">{t('auth.roles.officer')}</SelectItem>
                      <SelectItem value="supervisor">{t('auth.roles.supervisor')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">{t('auth.department')}</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="department"
                      type="text"
                      placeholder={t('auth.departmentPlaceholder')}
                      className="pl-10 h-12"
                      value={signupData.department}
                      onChange={(e) => setSignupData(prev => ({ ...prev, department: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.passwordPlaceholder')}
                      className="pl-10 pr-10 h-12"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('auth.confirmPassword')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                      className="pl-10 pr-10 h-12"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
                </Button>
              </form>
            )}

            {/* Toggle between login and signup */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className="text-green-600 hover:text-green-700 hover:bg-green-50 mt-2"
              >
                {isLogin ? t('auth.signUp') : t('auth.signIn')}
              </Button>
            </div>

            {/* Security badges */}
            <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>{t('common.secureVerified')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-green-600" />
                <span>{t('common.govCertified')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo credentials notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">{t('auth.demoCredentials')}</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p><strong>{t('auth.admin')}:</strong> admin@fra.gov.in / admin123</p>
            <p><strong>{t('auth.officer')}:</strong> officer@fra.gov.in / officer123</p>
          </div>
        </div>
      </div>
    </div>
  );
}