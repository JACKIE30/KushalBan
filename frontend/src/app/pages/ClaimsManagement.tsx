'use client'

import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  FileText,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Download,
  Brain,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { AIScrutinyPanel } from './AIScrutinyPanel';
import { AIQuickAnalysis } from './AIQuickAnalysis';

const claimsData = [
  {
    id: 'FRA-2024-001',
    applicantName: 'Ramesh Kumar',
    village: 'Kotapalli',
    district: 'Adilabad',
    landArea: '2.5 hectares',
    submissionDate: '2024-01-15',
    status: 'Under Review',
    priority: 'High',
    documents: 8
  },
  {
    id: 'FRA-2024-002',
    applicantName: 'Sunita Devi',
    village: 'Dharmasagar',
    district: 'Warangal',
    landArea: '1.8 hectares',
    submissionDate: '2024-01-12',
    status: 'Approved',
    priority: 'Medium',
    documents: 6
  },
  {
    id: 'FRA-2024-003',
    applicantName: 'Govind Rao',
    village: 'Mulugu',
    district: 'Khammam',
    landArea: '3.2 hectares',
    submissionDate: '2024-01-10',
    status: 'Pending Documents',
    priority: 'High',
    documents: 4
  },
  {
    id: 'FRA-2024-004',
    applicantName: 'Lakshmi Bai',
    village: 'Janagaon',
    district: 'Nalgonda',
    landArea: '2.1 hectares',
    submissionDate: '2024-01-08',
    status: 'Rejected',
    priority: 'Low',
    documents: 7
  },
  {
    id: 'FRA-2024-005',
    applicantName: 'Vinod Kumar',
    village: 'Bhadrachalam',
    district: 'Khammam',
    landArea: '4.0 hectares',
    submissionDate: '2024-01-05',
    status: 'Survey Scheduled',
    priority: 'Medium',
    documents: 9
  }
];

export function ClaimsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedClaimForAI, setSelectedClaimForAI] = useState<string | null>(null);
  const [isAIScrutinyOpen, setIsAIScrutinyOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Under Review':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Pending Documents':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'Survey Scheduled':
        return <MapPin className="w-4 h-4 text-purple-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Under Review': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pending Documents': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Survey Scheduled': 'bg-purple-100 text-purple-800 border-purple-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: { [key: string]: string } = {
      'High': 'bg-red-100 text-red-800 border-red-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Low': 'bg-green-100 text-green-800 border-green-200'
    };

    return (
      <Badge variant="outline" className={`${variants[priority]} border`}>
        {priority}
      </Badge>
    );
  };

  const filteredClaims = claimsData.filter(claim => {
    const matchesSearch = claim.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || claim.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleOpenAIAnalysis = (claimId: string) => {
    setSelectedClaimForAI(claimId);
    setIsAIScrutinyOpen(true);
  };

  const handleCloseAIAnalysis = () => {
    setIsAIScrutinyOpen(false);
    setSelectedClaimForAI(null);
  };

  const handleAIRecommendationAccept = (recommendation: string) => {
    console.log(`AI recommendation accepted: ${recommendation} for claim ${selectedClaimForAI}`);
    // Handle recommendation acceptance logic here
    handleCloseAIAnalysis();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claims Management</h1>
          <p className="text-gray-600">Track and manage Forest Rights Act claims</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800">
          <Plus className="w-4 h-4 mr-2" />
          New Claim
        </Button>
      </div>

      {/* AI Quick Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Total Claims</p>
                <p className="text-2xl font-bold text-green-900">1,247</p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Under Review</p>
                <p className="text-2xl font-bold text-blue-900">328</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Pending Action</p>
                <p className="text-2xl font-bold text-yellow-900">156</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700">Approved</p>
                <p className="text-2xl font-bold text-emerald-900">763</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
          </div>
        </div>

        {/* AI Quick Analysis Widget */}
        {/* <div className="lg:col-span-1">
          <AIQuickAnalysis
            claimId="FRA-2024-001"
            onOpenFullAnalysis={handleOpenAIAnalysis}
          />
        </div> */}
      </div>

      {/* Filters */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by claim ID, applicant name, or village..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 border-gray-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/80 border-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending Documents">Pending Documents</SelectItem>
                <SelectItem value="Survey Scheduled">Survey Scheduled</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/80 border-gray-200">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-white/80 border-gray-200">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Claims table */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Recent Claims ({filteredClaims.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Land Area</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>AI Analysis</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.map((claim) => (
                  <TableRow key={claim.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-mono font-medium">{claim.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{claim.applicantName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{claim.village}</div>
                          <div className="text-sm text-gray-500">{claim.district}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{claim.landArea}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{claim.submissionDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(claim.status)}
                        {getStatusBadge(claim.status)}
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(claim.priority)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50">
                        {claim.documents} files
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {claim.status === 'Under Review' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenAIAnalysis(claim.id)}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Analyze
                        </Button>
                      )}
                      {claim.status === 'Approved' && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          AI Approved
                        </Badge>
                      )}
                      {claim.status === 'Rejected' && (
                        <Badge className="bg-red-100 text-red-700 border-red-200">
                          <XCircle className="w-3 h-3 mr-1" />
                          AI Flagged
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="ghost" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Edit Claim">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="AI Analysis"
                          onClick={() => handleOpenAIAnalysis(claim.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Brain className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* AI Scrutiny Panel */}
      <AIScrutinyPanel
        isOpen={isAIScrutinyOpen}
        onClose={handleCloseAIAnalysis}
        claimId={selectedClaimForAI || undefined}
        onRecommendationAccept={handleAIRecommendationAccept}
      />
    </div>
  );
}