'use client'

import React, { useState } from 'react';
import {
  User,
  MapPin,
  Users,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  FileText,
  TreePine,
  Home,
  Ruler,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Alert, AlertDescription } from '../../../components/ui/alert';

interface FormData {
  // Personal Details
  firstName: string;
  lastName: string;
  fatherName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  aadharNumber: string;

  // Address
  houseNumber: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  pincode: string;

  // Land Details
  surveyNumber: string;
  subDivisionNumber: string;
  landType: string;
  totalArea: string;
  claimedArea: string;
  boundaryDetails: string;
  currentUse: string;

  // Community Details
  tribe: string;
  community: string;
  familySize: string;
  occupation: string;
  forestDependence: string;
  traditionalRights: string[];

  // Documents
  uploadedDocuments: string[];
}

const initialFormData: FormData = {
  firstName: '', lastName: '', fatherName: '', dateOfBirth: '', gender: '',
  phoneNumber: '', email: '', aadharNumber: '',
  houseNumber: '', village: '', tehsil: '', district: '', state: '', pincode: '',
  surveyNumber: '', subDivisionNumber: '', landType: '', totalArea: '',
  claimedArea: '', boundaryDetails: '', currentUse: '',
  tribe: '', community: '', familySize: '', occupation: '', forestDependence: '',
  traditionalRights: [], uploadedDocuments: []
};

const steps = [
  { id: 1, name: 'Personal Details', icon: User, description: 'Basic information about the claimant' },
  { id: 2, name: 'Land Details', icon: MapPin, description: 'Information about the claimed land' },
  { id: 3, name: 'Community Info', icon: Users, description: 'Tribal and community details' },
  { id: 4, name: 'Documents', icon: Upload, description: 'Upload supporting documents' },
  { id: 5, name: 'Review', icon: CheckCircle, description: 'Review and submit your claim' }
];

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const landTypes = [
  'Forest Land', 'Revenue Land', 'Sarkar Land', 'Patta Land', 'Community Land'
];

const tribes = [
  'Gond', 'Santhal', 'Bhil', 'Munda', 'Oraon', 'Kol', 'Sahariya', 'Baiga',
  'Korkus', 'Abujh Maria', 'Hill Maria', 'Bisonhorn Maria', 'Other'
];

const traditionalRightsOptions = [
  'Collection of Minor Forest Produce',
  'Grazing Rights',
  'Fishing Rights',
  'Water Access Rights',
  'Traditional Cultivation',
  'Sacred Grove Protection',
  'Habitat Rights'
];

const requiredDocuments = [
  { name: 'Identity Proof (Aadhar/Voter ID)', required: true },
  { name: 'Caste Certificate', required: true },
  { name: 'Residence Proof', required: true },
  { name: 'Forest Rights Evidence', required: true },
  { name: 'Survey Settlement Records', required: false },
  { name: 'Revenue Records', required: false },
  { name: 'Community Certificate', required: false },
  { name: 'Photographs of Land', required: false }
];

