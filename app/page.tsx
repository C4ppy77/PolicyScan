"use client"

import React, { useState, useRef } from "react"
import { Upload, FileText, Zap, CheckCircle, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PolicyData } from "@/lib/policyExtractor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/components/ui/use-mobile"
import AgeRangeSelect from "@/components/age-range-select"
import RegionSelect from "@/components/region-select"
import PolicyTypeSelect from "@/components/policy-type-select"

export default function MyPolicyScanLanding() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [showAgeModal, setShowAgeModal] = useState(false)
  const [showRegionModal, setShowRegionModal] = useState(false)
  const [selectedAgeRangeId, setSelectedAgeRangeId] = useState<number | null>(null)
  const [confirmedPolicyData, setConfirmedPolicyData] = useState<PolicyData | null>(null)
  const [policyData, setPolicyData] = useState<PolicyData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file)
    setIsProcessing(true)
    setShowResultsModal(false) // Close modal before new upload
    setError(null)
    setPolicyData(null)

    const formData = new FormData()
    formData.append("policyImage", file)

    try {
      const response = await fetch("/api/upload-policy", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Something went wrong during analysis.")
      }

      const data: PolicyData = await response.json()
      setPolicyData(data)
      setShowResultsModal(true) // Open the modal on success
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const resetState = () => {
    setUploadedFile(null)
    setIsProcessing(false)
    setShowResultsModal(false)
    setShowAgeModal(false)
    setShowRegionModal(false)
    setPolicyData(null)
    setConfirmedPolicyData(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
            Upload Your Car Insurance. <span className="text-[#ADFF2F]">Find Out if You're Overpaying.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We scan your policy and tell you if there's a cheaper deal. No login needed.
          </p>

          {/* Upload Component */}
          <div className="mt-12">
            <UploadBox
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFile}
              isProcessing={isProcessing}
              onDrop={handleDrop}
              onFileSelect={handleFileSelect}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-center bg-red-900/20 p-6 rounded-md">
              <p className="font-bold text-red-400">Analysis Failed</p>
              <p className="text-sm text-red-400/80 mt-1 mb-4">{error}</p>
              <Button
                variant="destructive"
                onClick={resetState}
              >
                Start Over
              </Button>
            </div>
          )}

          {/* Results Modal */}
          <ResultsModal
            isOpen={showResultsModal}
            onClose={resetState}
            data={policyData}
            onConfirm={(confirmedData) => {
              setConfirmedPolicyData(confirmedData)
              setShowResultsModal(false)
              setShowAgeModal(true)
            }}
          />

          {/* Age Picker Modal */}
          <AgePickerModal
            isOpen={showAgeModal}
            onClose={() => setShowAgeModal(false)}
            onConfirm={(ageRangeId) => {
              setSelectedAgeRangeId(ageRangeId)
              setShowAgeModal(false)
              setShowRegionModal(true)
            }}
          />

          <RegionPickerModal
            isOpen={showRegionModal}
            onClose={() => setShowRegionModal(false)}
            onConfirm={(regionId: string) => {
              console.log("Final Confirmed Data:", confirmedPolicyData)
              console.log("Policyholder Age Range ID:", selectedAgeRangeId)
              console.log("Policyholder Region ID:", regionId)
              setShowRegionModal(false)
              resetState()
            }}
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-[#ADFF2F] rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold">1. Upload your letter</h3>
              <p className="text-gray-400">Drag and drop your renewal letter or take a photo</p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-[#ADFF2F] rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold">2. We scan it with AI</h3>
              <p className="text-gray-400">Our AI extracts your policy details instantly</p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-[#ADFF2F] rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold">3. You get results in seconds</h3>
              <p className="text-gray-400">See if you're overpaying and find better deals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate CTA Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black">Ready to Save Money?</h2>

          <Button
            size="lg"
            disabled
            className="bg-gray-600 text-gray-400 cursor-not-allowed px-8 py-4 text-lg font-bold"
          >
            Compare Quotes
          </Button>

          <p className="text-gray-400 text-sm">Coming soon — live quote integration</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-2xl font-black">MyPolicyScan</div>

            <div className="flex space-x-8 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2025 MyPolicyScan. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

// Upload Box Component
function UploadBox({
  onFileUpload,
  uploadedFile,
  isProcessing,
  onDrop,
  onFileSelect,
}: {
  onFileUpload: (file: File) => void
  uploadedFile: File | null
  isProcessing: boolean
  onDrop: (e: React.DragEvent) => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture")
      fileInputRef.current.accept = ".pdf,.jpg,.jpeg,.png"
      fileInputRef.current.click()
    }
  }

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment")
      fileInputRef.current.accept = "image/*"
      fileInputRef.current.click()
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-700 p-8 max-w-md mx-auto">
      {isProcessing ? (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-[#ADFF2F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-semibold">Processing...</p>
          <p className="text-gray-400 text-sm">Scanning your policy with AI</p>
        </div>
      ) : uploadedFile ? (
        <div className="text-center space-y-4">
          <FileText className="w-12 h-12 mx-auto text-[#ADFF2F]" />
          <p className="font-semibold">{uploadedFile.name}</p>
          <p className="text-gray-400 text-sm">File uploaded successfully</p>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center space-y-4 hover:border-[#ADFF2F] transition-colors cursor-pointer"
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400" />
          <div className="space-y-2">
            <p className="font-semibold">Drag & drop your policy here</p>
            <p className="text-gray-400 text-sm">PDF, JPG, PNG accepted</p>
          </div>

          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button onClick={handleChooseFile} className="bg-[#ADFF2F] text-black hover:bg-[#9AE234] font-bold">
              Choose File
            </Button>

            <div className="text-gray-400 text-sm">or</div>

            <Button
              onClick={handleTakePhoto}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
            >
              <Camera className="w-4 h-4 mr-2" />
              Take a Photo
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

// Results Modal Component
function ResultsModal({
  isOpen,
  onClose,
  data,
  onConfirm,
}: {
  isOpen: boolean
  onClose: () => void
  data: PolicyData | null
  onConfirm: (confirmedData: PolicyData) => void
}) {
  const [editedData, setEditedData] = React.useState<PolicyData | null>(data)

  React.useEffect(() => {
    setEditedData(data)
  }, [data])

  if (!isOpen || !editedData) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    const isNumber = type === 'number';
    setEditedData(prev => prev ? { ...prev, [name]: isNumber ? parseFloat(value) || 0 : value } : null)
  }

  const handlePolicyTypeChange = (value: string) => {
    setEditedData(prev => prev ? { ...prev, policyType: value } : null)
  }

  const handleConfirm = () => {
    if (editedData) {
      onConfirm(editedData)
    }
  }

  const handleReject = () => {
    onClose()
  }

  // Helper to format ISO date string to YYYY-MM-DD for the input
  const formatDateForInput = (isoDate: string) => {
    try {
      return new Date(isoDate).toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Confirm or Edit Your Details</DialogTitle>
          <DialogDescription className="text-center">
            Please check and correct any details extracted from your policy.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-4 bg-black/30 p-4 rounded-md overflow-y-auto max-h-[60vh]">
          <EditableItem label="Registration" name="registrationNumber" value={editedData.registrationNumber} onChange={handleInputChange} />
          <EditableItem label="Insurer" name="insurerName" value={editedData.insurerName} onChange={handleInputChange} />
          <EditableItem label="Premium (£)" name="premiumAmount" value={editedData.premiumAmount} onChange={handleInputChange} type="number" />
          <EditableItem label="Vehicle Make" name="vehicleMake" value={editedData.vehicleMake} onChange={handleInputChange} />
          <EditableItem label="Vehicle Model" name="vehicleModel" value={editedData.vehicleModel} onChange={handleInputChange} />
          <EditableItem label="Vehicle Year" name="vehicleYear" value={editedData.vehicleYear} onChange={handleInputChange} type="number" />
          <EditableItem label="Renewal Date" name="renewalDate" value={formatDateForInput(editedData.renewalDate)} onChange={handleInputChange} type="date" />
          <EditableItem label="No Claims (Years)" name="noClaimsDiscount" value={editedData.noClaimsDiscount} onChange={handleInputChange} type="number" />
          <EditableItem label="Annual Mileage" name="annualMileage" value={editedData.annualMileage} onChange={handleInputChange} type="number" />
          <div className="grid grid-cols-3 items-center gap-4">
            <label htmlFor="policyType" className="text-sm text-gray-400 text-right">Policy Type</label>
            <PolicyTypeSelect
              value={editedData.policyType}
              onValueChange={handlePolicyTypeChange}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button variant="destructive" onClick={handleReject} className="w-full">
            No, Start Over
          </Button>
          <Button onClick={handleConfirm} className="w-full bg-[#ADFF2F] text-black hover:bg-[#9AE234] font-bold">
            Yes, This Is Correct
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// A new component for editable fields
function EditableItem({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string
  name: string
  value?: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}) {
  if (value === undefined || value === null) return null

  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <label htmlFor={name} className="text-sm text-gray-400 text-right">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="col-span-2 bg-gray-800 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-[#ADFF2F] focus:outline-none"
        step={type === 'number' ? '0.01' : undefined}
      />
    </div>
  )
}

function AgePickerModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: (ageRangeId: number) => void
}) {
  const [selectedAgeRangeId, setSelectedAgeRangeId] = React.useState<number | null>(null)

  const handleConfirm = () => {
    if (selectedAgeRangeId) {
      onConfirm(selectedAgeRangeId)
    }
  }

  const handleAgeRangeChange = (id: string) => {
    setSelectedAgeRangeId(parseInt(id, 10))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>What is your age range?</DialogTitle>
          <DialogDescription>
            Please select the age range of the main policyholder. This helps us find accurate quotes.
          </DialogDescription>
        </DialogHeader>

        <AgeRangeSelect onValueChange={handleAgeRangeChange} />

        <div className="flex justify-end mt-4">
          <Button onClick={handleConfirm} disabled={!selectedAgeRangeId} className="w-full bg-[#ADFF2F] text-black hover:bg-[#9AE234] font-bold">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function RegionPickerModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: (regionId: string) => void
}) {
  const [selectedRegionId, setSelectedRegionId] = React.useState<string | null>(null)

  const handleConfirm = () => {
    if (selectedRegionId) {
      onConfirm(selectedRegionId)
    }
  }

  const handleRegionChange = (id: string) => {
    console.log("Selected Region ID from component:", id);
    setSelectedRegionId(id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>What is your region?</DialogTitle>
          <DialogDescription>
            Please select your region to help us find accurate quotes.
          </DialogDescription>
        </DialogHeader>

        <RegionSelect onValueChange={handleRegionChange} />

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleConfirm}
            disabled={!selectedRegionId}
            className="w-full bg-[#ADFF2F] text-black hover:bg-[#9AE234] font-bold disabled:bg-gray-600 disabled:text-gray-400"
          >
            See Quotes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
