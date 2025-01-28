import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaArrowUp,
} from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-8 mt-20">
      {" "}
      {/* Increased top padding */}
      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Adjusted back-to-top button position */}
        <button
          onClick={scrollToTop}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300 text-white p-3 rounded-full shadow-lg hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <FaArrowUp className=" cursor-pointer w-5 h-5" />
        </button>

        {/* Rest of the footer content remains the same */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo section */}
          <div className="md:col-span-2 lg:col-span-1 mt-4">
            {" "}
            {/* Added margin-top */}
            <div className="flex flex-col items-center lg:items-start">
              <h2 className="text-3xl font-bold mb-4 transition-colors group">
                <span className="text-white group-hover:text-sky-700 transition-colors">
                  Rojgar
                </span>
                <span className=" text-sky-700 group-hover:text-white transition-colors">
                  Chowk
                </span>
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed text-center lg:text-left max-w-xs">
                Empowering your career journey with thousands of opportunities
                across Nepal. Find your perfect match today!
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Quick Navigation
            </h3>
            <ul className="space-y-3 text-center lg:text-left">
              {["About Us", "Find Jobs", "Contact Us", "FAQs"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-gray-400 hover:text-sky-500 transition-colors text-sm font-medium"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Get in Touch
            </h3>
            <div className="space-y-3 text-center lg:text-left">
              <p className="text-sm text-gray-400">
                <a
                  href="mailto:support@rojgarchowk.com"
                  className="hover:text-sky-500 transition-colors"
                >
                  support@rojgarchowk.com
                </a>
              </p>
              <p className="text-sm text-gray-400">
                <a
                  href="tel:+9779818181818"
                  className="hover:text-sky-500 transition-colors"
                >
                  +977 981-8181818
                </a>
              </p>
              <address className="text-sm text-gray-400 not-italic">
                Naikap, Changragiri-08
                <br />
                Kathmandu, Nepal
              </address>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Connect With Us
            </h3>
            <div className="flex space-x-3 mb-4">
              {[
                { icon: FaFacebookF, color: "bg-[#3b5998]" },
                { icon: FaTwitter, color: "bg-[#1da1f2]" },
                { icon: FaLinkedinIn, color: "bg-[#0077b5]" },
                { icon: FaInstagram, color: "bg-[#e1306c]" },
              ].map(({ icon: Icon, color }, index) => (
                <a
                  key={index}
                  href="#"
                  className={`${color} p-2.5 rounded-full text-white hover:opacity-90 transition-opacity transform hover:scale-105`}
                  aria-label={`${Icon.name} social link`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-400 text-center lg:text-left max-w-xs">
              Subscribe to our newsletter for latest updates
            </p>
            <div className="mt-4 flex gap-2 w-full max-w-xs">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 text-sm rounded-lg border border-gray-700 bg-gray-800 focus:outline-none focus:border-sky-700"
              />
              <button className="px-4 py-2 text-sm bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-700 hover:to-sky-500  active:scale-95 transition duration-300 text-white rounded-lg cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} RojgarChowk. All rights
              reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-sky-500 text-xs">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-sky-500 text-xs">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-sky-500 text-xs">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// import React from "react";
// import {
//   FaFacebookF,
//   FaTwitter,
//   FaLinkedinIn,
//   FaInstagram,
// } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-gray-300 py-12">
//       <div className="container mx-auto px-4 lg:px-8">
//         {/* Main Footer Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Logo and Description */}
//           <div className="flex flex-col items-center sm:items-start">
//             <h2 className="text-3xl font-bold text-white mb-4">
//               Rojgar<span className="text-sky-500">Chowk</span>
//             </h2>
//             <p className="text-sm text-gray-400 leading-relaxed text-center sm:text-left">
//               Discover your dream job with RojgarChowk. Explore thousands of job
//               listings and take the next step in your career.
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div className="flex flex-col items-center sm:items-start">
//             <h3 className="text-lg font-semibold text-white mb-4">
//               Quick Links
//             </h3>
//             <ul className="space-y-2">
//               <li>
//                 <a
//                   href="#about"
//                   className="hover:text-sky-400 transition text-sm"
//                 >
//                   About Us
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#jobs"
//                   className="hover:text-sky-400 transition text-sm"
//                 >
//                   Find Jobs
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#contact"
//                   className="hover:text-sky-400 transition text-sm"
//                 >
//                   Contact Us
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#faq"
//                   className="hover:text-sky-400 transition text-sm"
//                 >
//                   FAQs
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Details */}
//           <div className="flex flex-col items-center sm:items-start">
//             <h3 className="text-lg font-semibold text-white mb-4">
//               Contact Us
//             </h3>
//             <ul className="space-y-2 text-sm text-gray-400">
//               <li>
//                 Email:{" "}
//                 <a
//                   href="mailto:support@rojgarchowk.com"
//                   className="hover:text-sky-400 transition"
//                 >
//                   support@rojgarchowk.com
//                 </a>
//               </li>
//               <li>Phone: +977 9818181818</li>
//               <li>Address: Naikap, Changdragiri-08, KTM, Nepal</li>
//             </ul>
//           </div>

//           {/* Social Media Links */}
//           <div className="flex flex-col items-center">
//             <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
//             <div className="flex space-x-4 mb-4">
//               <a
//                 href="#"
//                 className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition"
//               >
//                 <FaFacebookF />
//               </a>
//               <a
//                 href="#"
//                 className="p-3 bg-blue-400 rounded-full text-white hover:bg-blue-500 transition"
//               >
//                 <FaTwitter />
//               </a>
//               <a
//                 href="#"
//                 className="p-3 bg-blue-700 rounded-full text-white hover:bg-blue-800 transition"
//               >
//                 <FaLinkedinIn />
//               </a>
//               <a
//                 href="#"
//                 className="p-3 bg-pink-600 rounded-full text-white hover:bg-pink-700 transition"
//               >
//                 <FaInstagram />
//               </a>
//             </div>
//             <p className="text-sm text-gray-400 text-center">
//               Stay connected for updates and job alerts!
//             </p>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="mt-12 border-t border-gray-700 pt-4 text-center">
//           <p className="text-sm text-gray-400">
//             &copy; {new Date().getFullYear()} RojgarChowk. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
