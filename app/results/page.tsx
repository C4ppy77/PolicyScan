"use client"

import { ArrowLeft, CheckCircle, AlertTriangle, Car, Calendar, MapPin, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function ResultsPage() {
  // Sample data - in real app this would come from props/API
  const scanResults = {
    insurer: "Aviva",
    car: "Ford Fiesta",
    registration: "AB12 CDE", // Add this line
    premium: 890,
    ncd: 3,
    age: 84,
    postcode: "SE15",
    benchmark: 700,
    adjustedBenchmark: 1120,
    overpayment: -230, // negative means they're getting a good deal
  }

  const isGoodDeal = scanResults.overpayment < 0
  const savingsAmount = Math.abs(scanResults.overpayment)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with back button */}
      <div className="px-4 py-6">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to scan
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Top Section: Scan Summary */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              Your Scan Is <span className="text-[#ADFF2F]">Complete</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300">Here's how your insurance compares to others like you.</p>
          </div>

          {/* Extracted Details Card */}
          <Card className="bg-gray-900 border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center text-slate-100">
              <Shield className="w-6 h-6 mr-3 text-[#ADFF2F]" />
              Your Policy Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400">Insurer</span>
                  <span className="font-semibold text-lg text-white">{scanResults.insurer}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400 flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    Vehicle
                  </span>
                  <span className="font-semibold text-lg text-white">{scanResults.car}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400">Registration</span>
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-400 text-black px-3 py-1 rounded font-bold text-sm tracking-wider border-2 border-black">
                      {scanResults.registration}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400">Annual Premium</span>
                  <span className="font-bold text-xl text-white">£{scanResults.premium.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    No Claims Discount
                  </span>
                  <span className="font-semibold text-lg text-white">{scanResults.ncd} years</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400">Age</span>
                  <span className="font-semibold text-lg text-white">{scanResults.age}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Postcode
                  </span>
                  <span className="font-semibold text-lg text-white">{scanResults.postcode}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Benchmark Comparison */}
          <Card className="bg-gray-900 border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-6 text-white">Market Comparison</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-black rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">UK Average</p>
                  <p className="text-2xl font-bold text-white">£{scanResults.benchmark.toLocaleString()}</p>
                </div>

                <div className="text-center p-4 bg-black rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Your Area Average</p>
                  <p className="text-2xl font-bold text-white">£{scanResults.adjustedBenchmark.toLocaleString()}</p>
                </div>
              </div>

              {/* Savings/Overpayment Display */}
              <div
                className={`text-center p-6 rounded-lg border-2 ${
                  isGoodDeal ? "bg-green-900/20 border-[#ADFF2F]" : "bg-red-900/20 border-red-500"
                }`}
              >
                <div className="flex items-center justify-center mb-4">
                  {isGoodDeal ? (
                    <CheckCircle className="w-8 h-8 text-[#ADFF2F] mr-3" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                  )}
                  <h3 className="text-xl font-bold text-white">
                    {isGoodDeal ? "✅ You're on a great deal!" : "⚠️ You might be overpaying"}
                  </h3>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-300">
                    {isGoodDeal ? `You're saving approximately` : `You could potentially save`}
                  </p>
                  <p className={`text-4xl font-black ${isGoodDeal ? "text-[#ADFF2F]" : "text-red-400"}`}>
                    £{savingsAmount}
                    <span className="text-lg font-normal text-gray-400">/year</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <Button
              size="lg"
              disabled
              className="w-full bg-gray-600 text-gray-400 cursor-not-allowed px-8 py-4 text-lg font-bold"
            >
              Find Cheaper Quotes
            </Button>
            <p className="text-gray-400 text-sm">Coming soon — live quote integration</p>
          </div>

          {/* Email Capture Section */}
          <Card className="bg-gray-900 border-gray-700 p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-white">Get Your Results & Stay Updated</h3>
              <p className="text-gray-300">
                We'll email you these results and notify you of better deals or renewal reminders.
              </p>

              <form className="max-w-md mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ADFF2F] focus:ring-1 focus:ring-[#ADFF2F]"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-[#ADFF2F] text-black hover:bg-[#9AE234] font-bold px-6 py-3 whitespace-nowrap"
                  >
                    Send Results
                  </Button>
                </div>
              </form>

              <div className="text-xs text-gray-400 space-y-1">
                <p>✓ Get these results emailed to you</p>
                <p>✓ Renewal reminders before your policy expires</p>
                <p>✓ Alerts when better deals become available</p>
                <p className="pt-2">No spam. Unsubscribe anytime.</p>
              </div>
            </div>
          </Card>

          {/* Bottom Note */}
          <div className="text-center pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm leading-relaxed">
              Results are estimated using anonymized UK benchmark data.
              <br />
              Actual quotes may vary based on individual circumstances.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
