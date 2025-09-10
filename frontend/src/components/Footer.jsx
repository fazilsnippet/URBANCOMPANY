import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-black">About us</a></li>
            <li><a href="#" className="hover:text-black">Investor Relations</a></li>
            <li><a href="#" className="hover:text-black">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-black">Anti Discrimination Policy</a></li>
            <li><a href="#" className="hover:text-black">ESG Impact</a></li>
            <li><a href="#" className="hover:text-black">Careers</a></li>
          </ul>
        </div>

        {/* For Customers */}
        <div>
          <h3 className="text-lg font-semibold mb-4">For customers</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-black">UC Reviews</a></li>
            <li><a href="#" className="hover:text-black">Categories near you</a></li>
            <li><a href="#" className="hover:text-black">Contact us</a></li>
          </ul>
        </div>

        {/* For Professionals */}
        <div>
          <h3 className="text-lg font-semibold mb-4">For professionals</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-black">Register as a professional</a></li>
          </ul>
        </div>

        {/* Social + Apps */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Social links</h3>
          <div className="flex space-x-4 text-xl mb-6">
            <a href="#" className="hover:text-blue-600"><FaFacebookF /></a>
            <a href="#" className="hover:text-sky-500"><FaTwitter /></a>
            <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
            <a href="#" className="hover:text-red-600"><FaYoutube /></a>
          </div>
          <div className="flex flex-col space-y-3">
            <a href="#"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="w-32"/></a>
            <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="w-32"/></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 text-xs text-gray-500 py-4 px-6 text-center">
        © {new Date().getFullYear()} Urban Company Ltd. All rights reserved.
      </div>
    </footer>
  );
}
