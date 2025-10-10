import React from "react";
import { Link } from "react-router-dom";
import "../css/Intro.css"; // add this import

function Intro() {
  return (
    <div className="intro-container">
      {/* Header */}
      <header className="intro-header">
        <h1 className="intro-title">Circus of Wonders</h1>
        <p className="intro-subtitle">A Grievance Tracker for the Traveling City</p>
      </header>

      {/* Main */}
      <main className="intro-main">
        <section className="intro-content">
          <p className="intro-description">
            The Circus of Wonders isn't just a show; it's a smart city with its
            own citizens—the performers, vendors, and roadies. But as this city
            springs up overnight, its infrastructure often breaks down: main
            pathways become damaged, water lines to the caravans leak, and
            garbage piles up. Our mission is to build a formal grievance
            tracker where any circus citizen can report these municipal issues
            and watch them get resolved, ensuring their traveling city runs as
            smoothly as the show itself.
          </p>

          <div className="intro-buttons">
            <Link to="/login" className="intro-btn">
              Login
            </Link>
            <Link to="/signup" className="intro-btn">
              Sign Up
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="intro-footer">
        <p>
          &copy; {new Date().getFullYear()} Circus of Wonders | All Rights Reserved
        </p>
        <p>
          Contact us:{" "}
          <a href="mailto:complainttracker1234@gmail.com">support@circusofwonders.com</a>
        </p>
      </footer>
    </div>
  );
}

export default Intro;
