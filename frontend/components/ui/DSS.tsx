"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Progress } from './progress';
import { Button } from './button';
import { RefreshCw, FileText, BarChart, ExternalLink, Award, TrendingUp, User, MapPin, Droplet } from 'lucide-react';

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

// Types for scheme recommendations
interface Scheme {
  scheme_name: string;
  reasoning: string;
  official_link: string;
  estimated_benefit: string;
}

interface ProfileAnalysis {
  primary_eligibility_factors: string[];
  main_livelihood_focus: string;
  geographic_advantages: string;
}

interface SchemeAnalysis {
  scheme_analysis: {
    high_priority: Scheme[];
    medium_priority: Scheme[];
    profile_analysis: ProfileAnalysis;
  };
}

interface SchemeData {
  schemeAnalysis: SchemeAnalysis;
  claimantName: string;
  processingTimestamp: string;
  analysisMetadata: {
    profile_summary: {
      social_category: string;
      land_use_primary: string;
      location: string;
      water_access: string;
    };
  };
}

interface DSSResponse {
  success: boolean;
  data?: {
    landCoverAnalysis?: LandCoverData;
    schemeAnalysis?: SchemeAnalysis;
    claimantName?: string;
    processingTimestamp?: string;
    analysisMetadata?: any;
  };
  error?: string;
  message?: string;
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

export default function DSS() {
  const [landCoverData, setLandCoverData] = useState<LandCoverData | null>(null);
  const [schemeData, setSchemeData] = useState<SchemeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schemeError, setSchemeError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch scheme recommendations from backend
  const fetchSchemeRecommendations = async () => {
    setSchemeLoading(true);
    setSchemeError(null);
    
    try {
      const response = await fetch('/api/dss/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisType: 'scheme_recommendations'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DSSResponse = await response.json();
      
      if (result.success && result.data?.schemeAnalysis) {
        setSchemeData({
          schemeAnalysis: result.data.schemeAnalysis,
          claimantName: result.data.claimantName || '',
          processingTimestamp: result.data.processingTimestamp || '',
          analysisMetadata: result.data.analysisMetadata || {}
        });
      } else {
        throw new Error(result.error || result.message || 'Failed to fetch scheme recommendations');
      }
    } catch (err) {
      console.error('Error fetching scheme recommendations:', err);
      setSchemeError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setSchemeLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchLandCoverData();
    fetchSchemeRecommendations();
  }, []);

  // Function to process asset mapping and update DSS
  const updateDSSFromAssetMapping = async () => {
    setUpdating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/asset-mapping/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      const result = await response.json();
      console.log('Asset mapping result:', result);

      if (result.success) {
        // Automatically refresh land cover data after successful processing
        await fetchLandCoverData();
        console.log('DSS Updated Successfully! Land cover data has been processed from the latest FRA polygon image.');
      } else {
        throw new Error(result.error || 'Failed to process asset mapping');
      }
    } catch (err) {
      console.error('Asset mapping error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error(`Failed to update DSS: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUpdating(false);
    }
  };

  // Format percentage display
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

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
          <div className="flex space-x-3">
            <Button 
              onClick={updateDSSFromAssetMapping} 
              disabled={updating}
              variant="secondary"
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 border-purple-500 text-white backdrop-blur-sm"
            >
              {updating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>Update DSS</span>
                </>
              )}
            </Button>
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
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((key) => (
                <div key={key} className="flex items-center space-x-4">
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : !landCoverData ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No land cover data available. Please check the backend connection.</p>
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
                  {Object.entries(landCoverData).map(([key, value], index) => (
                    <div key={key} className="flex justify-between items-center group hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                        <span className="text-blue-600">&gt;</span> {key}:
                      </span>
                      <span className="font-bold text-black group-hover:text-black transition-colors">
                        {formatPercentage(value as number)}
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
                  {Object.entries(landCoverData)
                    .filter(([_, value]) => (value as number) > 0) // Only show non-zero values
                    .sort(([_, a], [__, b]) => (b as number) - (a as number)) // Sort by value descending
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
                            strokeDasharray={`${2.51 * (value as number)} 251.2`}
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
                              {formatPercentage(value as number)}
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
                    {Object.entries(landCoverData)
                      .sort(([_, a], [__, b]) => (b as number) - (a as number))
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
                            {formatPercentage(value as number)}
                          </Badge>
                        </div>
                        {/* Animated Bar */}
                        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
                            style={{
                              width: `${Math.max(value as number, 0.5)}%`, // Minimum width for visibility
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
                            {formatPercentage(landCoverData.Tree + landCoverData.Rangeland)} total green cover
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
                            {formatPercentage(landCoverData["Agriculture land"])} farmland coverage
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
                          {formatPercentage(landCoverData["Agriculture land"])}
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
                          {formatPercentage(landCoverData.Tree)}
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
                          {formatPercentage(landCoverData.Water)}
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
                          {formatPercentage(landCoverData.Developed_Space + landCoverData.Building + landCoverData.Road)}
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

      {/* Scheme Recommendations Section */}
      {schemeData && (
        <>
          {/* Claimant Profile Header */}
          <Card className="shadow-2xl border-0 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Scheme Recommendations for {schemeData.claimantName}
                  </span>
                </CardTitle>
                <Button 
                  onClick={fetchSchemeRecommendations} 
                  disabled={schemeLoading}
                  variant="secondary"
                  size="sm"
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${schemeLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Profile Summary */}
              {schemeData.analysisMetadata?.profile_summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                    <User className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-xs text-gray-500">Social Category</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {schemeData.analysisMetadata.profile_summary.social_category}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-xs text-gray-500">Primary Land Use</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {schemeData.analysisMetadata.profile_summary.land_use_primary}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-gray-500">Location</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {schemeData.analysisMetadata.profile_summary.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                    <Droplet className="w-5 h-5 text-cyan-600" />
                    <div>
                      <div className="text-xs text-gray-500">Water Access</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {schemeData.analysisMetadata.profile_summary.water_access}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* High Priority Schemes */}
          {schemeData.schemeAnalysis.scheme_analysis.high_priority.length > 0 && (
            <Card className="shadow-2xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center space-x-3 text-lg">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-green-800">High Priority Schemes</span>
                  <Badge className="bg-green-500 text-white">
                    {schemeData.schemeAnalysis.scheme_analysis.high_priority.length} schemes
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {schemeData.schemeAnalysis.scheme_analysis.high_priority.map((scheme, index) => (
                    <Card key={index} className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-lg bg-gradient-to-br from-white to-green-50">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-gray-900 text-lg leading-tight flex-1">
                            {scheme.scheme_name}
                          </h4>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 ml-2">
                            High Priority
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          {scheme.reasoning}
                        </p>
                        
                        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-xs text-green-700 font-semibold mb-1">Estimated Benefit</div>
                          <div className="text-sm font-bold text-green-800">
                            {scheme.estimated_benefit}
                          </div>
                        </div>
                        
                        <a 
                          href={scheme.official_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-sm font-semibold text-green-600 hover:text-green-700 hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Visit Official Portal</span>
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medium Priority Schemes */}
          {schemeData.schemeAnalysis.scheme_analysis.medium_priority.length > 0 && (
            <Card className="shadow-2xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b">
                <CardTitle className="flex items-center space-x-3 text-lg">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-yellow-800">Medium Priority Schemes</span>
                  <Badge className="bg-yellow-500 text-white">
                    {schemeData.schemeAnalysis.scheme_analysis.medium_priority.length} schemes
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {schemeData.schemeAnalysis.scheme_analysis.medium_priority.map((scheme, index) => (
                    <Card key={index} className="border-2 border-yellow-200 hover:border-yellow-400 transition-all hover:shadow-lg bg-gradient-to-br from-white to-yellow-50">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-gray-900 text-lg leading-tight flex-1">
                            {scheme.scheme_name}
                          </h4>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 ml-2">
                            Medium Priority
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          {scheme.reasoning}
                        </p>
                        
                        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="text-xs text-yellow-700 font-semibold mb-1">Estimated Benefit</div>
                          <div className="text-sm font-bold text-yellow-800">
                            {scheme.estimated_benefit}
                          </div>
                        </div>
                        
                        <a 
                          href={scheme.official_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-sm font-semibold text-yellow-600 hover:text-yellow-700 hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Visit Official Portal</span>
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Analysis */}
          {schemeData.schemeAnalysis.scheme_analysis.profile_analysis && (
            <Card className="shadow-2xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b">
                <CardTitle className="flex items-center space-x-3 text-lg">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-blue-800">Profile Analysis Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Eligibility Factors */}
                  <div className="bg-white p-5 rounded-xl shadow-sm">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Primary Eligibility Factors</span>
                    </h5>
                    <ul className="space-y-2">
                      {schemeData.schemeAnalysis.scheme_analysis.profile_analysis.primary_eligibility_factors.map((factor, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Livelihood Focus */}
                  <div className="bg-white p-5 rounded-xl shadow-sm">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Main Livelihood Focus</span>
                    </h5>
                    <p className="text-gray-700 text-sm">
                      {schemeData.schemeAnalysis.scheme_analysis.profile_analysis.main_livelihood_focus}
                    </p>
                  </div>

                  {/* Geographic Advantages */}
                  <div className="bg-white p-5 rounded-xl shadow-sm">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>Geographic Advantages</span>
                    </h5>
                    <p className="text-gray-700 text-sm">
                      {schemeData.schemeAnalysis.scheme_analysis.profile_analysis.geographic_advantages}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Scheme Error Message */}
      {schemeError && (
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 text-yellow-800">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold">Scheme Recommendations Unavailable</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  {schemeError} - Please run the scheme analysis pipeline to generate recommendations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
