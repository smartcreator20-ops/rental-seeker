"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [properties, setProperties] = useState([]);
  const [approvedProperties, setApprovedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setSession(session);
    setLoading(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError("Invalid email or password.");
      return;
    }

    setSession(data.session);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  async function loadProperties() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    }

    setProperties(data || []);
  }

  async function loadApprovedProperties() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    }

    setApprovedProperties(data || []);
  }

  useEffect(() => {
    if (session) {
      loadProperties();
      loadApprovedProperties();
    }
  }, [session]);

  async function approveProperty(id) {
    const { error } = await supabase
      .from("properties")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      alert("Unable to approve property.");
      return;
    }

    loadProperties();
    loadApprovedProperties();
  }

  async function rejectProperty(id) {
    const { error } = await supabase
      .from("properties")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      alert("Unable to reject property.");
      return;
    }

    loadProperties();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <h1 className="text-2xl font-bold text-blue-700">
              Rentenant Admin
            </h1>

            <p className="text-sm text-gray-500">
              Administrator Login
            </p>
          </div>
        </header>

        <section className="max-w-md mx-auto px-6 py-12">
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Admin Login
            </h2>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <input
                type="email"
                placeholder="Admin email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-gray-800"
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-gray-800"
              />

              {loginError && (
                <p className="text-red-600 text-sm">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
              >
                Login
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              Rentenant Admin
            </h1>

            <p className="text-sm text-gray-500">
              Property Verification Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Pending Properties */}

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Pending Properties
        </h2>

        {properties.length === 0 ? (
          <p className="mt-6 text-gray-500">
            No properties waiting for approval.
          </p>
        ) : (
          <div className="grid gap-6 mt-8">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white border rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  {property.title}
                </h3>

                <p className="text-gray-500 mt-2">
                  {property.area}, {property.city}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Posted on{" "}
                  {new Date(property.created_at).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm text-gray-600">
                  <p>
                    <strong>Type:</strong> {property.property_type}
                  </p>

                  <p>
                    <strong>Rent:</strong> ₹
                    {property.rent.toLocaleString("en-IN")}
                  </p>

                  <p>
                    <strong>Area:</strong>{" "}
                    {property.carpet_area || "Not provided"} sq. ft.
                  </p>

                  <p>
                    <strong>Floor:</strong>{" "}
                    {property.floor_number !== null
                      ? `${property.floor_number}${
                          property.total_floors
                            ? ` of ${property.total_floors}`
                            : ""
                        }`
                      : "Not provided"}
                  </p>

                  <p>
                    <strong>Deposit:</strong>{" "}
                    {property.security_deposit
                      ? `₹${property.security_deposit.toLocaleString("en-IN")}`
                      : "Not provided"}
                  </p>

                  <p>
                    <strong>Negotiable:</strong>{" "}
                    {property.rent_negotiable ? "Yes" : "No"}
                  </p>
                </div>

                <p className="text-gray-600 mt-4">
                  {property.description}
                </p>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-700">
                    <strong>Posted By:</strong> {property.posted_by}
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Contact:</strong> {property.contact_name}
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Phone:</strong> {property.contact_phone}
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => approveProperty(property.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectProperty(property.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Approved Properties */}

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Approved Properties
        </h2>

        {approvedProperties.length === 0 ? (
          <p className="mt-6 text-gray-500">
            No approved properties.
          </p>
        ) : (
          <div className="grid gap-6 mt-8">
            {approvedProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white border rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  {property.title}
                </h3>

                <p className="text-gray-500 mt-2">
                  {property.area}, {property.city}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Posted on{" "}
                  {new Date(property.created_at).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm text-gray-600">
                  <p>
                    <strong>Type:</strong> {property.property_type}
                  </p>

                  <p>
                    <strong>Rent:</strong> ₹
                    {property.rent.toLocaleString("en-IN")}
                  </p>

                  <p>
                    <strong>Area:</strong>{" "}
                    {property.carpet_area || "Not provided"} sq. ft.
                  </p>

                  <p>
                    <strong>Floor:</strong>{" "}
                    {property.floor_number !== null
                      ? `${property.floor_number}${
                          property.total_floors
                            ? ` of ${property.total_floors}`
                            : ""
                        }`
                      : "Not provided"}
                  </p>

                  <p>
                    <strong>Deposit:</strong>{" "}
                    {property.security_deposit
                      ? `₹${property.security_deposit.toLocaleString("en-IN")}`
                      : "Not provided"}
                  </p>

                  <p>
                    <strong>Negotiable:</strong>{" "}
                    {property.rent_negotiable ? "Yes" : "No"}
                  </p>
                </div>

                <p className="text-gray-600 mt-4">
                  {property.description}
                </p>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-700">
                    <strong>Posted By:</strong> {property.posted_by}
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Contact:</strong> {property.contact_name}
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Phone:</strong> {property.contact_phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}