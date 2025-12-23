import { useState } from "react";
import axios from "axios";
import districts from "../data/districts";
import upazilas from "../data/upazilas";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const API = import.meta.env.VITE_API_URL;

const Search = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);
    setUpazila("");

    const foundDistrict = districts.find(
      (d) => d.name === selectedDistrict
    );

    if (foundDistrict) {
      const ups = upazilas.filter(
        (u) => u.district_id === foundDistrict.id
      );
      setFilteredUpazilas(ups);
    } else {
      setFilteredUpazilas([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(
        `${API}/search-donors`,
        {
          params: {
            bloodGroup,
            district,
            upazila,
          },
        }
      );

      setDonors(res.data || []);
      setSearched(true);
    } catch (err) {
      console.error(err);
      setDonors([]);
      setSearched(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        Search Blood Donors
      </h2>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-4 gap-4 mb-8"
      >
        <select
          className="select select-bordered"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          required
        >
          <option value="">Blood Group</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={district}
          onChange={handleDistrictChange}
          required
        >
          <option value="">District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={upazila}
          onChange={(e) => setUpazila(e.target.value)}
          required
        >
          <option value="">Upazila</option>
          {filteredUpazilas.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>

        <button className="btn bg-red-600 text-white">
          Search
        </button>
      </form>

      {searched && donors.length === 0 && (
        <p className="text-center text-gray-500">
          No donors found based on your search.
        </p>
      )}

      {donors.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {donors.map((d) => (
            <div
              key={d._id}
              className="card bg-white shadow p-4"
            >
              <img
                src={d.avatar}
                alt={d.name}
                className="w-20 h-20 rounded-full mx-auto"
              />
              <h3 className="text-xl font-semibold text-center mt-2">
                {d.name}
              </h3>
              <p className="text-center">
                {d.bloodGroup}
              </p>
              <p className="text-center text-sm">
                {d.district}, {d.upazila}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
