export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to Radius</h1>
        <p className="text-lg text-gray-600 mb-8">Tagline Here</p>
        <a
          href="#"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Learn More
        </a>
      </div>
    </div>
  );
}