export function ClaimSubmission() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [dragActive, setDragActive] = useState(false);

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.fatherName) newErrors.fatherName = 'Father name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.aadharNumber) newErrors.aadharNumber = 'Aadhar number is required';
        if (!formData.village) newErrors.village = 'Village is required';
        if (!formData.district) newErrors.district = 'District is required';
        if (!formData.state) newErrors.state = 'State is required';
        break;
      case 2:
        if (!formData.surveyNumber) newErrors.surveyNumber = 'Survey number is required';
        if (!formData.landType) newErrors.landType = 'Land type is required';
        if (!formData.totalArea) newErrors.totalArea = 'Total area is required';
        if (!formData.claimedArea) newErrors.claimedArea = 'Claimed area is required';
        if (!formData.currentUse) newErrors.currentUse = 'Current use is required';
        break;
      case 3:
        if (!formData.tribe) newErrors.tribe = 'Tribe is required';
        if (!formData.community) newErrors.community = 'Community is required';
        if (!formData.familySize) newErrors.familySize = 'Family size is required';
        if (!formData.occupation) newErrors.occupation = 'Occupation is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      alert('Claim submitted successfully! Your application ID is FRA-2024-' + Math.floor(Math.random() * 1000));
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-green-600" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
          <div>
            <Label htmlFor="fatherName">Father's Name *</Label>
            <Input
              id="fatherName"
              value={formData.fatherName}
              onChange={(e) => updateFormData('fatherName', e.target.value)}
              className={errors.fatherName ? 'border-red-500' : ''}
            />
            {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>}
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
              className={errors.dateOfBirth ? 'border-red-500' : ''}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
          </div>
          <div>
            <Label>Gender *</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => updateFormData('gender', value)}
              className="flex space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData('phoneNumber', e.target.value)}
              className={errors.phoneNumber ? 'border-red-500' : ''}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="aadharNumber">Aadhar Number *</Label>
            <Input
              id="aadharNumber"
              value={formData.aadharNumber}
              onChange={(e) => updateFormData('aadharNumber', e.target.value)}
              className={errors.aadharNumber ? 'border-red-500' : ''}
            />
            {errors.aadharNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Home className="w-5 h-5 mr-2 text-green-600" />
          Address Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="houseNumber">House Number</Label>
            <Input
              id="houseNumber"
              value={formData.houseNumber}
              onChange={(e) => updateFormData('houseNumber', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="village">Village *</Label>
            <Input
              id="village"
              value={formData.village}
              onChange={(e) => updateFormData('village', e.target.value)}
              className={errors.village ? 'border-red-500' : ''}
            />
            {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village}</p>}
          </div>
          <div>
            <Label htmlFor="tehsil">Tehsil/Block</Label>
            <Input
              id="tehsil"
              value={formData.tehsil}
              onChange={(e) => updateFormData('tehsil', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="district">District *</Label>
            <Input
              id="district"
              value={formData.district}
              onChange={(e) => updateFormData('district', e.target.value)}
              className={errors.district ? 'border-red-500' : ''}
            />
            {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Select value={formData.state} onValueChange={(value) => updateFormData('state', value)}>
              <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </div>
          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => updateFormData('pincode', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderLandDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <TreePine className="w-5 h-5 mr-2 text-green-600" />
        Land Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="surveyNumber">Survey Number *</Label>
          <Input
            id="surveyNumber"
            value={formData.surveyNumber}
            onChange={(e) => updateFormData('surveyNumber', e.target.value)}
            className={errors.surveyNumber ? 'border-red-500' : ''}
          />
          {errors.surveyNumber && <p className="text-red-500 text-sm mt-1">{errors.surveyNumber}</p>}
        </div>
        <div>
          <Label htmlFor="subDivisionNumber">Sub-division Number</Label>
          <Input
            id="subDivisionNumber"
            value={formData.subDivisionNumber}
            onChange={(e) => updateFormData('subDivisionNumber', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="landType">Land Type *</Label>
          <Select value={formData.landType} onValueChange={(value) => updateFormData('landType', value)}>
            <SelectTrigger className={errors.landType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select Land Type" />
            </SelectTrigger>
            <SelectContent>
              {landTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.landType && <p className="text-red-500 text-sm mt-1">{errors.landType}</p>}
        </div>
        <div>
          <Label htmlFor="totalArea">Total Area (in hectares) *</Label>
          <Input
            id="totalArea"
            type="number"
            step="0.01"
            value={formData.totalArea}
            onChange={(e) => updateFormData('totalArea', e.target.value)}
            className={errors.totalArea ? 'border-red-500' : ''}
          />
          {errors.totalArea && <p className="text-red-500 text-sm mt-1">{errors.totalArea}</p>}
        </div>
        <div>
          <Label htmlFor="claimedArea">Claimed Area (in hectares) *</Label>
          <Input
            id="claimedArea"
            type="number"
            step="0.01"
            value={formData.claimedArea}
            onChange={(e) => updateFormData('claimedArea', e.target.value)}
            className={errors.claimedArea ? 'border-red-500' : ''}
          />
          {errors.claimedArea && <p className="text-red-500 text-sm mt-1">{errors.claimedArea}</p>}
        </div>
        <div>
          <Label htmlFor="currentUse">Current Use of Land *</Label>
          <Input
            id="currentUse"
            value={formData.currentUse}
            onChange={(e) => updateFormData('currentUse', e.target.value)}
            className={errors.currentUse ? 'border-red-500' : ''}
          />
          {errors.currentUse && <p className="text-red-500 text-sm mt-1">{errors.currentUse}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="boundaryDetails">Boundary Details</Label>
        <Textarea
          id="boundaryDetails"
          value={formData.boundaryDetails}
          onChange={(e) => updateFormData('boundaryDetails', e.target.value)}
          placeholder="Describe the boundaries of your claimed land (North, South, East, West)"
          rows={4}
        />
      </div>
    </div>
  );

  const renderCommunityInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2 text-green-600" />
        Community and Livelihood Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tribe">Tribe *</Label>
          <Select value={formData.tribe} onValueChange={(value) => updateFormData('tribe', value)}>
            <SelectTrigger className={errors.tribe ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select Tribe" />
            </SelectTrigger>
            <SelectContent>
              {tribes.map((tribe) => (
                <SelectItem key={tribe} value={tribe}>{tribe}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tribe && <p className="text-red-500 text-sm mt-1">{errors.tribe}</p>}
        </div>
        <div>
          <Label htmlFor="community">Community/Sub-tribe *</Label>
          <Input
            id="community"
            value={formData.community}
            onChange={(e) => updateFormData('community', e.target.value)}
            className={errors.community ? 'border-red-500' : ''}
          />
          {errors.community && <p className="text-red-500 text-sm mt-1">{errors.community}</p>}
        </div>
        <div>
          <Label htmlFor="familySize">Family Size *</Label>
          <Input
            id="familySize"
            type="number"
            value={formData.familySize}
            onChange={(e) => updateFormData('familySize', e.target.value)}
            className={errors.familySize ? 'border-red-500' : ''}
          />
          {errors.familySize && <p className="text-red-500 text-sm mt-1">{errors.familySize}</p>}
        </div>
        <div>
          <Label htmlFor="occupation">Primary Occupation *</Label>
          <Input
            id="occupation"
            value={formData.occupation}
            onChange={(e) => updateFormData('occupation', e.target.value)}
            className={errors.occupation ? 'border-red-500' : ''}
          />
          {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="forestDependence">Dependence on Forest Resources</Label>
        <Textarea
          id="forestDependence"
          value={formData.forestDependence}
          onChange={(e) => updateFormData('forestDependence', e.target.value)}
          placeholder="Describe how your family depends on forest resources for livelihood"
          rows={3}
        />
      </div>
      <div>
        <Label>Traditional Rights Claimed</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {traditionalRightsOptions.map((right) => (
            <div key={right} className="flex items-center space-x-2">
              <Checkbox
                id={right}
                checked={formData.traditionalRights.includes(right)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData('traditionalRights', [...formData.traditionalRights, right]);
                  } else {
                    updateFormData('traditionalRights', formData.traditionalRights.filter(r => r !== right));
                  }
                }}
              />
              <Label htmlFor={right} className="text-sm">{right}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Upload className="w-5 h-5 mr-2 text-green-600" />
        Supporting Documents
      </h3>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please upload clear, readable copies of all required documents. Maximum file size: 5MB per document.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {requiredDocuments.map((doc, index) => (
          <Card key={index} className="bg-gray-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    {doc.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Additional Documents</h3>
        <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
        <Button variant="outline">Browse Files</Button>
        <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, JPG, PNG (Max 5MB each)</p>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
        Review Your Application
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
            <p><span className="font-medium">Father's Name:</span> {formData.fatherName}</p>
            <p><span className="font-medium">Gender:</span> {formData.gender}</p>
            <p><span className="font-medium">Phone:</span> {formData.phoneNumber}</p>
            <p><span className="font-medium">Address:</span> {formData.village}, {formData.district}, {formData.state}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Land Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-medium">Survey Number:</span> {formData.surveyNumber}</p>
            <p><span className="font-medium">Land Type:</span> {formData.landType}</p>
            <p><span className="font-medium">Total Area:</span> {formData.totalArea} hectares</p>
            <p><span className="font-medium">Claimed Area:</span> {formData.claimedArea} hectares</p>
            <p><span className="font-medium">Current Use:</span> {formData.currentUse}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Community Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-medium">Tribe:</span> {formData.tribe}</p>
            <p><span className="font-medium">Community:</span> {formData.community}</p>
            <p><span className="font-medium">Family Size:</span> {formData.familySize}</p>
            <p><span className="font-medium">Occupation:</span> {formData.occupation}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Traditional Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.traditionalRights.map((right, index) => (
                <Badge key={index} variant="outline" className="text-xs">{right}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          I hereby declare that the information provided above is true and accurate to the best of my knowledge.
          I understand that providing false information may result in rejection of my claim.
        </AlertDescription>
      </Alert>

      <div className="flex items-center space-x-2">
        <Checkbox id="declaration" />
        <Label htmlFor="declaration" className="text-sm">
          I agree to the terms and conditions and declare that the information provided is correct.
        </Label>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderPersonalDetails();
      case 2: return renderLandDetails();
      case 3: return renderCommunityInfo();
      case 4: return renderDocuments();
      case 5: return renderReview();
      default: return renderPersonalDetails();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital FRA Claim Submission</h1>
          <p className="text-gray-600">Submit your Forest Rights Act claim online</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Application Form
        </Badge>
      </div>

      {/* Progress bar */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center space-y-2">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                    ${isActive ? 'border-green-600 bg-green-600 text-white' :
                      isCompleted ? 'border-green-600 bg-green-50 text-green-600' :
                      'border-gray-300 bg-gray-100 text-gray-400'}
                  `}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                      {step.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form content */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5 mr-2 text-green-600" })}
            {steps[currentStep - 1].name}
          </CardTitle>
          <p className="text-gray-600">{steps[currentStep - 1].description}</p>
        </CardHeader>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-3">
          <Button variant="outline">
            Save Draft
          </Button>
          {currentStep < 5 ? (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 flex items-center"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 flex items-center"
            >
              Submit Claim
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}