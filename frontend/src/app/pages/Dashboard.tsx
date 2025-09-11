'use client'

import {
  FileText,
  TreePine,
  MapPin,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Brain,
  Zap,
  Eye,
  Target,
  Shield,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from './LanguageContext';

const monthlyData = [
  { month: 'Jan', claims: 45, allotments: 32 },
  { month: 'Feb', claims: 52, allotments: 41 },
  { month: 'Mar', claims: 61, allotments: 38 },
  { month: 'Apr', claims: 58, allotments: 45 },
  { month: 'May', claims: 67, allotments: 52 },
  { month: 'Jun', claims: 71, allotments: 48 },
];

export function Dashboard() {
  const { t, language } = useLanguage();

  const statusData = [
    { name: t('status.approved'), value: 45, color: '#10b981' },
    { name: t('status.pending'), value: 30, color: '#f59e0b' },
    { name: t('status.underReview'), value: 20, color: '#3b82f6' },
    { name: t('status.rejected'), value: 5, color: '#ef4444' },
  ];

  const recentActivities = [
    {
      action: t('activity.newClaim'),
      location: t('activity.adilabadDistrict'),
      time: `2 ${t('activity.hoursAgo')}`,
      status: 'pending',
      icon: FileText
    },
    {
      action: t('activity.allotmentApproved'),
      location: t('activity.warangalForest'),
      time: `5 ${t('activity.hoursAgo')}`,
      status: 'approved',
      icon: CheckCircle
    },
    {
      action: t('activity.documentVerification'),
      location: t('activity.khammamRegion'),
      time: `1 ${t('activity.dayAgo')}`,
      status: 'review',
      icon: Eye
    },
    {
      action: t('activity.surveyCompleted'),
      location: t('activity.nalgondaHills'),
      time: `2 ${t('activity.daysAgo')}`,
      status: 'completed',
      icon: MapPin
    },
  ];

  return (
    <div className={`space-y-6 lg:space-y-8 animate-fade-in w-full ${language === 'hi' ? 'hindi-text' : ''}`}>
      {/* Welcome section with government styling */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white overflow-hidden shadow-xl border border-green-500/20">
        {/* Government emblem background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-32 h-32 border-4 border-white/20 rounded-full flex items-center justify-center">
            <TreePine className="w-16 h-16" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
            <span className="text-green-100 font-medium">{t('status.online')}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">{t('dashboard.welcome')}</h1>
          <p className="text-green-100 text-xl lg:text-2xl leading-relaxed max-w-4xl">
            {t('dashboard.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
              <TreePine className="w-4 h-4 mr-2" />
              {t('system.forestManagement')}
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
              <Brain className="w-4 h-4 mr-2" />
              {t('system.aiPowered')}
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
              <Shield className="w-4 h-4 mr-2" />
              {t('system.securePlatform')}
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
              <Eye className="w-4 h-4 mr-2" />
              {t('common.govCertified')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats cards with government styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">{t('dashboard.totalClaims')}</CardTitle>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">1,247</div>
            <p className="text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              +12% {t('common.lastMonth')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors duration-300">{t('dashboard.activeAllotments')}</CardTitle>
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              <TreePine className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">892</div>
            <p className="text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              +8% {t('common.lastMonth')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border-l-4 border-l-purple-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors duration-300">{t('dashboard.mappedAreas')}</CardTitle>
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              <MapPin className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">2,156</div>
            <p className="text-sm text-gray-600">{t('dashboard.hectaresMapped')}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border-l-4 border-l-orange-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors duration-300">{t('dashboard.beneficiaries')}</CardTitle>
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">3,421</div>
            <p className="text-sm text-gray-600">{t('dashboard.familiesServed')}</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Analytics Overview with government styling */}
      <Card className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-t-green-600">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">{t('system.aiAnalysis')}</CardTitle>
                <p className="text-gray-600 mt-1">{t('system.aiAnalysisDesc')}</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className="bg-green-50 text-green-800 border-green-200 px-3 py-1">
                <Zap className="w-4 h-4 mr-2" />
                {t('system.activelearning')}
              </Badge>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>{t('system.liveAnalysis')}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">{t('system.claimsAnalyzed')}</span>
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">1,089</div>
              <div className="text-xs text-green-600 font-medium">94% {t('system.accuracyRate')}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">{t('system.autoApproved')}</span>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">673</div>
              <div className="text-xs text-blue-600 font-medium">62% {t('system.totalClaims')}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">{t('system.flaggedReview')}</span>
                <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">298</div>
              <div className="text-xs text-yellow-600 font-medium">27% {t('system.requireAttention')}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">{t('system.avgProcessTime')}</span>
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">4.2s</div>
              <div className="text-xs text-purple-600 font-medium">85% {t('system.fasterManual')}</div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  {t('system.aiSystemOptimal')} • {t('system.lastUpdated')}
                </span>
              </div>
              <Badge className="bg-green-50 text-green-800 border-green-200 px-3 py-1">
                <Eye className="w-3 h-3 mr-1" />
                {t('system.monitoring247')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 border-t-4 border-t-blue-600">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">{t('charts.monthlyActivity')}</CardTitle>
                <p className="text-gray-600 mt-1 text-sm">{t('charts.activityDesc')}</p>
              </div>
              <Badge className="bg-blue-50 text-blue-800 border-blue-200 px-3 py-1">
                <BarChart3 className="w-3 h-3 mr-1" />
                {t('charts.analytics')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="month" className="text-gray-600" />
                <YAxis className="text-gray-600" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="claims" fill="url(#claimsGradient)" name={t('sidebar.claims')} radius={[6, 6, 0, 0]} />
                <Bar dataKey="allotments" fill="url(#allotmentsGradient)" name={t('sidebar.allotments')} radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="claimsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="allotmentsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 border-t-4 border-t-purple-600">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">{t('charts.statusDistribution')}</CardTitle>
                <p className="text-gray-600 mt-1 text-sm">{t('charts.statusDesc')}</p>
              </div>
              <Badge className="bg-purple-50 text-purple-800 border-purple-200 px-3 py-1">
                <Target className="w-3 h-3 mr-1" />
                {t('charts.status')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent ?? 0).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity and quick actions with government styling */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 border-t-4 border-t-green-600">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">{t('activity.recentActivity')}</CardTitle>
                <p className="text-gray-600 mt-1 text-sm">{t('activity.recentDesc')}</p>
              </div>
              <Badge className="bg-green-50 text-green-800 border-green-200 px-3 py-1">
                <Clock className="w-3 h-3 mr-1" />
                {t('activity.liveFeed')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:shadow-sm transition-all duration-300 group">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'approved' ? 'bg-green-500' :
                    item.status === 'pending' ? 'bg-yellow-500' :
                    item.status === 'review' ? 'bg-blue-500' : 'bg-gray-500'
                  } animate-pulse`} />
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    item.status === 'approved' ? 'bg-green-100 text-green-600' :
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    item.status === 'review' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.action}</p>
                    <p className="text-sm text-gray-600">{item.location}</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-medium">
                    {item.time}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 border-t-4 border-t-blue-600">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">{t('processing.title')}</CardTitle>
                <p className="text-gray-600 mt-1 text-sm">{t('processing.desc')}</p>
              </div>
              <Badge className="bg-blue-50 text-blue-800 border-blue-200 px-3 py-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {t('processing.progress')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{t('processing.claimsProcessing')}</span>
                <span className="font-bold text-green-600">75%</span>
              </div>
              <Progress value={75} className="h-3 bg-gray-100" />
              <p className="text-sm text-gray-600">892 of 1,189 {t('processing.claimsProcessed')}</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{t('processing.documentVerification')}</span>
                <span className="font-bold text-blue-600">60%</span>
              </div>
              <Progress value={60} className="h-3 bg-gray-100" />
              <p className="text-sm text-gray-600">1,456 of 2,427 {t('processing.documentsVerified')}</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{t('processing.surveyCompletion')}</span>
                <span className="font-bold text-purple-600">85%</span>
              </div>
              <Progress value={85} className="h-3 bg-gray-100" />
              <p className="text-sm text-gray-600">1,834 {t('processing.hectaresSurveyed')}</p>
            </div>
            <div className="pt-6 space-y-4 border-t border-gray-100">
              <div className="flex items-center justify-between p-3 rounded-xl bg-green-50/80 backdrop-blur-sm border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">{t('processing.completedToday')}</span>
                </div>
                <span className="font-bold text-green-700 text-lg">24</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-50/80 backdrop-blur-sm border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">{t('processing.inProgress')}</span>
                </div>
                <span className="font-bold text-yellow-700 text-lg">18</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/80 backdrop-blur-sm border border-red-200">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">{t('processing.requiresAttention')}</span>
                </div>
                <span className="font-bold text-red-700 text-lg">7</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}