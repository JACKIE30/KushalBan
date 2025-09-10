'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Upload, File, Eye, Download, Trash2, CheckCircle, AlertCircle, Clock, User, MapPin, Calendar, Hash } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { Separator } from '../../../components/ui/separator'
import { useLanguage } from './LanguageContext'

interface ExtractedEntity {
  text: string
  label: string
  confidence: number
  start: number
  end: number
}

interface OCRResult {
  id: string
  filename: string
  uploadTime: Date
  status: 'processing' | 'completed' | 'error'
  progress: number
  extractedText?: string
  entities?: ExtractedEntity[]
  metadata?: {
    pageCount: number
    language: string
    fileSize: string
  }
}

export function OCRProcessor() {
  const { t, language } = useLanguage()
  const [files, setFiles] = useState<OCRResult[]>([])
  const [selectedFile, setSelectedFile] = useState<OCRResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock OCR processing with realistic delays and results
  const processFile = useCallback(async (file: File): Promise<OCRResult> => {
    const result: OCRResult = {
      id: Date.now().toString(),
      filename: file.name,
      uploadTime: new Date(),
      status: 'processing',
      progress: 0,
      metadata: {
        pageCount: Math.floor(Math.random() * 5) + 1,
        language: language === 'hi' ? 'Hindi' : 'English',
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      }
    }

    setFiles(prev => [...prev, result])

    // Simulate processing with progress updates
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setFiles(prev => prev.map(f => f.id === result.id ? {...f, progress: i} : f))
    }

    // Mock extracted text and entities
    const mockExtractedText = language === 'hi'
      ? `नाम: राम कुमार शर्मा
पता: ग्राम - रामपुर, तहसील - सिवनी, जिला - सिवनी (मध्य प्रदेश)
आधार संख्या: 1234 5678 9012
फोन नंबर: +91-9876543210
दिनांक: 15/03/2024
आवेदन संख्या: FRA/MP/2024/001234

वन अधिकार दावा विवरण:
- भूमि का प्रकार: कृषि भूमि
- क्षेत्रफल: 2.5 हेक्टेयर
- सर्वे संख्या: 45/2
- निवास अवधि: 1985 से निरंतर
- पारंपरिक व्यवसाय: कृषि एवं वन उत्पाद संग्रह`
      : `Name: Ram Kumar Sharma
Address: Village - Rampur, Tehsil - Seoni, District - Seoni (Madhya Pradesh)
Aadhaar Number: 1234 5678 9012
Phone Number: +91-9876543210
Date: 15/03/2024
Application Number: FRA/MP/2024/001234

Forest Rights Claim Details:
- Land Type: Agricultural Land
- Area: 2.5 hectares
- Survey Number: 45/2
- Period of Residence: Continuously since 1985
- Traditional Occupation: Agriculture and Forest Produce Collection`

    const mockEntities: ExtractedEntity[] = [
      { text: 'Ram Kumar Sharma', label: 'PERSON', confidence: 0.98, start: 6, end: 21 },
      { text: 'Rampur', label: 'LOCATION', confidence: 0.95, start: 40, end: 46 },
      { text: 'Seoni', label: 'LOCATION', confidence: 0.94, start: 58, end: 63 },
      { text: 'Madhya Pradesh', label: 'STATE', confidence: 0.96, start: 75, end: 89 },
      { text: '1234 5678 9012', label: 'AADHAAR', confidence: 0.99, start: 107, end: 121 },
      { text: '+91-9876543210', label: 'PHONE', confidence: 0.97, start: 140, end: 154 },
      { text: '15/03/2024', label: 'DATE', confidence: 0.98, start: 162, end: 172 },
      { text: 'FRA/MP/2024/001234', label: 'APPLICATION_ID', confidence: 0.99, start: 194, end: 212 },
      { text: '2.5 hectares', label: 'AREA', confidence: 0.95, start: 280, end: 292 },
      { text: '45/2', label: 'SURVEY_NUMBER', confidence: 0.93, start: 309, end: 313 },
      { text: '1985', label: 'YEAR', confidence: 0.96, start: 360, end: 364 }
    ]

    const completedResult: OCRResult = {
      ...result,
      status: 'completed',
      progress: 100,
      extractedText: mockExtractedText,
      entities: mockEntities
    }

    setFiles(prev => prev.map(f => f.id === result.id ? completedResult : f))
    return completedResult
  }, [language])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    droppedFiles.forEach(file => {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        processFile(file)
      }
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
          processFile(file)
        }
      })
    }
  }

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    if (selectedFile?.id === id) {
      setSelectedFile(null)
    }
  }

  const getEntityColor = (label: string) => {
    const colors: Record<string, string> = {
      'PERSON': 'bg-blue-100 text-blue-800 border-blue-200',
      'LOCATION': 'bg-green-100 text-green-800 border-green-200',
      'STATE': 'bg-purple-100 text-purple-800 border-purple-200',
      'AADHAAR': 'bg-red-100 text-red-800 border-red-200',
      'PHONE': 'bg-orange-100 text-orange-800 border-orange-200',
      'DATE': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'APPLICATION_ID': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'AREA': 'bg-teal-100 text-teal-800 border-teal-200',
      'SURVEY_NUMBER': 'bg-pink-100 text-pink-800 border-pink-200',
      'YEAR': 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[label] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getEntityIcon = (label: string) => {
    const icons: Record<string, React.ReactNode> = {
      'PERSON': <User className="w-3 h-3" />,
      'LOCATION': <MapPin className="w-3 h-3" />,
      'STATE': <MapPin className="w-3 h-3" />,
      'DATE': <Calendar className="w-3 h-3" />,
      'APPLICATION_ID': <Hash className="w-3 h-3" />,
      'PHONE': <Hash className="w-3 h-3" />,
      'AADHAAR': <Hash className="w-3 h-3" />
    }
    return icons[label] || <Hash className="w-3 h-3" />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-gradient">{language === 'hi' ? 'ओसीआर + एनईआर दस्तावेज़ प्रसंस्करण' : 'OCR + NER Document Processing'}</h1>
          <p className="text-gray-600">
            {language === 'hi'
              ? 'दस्तावेजों को अपलोड करें और स्वचालित टेक्स्ट निष्कर्षण और नामित इकाई पहचान का उपयोग क���के उनका विश्लेषण करें'
              : 'Upload documents and analyze them using automated text extraction and named entity recognition'
            }
          </p>
        </div>

        {/* Upload Area */}
        <Card className="government-card">
          <CardContent className="p-6">
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-green-400 hover:bg-green-50/30'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">
                  {language === 'hi' ? 'दस्तावेज़ अपलोड करें' : 'Upload Documents'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'hi'
                    ? 'PDF, PNG, JPG फाइलों को यहाँ खींचकर छोड़ें या क्लिक करके चुनें'
                    : 'Drag and drop PDF, PNG, JPG files here or click to select'
                  }
                </p>
                <Button variant="outline" size="sm">
                  {language === 'hi' ? 'फाइल चुनें' : 'Choose Files'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File List */}
        <Card className="government-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <File className="w-5 h-5" />
              <span>{language === 'hi' ? 'अपलोड की गई फाइलें' : 'Uploaded Files'}</span>
              <Badge variant="secondary" className="ml-auto">
                {files.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {files.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <File className="mx-auto h-8 w-8 mb-2" />
                    <p className="text-sm">
                      {language === 'hi' ? 'कोई फाइल अपलोड नहीं की गई' : 'No files uploaded yet'}
                    </p>
                  </div>
                ) : (
                  files.map((file) => (
                    <Card key={file.id} className={`cursor-pointer transition-all duration-200 ${selectedFile?.id === file.id ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'}`} onClick={() => setSelectedFile(file)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between space-x-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <File className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {file.filename}
                              </span>
                              <div className="flex items-center space-x-1">
                                {file.status === 'completed' && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                {file.status === 'processing' && (
                                  <Clock className="w-4 h-4 text-orange-500 animate-pulse" />
                                )}
                                {file.status === 'error' && (
                                  <AlertCircle className="w-4 h-4 text-red-500" />
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>{file.uploadTime.toLocaleString()}</p>
                              {file.metadata && (
                                <p>{file.metadata.fileSize} • {file.metadata.pageCount} pages</p>
                              )}
                            </div>
                            {file.status === 'processing' && (
                              <div className="mt-2">
                                <Progress value={file.progress} className="h-1" />
                                <p className="text-xs text-gray-500 mt-1">
                                  {language === 'hi' ? 'प्रसंस्करण' : 'Processing'}... {file.progress}%
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {file.status === 'completed' && (
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteFile(file.id) }}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="government-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>{language === 'hi' ? 'परिणाम' : 'Results'}</span>
              {selectedFile && (
                <Badge variant="outline" className="ml-auto">
                  {selectedFile.filename}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedFile ? (
              <div className="text-center py-8 text-gray-500">
                <Eye className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">
                  {language === 'hi' ? 'परिणाम देखने के लिए एक फाइल चुनें' : 'Select a file to view results'}
                </p>
              </div>
            ) : selectedFile.status === 'processing' ? (
              <div className="text-center py-8">
                <Clock className="mx-auto h-8 w-8 mb-2 text-orange-500 animate-pulse" />
                <p className="text-sm text-gray-600">
                  {language === 'hi' ? 'प्रसंस्करण जारी है...' : 'Processing in progress...'}
                </p>
                <Progress value={selectedFile.progress} className="mt-4 max-w-xs mx-auto" />
              </div>
            ) : selectedFile.status === 'error' ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-8 w-8 mb-2 text-red-500" />
                <p className="text-sm text-red-600">
                  {language === 'hi' ? 'प्रसंस्करण में त्रुटि हुई' : 'Processing error occurred'}
                </p>
              </div>
            ) : (
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">{language === 'hi' ? 'निकाला गया टेक्स्ट' : 'Extracted Text'}</TabsTrigger>
                  <TabsTrigger value="entities">{language === 'hi' ? 'नामित इकाइयाँ' : 'Named Entities'}</TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        {language === 'hi' ? 'ओसीआर आउटपुट' : 'OCR Output'}
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          {language === 'hi' ? 'डाउनलोड' : 'Download'}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded border">
                          {selectedFile.extractedText}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="entities" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">
                        {language === 'hi' ? 'पहचानी गई इकाइयाँ' : 'Identified Entities'}
                      </h4>
                      <Badge variant="outline">
                        {selectedFile.entities?.length || 0} {language === 'hi' ? 'इकाइयाँ' : 'entities'}
                      </Badge>
                    </div>

                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {selectedFile.entities?.map((entity, index) => (
                          <Card key={index} className="border border-gray-200">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between space-x-3">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge variant="outline" className={getEntityColor(entity.label)}>
                                      {getEntityIcon(entity.label)}
                                      <span className="ml-1 text-xs font-medium">{entity.label}</span>
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {Math.round(entity.confidence * 100)}%
                                    </Badge>
                                  </div>
                                  <p className="font-medium text-sm text-gray-900 bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                                    "{entity.text}"
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}