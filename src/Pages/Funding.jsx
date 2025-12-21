import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";
import axiosSecure from "../api/axiosSecure";



const Funding = () => {
  const { user } = useContext(AuthContext);
  const [funds, setFunds] = useState([]);

  // 🔹 Load all fundings
  useEffect(() => {
    axiosSecure.get("/fundings")
      .then(res => setFunds(res.data));
  }, []);

  // 🔹 Give fund (Stripe simulated)
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

    const updated = await axiosSecure.get("/fundings");
    setFunds(updated.data);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Funding</h2>
        <button
          onClick={handleGiveFund}
          className="btn btn-success"
        >
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
          {funds.map(fund => (
            <tr key={fund._id}>
              <td>{fund.userName}</td>
              <td>{fund.userEmail}</td>
              <td>৳ {fund.amount}</td>
              <td>
                {new Date(fund.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Funding;
