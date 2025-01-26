import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 mt-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and Description */}
          <div className="flex flex-col justify-start mb-6 md:mb-0 items-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Rojgar<span className="text-sky-700">Chowk</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Find your dream job at JobPortal. Explore a variety of job
              listings and take the next step in your career.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col justify-start mb-6 md:mb-0 items-center">
            <h3 className="text-lg font-semibold text-white mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-blue-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#jobs" className="hover:text-blue-400 transition">
                  Find Jobs
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-400 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-400 transition">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-start mb-6 md:mb-0 items-center">
            <h3 className="text-lg font-semibold text-white mb-3">
              Contact Us
            </h3>
            <p className="text-sm text-gray-400">
              Email:
              <a
                href="mailto:support@rojgarchowk.com"
                className="hover:text-sky-700 transition"
              >
                {" "}
                support@rojgarchowk.com
              </a>
            </p>
            <p className="text-sm text-gray-400">Phone: +977 9818181818</p>
            <p className="text-sm text-gray-400">
              Address: Naikap, Changdragiri-08, KTM, Nepal
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="p-2 bg-blue-400 rounded-full text-white hover:bg-blue-500 transition"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="p-2 bg-blue-700 rounded-full text-white hover:bg-blue-800 transition"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="#"
                className="p-2 bg-pink-600 rounded-full text-white hover:bg-pink-700 transition"
              >
                <FaInstagram />
              </a>
            </div>
            <p className="text-sm text-gray-400">
              Stay updated with the latest job openings and company news!
            </p>
          </div>
        </div>

        {/* Bottom Section (Copyright) */}
        <div className="mt-10 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} RogjarChowk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
