"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Zap, CheckCircle, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function MyPolicyScanLanding() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      setShowResults(true)
    }, 3000)
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

          {/* Results Preview */}
          {showResults && <ResultsPreview />}
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
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={onFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="bg-[#ADFF2F] text-black hover:bg-[#9AE234] font-bold">Choose File</Button>
            </label>

            <div className="text-gray-400 text-sm">or</div>

            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
              <Camera className="w-4 h-4 mr-2" />
              Take a Photo
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

// Results Preview Component
function ResultsPreview() {
  return (
    <Card className="bg-gray-900 border-gray-700 p-8 max-w-2xl mx-auto mt-8">
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-[#ADFF2F] mb-4" />
          <h3 className="text-xl font-bold mb-2">Policy Scanned Successfully</h3>
        </div>

        <div className="bg-black p-6 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Current Policy:</span>
            <span className="font-semibold">Aviva, £832/yr, Ford Focus</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Market Average:</span>
            <span className="font-semibold">£620/yr</span>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-[#ADFF2F] font-bold">Potential Savings:</span>
              <span className="text-[#ADFF2F] font-bold text-xl">£212/yr</span>
            </div>
          </div>
        </div>

        <Button className="w-full bg-[#ADFF2F] text-black hover:bg-[#9AE234] font-bold py-3">
          Check Cheaper Quotes
        </Button>
      </div>
    </Card>
  )
}
