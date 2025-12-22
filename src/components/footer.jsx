import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-red-600 text-white p-10">
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold text-lg mb-2">BloodCare</h3>
          <p>Connecting donors with people in need.</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Useful Links</h4>
          <ul className="space-y-1">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/donation-requests">Donation Requests</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p>Phone: 01777-123456</p>
          <p>Email: abusaidhridoy5@gmail.com</p>
        </div>
      </div>

      <p className="text-center mt-6 text-sm">
        © {new Date().getFullYear()} BloodCare. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
