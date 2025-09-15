import { useState } from 'react';
import {
  TreePine,
  MapPin,
  Calendar,
  User,
  Ruler,
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Progress } from '../../../components/ui/progress';

const allotmentsData = [
  {
    id: 'ALL-2024-001',
    claimId: 'FRA-2024-001',
    beneficiary: 'Ramesh Kumar',
    village: 'Kotapalli',
    district: 'Adilabad',
    forestType: 'Dense Forest',
    allottedArea: '2.5 hectares',
    surveyNumber: 'SY-789',
    allotmentDate: '2024-01-20',
    validityPeriod: '10 years',
    status: 'Active',
    compliance: 95,
    lastInspection: '2024-01-15'
  },
  {
    id: 'ALL-2024-002',
    claimId: 'FRA-2024-002',
    beneficiary: 'Sunita Devi',
    village: 'Dharmasagar',
    district: 'Warangal',
    forestType: 'Scrub Forest',
    allottedArea: '1.8 hectares',
    surveyNumber: 'SY-456',
    allotmentDate: '2024-01-18',
    validityPeriod: '10 years',
    status: 'Active',
    compliance: 88,
    lastInspection: '2024-01-10'
  },
  {
    id: 'ALL-2024-003',
    claimId: 'FRA-2024-005',
    beneficiary: 'Vinod Kumar',
    village: 'Bhadrachalam',
    district: 'Khammam',
    forestType: 'Degraded Forest',
    allottedArea: '4.0 hectares',
    surveyNumber: 'SY-123',
    allotmentDate: '2024-01-15',
    validityPeriod: '10 years',
    status: 'Under Review',
    compliance: 72,
    lastInspection: '2024-01-05'
  },
  {
    id: 'ALL-2023-047',
    claimId: 'FRA-2023-185',
    beneficiary: 'Anjali Reddy',
    village: 'Mulugu',
    district: 'Khammam',
    forestType: 'Mixed Forest',
    allottedArea: '3.2 hectares',
    surveyNumber: 'SY-234',
    allotmentDate: '2023-12-10',
    validityPeriod: '10 years',
    status: 'Expired',
    compliance: 65,
    lastInspection: '2023-12-01'
  }
];

const forestTypes = ['All', 'Dense Forest', 'Scrub Forest', 'Degraded Forest', 'Mixed Forest'];
const statuses = ['All', 'Active', 'Under Review', 'Expired', 'Suspended'];

export function Allotments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [forestTypeFilter, setForestTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Under Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Expired': 'bg-red-100 text-red-800 border-red-200',
      'Suspended': 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Under Review':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Expired':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'Suspended':
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'text-green-600';
    if (compliance >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredAllotments = allotmentsData.filter(allotment => {
    const matchesSearch = allotment.beneficiary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         allotment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         allotment.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesForestType = forestTypeFilter === 'All' || allotment.forestType === forestTypeFilter;
    const matchesStatus = statusFilter === 'All' || allotment.status === statusFilter;

    return matchesSearch && matchesForestType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forest Allotments</h1>
          <p className="text-gray-600">Manage and monitor forest land allotments</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800">
          <Plus className="w-4 h-4 mr-2" />
          New Allotment
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Total Allotments</p>
                <p className="text-2xl font-bold text-green-900">892</p>
              </div>
              <TreePine className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Active</p>
                <p className="text-2xl font-bold text-blue-900">756</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Under Review</p>
                <p className="text-2xl font-bold text-yellow-900">89</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Total Area</p>
                <p className="text-2xl font-bold text-purple-900">2,156</p>
                <p className="text-xs text-purple-600">hectares</p>
              </div>
              <Ruler className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forest type distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle>Forest Type Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { type: 'Dense Forest', count: 245, percentage: 35 },
              { type: 'Mixed Forest', count: 198, percentage: 28 },
              { type: 'Scrub Forest', count: 156, percentage: 22 },
              { type: 'Degraded Forest', count: 105, percentage: 15 }
            ].map((item) => (
              <div key={item.type} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.type}</span>
                  <span>{item.count} allotments ({item.percentage}%)</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle>Compliance Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { range: 'Excellent (90-100%)', count: 456, color: 'bg-green-500' },
              { range: 'Good (70-89%)', count: 287, color: 'bg-yellow-500' },
              { range: 'Needs Improvement (<70%)', count: 149, color: 'bg-red-500' }
            ].map((item) => (
              <div key={item.range} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm">{item.range}</span>
                </div>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by allotment ID, beneficiary, or village..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 border-gray-200"
              />
            </div>
            <Select value={forestTypeFilter} onValueChange={setForestTypeFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/80 border-gray-200">
                <SelectValue placeholder="Forest Type" />
              </SelectTrigger>
              <SelectContent>
                {forestTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/80 border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-white/80 border-gray-200">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Allotments table */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle>Allotment Records ({filteredAllotments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Allotment ID</TableHead>
                  <TableHead>Beneficiary</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Forest Type</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAllotments.map((allotment) => (
                  <TableRow key={allotment.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-mono font-medium">{allotment.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{allotment.beneficiary}</div>
                          <div className="text-sm text-gray-500 font-mono">{allotment.claimId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{allotment.village}</div>
                          <div className="text-sm text-gray-500">{allotment.district}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TreePine className="w-4 h-4 text-green-500" />
                        <span>{allotment.forestType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Ruler className="w-4 h-4 text-gray-400" />
                        <span>{allotment.allottedArea}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(allotment.status)}
                        {getStatusBadge(allotment.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${getComplianceColor(allotment.compliance)}`}>
                          {allotment.compliance}%
                        </span>
                        <div className="w-16">
                          <Progress value={allotment.compliance} className="h-1" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm">{allotment.validityPeriod}</div>
                          <div className="text-xs text-gray-500">
                            Since {allotment.allotmentDate}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <FileText className="w-4 h-4" />
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
    </div>
  );
}