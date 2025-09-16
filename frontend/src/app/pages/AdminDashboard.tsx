'use client'

import { useState } from 'react';
import {
  FileText,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  Settings,
  BarChart3,
  Filter,
  Search,
  Calendar,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Map
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useLanguage } from './LanguageContext';

interface Document {
  id: string;
  userId: string;
  userName: string;
  type: string;
  fileName: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  size: string;
  claimId: string;
}

interface LandClaim {
  id: string;
  userId: string;
  userName: string;
  claimType: string;
  landArea: number;
  coordinates: { lat: number; lng: number }[];
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  documents: string[];
  village: string;
  district: string;
}

interface DSSScheme {
  id: string;
  name: string;
  description: string;
  eligibilityCriteria: string[];
  benefits: string;
  status: 'active' | 'inactive' | 'draft';
  applicants: number;
  approvedCount: number;
  createdDate: string;
}

export function AdminDashboard() {
  const { t } = useLanguage();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<LandClaim | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - In real app, this would come from API
  const documents: Document[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Ram Kumar',
      type: 'Identity Proof',
      fileName: 'aadhar_card.pdf',
      uploadDate: '2024-01-15',
      status: 'pending',
      size: '2.3 MB',
      claimId: 'claim1'
    },
    {
      id: '2',
      userId: 'user1',
      userName: 'Ram Kumar',
      type: 'Land Document',
      fileName: 'land_survey.pdf',
      uploadDate: '2024-01-15',
      status: 'approved',
      size: '4.1 MB',
      claimId: 'claim1'
    },
    {
      id: '3',
      userId: 'user2',
      userName: 'Sunita Devi',
      type: 'Community Certificate',
      fileName: 'community_cert.pdf',
      uploadDate: '2024-01-14',
      status: 'pending',
      size: '1.8 MB',
      claimId: 'claim2'
    }
  ];

  const landClaims: LandClaim[] = [
    {
      id: 'claim1',
      userId: 'user1',
      userName: 'Ram Kumar',
      claimType: 'Individual Forest Rights',
      landArea: 2.5,
      coordinates: [
        { lat: 19.2183, lng: 72.9781 },
        { lat: 19.2200, lng: 72.9800 },
        { lat: 19.2150, lng: 72.9820 },
        { lat: 19.2130, lng: 72.9760 }
      ],
      submissionDate: '2024-01-15',
      status: 'under-review',
      documents: ['1', '2'],
      village: 'Dharmasagar',
      district: 'Adilabad'
    },
    {
      id: 'claim2',
      userId: 'user2',
      userName: 'Sunita Devi',
      claimType: 'Community Forest Rights',
      landArea: 15.0,
      coordinates: [
        { lat: 19.2283, lng: 72.9881 },
        { lat: 19.2300, lng: 72.9900 },
        { lat: 19.2250, lng: 72.9920 },
        { lat: 19.2230, lng: 72.9860 }
      ],
      submissionDate: '2024-01-14',
      status: 'pending',
      documents: ['3'],
      village: 'Kamalapur',
      district: 'Adilabad'
    }
  ];

  const dssSchemes: DSSScheme[] = [
    {
      id: 'scheme1',
      name: 'Forest-based Livelihood Scheme',
      description: 'Forest-based livelihood support for tribal communities',
      eligibilityCriteria: [
        'Must be a recognized forest dweller',
        'Should have valid FRA title',
        'Annual income below ₹2 lakhs'
      ],
      benefits: 'Financial assistance up to ₹50,000 for forest-based activities',
      status: 'active',
      applicants: 234,
      approvedCount: 156,
      createdDate: '2024-01-01'
    },
    {
      id: 'scheme2',
      name: 'Community Forest Conservation Scheme',
      description: 'Community forest conservation and development program',
      eligibilityCriteria: [
        'Community forest rights holder',
        'Minimum 10 families in community',
        'Conservation plan approval required'
      ],
      benefits: 'Grant support up to ₹5 lakhs for conservation activities',
      status: 'active',
      applicants: 89,
      approvedCount: 45,
      createdDate: '2024-02-01'
    }
  ];

  const handleDocumentApproval = (docId: string, action: 'approve' | 'reject') => {
    // Update document status
    const updatedDocuments = documents.map(doc => 
      doc.id === docId ? { ...doc, status: action === 'approve' ? 'approved' as const : 'rejected' as const } : doc
    );
    console.log(`Document ${docId} ${action}d`);
    // In real app, this would update the state/send to API
    alert(`Document ${action}d successfully!`);
  };

  const handleClaimAction = (claimId: string, action: 'approve' | 'reject' | 'request-info') => {
    // Update claim status
    const updatedClaims = landClaims.map(claim => 
      claim.id === claimId ? { 
        ...claim, 
        status: action === 'approve' ? 'approved' as const : 
                action === 'reject' ? 'rejected' as const : 'under-review' as const 
      } : claim
    );
    console.log(`Claim ${claimId} action: ${action}`);
    // In real app, this would update the state/send to API
    alert(`Claim ${action} action completed successfully!`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      'under-review': { color: 'bg-blue-100 text-blue-800', text: 'Under Review' },
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: 'Inactive' },
      draft: { color: 'bg-yellow-100 text-yellow-800', text: 'Draft' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={`${config.color} border-0`}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administrator Dashboard</h1>
            <p className="text-gray-600">Forest Rights Management & Review</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Documents</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {documents.filter(d => d.status === 'pending').length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Claims Under Review</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {landClaims.filter(c => c.status === 'under-review' || c.status === 'pending').length}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Schemes</p>
                  <p className="text-3xl font-bold text-green-600">
                    {dssSchemes.filter(s => s.status === 'active').length}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-purple-600">1,247</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents">Document Review</TabsTrigger>
            <TabsTrigger value="land-claims">Land Claims</TabsTrigger>
            <TabsTrigger value="dss-schemes">DSS Schemes</TabsTrigger>
          </TabsList>

          {/* Documents Review Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Document Review</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <FileText className="w-10 h-10 text-blue-500" />
                          <div>
                            <h3 className="font-medium">{doc.fileName}</h3>
                            <p className="text-sm text-gray-600">
                              {doc.userName} • {doc.type} • {doc.size}
                            </p>
                            <p className="text-xs text-gray-500">
                              Uploaded: {new Date(doc.uploadDate).toLocaleDateString('en-US')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(doc.status)}
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          {doc.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleDocumentApproval(doc.id, 'approve')}
                              >
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDocumentApproval(doc.id, 'reject')}
                              >
                                <ThumbsDown className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Land Claims Tab */}
          <TabsContent value="land-claims" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Land Claims & Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {landClaims.map((claim) => (
                    <div key={claim.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <MapPin className="w-10 h-10 text-green-500 mt-1" />
                          <div>
                            <h3 className="font-medium">{claim.claimType}</h3>
                            <p className="text-sm text-gray-600">
                              Applicant: {claim.userName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Village: {claim.village}, District: {claim.district}
                            </p>
                            <p className="text-sm text-gray-600">
                              Land Area: {claim.landArea} hectares
                            </p>
                            <p className="text-xs text-gray-500">
                              Submitted: {new Date(claim.submissionDate).toLocaleDateString('en-US')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(claim.status)}
                          <Button variant="outline" size="sm">
                            <Map className="w-4 h-4 mr-2" />
                            View Map
                          </Button>
                          {(claim.status === 'pending' || claim.status === 'under-review') && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleClaimAction(claim.id, 'approve')}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleClaimAction(claim.id, 'request-info')}
                              >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Request Info
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleClaimAction(claim.id, 'reject')}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DSS Schemes Tab */}
          <TabsContent value="dss-schemes" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>DSS Scheme Management</CardTitle>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Add New Scheme
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dssSchemes.map((scheme) => (
                    <Card key={scheme.id} className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{scheme.name}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{scheme.description}</p>
                          </div>
                          {getStatusBadge(scheme.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">Eligibility Criteria:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {scheme.eligibilityCriteria.map((criteria, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  {criteria}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm mb-1">Benefits:</h4>
                            <p className="text-sm text-gray-600">{scheme.benefits}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{scheme.applicants}</p>
                              <p className="text-xs text-gray-600">Total Applications</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">{scheme.approvedCount}</p>
                              <p className="text-xs text-gray-600">Approved</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <p className="text-xs text-gray-500">
                              Created: {new Date(scheme.createdDate).toLocaleDateString('en-US')}
                            </p>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}