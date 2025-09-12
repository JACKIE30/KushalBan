'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { CheckCircle, XCircle, RefreshCw, Server, Database, Cpu } from 'lucide-react'
import { API_CONFIG } from '../config/api'

interface ServiceStatus {
  name: string
  status: 'healthy' | 'unhealthy' | 'checking'
  details?: any
  error?: string
}

export function SystemStatus() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Backend API', status: 'checking' },
    { name: 'OCR Service', status: 'checking' },
    { name: 'Document Classification', status: 'checking' }
  ])

  const checkBackendHealth = async (): Promise<Partial<ServiceStatus>> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/`)
      if (response.ok) {
        const data = await response.json()
        return { status: 'healthy', details: data }
      } else {
        return { status: 'unhealthy', error: `HTTP ${response.status}` }
      }
    } catch (error) {
      return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  const checkDetailedHealth = async (): Promise<Partial<ServiceStatus>> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/health`)
      if (response.ok) {
        const data = await response.json()
        return { status: 'healthy', details: data }
      } else {
        return { status: 'unhealthy', error: `HTTP ${response.status}` }
      }
    } catch (error) {
      return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  const runHealthChecks = async () => {
    setServices(prev => prev.map(service => ({ ...service, status: 'checking' })))

    // Check backend health
    const backendHealth = await checkBackendHealth()
    setServices(prev => prev.map(service => {
      if (service.name === 'Backend API') {
        return {
          ...service,
          status: backendHealth.status || 'unhealthy',
          details: backendHealth.details,
          error: backendHealth.error
        } as ServiceStatus
      }
      return service
    }))

    // Check detailed health
    const detailedHealth = await checkDetailedHealth()
    
    if (detailedHealth.status === 'healthy' && detailedHealth.details) {
      const { services: healthServices } = detailedHealth.details
      
      setServices(prev => prev.map(service => {
        if (service.name === 'OCR Service') {
          return {
            ...service,
            status: healthServices?.ocr_parser ? 'healthy' : 'unhealthy',
            details: { available: healthServices?.ocr_parser }
          }
        }
        if (service.name === 'Document Classification') {
          return {
            ...service,
            status: healthServices?.document_classifier ? 'healthy' : 'unhealthy',
            details: { available: healthServices?.document_classifier }
          }
        }
        return service
      }))
    }
  }

  useEffect(() => {
    runHealthChecks()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'unhealthy':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'checking':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <RefreshCw className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>
      case 'unhealthy':
        return <Badge className="bg-red-100 text-red-800">Unhealthy</Badge>
      case 'checking':
        return <Badge className="bg-blue-100 text-blue-800">Checking...</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'Backend API':
        return <Server className="w-5 h-5" />
      case 'OCR Service':
        return <Cpu className="w-5 h-5" />
      case 'Document Classification':
        return <Database className="w-5 h-5" />
      default:
        return <Server className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Status</h1>
          <p className="text-gray-600">Monitor the health of BanRakshak services</p>
        </div>
        <Button onClick={runHealthChecks} className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Status</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center space-x-2">
                  {getServiceIcon(service.name)}
                  <span>{service.name}</span>
                </div>
                {getStatusIcon(service.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  {getStatusBadge(service.status)}
                </div>
                
                {service.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <p className="text-sm text-red-700">Error: {service.error}</p>
                  </div>
                )}
                
                {service.details && (
                  <div className="bg-gray-50 border border-gray-200 rounded p-2">
                    <p className="text-xs text-gray-600 font-medium mb-1">Details:</p>
                    <pre className="text-xs text-gray-700 overflow-auto">
                      {JSON.stringify(service.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Connection Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Frontend URL:</span>
              <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded">http://localhost:3000</code>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Backend API:</span>
              <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{API_CONFIG.BASE_URL}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">API Documentation:</span>
              <a 
                href={`${API_CONFIG.BASE_URL}/docs`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
              >
                {API_CONFIG.BASE_URL}/docs
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
