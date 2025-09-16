'use client'

// Remove Next.js Link import
import {
  TreePine,
  FileText,
  MapPin,
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  Award,
  Globe,
  ArrowRight,
  Star,
  Quote,
  Menu,
  Phone,
  Mail,
  Building2,
  Settings
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from './LanguageContext';

interface LandingPageProps {
  onGetStarted?: () => void;
  onAdminLogin?: () => void;
}

export function LandingPage({ onGetStarted, onAdminLogin }: LandingPageProps) {
  const { t } = useLanguage();

  const features = [
    {
      icon: FileText,
      title: t('features.claims.title'),
      description: t('features.claims.desc'),
      color: 'from-green-600 to-green-700',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      icon: TreePine,
      title: t('features.allotments.title'),
      description: t('features.allotments.desc'),
      color: 'from-emerald-600 to-emerald-700',
      bgColor: 'from-emerald-50 to-emerald-100'
    },
    {
      icon: MapPin,
      title: t('features.gis.title'),
      description: t('features.gis.desc'),
      color: 'from-blue-600 to-blue-700',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.desc'),
      color: 'from-teal-600 to-teal-700',
      bgColor: 'from-teal-50 to-teal-100'
    },
    {
      icon: BarChart3,
      title: t('features.analytics.title'),
      description: t('features.analytics.desc'),
      color: 'from-indigo-600 to-indigo-700',
      bgColor: 'from-indigo-50 to-indigo-100'
    },
    {
      icon: Users,
      title: t('features.access.title'),
      description: t('features.access.desc'),
      color: 'from-purple-600 to-purple-700',
      bgColor: 'from-purple-50 to-purple-100'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'District Forest Officer, Adilabad',
      image: 'https://images.unsplash.com/photo-1655985313952-4a182841d6e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwb2ZmaWNpYWwlMjBmb3Jlc3R8ZW58MXx8fHwxNzU2NjE1NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      quote: 'This system has revolutionized how we process FRA claims. The transparency and efficiency have improved dramatically, reducing processing time by 60%.'
    },
    {
      name: 'Sunita Devi',
      role: 'Community Leader, Dharmasagar Village',
      image: 'https://images.unsplash.com/photo-1621394250710-621401830f4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmliYWwlMjBjb21tdW5pdHklMjBmb3Jlc3QlMjByaWdodHN8ZW58MXx8fHwxNzU2NjE1NjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      quote: 'Finally, we can track our claims in real-time and know exactly where we stand. The digital process has made everything more transparent and accessible.'
    },
    {
      name: 'Prof. Anand Sharma',
      role: 'Forest Rights Researcher, TISS',
      image: 'https://images.unsplash.com/photo-1718988249152-d51871866843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZvcmVzdCUyMGNvbnNlcnZhdGlvbnxlbnwxfHx8fDE3NTY2MTU2ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      quote: 'The GIS integration and analytics capabilities provide unprecedented insights into forest rights implementation across different regions.'
    }
  ];

  const stats = [
    { number: '50,000+', label: t('landing.stats.claims') },
    { number: '15,000+', label: t('landing.stats.beneficiaries') },
    { number: '25', label: t('landing.stats.districts') },
    { number: '98%', label: t('landing.stats.satisfaction') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-green-50/50 relative overflow-hidden">
      {/* Background decorative elements - more subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-green-50/60 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-emerald-50/50 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 py-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-md">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{t('nav.portal')}</h1>
                <p className="text-xs text-gray-600">{t('nav.subtitle')}</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" className="font-medium hover:text-green-700 hover:bg-green-50 transition-colors duration-200">
                {t('nav.about')}
              </Button>
              <Button variant="ghost" className="font-medium hover:text-green-700 hover:bg-green-50 transition-colors duration-200">
                {t('nav.features')}
              </Button>
              <Button variant="ghost" className="font-medium hover:text-green-700 hover:bg-green-50 transition-colors duration-200">
                {t('nav.contact')}
              </Button>
              <LanguageSwitcher />
              <Button
                variant="outline"
                className="border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-700 hover:text-green-700 px-4 py-2 transition-all duration-300 flex items-center gap-2"
                onClick={onAdminLogin}
              >
                <Settings className="w-4 h-4" />
                {t('nav.adminLogin')}
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 shadow-md hover:shadow-lg transition-all duration-300"
                onClick={onGetStarted}
              >
                {t('nav.accessPortal')}
              </Button>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <Badge className="bg-green-50 text-green-800 border-green-200 px-4 py-2 rounded-full">
                  {t('landing.badge')}
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {t('landing.title')}
                  <span className="block text-green-600">{t('landing.titleHighlight')}</span>
                </h1>
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl">
                  {t('landing.subtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                  onClick={onGetStarted}
                >
                  {t('nav.accessPortal')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-3 text-lg border-2 border-gray-300 hover:border-green-500 hover:text-green-700 hover:bg-green-50 transition-all duration-300"
                >
                  {t('nav.learnMore')}
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1645791497474-c0c1a7a4c7b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBtYW5hZ2VtZW50JTIwZGlnaXRhbCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU2NjE1NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Forest Management Technology"
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-md border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-800">{t('common.secureVerified')}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-white rounded-lg px-3 py-2 shadow-md border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-800">{t('common.govCertified')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-blue-50 text-blue-800 border-blue-200 px-4 py-2 rounded-full mb-4">
              {t('features.badge')}
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {t('features.title')}
              <span className="block text-green-600">{t('features.titleHighlight')}</span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                    <div className="mt-4 flex items-center text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-sm">{t('common.learnMore')}</span>
                      <ArrowRight className="w-4 h-4 ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {t('about.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('about.para1')}
              </p>
              <p className="text-gray-600 mb-8">
                {t('about.para2')}
              </p>

              <div className="space-y-4">
                {[
                  t('about.point1'),
                  t('about.point2'),
                  t('about.point3'),
                  t('about.point4')
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-green-600 text-white p-6">
                  <Globe className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">{t('cards.national')}</h3>
                  <p className="text-green-100 text-sm">{t('cards.nationalDesc')}</p>
                </Card>
                <Card className="bg-blue-600 text-white p-6 mt-6">
                  <Award className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">{t('cards.award')}</h3>
                  <p className="text-blue-100 text-sm">{t('cards.awardDesc')}</p>
                </Card>
                <Card className="bg-teal-600 text-white p-6 -mt-3">
                  <Shield className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">{t('cards.secure')}</h3>
                  <p className="text-teal-100 text-sm">{t('cards.secureDesc')}</p>
                </Card>
                <Card className="bg-emerald-600 text-white p-6 mt-3">
                  <Users className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold mb-2">{t('cards.community')}</h3>
                  <p className="text-emerald-100 text-sm">{t('cards.communityDesc')}</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Stakeholders
            </h2>
            <p className="text-lg text-gray-600">
              Hear from government officials, community leaders, and researchers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-green-600 mb-4" />
                  <p className="text-gray-700 mb-6 italic text-sm">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-3">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-green-700 hover:bg-gray-100 px-8 py-3"
              onClick={onGetStarted}
            >
              {t('cta.accessNow')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-3"
            >
              {t('cta.requestDemo')}
            </Button>
          </div>
          <p className="text-green-100 text-sm mt-6">
            {t('cta.note')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <TreePine className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">FRA Portal</h3>
                  <p className="text-xs text-gray-400">Forest Rights Management</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Digital platform for transparent and efficient Forest Rights Act implementation.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('footer.platform')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Claims Management</li>
                <li>GIS Mapping</li>
                <li>Document Center</li>
                <li>Analytics</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>User Guide</li>
                <li>Training Materials</li>
                <li>Contact Support</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>Ministry of Environment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>1800-XXX-XXXX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@fra.gov.in</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer.accessibility')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}