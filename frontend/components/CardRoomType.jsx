"use client";
import Link from "next/link";

export default function AdditionalInfo() {
  const additionalInfoLeft = [
    "Confirmation will be received at time of booking",
    "Not wheelchair accessible",
    "Not recommended for travelers with back problems",
    "Not recommended for pregnant travelers",
  ];

  const additionalInfoRight = [
    "No heart problems or other serious medical conditions",
    "Travelers should have a moderate physical fitness level",
    "Participants from 14-55 yrs of age are eligible to ride the ATVs.",
  ];

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <Link href="#AdditionalInfo" id="AdditionalInfo">
        <h1 className="text-3xl font-bold mb-6">Additional Info</h1>
      </Link>
      <div className="bg-white rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {additionalInfoLeft.map((info, index) => (
              <div key={index} className="flex items-start">
                <span className="text-gray-600 mr-2">•</span>
                <p className="text-gray-700">{info}</p>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {additionalInfoRight.map((info, index) => (
              <div key={index} className="flex items-start">
                <span className="text-gray-600 mr-2">•</span>
                <p className="text-gray-700">{info}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <button className="text-blue-600 py-3 p-8 hover:bg-green-600 rounded-full hover:text-white font-semibold transition border">
            Show 14 more
          </button>
        </div>
      </div>
    </div>
  );
}