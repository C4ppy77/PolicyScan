import { NextRequest, NextResponse } from 'next/server';
import { savePolicyScan } from '@/lib/savePolicyScan';
import { supabase } from '@/lib/supabaseClient';
import { PolicyData } from '@/lib/policyExtractor';

interface SaveScanRequest {
  policyData: PolicyData;
  ageRangeId: number;
  regionId: string;
}

export async function POST(req: NextRequest) {
  try {
    const { policyData, ageRangeId, regionId }: SaveScanRequest = await req.json();

    if (!policyData || !ageRangeId || !regionId) {
      return NextResponse.json({ error: 'Missing required data.' }, { status: 400 });
    }

    // --- Database Lookups ---
    const { data: ageRangeData, error: ageError } = await supabase
      .from('age_multipliers')
      .select('age_min, age_max, multiplier')
      .eq('id', ageRangeId)
      .single();

    if (ageError) {
      console.error('Supabase error fetching age range:', ageError.message);
      throw new Error(`Could not find age range with ID ${ageRangeId}.`);
    }

    const { data: regionData, error: regionError } = await supabase
      .from('region_multipliers')
      .select('region, multiplier')
      .eq('id', regionId)
      .single();

    if (regionError) {
      console.error('Supabase error fetching region:', regionError.message);
      throw new Error(`Could not find region with ID ${regionId}.`);
    }
    
    // --- Data Transformation and Saving ---
    const scanData = {
      manufacturer: policyData.vehicleMake,
      model: policyData.vehicleModel,
      ncd_years: policyData.noClaimsDiscount ?? 0,
      premium_last_year: policyData.premiumAmount,
      renewal_date: new Date(policyData.renewalDate).toISOString().split('T')[0],
      insurer_name: policyData.insurerName,
      policy_type: policyData.policyType,
      age_range: `${ageRangeData.age_min}–${ageRangeData.age_max}`,
      age_multiplier: ageRangeData.multiplier,
      region: regionData.region,
      region_multiplier: regionData.multiplier,
      raw_policy_text: JSON.stringify(policyData),
    };

    const savedScan = await savePolicyScan(scanData);

    return NextResponse.json(savedScan, { status: 200 });

  } catch (error: any) {
    console.error("Error in save-scan route:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
