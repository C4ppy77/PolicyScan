"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const policyTypes = [
  "Comprehensive",
  "Third Party, Fire & Theft",
  "Third Party Only",
];

const PolicyTypeSelect = ({ value, onValueChange }: { value?: string, onValueChange: (value: string) => void }) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="col-span-2 bg-gray-800 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-[#ADFF2F] focus:outline-none">
        <SelectValue placeholder="Select Policy Type" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 text-white">
        {policyTypes.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PolicyTypeSelect;
