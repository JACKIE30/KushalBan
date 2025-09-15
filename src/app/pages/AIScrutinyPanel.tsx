import React, { useState, useEffect } from 'react';
import {
  Brain,
  FileText,
  MapPin,
  Satellite,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  TrendingUp,
  Zap,
  X,
  Maximize2,
  Minimize2,
  RotateCw,
  Download,
  MessageSquare,
  Clock,
  Shield,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Separator } from '../../../components/ui/separator';

interface AIAnalysisResult {
  id: string;
  type: 'document' | 'map' | 'satellite';
  name: string;
  confidence: number;
  status: 'valid' | 'invalid' | 'suspicious' | 'missing';
  issues: string[];
  suggestions: string[];
  processingTime: number;
}

interface ClaimAnalysis {
  claimId: string;
  overallScore: number;
  recommendation: 'approve' | 'reject' | 'review';
  confidence: number;
  analysisResults: AIAnalysisResult[];
  missingFields: string[];
  completionPercentage: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastAnalyzed: string;
}

interface AIScrutinyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  claimId?: string;
  onRecommendationAccept?: (recommendation: string) => void;
}

const mockAnalysisData: ClaimAnalysis = {
  claimId: "FRA-2024-001",
  overallScore: 78,
  recommendation: 'review',
  confidence: 85,
  completionPercentage: 92,
  riskLevel: 'medium',
  lastAnalyzed: '2024-08-31T10:30:00Z',
  missingFields: ['Community Certificate', 'Land Survey Sketch'],
  analysisResults: [
    {
      id: '1',
      type: 'document',
      name: 'Aadhar Card',
      confidence: 95,
      status: 'valid',
      issues: [],
      suggestions: [],
      processingTime: 1.2
    },
    {
      id: '2',
      type: 'document',
      name: 'Caste Certificate',
      confidence: 88,
      status: 'valid',
      issues: ['Minor text blur detected'],
      suggestions: ['Request higher resolution scan'],
      processingTime: 2.1
    },
    {
      id: '3',
      type: 'satellite',
      name: 'Land Verification',
      confidence: 72,
      status: 'suspicious',
      issues: ['Boundary mismatch with survey records', 'Forest encroachment detected'],
      suggestions: ['Ground verification recommended', 'Update boundary coordinates'],
      processingTime: 5.8
    },
    {
      id: '4',
      type: 'map',
      name: 'GIS Mapping',
      confidence: 81,
      status: 'valid',
      issues: ['Minor coordinate deviation'],
      suggestions: ['Cross-verify with revenue records'],
      processingTime: 3.2
    }
  ]
};

