import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-red-600 text-white pt-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">

        <div>
          <h3 className="text-xl font-bold mb-3">BloodCare</h3>
          <p>Connecting donors with lives that matter.</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Pages</h4>
          <ul className="space-y-1">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Support</h4>
          <ul className="space-y-1">
            <li><Link to="/help">Help</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p>📞 01777-123456</p>
          <p>📧 abusaidhridoy5@gmail.com </p>
        </div>
      </div>

      <div className="text-center py-4 mt-8 bg-red-700 text-sm">
        © {new Date().getFullYear()} BloodCare. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
