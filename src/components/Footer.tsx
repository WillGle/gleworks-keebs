// Shared footer shown on public pages.
import React from "react";
import "./Footer.css";
import { FaArrowRight, FaFacebook, FaInstagram } from "react-icons/fa";

// Footer component representing the bottom section of the application
const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Newsletter Signup Section */}
        <div className="footer-section">
          <h3>STAY IN THE LOOP</h3>
          <p>Sign up with your email address to receive news and updates.</p>
          <div className="email-signup">
            <input type="email" placeholder="Email" />
            <button>
              <FaArrowRight /> {/* Handle mail send */}
            </button>
          </div>
        </div>

        {/* Company Information Section */}
        <div className="footer-section">
          <div className="logo">GLEWORKS</div>
          <p>Ho Chi Minh, Vietnam</p>
          <p>hello.gleworks@gmail.com</p>
          <div className="social-icons">
            <a href="https://www.instagram.com/gleworks/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/will.gleam" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
          </div>
        </div>
        {/* Quick Links Section */}
        <div className="footer-section">
          <ul>
            <li>
              <a href="/policies#term-of-service">Terms of Service</a>
            </li>
            <li>
              <a href="/policies#privacy-policy">Privacy Policy</a>
            </li>
            <li>
              <a href="/policies#return-policy">Return Policy</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
