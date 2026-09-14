export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">Rentenant</h1>
            <p className="text-xs text-gray-500">Your Rental. Your Tenant.</p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 text-gray-700">
              Login
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Post Property
            </button>
          </div>
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

          {/* Search box */}
          <div className="max-w-4xl mx-auto mt-10 bg-white p-3 rounded-xl shadow-lg">
            <div className="grid md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Enter city or area"
                className="w-full px-4 py-3 border rounded-lg text-gray-800"
              />

              <select className="w-full px-4 py-3 border rounded-lg text-gray-800">
                <option>Property Type</option>
                <option>1 BHK</option>
                <option>2 BHK</option>
                <option>3 BHK</option>
                <option>Room</option>
                <option>House</option>
              </select>

              <button className="bg-blue-600 text-white rounded-lg px-6 py-3 font-semibold">
                Search Rentals
              </button>
            </div>
          </div>
        </div>
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
              className="bg-white rounded-xl p-6 text-center shadow-sm border hover:shadow-md transition"
            >
              <div className="text-4xl">{icon}</div>
              <h4 className="mt-4 font-semibold text-gray-900">{title}</h4>
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
              <div className="text-4xl">🔍</div>
              <h4 className="font-semibold mt-4">Easy Search</h4>
              <p className="text-gray-500 mt-2">
                Find rental properties by location and property type.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl">🤝</div>
              <h4 className="font-semibold mt-4">Connect Directly</h4>
              <p className="text-gray-500 mt-2">
                Connect tenants and property owners directly.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl">📍</div>
              <h4 className="font-semibold mt-4">Local Properties</h4>
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
          <h3 className="font-bold text-xl">Rentenant</h3>
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