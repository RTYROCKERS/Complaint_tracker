import React from "react";
import { Link } from "react-router-dom";

function Intro() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-6 text-center border-b border-purple-700">
        <h1 className="text-3xl font-bold tracking-wide">Circus of Wonders</h1>
        <p className="text-sm mt-2">A Grievance Tracker for the Traveling City</p>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6">
        <div className="max-w-3xl text-center space-y-8">
          {/* Description Section */}
          <p className="bg-purple-700/50 rounded-xl p-6 leading-relaxed shadow-lg">
            The Circus of Wonders isn't just a show; it's a mobile city with its
            own citizens—the performers, vendors, and roadies. But as this city
            springs up overnight, its infrastructure often breaks down: main
            pathways become damaged, water lines to the caravans leak, and
            garbage piles up. Your mission is to build a formal grievance
            tracker where any circus citizen can report these municipal issues
            and watch them get resolved, ensuring their traveling city runs as
            smoothly as the show itself.
          </p>

          {/* Buttons */}
          <div className="flex gap-6 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition font-semibold shadow-md"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition font-semibold shadow-md"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-purple-700 text-sm">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} Circus of Wonders | All Rights Reserved
        </p>
        <p>
          Contact us:{" "}
          <a
            href="mailto:support@circusofwonders.com"
            className="underline hover:text-purple-300"
          >
            support@circusofwonders.com
          </a>
        </p>
      </footer>
    </div>
  );
}

export default Intro;
