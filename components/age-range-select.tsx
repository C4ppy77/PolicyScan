"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AgeRange {
  id: string; // Changed from number to string to support UUIDs
  age_min: number;
  age_max: number;
}

const AgeRangeSelect = ({ onValueChange }: { onValueChange: (value: string) => void }) => {
  const [ageRanges, setAgeRanges] = useState<AgeRange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgeRanges = async () => {
      try {
        const { data, error } = await supabase
          .from('age_multipliers')
          .select('id, age_min, age_max');

        if (error) {
          throw error;
        }

        setAgeRanges(data || []);
      } catch (error) {
        console.error('Error fetching age ranges:', (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgeRanges();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-gray-800 border-gray-600">
        <SelectValue placeholder="Select Age Range" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 text-white" position="popper" side="bottom">
        {ageRanges.map((range) => (
          <SelectItem key={range.id} value={String(range.id)}>
            {range.age_min} – {range.age_max}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AgeRangeSelect;
