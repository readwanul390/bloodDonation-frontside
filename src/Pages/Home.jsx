import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>

      {/* ===== 1. HERO / BANNER ===== */}
      <section className="bg-red-50 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-600">
          Donate Blood, Save Lives
        </h1>
        <p className="mb-6 text-gray-600">
          A trusted platform connecting blood donors with patients in need
        </p>

        <div className="flex justify-center gap-4">
          <button
            className="btn btn-error text-white"
            onClick={() => navigate("/register")}
          >
            Join as a Donor
          </button>

          <button
            className="btn btn-outline btn-error"
            onClick={() => navigate("/search")}
          >
            Search Donors
          </button>
        </div>
      </section>

      {/* ===== 2. ABOUT BLOODCARE ===== */}
      <section className="py-16 px-6 text-center max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">About BloodCare</h2>
        <p className="text-gray-600">
          BloodCare is a community-driven blood donation platform designed to
          connect verified donors with patients quickly and safely.
        </p>
      </section>

      {/* ===== 3. WHY BLOODCARE ===== */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="card bg-white shadow p-6">Verified Donors</div>
          <div className="card bg-white shadow p-6">Fast Requests</div>
          <div className="card bg-white shadow p-6">Community Support</div>
        </div>
      </section>

      {/* ===== 4. HOW IT WORKS ===== */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="card shadow p-6">Register as Donor</div>
          <div className="card shadow p-6">Create Request</div>
          <div className="card shadow p-6">Get Help Fast</div>
        </div>
      </section>

      {/* ===== 5. BLOOD GROUPS ===== */}
      <section className="py-16 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-8">Available Blood Groups</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(group => (
            <span key={group} className="badge badge-error badge-lg">{group}</span>
          ))}
        </div>
      </section>

      {/* ===== 6. EMERGENCY REQUESTS ===== */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Emergency Requests</h2>
        <p className="text-gray-600">
          Urgent blood donation requests are prioritized for faster response.
        </p>
      </section>

      {/* ===== 7. BLOG HIGHLIGHTS ===== */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Latest Blogs</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="card shadow p-6">Why Blood Donation Matters</div>
          <div className="card shadow p-6">Who Can Donate Blood?</div>
          <div className="card shadow p-6">Donation Myths</div>
        </div>
      </section>

      {/* ===== 8. TESTIMONIALS ===== */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">What People Say</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          “BloodCare helped me find a donor within hours. Truly life-saving!”
        </p>
      </section>

      {/* ===== 9. HELP & SUPPORT ===== */}
      <section className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6">Help & Support</h2>
        <ul className="max-w-xl mx-auto text-gray-600 space-y-2">
          <li>✔ How to register</li>
          <li>✔ How to request blood</li>
          <li>✔ Account & profile help</li>
        </ul>
      </section>

      {/* ===== 10. CONTACT / CTA ===== */}
      <section className="py-20 px-6 bg-red-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Save a Life?
        </h2>
        <p className="mb-6">
          Contact us or register today to become a blood donor.
        </p>
        <button
          className="btn btn-outline text-white"
          onClick={() => navigate("/register")}
        >
          Get Started
        </button>
      </section>

    </div>
  );
};

export default Home;
