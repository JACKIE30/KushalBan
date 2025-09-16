'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation objects
const translations = {
  en: {
    // Navigation
    'nav.portal': 'FRA Portal',
    'nav.subtitle': 'Forest Rights Management',
    'nav.about': 'About',
    'nav.features': 'Features',
    'nav.contact': 'Contact',
    'nav.signin': 'Sign In',
    'nav.accessPortal': 'Access Portal',
    'nav.adminLogin': 'Admin Login',
    'nav.learnMore': 'Learn More',
    'nav.backToHome': 'Back to Home',

    // Landing Page
    'landing.badge': '🇮🇳 Government of India Initiative',
    'landing.title': 'Digital Forest Rights',
    'landing.titleHighlight': 'Management',
    'landing.subtitle': 'Empowering forest communities through transparent, efficient, and secure digital management of Forest Rights Act claims and allotments.',
    'landing.stats.claims': 'Claims Processed',
    'landing.stats.beneficiaries': 'Beneficiaries',
    'landing.stats.districts': 'Districts Covered',
    'landing.stats.satisfaction': 'User Satisfaction',

    // Features
    'features.badge': '⚡ Platform Features',
    'features.title': 'Comprehensive Forest Rights',
    'features.titleHighlight': 'Management Platform',
    'features.subtitle': 'Our integrated platform streamlines every aspect of FRA implementation, from claims processing to allotment monitoring and compliance tracking.',

    'features.claims.title': 'Claims Management',
    'features.claims.desc': 'Streamlined processing of Forest Rights Act claims with digital workflows and transparent tracking.',
    'features.allotments.title': 'Allotment Tracking',
    'features.allotments.desc': 'Comprehensive monitoring of forest land allotments with compliance tracking and reporting.',
    'features.gis.title': 'GIS Mapping',
    'features.gis.desc': 'Interactive mapping with satellite imagery, boundary demarcation, and spatial analysis tools.',
    'features.security.title': 'Document Security',
    'features.security.desc': 'Secure document management with verification workflows and digital authentication.',
    'features.analytics.title': 'Analytics Dashboard',
    'features.analytics.desc': 'Real-time insights and reporting for better decision-making and policy implementation.',
    'features.access.title': 'Multi-stakeholder Access',
    'features.access.desc': 'Role-based access for government officials, forest communities, and other stakeholders.',

    // About Section
    'about.title': 'Empowering Forest Communities Through Digital Innovation',
    'about.para1': 'The Forest Rights Act, 2006 recognizes the rights of forest dwelling tribal communities and other traditional forest dwellers to forest resources, on which these communities were dependent for a variety of needs.',
    'about.para2': 'Our digital platform ensures transparent, efficient, and accessible implementation of FRA provisions while maintaining the highest standards of data security and user privacy.',
    'about.point1': 'Transparent claim processing with real-time tracking',
    'about.point2': 'Secure document management and verification',
    'about.point3': 'GIS-based mapping for accurate boundary demarcation',
    'about.point4': 'Comprehensive reporting and analytics tools',

    // Cards
    'cards.national': 'National Coverage',
    'cards.nationalDesc': 'Deployed across multiple states',
    'cards.award': 'Award Winning',
    'cards.awardDesc': 'Digital governance excellence',
    'cards.secure': 'Secure & Compliant',
    'cards.secureDesc': 'Government security standards',
    'cards.community': 'Community Focused',
    'cards.communityDesc': 'Accessible and user-friendly',

    // Testimonials
    'testimonials.title': 'Trusted by Stakeholders',
    'testimonials.subtitle': 'Hear from government officials, community leaders, and researchers',

    // CTA Section
    'cta.title': 'Ready to Transform Forest Rights Management?',
    'cta.subtitle': 'Join thousands of officials and communities already using our platform to ensure transparent and efficient implementation of Forest Rights Act.',
    'cta.accessNow': 'Access Portal Now',
    'cta.requestDemo': 'Request Demo',
    'cta.note': 'Secure login with government credentials • No installation required',

    // Footer
    'footer.platform': 'Platform',
    'footer.support': 'Support',
    'footer.contact': 'Contact',
    'footer.copyright': '© 2024 Government of India. All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.accessibility': 'Accessibility',

    // Dashboard
    'dashboard.welcome': 'Welcome to FRA Portal',
    'dashboard.subtitle': 'Manage forest rights claims, allotments, and documentation with transparency and efficiency using our advanced AI-powered platform',
    'dashboard.totalClaims': 'Total Claims',
    'dashboard.activeAllotments': 'Active Allotments',
    'dashboard.mappedAreas': 'Mapped Areas',
    'dashboard.beneficiaries': 'Beneficiaries',
    'dashboard.hectaresMapped': 'hectares mapped',
    'dashboard.familiesServed': 'families served',

    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.submitClaim': 'Submit Claim',
    'sidebar.claims': 'Claims Management',
    'sidebar.allotments': 'Allotments',
    'sidebar.maps': 'GIS Mapping',
    'sidebar.documents': 'Document Center',
    'sidebar.ocrProcessing': 'OCR Processing',

    // OCR Processing
    'ocr.title': 'OCR + NER Document Processing',
    'ocr.subtitle': 'Upload documents and analyze them using automated text extraction and named entity recognition',
    'ocr.upload': 'Upload Documents',
    'ocr.uploadDesc': 'Drag and drop PDF, PNG, JPG files here or click to select',
    'ocr.chooseFiles': 'Choose Files',
    'ocr.uploadedFiles': 'Uploaded Files',
    'ocr.noFiles': 'No files uploaded yet',
    'ocr.processing': 'Processing',
    'ocr.results': 'Results',
    'ocr.selectFile': 'Select a file to view results',
    'ocr.processingProgress': 'Processing in progress...',
    'ocr.processingError': 'Processing error occurred',
    'ocr.extractedText': 'Extracted Text',
    'ocr.namedEntities': 'Named Entities',
    'ocr.ocrOutput': 'OCR Output',
    'ocr.download': 'Download',
    'ocr.identifiedEntities': 'Identified Entities',
    'ocr.entities': 'entities',

    // Search
    'search.placeholder': 'Search claims, documents, or locations...',

    // Status
    'status.online': 'System Status: Online',
    'status.approved': 'Approved',
    'status.pending': 'Pending',
    'status.underReview': 'Under Review',
    'status.rejected': 'Rejected',

    // Common
    'common.learnMore': 'Learn more',
    'common.lastMonth': 'from last month',
    'common.secureVerified': 'Secure & Verified',
    'common.govCertified': 'Government Certified',

    // Authentication
    'auth.portal': 'FRA Portal',
    'auth.loginSubtitle': 'Secure access for government officials',
    'auth.signupSubtitle': 'Register for authorized access',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.createAccount': 'Create Account',
    'auth.signInDescription': 'Enter your government credentials to access the portal',
    'auth.signUpDescription': 'Register with your official details for portal access',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.employeeId': 'Employee ID',
    'auth.role': 'Role',
    'auth.department': 'Department',
    'auth.emailPlaceholder': 'your.email@fra.gov.in',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.confirmPasswordPlaceholder': 'Confirm your password',
    'auth.fullNamePlaceholder': 'Enter your full name',
    'auth.employeeIdPlaceholder': 'Enter your employee ID',
    'auth.departmentPlaceholder': 'Enter your department',
    'auth.selectRole': 'Select your role',
    'auth.roles.admin': 'Administrator',
    'auth.roles.officer': 'Field Officer',
    'auth.roles.supervisor': 'Supervisor',
    'auth.signingIn': 'Signing In...',
    'auth.creatingAccount': 'Creating Account...',
    'auth.noAccount': "Don't have an account?",
    'auth.haveAccount': 'Already have an account?',
    'auth.demoCredentials': 'Demo Credentials',
    'auth.admin': 'Admin',
    'auth.officer': 'Officer',
    'auth.fillAllFields': 'Please fill in all required fields',
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.passwordMismatch': 'Passwords do not match',
    'auth.passwordTooShort': 'Password must be at least 6 characters',
    'auth.registrationSuccess': 'Registration successful! Redirecting...',
    'auth.userExists': 'User with this email already exists',
    'auth.logout': 'Logout',
    'auth.logoutConfirm': 'Are you sure you want to logout?',

    // Post-login sections translations
    'system.forestManagement': 'Forest Management',
    'system.aiPowered': 'AI-Powered',
    'system.securePlatform': 'Secure Platform',
    'system.aiAnalysis': 'AI-Powered Claim Analysis',
    'system.aiAnalysisDesc': 'Real-time insights and automated processing with machine learning',
    'system.activelearning': 'Active & Learning',
    'system.liveAnalysis': 'Live Analysis',
    'system.claimsAnalyzed': 'Claims Analyzed',
    'system.accuracyRate': 'accuracy rate',
    'system.autoApproved': 'Auto-Approved',
    'system.totalClaims': 'of total claims',
    'system.flaggedReview': 'Flagged for Review',
    'system.requireAttention': 'require attention',
    'system.avgProcessTime': 'Avg Process Time',
    'system.fasterManual': 'faster than manual',
    'system.aiSystemOptimal': 'AI system running optimally',
    'system.lastUpdated': 'Last updated: 2 minutes ago',
    'system.monitoring247': 'Monitoring 24/7',
    'charts.monthlyActivity': 'Monthly Activity',
    'charts.activityDesc': 'Claims and allotments processing trends',
    'charts.analytics': 'Analytics',
    'charts.statusDistribution': 'Claim Status Distribution',
    'charts.statusDesc': 'Current status breakdown of all claims',
    'charts.status': 'Status',
    'activity.recentActivity': 'Recent Activity',
    'activity.recentDesc': 'Latest system updates and actions',
    'activity.liveFeed': 'Live Feed',
    'activity.newClaim': 'New claim submitted',
    'activity.allotmentApproved': 'Allotment approved',
    'activity.documentVerification': 'Document verification',
    'activity.surveyCompleted': 'Survey completed',
    'activity.adilabadDistrict': 'Adilabad District',
    'activity.warangalForest': 'Warangal Forest',
    'activity.khammamRegion': 'Khammam Region',
    'activity.nalgondaHills': 'Nalgonda Hills',
    'activity.hoursAgo': 'hours ago',
    'activity.dayAgo': 'day ago',
    'activity.daysAgo': 'days ago',
    'processing.title': 'Processing Status',
    'processing.desc': 'Current workflow progress overview',
    'processing.progress': 'Progress',
    'processing.claimsProcessing': 'Claims Processing',
    'processing.claimsProcessed': 'claims processed',
    'processing.documentVerification': 'Document Verification',
    'processing.documentsVerified': 'documents verified',
    'processing.surveyCompletion': 'Survey Completion',
    'processing.hectaresSurveyed': 'hectares surveyed',
    'processing.completedToday': 'Completed Today',
    'processing.inProgress': 'In Progress',
    'processing.requiresAttention': 'Requires Attention',
    'common.cancel': 'Cancel',

    // Claim Submission
    'claim.personalDetails': 'Personal Details',
    'claim.landDetails': 'Land Details',
    'claim.communityInfo': 'Community Info',
    'claim.documents': 'Documents',
    'claim.review': 'Review',
    'claim.submit': 'Submit',
    'claim.previous': 'Previous',
    'claim.next': 'Next',
    'claim.firstName': 'First Name',
    'claim.lastName': 'Last Name',
    'claim.fatherName': "Father's Name",
    'claim.dateOfBirth': 'Date of Birth',
    'claim.gender': 'Gender',
    'claim.phoneNumber': 'Phone Number',
    'claim.email': 'Email',
    'claim.aadharNumber': 'Aadhar Number',
    'claim.address': 'Address',
    'claim.village': 'Village',
    'claim.tehsil': 'Tehsil',
    'claim.district': 'District',
    'claim.state': 'State',
    'claim.pincode': 'Pincode',

    // Claims Management
    'claims.management': 'Claims Management',
    'claims.searchClaims': 'Search claims...',
    'claims.filterBy': 'Filter by',
    'claims.allClaims': 'All Claims',
    'claims.viewClaim': 'View Claim',
    'claims.editClaim': 'Edit Claim',
    'claims.claimId': 'Claim ID',
    'claims.applicantName': 'Applicant Name',
    'claims.submissionDate': 'Submission Date',
    'claims.priority': 'Priority',
    'claims.high': 'High',
    'claims.medium': 'Medium',
    'claims.low': 'Low',

    // Allotments
    'allotments.title': 'Forest Land Allotments',
    'allotments.overview': 'Comprehensive tracking of approved forest land allotments',
    'allotments.totalArea': 'Total Area Allotted',
    'allotments.activeCases': 'Active Cases',
    'allotments.compliance': 'Compliance Rate',

    // GIS Mapping
    'gis.title': 'GIS Mapping & Spatial Analysis',
    'gis.overview': 'Interactive mapping with satellite imagery and boundary analysis',
    'gis.satelliteView': 'Satellite View',
    'gis.boundaryMapping': 'Boundary Mapping',
    'gis.layerControls': 'Layer Controls',

    // Document Center
    'docs.title': 'Document Management Center',
    'docs.overview': 'Secure document storage, verification, and compliance tracking',
    'docs.uploadDocument': 'Upload Document',
    'docs.verifyDocument': 'Verify Document',
    'docs.totalDocuments': 'Total Documents',
    'docs.verified': 'Verified',
    'docs.pending': 'Pending Verification',
  },

  hi: {
    // Navigation
    'nav.portal': 'वन अधिकार पोर्टल',
    'nav.subtitle': 'वन अधिकार प्रबंधन',
    'nav.about': 'हमारे बारे में',
    'nav.features': 'सुविधाएं',
    'nav.contact': 'संपर्क',
    'nav.signin': 'साइन इन',
    'nav.accessPortal': 'पोर्टल तक पहुंच',
    'nav.adminLogin': 'व्यवस्थापक लॉगिन',
    'nav.learnMore': 'और जानें',
    'nav.backToHome': 'होम पर वापस जाएं',

    // Landing Page
    'landing.badge': '🇮🇳 भारत सरकार की पहल',
    'landing.title': 'डिजिटल वन अधिकार',
    'landing.titleHighlight': 'प्रबंधन',
    'landing.subtitle': 'वन अधिकार अधिनियम दावों और आवंटन के पारदर्शी, कुशल और सुरक्षित डिजिटल प्रबंधन के माध्यम से वन समुदायों को सशक्त बनाना।',
    'landing.stats.claims': 'दावे संसाधित',
    'landing.stats.beneficiaries': 'लाभार्थी',
    'landing.stats.districts': 'जिले कवर किए गए',
    'landing.stats.satisfaction': 'उपयोगकर्ता संतुष्टि',

    // Features
    'features.badge': '⚡ प्लेटफॉर्म सुविधाएं',
    'features.title': 'व्यापक वन अधिकार',
    'features.titleHighlight': 'प्रबंधन प्लेटफॉर्म',
    'features.subtitle': 'हमारा एकीकृत प्लेटफॉर्म वन अधिकार अधिनियम कार्यान्वयन के हर पहलू को सुव्यवस्थित करता है, दाव�� प्रसंस्करण से लेकर आवंटन निगरानी और अनुपालन ट्रैकिंग तक।',

    'features.claims.title': 'दावा प्रबंधन',
    'features.claims.desc': 'डिजिटल वर्कफ़्लो और पारदर्शी ट्रैकिंग के साथ वन अधिकार अधिनियम दावों की सुव्यवस्थित प्रसंस्करण।',
    'features.allotments.title': 'आवंटन ट्रैकिंग',
    'features.allotments.desc': 'अनुपालन ट्रैकिंग और रिपोर्टिंग के साथ वन भूमि आवंटन की व्यापक निगरानी।',
    'features.gis.title': 'जीआईएस मैपिंग',
    'features.gis.desc': 'उपग्रह इमेजरी, सीमा निर्धारण और स्थानिक विश्लेषण उपकरणों के साथ ���ंटरै��्टिव मैपिंग।',
    'features.security.title': 'दस्तावेज़ सुरक्षा',
    'features.security.desc': 'सत्यापन वर्कफ़्लो और डिजिटल प्रमाणीकरण के साथ सुरक्षित दस्तावेज़ प्रबंधन।',
    'features.analytics.title': 'एनालिटिक्स डैशबोर्ड',
    'features.analytics.desc': 'बेहतर निर्णय लेने और नीति कार्यान्वयन के लिए रीयल-टाइम अंतर्दृष्टि और रिपोर्टिंग।',
    'features.access.title': 'बहु-हितधारक पहुंच',
    'features.access.desc': 'सरकारी अधिकारियों, वन समुदायों और अन्य हितधारकों के लिए भूमिका-आधारित पहुंच।',

    // About Section
    'about.title': 'डिजिटल नवाचार के माध्यम से वन समुदायों का सशक्तिकरण',
    'about.para1': 'वन अधिकार अधिनियम, 2006 वन निवासी आदिवासी समुदायों और अन्य पारंपरिक वन निवासियों के वन संसाधनों पर अधिकारों को मान्यता देता है, जिन पर ये समुदाय विभिन्न आवश्यकताओं के लिए निर्भर थे।',
    'about.para2': 'हमारा डिजिटल प्लेटफॉर्म डेटा सुरक्षा और उपयोगकर्ता गोपनीयता के उच्चतम मानकों को बनाए रखते हुए वन अधिकार अधिनियम प्रावधानों का पारदर्शी, कुशल और सुलभ कार्यान्वयन सुनिश्चित करता है।',
    'about.point1': 'रीयल-टाइम ट्रैकिंग के साथ पारदर्शी दावा प्रसंस्करण',
    'about.point2': 'सुरक्षित दस्तावेज़ प्रबंधन और सत्यापन',
    'about.point3': 'सटीक सीमा निर्धारण के लिए जीआईएस-आधारित मैपिंग',
    'about.point4': 'व्यापक रिपोर्टिंग और एनालिटिक्स उपकरण',

    // Cards
    'cards.national': 'राष्ट्रीय कवरेज',
    'cards.nationalDesc': 'कई राज्यों में तैनात',
    'cards.award': 'पुरस्कार विजेता',
    'cards.awardDesc': 'डिजिटल गवर्नेंस उत्कृष्टता',
    'cards.secure': 'सुरक्षित और अनुपालित',
    'cards.secureDesc': 'सरकारी सुरक्षा मानक',
    'cards.community': 'समुदाय केंद्रित',
    'cards.communityDesc': 'सुलभ और उपयोगकर्ता-मित्र',

    // Testimonials
    'testimonials.title': 'हितधारकों द्वारा भरोसेमंद',
    'testimonials.subtitle': 'सरकारी अधिकारियों, समुदायिक नेताओं और शोधकर्ताओं से सुनें',

    // CTA Section
    'cta.title': 'वन अधिकार प्रबंधन को बदलने के लिए तैयार हैं?',
    'cta.subtitle': 'हजारों अधिकारियों और समुदायों के साथ जुड़ें जो पहले से ही हमारे प्लेटफॉर्म का उपयोग करके वन अधिकार अधिनियम के पारदर्शी और कुशल कार्यान्वयन को सुनिश्चित कर रहे हैं।',
    'cta.accessNow': 'अभी पोर्टल तक पहुंचें',
    'cta.requestDemo': 'डेमो का अनुरोध करें',
    'cta.note': 'सरकारी क्रेडेंशियल के साथ सुरक्षित लॉगिन • कोई इंस्टॉलेशन आवश्यक नहीं',

    // Footer
    'footer.platform': 'प्लेटफॉर्म',
    'footer.support': 'सहायता',
    'footer.contact': 'संपर्क',
    'footer.copyright': '© 2024 भारत सरकार। सभी अधिकार सुरक्षित।',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.accessibility': 'पहुंच',

    // Dashboard
    'dashboard.welcome': 'वन अधिकार पोर्टल में आपका स्वागत है',
    'dashboard.subtitle': 'हमारे उन्नत एआई-संचालित प्लेटफॉर्म का उपयोग करके पारदर्शिता और दक्षता के साथ वन अधिकार दावों, आवंटन और दस्तावेज़ीकरण का प्रबंधन करें',
    'dashboard.totalClaims': 'कुल दावे',
    'dashboard.activeAllotments': 'सक्रिय आवंटन',
    'dashboard.mappedAreas': 'मैप किए गए क्षेत्र',
    'dashboard.beneficiaries': 'लाभार्थी',
    'dashboard.hectaresMapped': 'हेक्टेयर मैप किए गए',
    'dashboard.familiesServed': 'परिवारों की सेवा की',

    // Sidebar
    'sidebar.dashboard': 'डैशबोर्ड',
    'sidebar.submitClaim': 'दावा जमा करें',
    'sidebar.claims': 'दावा प्रबंधन',
    'sidebar.allotments': 'आवंटन',
    'sidebar.maps': 'जीआईएस मैपिंग',
    'sidebar.documents': 'दस्तावेज़ केंद्र',
    'sidebar.ocrProcessing': 'ओसीआर प्रसंस्करण',

    // OCR Processing
    'ocr.title': 'ओसीआर + एनईआर दस्तावेज़ प्रसंस्करण',
    'ocr.subtitle': 'दस्तावेजों को अपलोड करें और स्वचालित टेक्स्ट निष्कर्षण और नामित इकाई पहचान का उपयोग करके उनका विश्लेषण करें',
    'ocr.upload': 'दस्तावेज़ अपलोड करें',
    'ocr.uploadDesc': 'PDF, PNG, JPG फाइलों को यहाँ खींचकर छोड़ें या क्लिक करके चुनें',
    'ocr.chooseFiles': 'फाइल चुनें',
    'ocr.uploadedFiles': 'अपलोड की गई फाइलें',
    'ocr.noFiles': 'कोई फाइल अपलोड नहीं की गई',
    'ocr.processing': 'प्रसंस्करण',
    'ocr.results': 'परिणाम',
    'ocr.selectFile': 'परिणाम देखने के लिए एक फाइल चुनें',
    'ocr.processingProgress': 'प्रसंस्करण जारी है...',
    'ocr.processingError': 'प्रसंस्करण में त्रुटि हुई',
    'ocr.extractedText': 'निकाला गया टेक्स्ट',
    'ocr.namedEntities': 'नामित इकाइयाँ',
    'ocr.ocrOutput': 'ओसीआर आउटपुट',
    'ocr.download': 'डाउनलोड',
    'ocr.identifiedEntities': 'पहचानी गई इकाइयाँ',
    'ocr.entities': 'इकाइयाँ',

    // Search
    'search.placeholder': 'दावे, दस्तावेज़ या स्थान खोजें...',

    // Status
    'status.online': 'सिस्टम स्थिति: ऑनलाइन',
    'status.approved': 'अनुमोदित',
    'status.pending': 'लंबित',
    'status.underReview': 'समीक्षाधीन',
    'status.rejected': 'अस्वीकृत',

    // Common
    'common.learnMore': 'और जानें',
    'common.lastMonth': 'पिछले महीने से',
    'common.secureVerified': 'सुरक्षित और सत्यापित',
    'common.govCertified': 'सरकार द्वारा प्रमाणित',

    // Authentication
    'auth.portal': 'वन अधिकार पोर्टल',
    'auth.loginSubtitle': 'सरकारी अधिकारियों के लिए सुरक्षित पहुंच',
    'auth.signupSubtitle': 'अधिकृत पहुंच के लिए पंजीकरण करें',
    'auth.signIn': 'साइन इन',
    'auth.signUp': 'साइन अप',
    'auth.createAccount': 'खाता बनाएं',
    'auth.signInDescription': 'पोर्टल तक पहुंचने के लिए अपनी सरकारी क्रेडेंशियल दर्ज करें',
    'auth.signUpDescription': 'पोर्टल एक्सेस के लिए अपने आधिकारिक विवरण के साथ पंजीकरण करें',
    'auth.email': 'ईमेल पता',
    'auth.password': 'पासवर्ड',
    'auth.confirmPassword': 'पासवर्ड की पुष्टि करें',
    'auth.fullName': 'पूरा नाम',
    'auth.employeeId': 'कर्मचारी आईडी',
    'auth.role': 'भूमिका',
    'auth.department': 'विभाग',
    'auth.emailPlaceholder': 'your.email@fra.gov.in',
    'auth.passwordPlaceholder': 'अपना पासवर्ड दर्ज करें',
    'auth.confirmPasswordPlaceholder': 'अपने पासवर्ड की पुष्टि करें',
    'auth.fullNamePlaceholder': 'अपना पूरा नाम दर्ज करें',
    'auth.employeeIdPlaceholder': 'अपनी कर्मचारी आईडी दर्ज करें',
    'auth.departmentPlaceholder': 'अपना विभाग दर्ज करें',
    'auth.selectRole': 'अपनी भूमिका चुनें',
    'auth.roles.admin': 'प्रशासक',
    'auth.roles.officer': 'फील्ड अधिकारी',
    'auth.roles.supervisor': 'पर्यवेक्षक',
    'auth.signingIn': 'साइन इन हो रहा है...',
    'auth.creatingAccount': 'खाता बनाया जा रहा है...',
    'auth.noAccount': 'कोई खाता नहीं है?',
    'auth.haveAccount': 'पहले से ही एक खाता है?',
    'auth.demoCredentials': 'डेमो क्रेडेंशियल',
    'auth.admin': 'प्रशासक',
    'auth.officer': 'अधिकारी',
    'auth.fillAllFields': 'कृपया सभी आवश्यक फ़ील्ड भरें',
    'auth.invalidCredentials': 'अमान्य ईमेल या पासवर्ड',
    'auth.passwordMismatch': 'पासवर्ड मेल नहीं खाते',
    'auth.passwordTooShort': 'पासवर्ड कम से कम 6 वर्ण का होना चाहिए',
    'auth.registrationSuccess': 'पंजीकरण सफल! रीडायरेक्ट कर रहा है...',
    'auth.userExists': 'इस ईमेल के साथ उपयोगकर्ता पहले से मौजूद है',
    'auth.logout': 'लॉगआउट',
    'auth.logoutConfirm': 'क्या आप वाकई लॉगआउट करना चाहते हैं?',

    // Post-login sections translations
    'system.forestManagement': 'वन प्रबंधन',
    'system.aiPowered': 'एआई संचालित',
    'system.securePlatform': 'सुरक्षित प्लेटफॉर्म',
    'system.aiAnalysis': 'एआई-संचालित दावा विश्लेषण',
    'system.aiAnalysisDesc': 'मशीन लर्निंग के साथ रीयल-टाइम अंतर्दृष्टि और स्वचालित प्रसंस्करण',
    'system.activelearning': 'सक्रिय और सीखना',
    'system.liveAnalysis': 'लाइव विश्लेषण',
    'system.claimsAnalyzed': 'दावे विश्लेषित',
    'system.accuracyRate': 'सटीकता दर',
    'system.autoApproved': 'स्वतः अनुमोदित',
    'system.totalClaims': 'कुल दावों में से',
    'system.flaggedReview': 'समीक्षा के लिए चिह्नित',
    'system.requireAttention': 'ध्यान चाहिए',
    'system.avgProcessTime': 'औसत प्रक्रिया समय',
    'system.fasterManual': 'मैनुअल से तेज',
    'system.aiSystemOptimal': 'एआई सिस्टम इष्टतम रूप से चल रहा है',
    'system.lastUpdated': 'अंतिम अपडेट: 2 मिनट पहले',
    'system.monitoring247': '24/7 निगरानी',
    'charts.monthlyActivity': 'मासिक गतिविधि',
    'charts.activityDesc': 'दावे और आवंटन प्रसंस्करण रुझान',
    'charts.analytics': 'एनालिटिक्स',
    'charts.statusDistribution': 'दावा स्थिति वितरण',
    'charts.statusDesc': 'सभी दावों का वर्तमान स्थिति विभाजन',
    'charts.status': 'स्थिति',
    'activity.recentActivity': 'हाल की गतिविधि',
    'activity.recentDesc': 'नवीनतम सिस्टम अपडेट और कार्य',
    'activity.liveFeed': 'लाइव फीड',
    'activity.newClaim': 'नया दावा प्रस्तुत',
    'activity.allotmentApproved': 'आवंटन अनुमोदित',
    'activity.documentVerification': 'दस्तावेज़ सत्यापन',
    'activity.surveyCompleted': 'सर्वेक्षण पूर्ण',
    'activity.adilabadDistrict': 'आदिलाबा�� जिला',
    'activity.warangalForest': 'वारंगल वन',
    'activity.khammamRegion': 'खम्मम क्षेत्र',
    'activity.nalgondaHills': 'नालगोंडा पहाड़ियां',
    'activity.hoursAgo': 'घंटे पहले',
    'activity.dayAgo': 'दिन पहले',
    'activity.daysAgo': 'दिन पहले',
    'processing.title': 'प्रसंस्करण स्थिति',
    'processing.desc': 'वर्तमान वर्कफ़्लो प्रगति अवलोकन',
    'processing.progress': 'प्रगति',
    'processing.claimsProcessing': 'दावे प्रसंस्करण',
    'processing.claimsProcessed': 'दावे संसाधित',
    'processing.documentVerification': 'दस्तावेज़ सत्यापन',
    'processing.documentsVerified': 'दस्तावेज़ सत्यापित',
    'processing.surveyCompletion': 'सर्वेक्षण पूर्णता',
    'processing.hectaresSurveyed': 'हेक्टेयर सर्वेक्षण',
    'processing.completedToday': 'आज पूर्ण',
    'processing.inProgress': 'प्रगति में',
    'processing.requiresAttention': 'ध्यान चाहिए',
    'common.cancel': 'रद्द करें',

    // Claim Submission
    'claim.personalDetails': 'व्यक्तिगत विवरण',
    'claim.landDetails': 'भूमि विवरण',
    'claim.communityInfo': 'समुदायिक जानकारी',
    'claim.documents': 'दस्तावेज़',
    'claim.review': 'समीक्षा',
    'claim.submit': 'जमा करें',
    'claim.previous': 'पिछला',
    'claim.next': 'अगला',
    'claim.firstName': 'पहला नाम',
    'claim.lastName': 'अंतिम नाम',
    'claim.fatherName': 'पिता का नाम',
    'claim.dateOfBirth': 'जन्म तिथि',
    'claim.gender': 'लिंग',
    'claim.phoneNumber': 'फोन नंबर',
    'claim.email': 'ईमेल',
    'claim.aadharNumber': 'आधार संख्या',
    'claim.address': 'पता',
    'claim.village': 'गांव',
    'claim.tehsil': 'तहसील',
    'claim.district': 'जिला',
    'claim.state': 'राज्य',
    'claim.pincode': 'पिनकोड',

    // Claims Management
    'claims.management': 'दावा प्रबंधन',
    'claims.searchClaims': 'दावे खोजें...',
    'claims.filterBy': 'फ़िल्टर करें',
    'claims.allClaims': 'सभी दावे',
    'claims.viewClaim': 'दावा देखें',
    'claims.editClaim': 'दावा संपादित करें',
    'claims.claimId': 'दावा आईडी',
    'claims.applicantName': 'आवेदक का नाम',
    'claims.submissionDate': 'प्रस्तुति तिथि',
    'claims.priority': 'प्राथमिकता',
    'claims.high': 'उच्च',
    'claims.medium': 'मध्यम',
    'claims.low': 'निम्न',

    // Allotments
    'allotments.title': 'वन भूमि आवंटन',
    'allotments.overview': 'अनुमोदित वन भूमि आवंटन का व्यापक ट्रैकिंग',
    'allotments.totalArea': 'कुल आवंटित क्षेत्र',
    'allotments.activeCases': 'सक्रिय मामले',
    'allotments.compliance': 'अनुपालन दर',

    // GIS Mapping
    'gis.title': 'जीआईएस मैपिंग और स्थानिक विश्लेषण',
    'gis.overview': 'उपग्रह इमेजरी और सीमा विश्लेषण के साथ इंटरैक्टिव मैपिंग',
    'gis.satelliteView': 'उपग्रह दृश्य',
    'gis.boundaryMapping': 'सीमा मैपिंग',
    'gis.layerControls': 'लेयर नियंत्रण',

    // Document Center
    'docs.title': 'दस्तावेज़ प्रबंधन केंद्र',
    'docs.overview': 'सुरक्षित दस्तावेज़ भंडारण, सत्यापन और अनुपालन ट्रैकिंग',
    'docs.uploadDocument': 'दस्तावेज़ अपलोड करें',
    'docs.verifyDocument': 'दस्तावेज़ सत्यापित करें',
    'docs.totalDocuments': 'कुल दस्तावेज़',
    'docs.verified': 'सत्यापित',
    'docs.pending': 'सत्यापन लंबित',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  type TranslationKeys = keyof typeof translations["en"];

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] ?? key;
  };

  interface LanguageContextType {
    language: "en" | "hi";
    setLanguage: (lang: "en" | "hi") => void;
    t: (key: string) => string; // consumer-friendly
  }


  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: t as (key: string) => string }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}