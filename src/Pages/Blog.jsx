const Blog = () => {
  return (
    <div className="py-20 px-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-10">
        Blog
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow p-5">
          <h3 className="font-semibold mb-2">Why Blood Donation Matters</h3>
          <p className="text-sm text-gray-600">
            Learn how blood donation saves lives every day.
          </p>
        </div>

        <div className="card bg-base-100 shadow p-5">
          <h3 className="font-semibold mb-2">Who Can Donate Blood?</h3>
          <p className="text-sm text-gray-600">
            Basic eligibility rules explained clearly.
          </p>
        </div>

        <div className="card bg-base-100 shadow p-5">
          <h3 className="font-semibold mb-2">Emergency Blood Requests</h3>
          <p className="text-sm text-gray-600">
            How our platform handles urgent needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;
