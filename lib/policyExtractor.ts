import { z } from 'zod';

// Define the Zod schema for validating the extracted policy data.
// I've added the 'export' keyword here.
export const PolicyDataSchema = z.object({
  // Gemini output for 'registration_number' -> registrationNumber
  registrationNumber: z.string().regex(/^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$/, "Invalid UK registration number format"),
  
  // Gemini output for 'insurer_name' -> insurerName
  insurerName: z.string().min(1, "Insurer name cannot be empty"),
  
  // Gemini output for 'premium_amount' -> premiumAmount
  premiumAmount: z.number().positive("Premium amount must be a positive number"),
  
  // Gemini output for 'vehicle_make' -> vehicleMake
  vehicleMake: z.string().min(1, "Vehicle make cannot be empty"),
  
  // Gemini output for 'vehicle_model' -> vehicleModel
  vehicleModel: z.string().min(1, "Vehicle model cannot be empty"),
  
  // Gemini output for 'vehicle_year' -> vehicleYear
  vehicleYear: z.number().int().min(1900).max(new Date().getFullYear() + 1, "Invalid vehicle year"),
  
  // Gemini output for 'renewal_date' -> renewalDate
  renewalDate: z.string().datetime("Invalid date format, should be ISO string"),
});

// The type can be inferred from the schema
export type PolicyData = z.infer<typeof PolicyDataSchema>;

/**
 * Extracts structured policy data from raw text.
 * 
 * This function is designed to process text that has been semi-structured 
 * by a generative model like Gemini. It uses regular expressions to find
 * and extract key pieces of information from the text.
 *
 * @param text The raw text output from an OCR or LLM process.
 * @returns A validated policy data object.
 * @throws An error if the text cannot be parsed or fails validation.
 */
export function extractPolicyDataFromText(text: string): PolicyData {
  const extractedData = {
    registrationNumber: extract(/Registration Number:\s*([A-Z]{2}[0-9]{2}\s?[A-Z]{3})/i, text),
    insurerName: extract(/Insurer:\s*(.*)/i, text),
    premiumAmount: parseFloat(extract(/Premium:\s*£?([0-9,]+\.?[0-9]*)/i, text)?.replace(/,/g, '') || '0'),
    vehicleMake: extract(/Vehicle Make:\s*(.*)/i, text),
    vehicleModel: extract(/Vehicle Model:\s*(.*)/i, text),
    vehicleYear: parseInt(extract(/Vehicle Year:\s*([0-9]{4})/i, text) || '0', 10),
    renewalDate: new Date(extract(/Renewal Date:\s*(.*)/i, text) || '').toISOString(),
  };

  // Validate the extracted data against the schema
  const validationResult = PolicyDataSchema.safeParse(extractedData);

  if (!validationResult.success) {
    // Throw an error with detailed issues if validation fails
    throw new Error(`Policy data validation failed: ${JSON.stringify(validationResult.error.flatten().fieldErrors)}`);
  }

  return validationResult.data;
}

/**
 * A helper function to run a regex and extract a capturing group.
 * @param regex The regular expression to execute.
 * @param text The text to search within.
 * @returns The captured string or null if no match is found.
 */
function extract(regex: RegExp, text: string): string | null {
  const match = text.match(regex);
  return match ? match[1]?.trim() : null;
}
