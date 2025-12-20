import { useEffect, useState } from "react";
import axios from "axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  const loadUsers = () => {
    const url = filter
      ? `http://localhost:5000/users?status=${filter}`
      : `http://localhost:5000/users`;

    axios.get(url).then(res => setUsers(res.data));
  };

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const updateStatus = (id, status) => {
    axios.patch(`http://localhost:5000/users/status/${id}`, { status })
      .then(() => loadUsers());
  };

  const updateRole = (id, role) => {
    axios.patch(`http://localhost:5000/users/role/${id}`, { role })
      .then(() => loadUsers());
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      <select
        className="select select-bordered mb-4"
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="blocked">Blocked</option>
      </select>

      <table className="table bg-white">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>
                <img src={user.avatar} className="w-10 rounded-full" />
              </td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td className="space-x-2">
                {user.status === "active" ? (
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => updateStatus(user._id, "blocked")}
                  >
                    Block
                  </button>
                ) : (
                  <button
                    className="btn btn-xs btn-success"
                    onClick={() => updateStatus(user._id, "active")}
                  >
                    Unblock
                  </button>
                )}

                <button
                  className="btn btn-xs"
                  onClick={() => updateRole(user._id, "volunteer")}
                >
                  Make Volunteer
                </button>

                <button
                  className="btn btn-xs btn-warning"
                  onClick={() => updateRole(user._id, "admin")}
                >
                  Make Admin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
