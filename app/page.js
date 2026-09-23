"use client";

import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("Property Type");
  const [sortBy, setSortBy] = useState("newest");
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!location.trim()) {
      setMessage("Please enter a city or area.");
      setProperties([]);
      return;
    }

    setLoading(true);
    setMessage("");

    let query = supabase
      .from("properties")
      .select("*")
      .eq("status", "approved")
      .ilike("city", `%${location.trim()}%`);

    if (propertyType !== "Property Type") {
      query = query.eq("property_type", propertyType);
    }

    query = query.order(
      sortBy === "rent_low" || sortBy === "rent_high"
        ? "rent"
        : "created_at",
      {
        ascending:
          sortBy === "oldest" || sortBy === "rent_low",
      }
    );

    const { data, error } = await query;

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage("Unable to search properties.");
      setProperties([]);
      return;
    }

    setProperties(data || []);

    if (!data || data.length === 0) {
      setMessage("No approved properties found.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              Rentenant
            </h1>

            <p className="text-xs text-gray-500">
              Your Rental. Your Tenant.
            </p>
          </div>

          <a
            href="/post-property"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-block"
          >
            Post Property
          </a>

        </div>
      </header>


      {/* Hero */}
      <section className="bg-blue-700 text-white">

        <div className="max-w-7xl mx-auto px-6 py-20 text-center">

          <h2 className="text-4xl md:text-5xl font-bold">
            Find Your Perfect Rental
          </h2>

          <p className="mt-4 text-lg text-blue-100">
            Search homes, flats and rooms for rent directly from owners.
          </p>


          {/* Search Box */}
          <div className="max-w-6xl mx-auto mt-10 bg-white p-3 rounded-xl shadow-lg">

            <div className="grid md:grid-cols-4 gap-3">

              {/* Location */}
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or area"
                className="w-full px-4 py-3 border rounded-lg text-gray-800"
              />


              {/* Property Type */}
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-gray-800"
              >
                <option>Property Type</option>
                <option>1 BHK</option>
                <option>2 BHK</option>
                <option>3 BHK</option>
                <option>4 BHK</option>
                <option>Room</option>
                <option>House</option>
                <option>Villa</option>
                <option>PG</option>
                <option>Commercial</option>
              </select>


              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-gray-800"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rent_low">
                  Rent: Low to High
                </option>
                <option value="rent_high">
                  Rent: High to Low
                </option>
              </select>


              {/* Search */}
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-blue-800"
              >
                {loading ? "Searching..." : "Search Rentals"}
              </button>

            </div>
          </div>

        </div>
      </section>


      {/* Search Results */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        {message && (
          <p className="text-center text-blue-700 font-medium mb-6">
            {message}
          </p>
        )}


        {properties.length > 0 && (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Available Rentals
            </h3>


            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {properties.map((property) => (

                <div
                  key={property.id}
                  className="bg-white rounded-xl shadow-sm border p-6"
                >

                  {/* Title */}
                  <h4 className="text-xl font-bold text-gray-900">
                    {property.title}
                  </h4>


                  {/* Location */}
                  <p className="text-gray-500 mt-2">
                    {property.area}, {property.city}
                  </p>


                  {/* Posted Date */}
                  <p className="text-xs text-gray-400 mt-1">
                    Posted on{" "}
                    {new Date(property.created_at).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>


                  {/* Rent */}
                  <p className="text-blue-700 font-bold text-lg mt-4">
                    ₹{property.rent.toLocaleString("en-IN")} / month
                  </p>


                  {/* Property Details */}
                  <div className="mt-3 text-sm text-gray-600">

                    <p>
                      <strong>Type:</strong>{" "}
                      {property.property_type}
                    </p>


                    {property.carpet_area && (
                      <p>
                        <strong>Area:</strong>{" "}
                        {property.carpet_area} sq. ft.
                      </p>
                    )}


                    {property.floor_number !== null && (
                      <p>
                        <strong>Floor:</strong>{" "}
                        {property.floor_number}

                        {property.total_floors
                          ? ` of ${property.total_floors}`
                          : ""}
                      </p>
                    )}


                    {property.security_deposit && (
                      <p>
                        <strong>Deposit:</strong>{" "}
                        ₹
                        {property.security_deposit.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    )}


                    {property.rent_negotiable && (
                      <p className="text-green-600 font-medium mt-1">
                        Rent Negotiable
                      </p>
                    )}

                  </div>


                  {/* Description */}
                  <p className="text-gray-600 mt-4 text-sm">
                    {property.description}
                  </p>


                  {/* Contact Details */}
                  <div className="mt-5 pt-4 border-t">

                    <p className="text-sm text-gray-700">
                      <strong>Posted By:</strong>{" "}
                      {property.posted_by}
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Contact:</strong>{" "}
                      {property.contact_name}
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Phone:</strong>{" "}
                      {property.contact_phone}
                    </p>

                  </div>

                </div>

              ))}

            </div>
          </>
        )}

      </section>


      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-14">

        <h3 className="text-2xl font-bold text-gray-900 text-center">
          What are you looking for?
        </h3>


        <div className="grid md:grid-cols-4 gap-6 mt-8">

          {[
            ["🏠", "Flats for Rent"],
            ["🏡", "Houses for Rent"],
            ["🛏️", "Rooms & PG"],
            ["🏢", "Commercial Space"],
          ].map(([icon, title]) => (

            <div
              key={title}
              className="bg-white rounded-xl p-6 text-center shadow-sm border"
            >

              <div className="text-4xl">
                {icon}
              </div>

              <h4 className="mt-4 font-semibold text-gray-900">
                {title}
              </h4>

              <p className="text-sm text-gray-500 mt-2">
                Browse available properties
              </p>

            </div>

          ))}

        </div>
      </section>


      {/* Why Rentenant */}
      <section className="bg-white border-y">

        <div className="max-w-7xl mx-auto px-6 py-14">

          <h3 className="text-2xl font-bold text-center text-gray-900">
            Why Rentenant?
          </h3>


          <div className="grid md:grid-cols-3 gap-8 mt-10">

            <div className="text-center">

              <div className="text-4xl">
                🔍
              </div>

              <h4 className="font-semibold mt-4">
                Easy Search
              </h4>

              <p className="text-gray-500 mt-2">
                Find rental properties by location and property type.
              </p>

            </div>


            <div className="text-center">

              <div className="text-4xl">
                🤝
              </div>

              <h4 className="font-semibold mt-4">
                Connect Directly
              </h4>

              <p className="text-gray-500 mt-2">
                Connect tenants and property owners directly.
              </p>

            </div>


            <div className="text-center">

              <div className="text-4xl">
                📍
              </div>

              <h4 className="font-semibold mt-4">
                Local Properties
              </h4>

              <p className="text-gray-500 mt-2">
                Discover rental options in your preferred area.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white">

        <div className="max-w-7xl mx-auto px-6 py-8 text-center">

          <h3 className="font-bold text-xl">
            Rentenant
          </h3>

          <p className="text-gray-400 mt-2">
            Your Rental. Your Tenant.
          </p>

          <p className="text-gray-500 text-sm mt-6">
            © 2026 Rentenant.in. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}
