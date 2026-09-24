"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  async function loadProperty() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .eq("status", "approved")
      .single();

    if (error) {
      console.error(error);
      setError("Property not found or no longer available.");
      setProperty(null);
    } else {
      setProperty(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading property...</p>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 py-5">
            <a
              href="/"
              className="text-2xl font-bold text-blue-700"
            >
              Rentenant
            </a>
          </div>
        </header>

        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Property Not Found
          </h1>

          <p className="text-gray-500 mt-3">
            This property may have been removed or is no longer available.
          </p>

          <a
            href="/"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Rentals
          </a>
        </section>
      </main>
    );
  }

  const whatsappNumber = property.contact_phone
    ? property.contact_phone.replace(/\D/g, "")
    : "";

  const whatsappMessage = encodeURIComponent(
    `Hello, I found your property "${property.title}" on Rentenant. I am interested in this property.`
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}

      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <a
            href="/"
            className="text-2xl font-bold text-blue-700"
          >
            Rentenant
          </a>

          <a
            href="/"
            className="text-sm font-semibold text-gray-600 hover:text-blue-600"
          >
            ← Back to Rentals
          </a>
        </div>
      </header>

      {/* Property */}

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Title */}

            <h1 className="text-3xl font-bold text-gray-900">
              {property.title}
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              {property.area}, {property.city}
            </p>

            {/* Rent */}

            <div className="mt-6 p-5 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-500">
                Monthly Rent
              </p>

              <p className="text-3xl font-bold text-blue-700">
                ₹{property.rent.toLocaleString("en-IN")}
              </p>

              {property.rent_negotiable && (
                <p className="text-sm text-green-600 font-semibold mt-1">
                  Rent Negotiable
                </p>
              )}
            </div>

            {/* Property Information */}

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900">
                Property Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Property Type
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {property.property_type}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Carpet Area
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {property.carpet_area
                      ? `${property.carpet_area} sq. ft.`
                      : "Not provided"}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Floor
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {property.floor_number !== null
                      ? `${property.floor_number}${
                          property.total_floors
                            ? ` of ${property.total_floors}`
                            : ""
                        }`
                      : "Not provided"}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Security Deposit
                  </p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {property.security_deposit
                      ? `₹${property.security_deposit.toLocaleString(
                          "en-IN"
                        )}`
                      : "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900">
                Description
              </h2>

              <p className="text-gray-600 mt-4 leading-7 whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Posted Information */}

            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900">
                Posted By
              </h2>

              <div className="mt-4 space-y-2 text-gray-600">
                <p>
                  <strong>Posted By:</strong>{" "}
                  {property.posted_by || "Not provided"}
                </p>

                <p>
                  <strong>Contact Person:</strong>{" "}
                  {property.contact_name || "Not provided"}
                </p>

                <p className="text-sm text-gray-400">
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
              </div>
            </div>

            {/* Contact Owner */}

            <div className="mt-8 border-t pt-8">
              <h2 className="text-xl font-bold text-gray-900">
                Interested in this property?
              </h2>

              <p className="text-gray-500 mt-2">
                Contact the person who posted this property.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                {property.contact_phone && (
                  <a
                    href={`tel:${property.contact_phone}`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg"
                  >
                    📞 Call
                  </a>
                )}

                {whatsappNumber && (
                  <a
                    href={`https://wa.me/91${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-lg"
                  >
                    💬 WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}