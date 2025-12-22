import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";
import axiosSecure from "../api/axiosSecure";

const Funding = () => {
  const { user } = useContext(AuthContext);

  const [funds, setFunds] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 6;
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  // 🔹 Load fundings with pagination
  const loadFunds = () => {
    axiosSecure
      .get(`/fundings?page=${page}&limit=${limit}`)
      .then((res) => {
        setFunds(res.data.fundings);
        setTotal(res.data.total);
      });
  };

  useEffect(() => {
    loadFunds();
  }, [page]);

  // 🔹 Give fund
  const handleGiveFund = async () => {
    const { value: amount } = await Swal.fire({
      title: "Give Fund",
      input: "number",
      inputLabel: "Enter amount (BDT)",
      inputPlaceholder: "e.g. 500",
      showCancelButton: true,
    });

    if (!amount) return;

    await axiosSecure.post("/fundings", {
      userName: user.displayName,
      userEmail: user.email,
      amount,
    });

    Swal.fire("Success", "Thank you for your support!", "success");
    setPage(1); // go back to first page
    loadFunds();
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Funding</h2>
        <button onClick={handleGiveFund} className="btn btn-success">
          Give Fund
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {funds.map((fund) => (
            <tr key={fund._id}>
              <td>{fund.userName}</td>
              <td>{fund.userEmail}</td>
              <td>৳ {fund.amount}</td>
              <td>{new Date(fund.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="btn btn-sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num}
            className={`btn btn-sm ${
              page === num + 1 ? "btn-primary" : ""
            }`}
            onClick={() => setPage(num + 1)}
          >
            {num + 1}
          </button>
        ))}

        <button
          className="btn btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Funding;
