
"use client";

import Link from 'next/link';

// A component for the floating background shapes
const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* A few blurred, floating blobs for the background effect */}
      <div
        className="absolute top-[10%] left-[10%] h-48 w-48 rounded-full bg-mango-orange/30 blur-2xl"
      />
      <div
        className="absolute bottom-[15%] right-[5%] h-64 w-64 rounded-full bg-coral/30 blur-3xl"
      />
    </div>
  );
};

export default function Page() {
  return (
    <div
      className="relative min-h-screen w-full bg-no-repeat bg-center bg-cover flex flex-col items-center justify-center p-6 text-center overflow-hidden"
      style={{ backgroundImage: `url('/iamges/background.png')` }}
    >
      <FloatingShapes />


      <h1
        className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight bg-gradient-to-t from-blue-500 to-purple-600 text-transparent bg-clip-text  absolute top-1/7 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        School Management  App
      </h1>

      <div className="flex flex-col md:flex-row gap-12">
        <div>
          <Link
            href="/add-school"
            className="block px-10 py-5 bg-mango-orange text-off-white font-bold rounded-2xl shadow-xl transition-all duration-500 hover:scale-105 border-2 border-black top-1/4 "
          >
            Add a New School
          </Link>
        </div>
        <div>
          <Link
            href="/schools"
            className="block px-10 py-5 bg-coral text-off-white font-bold rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 border-black border-2"
          >
            View All Schools
          </Link>
        </div>
      </div>
    </div >
  );
}
