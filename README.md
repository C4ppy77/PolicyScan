Policy Scan is an AI-powered web app that lets users upload or scan their insurance policy documents to find out if they're overpaying. Using OCR and Google Gemini, it extracts key details like premium, provider, and coverage — and compares them to typical market rates in real-time.

🚀 Features
📄 Upload insurance policy PDFs or images

🤖 AI extracts key fields: insurer, price, car model, renewal date, etc.

💡 Real-time insight: “You’re paying £120 more than average for your vehicle.”

🔐 Optional login to track scans and get renewal alerts

💸 Monetized with affiliate links to GoCompare, Confused.com, etc.

🧠 Tech Stack
Tool	Purpose
Next.js 15	Fullstack React framework
TypeScript	Type safety
Tailwind CSS	Styling
ShadCN UI	UI components
Lucide Icons	Icon set
Supabase	Auth & DB (optional)
Gemini API	AI policy summarisation + insight
Tesseract.js	OCR for image-based policies

Table	Purpose
benchmark_premiums	Stores the average premium per car type and region baseline. Core for comparison.
vehicle_registry	Look-up for recognized car models, types, and their classes for benchmark matching.
age_multipliers	Adjusts benchmark premium based on driver age brackets.
mileage_multipliers	Adjusts based on estimated annual mileage.
vehicle_age_multipliers	Adjusts based on age of the vehicle being insured.
region_multipliers	Adds multipliers based on risk factors in the region (e.g. city vs rural).
postcode_region_map	Maps UK postcodes to risk regions for geo-based adjustments.
user_scans	Stores logged scans, extracted policy fields, and result snapshots.