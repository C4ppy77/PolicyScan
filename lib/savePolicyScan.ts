import { supabase } from './supabaseClient';

export async function savePolicyScan(scanData: any) {
  console.log('Executing savePolicyScan');
  console.log('Original data received:', scanData);

  // Extracting only the necessary data as per the new approach.
  const dataToSave = {
    // Gemini results
    manufacturer: scanData.manufacturer,
    model: scanData.model,
    year_made: scanData.year_made,
    annual_mileage: scanData.annual_mileage, // Add this line
    ncd_years: scanData.ncd_years,
    premium_last_year: scanData.premium_last_year,
    renewal_date: scanData.renewal_date,
    insurer_name: scanData.insurer_name,
    policy_type: scanData.policy_type,
    raw_policy_text: scanData.raw_policy_text,

    // User selections
    age_range: scanData.age_range,
    region: scanData.region,
  };

  console.log('Data being sent to Supabase:', dataToSave);

  const { data, error } = await supabase
    .from('user_scans') // Changed from 'policy_scans' to 'user_scans'
    .insert([dataToSave])
    .select();

  if (error) {
    console.error('Error response from Supabase:', JSON.stringify(error, null, 2));
    throw new Error('Failed to save policy scan.');
  }

  console.log('Successfully inserted data!');
  return data;
}

