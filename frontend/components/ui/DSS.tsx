"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Progress } from './progress';
import { Button } from './button';
import { RefreshCw, FileText, BarChart } from 'lucide-react';

// Types for land cover data
interface LandCoverData {
  Background: number;
  Bareland: number;
  Rangeland: number;
  Developed_Space: number;
  Road: number;
  Tree: number;
  Water: number;
  "Agriculture land": number;
  Building: number;
}

interface DSSResponse {
  success: boolean;
  data?: {
    landCoverAnalysis?: LandCoverData;
  };
  error?: string;
}

// Color mapping for different land cover types
const landCoverColors: Record<string, string> = {
  'Background': '#e5e7eb',
  'Bareland': '#d6ccc2',
  'Rangeland': '#a3d977',
  'Developed_Space': '#6b7280',
  'Road': '#374151',
  'Tree': '#16a34a',
  'Water': '#0ea5e9',
  'Agriculture land': '#eab308',
  'Building': '#dc2626'
};

// Mock data for development/fallback
const mockLandCoverData: LandCoverData = {
  Background: 0.00,
  Bareland: 0.00,
  Rangeland: 14.79,
  Developed_Space: 5.74,
  Road: 0.00,
  Tree: 16.01,
  Water: 0.08,
  "Agriculture land": 61.79,
  Building: 1.59
};

