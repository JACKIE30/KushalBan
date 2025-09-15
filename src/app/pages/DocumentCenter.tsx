import { useState } from 'react';
import {
  Upload,
  FileText,
  Image,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  FolderOpen,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  Clock,
  File
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Progress } from '../../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

const documentsData = [
  {
    id: 'DOC-001',
    name: 'Land Ownership Certificate.pdf',
    type: 'Ownership Proof',
    claimId: 'FRA-2024-001',
    applicant: 'Ramesh Kumar',
    uploadDate: '2024-01-15',
    size: '2.3 MB',
    status: 'Verified',
    category: 'Legal'
  },
  {
    id: 'DOC-002',
    name: 'Survey Map.jpg',
    type: 'Survey Document',
    claimId: 'FRA-2024-002',
    applicant: 'Sunita Devi',
    uploadDate: '2024-01-14',
    size: '5.7 MB',
    status: 'Pending Review',
    category: 'Survey'
  },
  {
    id: 'DOC-003',
    name: 'Identity Proof.pdf',
    type: 'Identity Document',
    claimId: 'FRA-2024-001',
    applicant: 'Ramesh Kumar',
    uploadDate: '2024-01-13',
    size: '1.2 MB',
    status: 'Verified',
    category: 'Identity'
  },
  {
    id: 'DOC-004',
    name: 'Forest Settlement Record.pdf',
    type: 'Settlement Record',
    claimId: 'FRA-2024-003',
    applicant: 'Govind Rao',
    uploadDate: '2024-01-12',
    size: '3.8 MB',
    status: 'Requires Attention',
    category: 'Legal'
  },
  {
    id: 'DOC-005',
    name: 'Satellite Imagery.tiff',
    type: 'Satellite Data',
    claimId: 'FRA-2024-004',
    applicant: 'Lakshmi Bai',
    uploadDate: '2024-01-10',
    size: '12.4 MB',
    status: 'Processing',
    category: 'Survey'
  }
];

const categories = ['All', 'Legal', 'Identity', 'Survey', 'Financial'];
const statuses = ['All', 'Verified', 'Pending Review', 'Requires Attention', 'Processing'];

export function DocumentCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileUpload = (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'tiff':
        return <Image className="w-5 h-5 text-blue-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Verified': 'bg-green-100 text-green-800 border-green-200',
      'Pending Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Requires Attention': 'bg-red-100 text-red-800 border-red-200',
      'Processing': 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Pending Review':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Requires Attention':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'Processing':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredDocuments = documentsData.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.claimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.applicant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Center</h1>
          <p className="text-gray-600">Manage and verify claim-related documents</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
          <Upload className="w-4 h-4 mr-2" />
          Upload Documents
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Total Documents</p>
                <p className="text-2xl font-bold text-blue-900">2,847</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Verified</p>
                <p className="text-2xl font-bold text-green-900">1,923</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-900">756</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Needs Attention</p>
                <p className="text-2xl font-bold text-red-900">168</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-96">
          <TabsTrigger value="documents">Document Library</TabsTrigger>
          <TabsTrigger value="upload">Upload Center</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search documents, claims, or applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 border-gray-200"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/80 border-gray-200">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/80 border-gray-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="bg-white/60 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(doc.name)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(doc.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Claim ID:</span>
                      <span className="font-mono">{doc.claimId}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Applicant:</span>
                      <span>{doc.applicant}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Size:</span>
                      <span>{doc.size}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Upload Date:</span>
                      <span>{doc.uploadDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {getStatusBadge(doc.status)}
                    <Badge variant="outline" className="text-xs">
                      {doc.category}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          {/* Upload area */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
            <CardContent className="p-6">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Documents
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <div className="space-y-2">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-700">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                  <p className="text-xs text-gray-500">
                    Supported formats: PDF, JPG, PNG, TIFF (Max 25MB)
                  </p>
                </div>
              </div>

              {isUploading && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading documents...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload guidelines */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
            <CardHeader>
              <CardTitle>Document Upload Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Required Documents</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Land ownership certificates</li>
                    <li>• Identity proof documents</li>
                    <li>• Survey maps and records</li>
                    <li>• Settlement records</li>
                    <li>• Occupancy evidence</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">File Requirements</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Maximum file size: 25MB</li>
                    <li>• Supported formats: PDF, JPG, PNG, TIFF</li>
                    <li>• Clear, readable scans</li>
                    <li>• Proper file naming convention</li>
                    <li>• Include claim ID in filename</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}