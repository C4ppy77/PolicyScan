import { GoogleGenerativeAI } from "@google/generative-ai";
import { PolicyData, PolicyDataSchema } from "@/lib/policyExtractor";

// --- IMPORTANT ---
// Make sure to set your GEMINI_API_KEY in your .env file
// For example: GEMINI_API_KEY="your_api_key_here"
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// The model name has been updated to a current, recommended version.
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

/**
 * The detailed prompt for instructing the Gemini model.
 * This tells the model to act as an expert and return a specific JSON schema.
 */
const prompt = `
You are an expert insurance policy analyst for a UK-based company.
Analyze the provided image of a car insurance policy and extract the following fields.
Return the data as a single, minified JSON object and nothing else.

- registrationNumber: The vehicle's registration number.
- insurerName: The name of the insurance company.
- premiumAmount: The total policy cost, as a number, without the '£' symbol. Look for phrases like 'Total Premium', 'Amount Payable', or 'Total Price'.
- vehicleMake: The make of the vehicle (e.g., Ford).
- vehicleModel: The model of the vehicle (e.g., Focus).
- vehicleYear: The year the vehicle was manufactured.
- renewalDate: The policy renewal date, as a full ISO 8601 string (YYYY-MM-DDTHH:mm:ss.sssZ).
- noClaimsDiscount: The number of years of no claims discount, as a number.
- annualMileage: The estimated annual mileage, as a number.
- policyType: The type of cover, such as 'Comprehensive', 'Third Party, Fire and Theft', or 'Third Party Only'.

Do not add any extra text, explanations, or markdown formatting around the JSON object.
`;

/**
 * Sends an image of an insurance policy to the Gemini API and returns structured, validated data.
 *
 * @param imageBuffer The raw image data as a Buffer.
 * @param mimeType The MIME type of the image (e.g., "image/png", "image/jpeg").
 * @returns A promise that resolves to the validated policy data.
 * @throws An error if the API call, parsing, or validation fails.
 */
export async function getPolicyDataFromImage(imageBuffer: Buffer, mimeType: string): Promise<PolicyData> {
  try {
    // Convert the image buffer to a format the Gemini API understands
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    };

    // Send the prompt and the image to the model
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    // Parse the JSON string returned by the model
    const parsedJson = JSON.parse(responseText);

    // Validate the parsed data against our Zod schema
    const validationResult = PolicyDataSchema.safeParse(parsedJson);

    if (!validationResult.success) {
      // If validation fails, throw an error with the details
      const errorMessage = JSON.stringify(validationResult.error.flatten().fieldErrors);
      throw new Error(`Gemini response validation failed: ${errorMessage}`);
    }

    // Return the clean, validated data
    return validationResult.data;

  } catch (error) {
    console.error("Error processing policy with Gemini:", error);
    // Re-throw a more user-friendly error to be handled by the caller
    throw new Error("Failed to extract policy data from the provided image.");
  }
}