export default function DSS() {
  const [landCoverData, setLandCoverData] = useState<LandCoverData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch land cover data from backend
  const fetchLandCoverData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/dss/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Add any required parameters for the DSS analysis
          analysisType: 'land_cover'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DSSResponse = await response.json();
      
      if (result.success && result.data?.landCoverAnalysis) {
        setLandCoverData(result.data.landCoverAnalysis);
      } else {
        throw new Error(result.error || 'Failed to fetch land cover data');
      }
    } catch (err) {
      console.error('Error fetching land cover data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      // Use mock data as fallback
      setLandCoverData(mockLandCoverData);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchLandCoverData();
  }, []);

  // Format percentage display
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  // Get the data to display (either fetched or mock)
  const displayData = landCoverData || mockLandCoverData;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl shadow-2xl">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
        
        <div className="relative p-8 flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <BarChart className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Decision Support System</h1>
              <p className="text-indigo-100 text-lg">Intelligent Land Cover Analysis</p>
            </div>
          </div>
          <Button 
            onClick={fetchLandCoverData} 
            disabled={loading}
            variant="secondary"
            size="lg"
            className="bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </Button>
        </div>
      </div>

      {/* Enhanced Error message */}
      {error && (
        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 text-red-700">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold">Connection Error</h4>
                <p className="text-sm text-red-600 mt-1">
                  {error} - Displaying sample data for demonstration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Main Land Cover Display */}
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Land Cover Distribution Analysis
            </span>
            {loading && (
              <Badge variant="secondary" className="animate-pulse">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping mr-2" />
                Processing...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Object.keys(mockLandCoverData).map((key) => (
                <div key={key} className="flex items-center space-x-4">
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Enhanced Raw Data Display - Light Theme */}
              <div className="bg-gradient-to-r from-gray-50 via-black-50 to-black-50 p-6 rounded-xl border border-gray-200 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">System Output Data</h3>
                  <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">
                    Real-time
                  </Badge>
                </div>
                <div className="font-mono text-sm space-y-2 bg-white/80 p-4 rounded-lg border border-gray-200 shadow-inner">
                  {Object.entries(displayData).map(([key, value], index) => (
                    <div key={key} className="flex justify-between items-center group hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                        <span className="text-blue-600">&gt;</span> {key}:
                      </span>
                      <span className="font-bold text-black group-hover:text-black transition-colors">
                        {formatPercentage(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Visual Representation */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Land Cover Distribution</h3>
                
                {/* Circular Progress Charts for Major Categories */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Object.entries(displayData)
                    .filter(([_, value]) => value > 0) // Only show non-zero values
                    .sort(([_, a], [__, b]) => b - a) // Sort by value descending
                    .map(([key, value]) => (
                    <div key={key} className="relative">
                      {/* Circular Progress */}
                      <div className="relative w-24 h-24 mx-auto">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                          {/* Background circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-200"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke={landCoverColors[key] || '#6b7280'}
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2.51 * value} 251.2`}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                            style={{
                              filter: `drop-shadow(0 0 6px ${landCoverColors[key]}40)`
                            }}
                          />
                        </svg>
                        {/* Center text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-sm font-bold text-black">
                              {formatPercentage(value)}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Label */}
                      <div className="mt-2 text-center">
                        <div className="text-xs font-medium text-black leading-tight">
                          {key.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive Bar Chart with Hover Effects */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Detailed Breakdown</h4>
                  <div className="space-y-4">
                    {Object.entries(displayData)
                      .sort(([_, a], [__, b]) => b - a)
                      .map(([key, value]) => (
                      <div key={key} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-3 h-3 rounded-full shadow-sm transition-all group-hover:scale-110"
                              style={{ backgroundColor: landCoverColors[key] || '#6b7280' }}
                            />
                            <span className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
                              {key.replace('_', ' ')}
                            </span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className="font-mono group-hover:bg-gray-100 transition-colors text-gray-900"
                            style={{ borderColor: landCoverColors[key] }}
                          >
                            {formatPercentage(value)}
                          </Badge>
                        </div>
                        {/* Animated Bar */}
                        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
                            style={{
                              width: `${Math.max(value, 0.5)}%`, // Minimum width for visibility
                              background: `linear-gradient(90deg, ${landCoverColors[key]}dd, ${landCoverColors[key]})`
                            }}
                          />
                          {/* Subtle shimmer effect on hover */}
                          <div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                            style={{
                              transform: 'translateX(-100%)',
                              animation: 'shimmer 2s infinite'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Land Use Insights Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Forest Health Card */}
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0115 5c0 2.236-1.846 4.542-5 6.866C6.846 9.542 5 7.236 5 5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-semibold text-green-800">Forest Health</h5>
                          <p className="text-sm text-green-700 mt-1">
                            {formatPercentage(displayData.Tree + displayData.Rangeland)} total green cover
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Agricultural Dominance Card */}
                  <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-semibold text-yellow-800">Agricultural Use</h5>
                          <p className="text-sm text-yellow-700 mt-1">
                            {formatPercentage(displayData["Agriculture land"])} farmland coverage
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <style jsx>{`
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
              `}</style>

              {/* Enhanced Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {/* Agriculture Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold mb-1">
                          {formatPercentage(displayData["Agriculture land"])}
                        </div>
                        <div className="text-yellow-100 text-sm font-medium">Agriculture Land</div>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full" />
                    <div className="absolute -top-2 -left-2 w-16 h-16 bg-white/5 rounded-full" />
                  </CardContent>
                </Card>

                {/* Forest Cover Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold mb-1">
                          {formatPercentage(displayData.Tree)}
                        </div>
                        <div className="text-green-100 text-sm font-medium">Forest Cover</div>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0115 5c0 2.236-1.846 4.542-5 6.866C6.846 9.542 5 7.236 5 5z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full" />
                    <div className="absolute -top-2 -left-2 w-16 h-16 bg-white/5 rounded-full" />
                  </CardContent>
                </Card>

                {/* Water Bodies Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold mb-1">
                          {formatPercentage(displayData.Water)}
                        </div>
                        <div className="text-blue-100 text-sm font-medium">Water Bodies</div>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 3.636a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0 9 9 0 010 12.728 1 1 0 11-1.414-1.414 7 7 0 000-9.9 1 1 0 010-1.414zM7.879 6.464a1 1 0 010 1.414 3 3 0 000 4.243 1 1 0 11-1.415 1.414 5 5 0 010-7.07 1 1 0 011.415 0zm4.242 0a1 1 0 011.415 0 5 5 0 010 7.072 1 1 0 01-1.415-1.415 3 3 0 000-4.242 1 1 0 010-1.415zM10 9a1 1 0 011 1v.01a1 1 0 01-2 0V10a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full" />
                    <div className="absolute -top-2 -left-2 w-16 h-16 bg-white/5 rounded-full" />
                  </CardContent>
                </Card>

                {/* Developed Areas Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-gray-500 via-gray-600 to-slate-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold mb-1">
                          {formatPercentage(displayData.Developed_Space + displayData.Building + displayData.Road)}
                        </div>
                        <div className="text-gray-100 text-sm font-medium">Developed Areas</div>
                      </div>
                      <div className="p-3 bg-white/20 rounded-full">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h5v8H4V6zm7 0h5v8h-5V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full" />
                    <div className="absolute -top-2 -left-2 w-16 h-16 bg-white/5 rounded-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Data Source Info */}
      <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 text-lg">Data Intelligence Source</h4>
              <p className="text-blue-700 mt-2 leading-relaxed">
                Advanced land cover analysis powered by satellite imagery and machine learning algorithms. 
                This data provides critical insights for forest rights analysis, environmental impact assessment, 
                and sustainable land management decisions.
              </p>
              <div className="mt-4 flex items-center space-x-4 text-sm text-blue-600">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Real-time Processing</span>
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>AI-Powered Analysis</span>
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>Government Certified</span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
