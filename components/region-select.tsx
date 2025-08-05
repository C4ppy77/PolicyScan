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

interface Region {
  id: string; // Changed from number to string to support UUIDs
  region: string;
}

const RegionSelect = ({ onValueChange }: { onValueChange: (value: string) => void }) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const { data, error } = await supabase
          .from('region_multipliers')
          .select('id, region');

        if (error) {
          throw error;
        }

        if (data) {
          setRegions(data);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching regions:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  if (loading) {
    return <div>Loading regions...</div>;
  }
  
  if (error) {
      return <div className="text-red-500">Failed to load regions.</div>
  }

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-gray-800 border-gray-600">
        <SelectValue placeholder="Select Region" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 text-white" position="popper" side="bottom">
        {regions.map((region) => (
          <SelectItem key={region.id} value={String(region.id)}>
            {region.region}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RegionSelect;
