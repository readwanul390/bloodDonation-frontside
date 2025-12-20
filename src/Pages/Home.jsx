import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* ===== BANNER ===== */}
      <section className="bg-red-50 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-600">
          Donate Blood, Save Lives
        </h1>
        <p className="mb-6 text-gray-600">
          Join our community and help people in need
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

      {/* ===== FEATURED SECTION ===== */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why BloodCare?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow p-6">
            <h3 className="font-semibold mb-2">Verified Donors</h3>
            <p className="text-sm text-gray-600">
              All donors are verified to ensure safety and reliability.
            </p>
          </div>

          <div className="card bg-base-100 shadow p-6">
            <h3 className="font-semibold mb-2">Quick Requests</h3>
            <p className="text-sm text-gray-600">
              Create blood donation requests in just a few steps.
            </p>
          </div>

          <div className="card bg-base-100 shadow p-6">
            <h3 className="font-semibold mb-2">Community Support</h3>
            <p className="text-sm text-gray-600">
              Volunteers and donors work together to save lives.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CONTACT US ===== */}
      <section className="bg-gray-100 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          Contact Us
        </h2>

        <div className="max-w-xl mx-auto bg-white p-6 shadow rounded">
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full"
            />
            <textarea
              placeholder="Message"
              className="textarea textarea-bordered w-full"
            ></textarea>

            <button className="btn btn-error w-full text-white">
              Send Message
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            📞 Contact Number: <strong>01777-123456</strong>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
