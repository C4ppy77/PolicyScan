"use client"

import React, { useState } from "react"
import { PolicyData } from "@/lib/policyExtractor"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import PolicyTypeSelect from "./policy-type-select"

interface ManualEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (policyData: PolicyData) => void
}

export default function ManualEntryModal({ isOpen, onClose, onConfirm }: ManualEntryModalProps) {
  const [formData, setFormData] = useState<Omit<PolicyData, "registrationNumber">>({
    insurerName: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: 0,
    premiumAmount: 0,
    renewalDate: new Date().toISOString(),
    noClaimsDiscount: 0,
    annualMileage: 0,
    policyType: "Comprehensive",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    const isNumber = type === "number"
    setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }))
  }

  const handlePolicyTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, policyType: value }))
  }

  const handleConfirm = () => {
    onConfirm({ ...formData, registrationNumber: "" }) // registrationNumber is not needed for manual entry
  }

  const formatDateForInput = (isoDate: string) => {
    try {
      return new Date(isoDate).toISOString().split("T")[0]
    } catch {
      return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Enter Your Details Manually</DialogTitle>
          <DialogDescription className="text-center">
            We couldn't extract all details automatically. Please fill them in.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-4 bg-black/30 p-4 rounded-md overflow-y-auto max-h-[60vh]">
          <EditableItem label="Insurer" name="insurerName" value={formData.insurerName} onChange={handleInputChange} />
          <EditableItem label="Premium (£)" name="premiumAmount" value={formData.premiumAmount} onChange={handleInputChange} type="number" />
          <EditableItem label="Vehicle Make" name="vehicleMake" value={formData.vehicleMake} onChange={handleInputChange} />
          <EditableItem label="Vehicle Model" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} />
          <EditableItem label="Vehicle Year" name="vehicleYear" value={formData.vehicleYear} onChange={handleInputChange} type="number" />
          <EditableItem label="Renewal Date" name="renewalDate" value={formatDateForInput(formData.renewalDate)} onChange={handleInputChange} type="date" />
          <EditableItem label="No Claims (Years)" name="noClaimsDiscount" value={formData.noClaimsDiscount} onChange={handleInputChange} type="number" />
          <EditableItem label="Annual Mileage" name="annualMileage" value={formData.annualMileage} onChange={handleInputChange} type="number" />
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="policyType" className="text-sm text-gray-400 text-right">Policy Type</Label>
            <PolicyTypeSelect
              value={formData.policyType}
              onValueChange={handlePolicyTypeChange}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button variant="destructive" onClick={onClose} className="w-full">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="w-full bg-[#ADFF2F] text-black hover:bg-[#9AE234] font-bold">
            Confirm Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

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
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <Label htmlFor={name} className="text-sm text-gray-400 text-right">{label}</Label>
      <Input
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
