import React, { useState } from 'react';
import {
  Brain,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';

interface QuickAnalysisProps {
  claimId: string;
  onOpenFullAnalysis: (claimId: string) => void;
}

interface QuickAnalysisData {
  overallScore: number;
  recommendation: 'approve' | 'reject' | 'review';
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  processingStatus: 'idle' | 'analyzing' | 'completed';
  keyIssues: number;
  documentsAnalyzed: number;
  totalDocuments: number;
}

export function AIQuickAnalysis({ claimId, onOpenFullAnalysis }: QuickAnalysisProps) {
  const [analysisData, setAnalysisData] = useState<QuickAnalysisData>({
    overallScore: 78,
    recommendation: 'review',
    confidence: 85,
    riskLevel: 'medium',
    processingStatus: 'completed',
    keyIssues: 2,
    documentsAnalyzed: 6,
    totalDocuments: 8
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const runQuickAnalysis = () => {
    setIsProcessing(true);
    setAnalysisData(prev => ({ ...prev, processingStatus: 'analyzing' }));

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setAnalysisData(prev => ({
        ...prev,
        processingStatus: 'completed',
        overallScore: Math.floor(Math.random() * 20) + 75,
        confidence: Math.floor(Math.random() * 15) + 80
      }));
    }, 2500);
  };

  const getRecommendationConfig = (recommendation: string) => {
    switch (recommendation) {
      case 'approve':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'reject':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'review':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const recommendationConfig = getRecommendationConfig(analysisData.recommendation);
  const RecommendationIcon = recommendationConfig.icon;

  return (
    <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-700 rounded-lg flex items-center justify-center mr-3">
              <Brain className="w-5 h-5 text-white" />
            </div>
            AI Analysis
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={runQuickAnalysis}
            disabled={isProcessing}
            className="text-green-600 hover:text-green-700 hover:bg-green-100"
          >
            <RotateCw className={`w-4 h-4 mr-1 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {analysisData.processingStatus === 'analyzing' ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">AI Analysis in Progress</h3>
            <p className="text-sm text-gray-600 mb-4">Analyzing documents, maps, and satellite imagery...</p>
            <Progress value={65} className="h-2" />
          </div>
        ) : (
          <>
            {/* Overall Score */}
            <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-green-200">
              <div>
                <h3 className="font-medium text-gray-900">Overall Score</h3>
                <div className="flex items-center mt-1">
                  <div className="text-2xl font-bold text-green-700 mr-2">
                    {analysisData.overallScore}%
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="text-right">
                <Progress value={analysisData.overallScore} className="h-3 w-24 mb-1" />
                <p className="text-xs text-gray-600">AI Confidence: {analysisData.confidence}%</p>
              </div>
            </div>

            {/* Recommendation */}
            <div className={`flex items-center justify-between p-4 ${recommendationConfig.bgColor} rounded-xl border ${recommendationConfig.borderColor}`}>
              <div className="flex items-center">
                <RecommendationIcon className={`w-6 h-6 ${recommendationConfig.color} mr-3`} />
                <div>
                  <h3 className="font-medium text-gray-900">AI Recommendation</h3>
                  <div className="flex items-center mt-1">
                    <span className={`text-lg font-semibold capitalize ${recommendationConfig.color}`}>
                      {analysisData.recommendation}
                    </span>
                    <Badge variant="outline" className={`ml-2 ${getRiskColor(analysisData.riskLevel)}`}>
                      {analysisData.riskLevel.toUpperCase()} Risk
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-green-100">
                <div className="text-lg font-bold text-blue-600">
                  {analysisData.documentsAnalyzed}/{analysisData.totalDocuments}
                </div>
                <p className="text-xs text-gray-600">Documents</p>
              </div>
              <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-green-100">
                <div className="text-lg font-bold text-yellow-600">{analysisData.keyIssues}</div>
                <p className="text-xs text-gray-600">Key Issues</p>
              </div>
              <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-green-100">
                <div className="text-lg font-bold text-purple-600">{analysisData.confidence}%</div>
                <p className="text-xs text-gray-600">Confidence</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => onOpenFullAnalysis(claimId)}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Full Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                <Zap className="w-4 h-4" />
              </Button>
            </div>

            {/* Key Insights */}
            {analysisData.keyIssues > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">Key Issues Detected</span>
                </div>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Satellite imagery shows boundary discrepancies</li>
                  <li>• Missing community certificate verification</li>
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}