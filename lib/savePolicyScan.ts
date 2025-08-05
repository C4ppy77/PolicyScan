import { supabase } from '@/lib/supabaseClient';

/**
 * Interface for the policy scan data.
 * The 'uuid' type from Postgres is represented as a 'string' in TypeScript.
 * The 'date' type from Postgres can be represented as a 'string' or 'Date' object.
 */
interface PolicyScan {
  manufacturer: string;
  model: string;
  ncd_years: number;
  premium_last_year: number;
  renewal_date: string; // YYYY-MM-DD format
  insurer_name: string;
  policy_type?: string;
  age_range: string;
  age_multiplier: number;
  region: string;
  region_multiplier: number;
  calculated_base_premium?: number;
  adjusted_premium?: number;
  policy_age_years?: number;
  used_in_baseline?: boolean; // Defaults to false
  is_duplicate_policy?: boolean; // Defaults to false
  duplicate_of?: string; // uuid
  affiliate_partner?: string;
  affiliate_click_id?: string;
  affiliate_clicked_at?: string | Date; // date
  affiliate_converted?: boolean;
  affiliate_conversion_at?: string | Date; // date
  notes?: string;
  source?: string;
  raw_policy_text?: string;
}

/**
 * Inserts a new policy scan into the Supabase 'user_scans' table.
 *
 * @param scanData - An object containing the policy scan data.
 * @returns The newly inserted record from the 'user_scans' table.
 * @throws Will throw an error if the Supabase insert operation fails.
 */
export async function savePolicyScan(scanData: PolicyScan) {
  // Prepare the data for insertion, setting default values for boolean fields
  const dataToInsert = {
    ...scanData,
    used_in_baseline: scanData.used_in_baseline ?? false,
    is_duplicate_policy: scanData.is_duplicate_policy ?? false,
  };

  const { data, error } = await supabase
    .from('user_scans')
    .insert([dataToInsert])
    .select()
    .single(); // Use .single() to get the inserted object directly

  if (error) {
    // Log the error for debugging and throw a new error to be handled by the caller
    console.error('Error inserting policy scan:', error.message);
    throw new Error('Failed to save policy scan.');
  }

  return data;
}