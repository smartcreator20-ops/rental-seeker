"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function PostProperty() {
  const [submitted, setSubmitted] = useState(false);

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [rent, setRent] = useState("");
  const [carpetArea, setCarpetArea] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [rentNegotiable, setRentNegotiable] = useState(false);
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);

  async function handleSubmit(e) {
  e.preventDefault();

  try {
    const { error } = await supabase
      .from("properties")
      .insert([
        {
          title,
          city,
          area,
          posted_by: postedBy,
          contact_name: contactName,
          contact_phone: contactPhone,
          property_type: propertyType,
          floor_number: floorNumber ? Number(floorNumber) : null,
          total_floors: totalFloors ? Number(totalFloors) : null,
          rent: Number(rent),
          carpet_area: carpetArea ? Number(carpetArea) : null,
          security_deposit: securityDeposit
            ? Number(securityDeposit)
            : null,
          rent_negotiable: rentNegotiable,
          description,
          status: "pending",
        },
      ]);

    if (error) {
      console.error(error);
      alert("Unable to save property.");
      return;
    }

    setSubmitted(true);
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
}

  async function generateDescription() {
    if (!title || !city || !area || !propertyType || !rent) {
      alert("Please fill in the property details first.");
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          city,
          area,
          propertyType,
          floorNumber,
          totalFloors,
          rent,
          carpetArea,
          securityDeposit,
          rentNegotiable,
        }),
      });

      const data = await response.json();

      if (data.description) {
        setDescription(data.description);
      } else {
        alert("Unable to generate description.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-blue-700">Rentenant</h1>
          <p className="text-sm text-gray-500">Post Your Property</p>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Post Your Rental Property
          </h2>

          <p className="text-gray-500 mt-2">
            List your property and connect directly with tenants.
          </p>

          {submitted ? (
            <div className="mt-8 p-5 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-bold text-green-700">
                Property submitted successfully!
              </h3>

              <p className="text-green-600 mt-2">
                Your property will appear on Rentenant after verification.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              {/* Property Title */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Property Title
                </label>

                <input
                  type="text"
                  placeholder="Example: Spacious 1 BHK Flat"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-gray-800"
                />
              </div>

              {/* City and Area */}
              
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    placeholder="Example: Virar"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg text-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Area
                  </label>

                  <input
                    type="text"
                    placeholder="Example: Virar East"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg text-gray-800"
                  />
                </div>
              </div>
              
              {/* Property Type */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Property Type
                </label>

                <select
                  required
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-gray-800"
                >
                  <option value="">Select Property Type</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="Room">Room</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="PG">PG</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* Floor Details */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Floor Number
                  </label>

                  <input
                    type="number"
                    placeholder="Example: 5"
                    min="0"
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg text-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Total Floors
                  </label>

                  <input
                    type="number"
                    placeholder="Example: 12"
                    min="1"
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg text-gray-800"
                  />
                </div>
              </div>

              {/* Rent and Carpet Area */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Monthly Rent (₹)
                  </label>

                  <input
                    type="number"
                    placeholder="Example: 12000"
                    required
                    min="0"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg text-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Carpet Area (sq. ft.)
                  </label>

                  <input
                    type="number"
                    placeholder="Example: 650"
                    min="0"
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg text-gray-800"
                  />
                </div>
              </div>

              {/* Security Deposit */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Security Deposit (₹)
                </label>

                <input
                  type="number"
                  placeholder="Example: 30000"
                  min="0"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-gray-800"
                />
              </div>

              {/* Rent Negotiable */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="rentNegotiable"
                  checked={rentNegotiable}
                  onChange={(e) => setRentNegotiable(e.target.checked)}
                  className="w-5 h-5"
                />

                <label
                  htmlFor="rentNegotiable"
                  className="font-medium text-gray-700"
                >
                  Rent is negotiable
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Description
                </label>

                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={generating}
                  className="mb-2 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-3 py-2 rounded-lg"
                >
                  {generating ? "✨ Writing..." : "✨ Write with AI"}
                </button>

                <textarea
                  placeholder="Describe your property..."
                  rows="5"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-gray-800"
                />
              </div>
              {/* Posted By */}
<div>
  <label className="block font-medium text-gray-700 mb-2">
    Posted By
  </label>

  <select
    required
    value={postedBy}
    onChange={(e) => setPostedBy(e.target.value)}
    className="w-full px-4 py-3 border rounded-lg text-gray-800"
  >
    <option value="">Select</option>
    <option value="Owner">Owner</option>
    <option value="Agent">Agent</option>
    <option value="Builder">Builder</option>
  </select>
</div>
              {/* Contact Person */}
<div>
  <label className="block font-medium text-gray-700 mb-2">
    Contact Person Name
  </label>

  <input
    type="text"
    placeholder="Example: Wilson Jagtap"
    required
    value={contactName}
    onChange={(e) => setContactName(e.target.value)}
    className="w-full px-4 py-3 border rounded-lg text-gray-800"
  />
</div>
{/* Contact Phone */}
<div>
  <label className="block font-medium text-gray-700 mb-2">
    Contact Phone
  </label>

  <input
    type="tel"
    placeholder="Example: 9876543210"
    required
    value={contactPhone}
    onChange={(e) => setContactPhone(e.target.value)}
    className="w-full px-4 py-3 border rounded-lg text-gray-800"
  />
</div>
              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
              >
                Post Property
              </button>

            </form>
          )}
        </div>
      </section>
    </main>
  );
}