export function AIScrutinyPanel({ isOpen, onClose, claimId, onRecommendationAccept }: AIScrutinyPanelProps) {
  const [analysisData, setAnalysisData] = useState<ClaimAnalysis>(mockAnalysisData);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const runAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisData(prev => ({
        ...prev,
        lastAnalyzed: new Date().toISOString()
      }));
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-600 bg-green-50 border-green-200';
      case 'invalid': return 'text-red-600 bg-red-50 border-red-200';
      case 'suspicious': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'missing': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'approve': return 'text-green-700 bg-green-100 border-green-300';
      case 'reject': return 'text-red-700 bg-red-100 border-red-300';
      case 'review': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
        isExpanded ? 'w-full h-full' : 'w-full max-w-6xl h-[90vh]'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI Claim Scrutiny</h2>
                <p className="text-sm text-gray-600">Claim ID: {analysisData.claimId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="flex items-center space-x-2"
              >
                <RotateCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analyzing...' : 'Re-analyze'}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="mx-6 mt-4 grid w-fit grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="mapping">Mapping</TabsTrigger>
                <TabsTrigger value="recommendations">Actions</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="overview" className="space-y-6 mt-0">
                  {/* Overall Analysis */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Overall Score</CardTitle>
                          <Shield className="w-5 h-5 text-green-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-700 mb-2">{analysisData.overallScore}%</div>
                        <Progress value={analysisData.overallScore} className="h-2 mb-2" />
                        <p className="text-sm text-green-600">AI Confidence: {analysisData.confidence}%</p>
                      </CardContent>
                    </Card>

                    <Card className={`border-2 ${getRecommendationColor(analysisData.recommendation)}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">AI Recommendation</CardTitle>
                          <Target className="w-5 h-5" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold capitalize mb-2">{analysisData.recommendation}</div>
                        <Badge variant="outline" className={`${getRiskColor(analysisData.riskLevel)} border-current`}>
                          Risk: {analysisData.riskLevel.toUpperCase()}
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Completion</CardTitle>
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-700 mb-2">{analysisData.completionPercentage}%</div>
                        <p className="text-sm text-gray-600">{analysisData.missingFields.length} fields missing</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Analysis Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-gray-600" />
                        Analysis Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysisData.analysisResults.map((result, index) => (
                          <div key={result.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              result.type === 'document' ? 'bg-blue-100 text-blue-600' :
                              result.type === 'satellite' ? 'bg-purple-100 text-purple-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {result.type === 'document' ? <FileText className="w-4 h-4" /> :
                               result.type === 'satellite' ? <Satellite className="w-4 h-4" /> :
                               <MapPin className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{result.name}</span>
                                <Badge className={`${getStatusColor(result.status)} border`}>
                                  {result.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                Processed in {result.processingTime}s • Confidence: {result.confidence}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Missing Fields */}
                  {analysisData.missingFields.length > 0 && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription>
                        <div className="font-medium text-yellow-800 mb-2">Missing Required Documents:</div>
                        <ul className="list-disc list-inside space-y-1 text-yellow-700">
                          {analysisData.missingFields.map((field, index) => (
                            <li key={index}>{field}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="space-y-4 mt-0">
                  {analysisData.analysisResults
                    .filter(result => result.type === 'document')
                    .map((result) => (
                    <Card key={result.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            {result.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getStatusColor(result.status)} border`}>
                              {result.status}
                            </Badge>
                            <span className="text-sm text-gray-600">{result.confidence}% confidence</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Progress value={result.confidence} className="h-2 mb-4" />
                        {result.issues.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-medium text-red-700 mb-2">Issues Detected:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                              {result.issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {result.suggestions.length > 0 && (
                          <div>
                            <h4 className="font-medium text-blue-700 mb-2">AI Suggestions:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-blue-600">
                              {result.suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="mapping" className="space-y-4 mt-0">
                  {analysisData.analysisResults
                    .filter(result => result.type === 'map' || result.type === 'satellite')
                    .map((result) => (
                    <Card key={result.id} className={`border-l-4 ${
                      result.type === 'satellite' ? 'border-l-purple-500' : 'border-l-green-500'
                    }`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center">
                            {result.type === 'satellite' ?
                              <Satellite className="w-4 h-4 mr-2" /> :
                              <MapPin className="w-4 h-4 mr-2" />
                            }
                            {result.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getStatusColor(result.status)} border`}>
                              {result.status}
                            </Badge>
                            <span className="text-sm text-gray-600">{result.confidence}% confidence</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Progress value={result.confidence} className="h-2 mb-4" />

                        {result.type === 'satellite' && (
                          <div className="bg-purple-50 p-4 rounded-lg mb-4">
                            <h4 className="font-medium text-purple-800 mb-2">Satellite Analysis Results:</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Land Cover Type:</span>
                                <span className="ml-2 text-purple-600">Mixed Forest (68%)</span>
                              </div>
                              <div>
                                <span className="font-medium">Change Detection:</span>
                                <span className="ml-2 text-purple-600">2.3% deforestation</span>
                              </div>
                              <div>
                                <span className="font-medium">Boundary Accuracy:</span>
                                <span className="ml-2 text-purple-600">89.2% match</span>
                              </div>
                              <div>
                                <span className="font-medium">Last Updated:</span>
                                <span className="ml-2 text-purple-600">15 days ago</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {result.issues.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-medium text-red-700 mb-2">Issues Detected:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                              {result.issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {result.suggestions.length > 0 && (
                          <div>
                            <h4 className="font-medium text-blue-700 mb-2">AI Suggestions:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-blue-600">
                              {result.suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6 mt-0">
                  <Card className={`border-2 ${getRecommendationColor(analysisData.recommendation)}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        AI Recommendation: {analysisData.recommendation.toUpperCase()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Confidence Level:</span>
                          <Badge variant="outline">{analysisData.confidence}%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Risk Assessment:</span>
                          <Badge variant="outline" className={`${getRiskColor(analysisData.riskLevel)} border-current`}>
                            {analysisData.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <Separator />

                        {analysisData.recommendation === 'review' && (
                          <Alert className="border-yellow-200 bg-yellow-50">
                            <MessageSquare className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-800">
                              <div className="font-medium mb-2">Manual Review Required:</div>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Satellite imagery shows boundary discrepancies</li>
                                <li>Missing community certificate verification</li>
                                <li>Land use pattern requires field verification</li>
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 flex-1"
                            onClick={() => onRecommendationAccept?.(analysisData.recommendation)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept AI Recommendation
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            Schedule Field Verification
                          </Button>
                          <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Processing Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Analysis Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {analysisData.analysisResults.reduce((acc, r) => acc + r.processingTime, 0).toFixed(1)}s
                          </div>
                          <p className="text-sm text-gray-600">Total Processing Time</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {analysisData.analysisResults.length}
                          </div>
                          <p className="text-sm text-gray-600">Components Analyzed</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {analysisData.analysisResults.filter(r => r.status === 'valid').length}
                          </div>
                          <p className="text-sm text-gray-600">Valid Components</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {analysisData.analysisResults.filter(r => r.status === 'suspicious').length}
                          </div>
                          <p className="text-sm text-gray-600">Flagged for Review</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}