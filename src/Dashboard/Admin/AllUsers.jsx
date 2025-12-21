import { useEffect, useState } from "react";
import axiosSecure from "../../api/axiosSecure";


const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  const loadUsers = () => {
    const url = filter
      ? `/users?status=${filter}`
      : `/users`;

    axiosSecure.get(url).then(res => setUsers(res.data));
  };

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const updateStatus = (id, status) => {
    axiosSecure
      .patch(`/users/status/${id}`, { status })
      .then(() => loadUsers());
  };

  const updateRole = (id, role) => {
    axiosSecure
      .patch(`/users/role/${id}`, { role })
      .then(() => loadUsers());
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      {/* ===== FILTER ===== */}
      <select
        className="select select-bordered mb-4"
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="blocked">Blocked</option>
      </select>

      {/* ===== TABLE ===== */}
      <table className="table bg-white">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users
            // 🔴 ADMIN USERS FULLY HIDDEN
            .filter(user => user.role !== "admin")
            .map(user => (
              <tr key={user._id}>
                <td>
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td className="capitalize">{user.role}</td>
                <td className="capitalize">{user.status}</td>

                {/* ===== 3-DOT DROPDOWN ===== */}
                <td className="text-center">
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-sm">
                      ⋮
                    </label>

                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
                    >
                      {/* Block / Unblock */}
                      {user.status === "active" ? (
                        <li>
                          <button
                            onClick={() =>
                              updateStatus(user._id, "blocked")
                            }
                          >
                            Block
                          </button>
                        </li>
                      ) : (
                        <li>
                          <button
                            onClick={() =>
                              updateStatus(user._id, "active")
                            }
                          >
                            Unblock
                          </button>
                        </li>
                      )}

                      {/* Make Volunteer */}
                      {user.role === "donor" && (
                        <li>
                          <button
                            onClick={() =>
                              updateRole(user._id, "volunteer")
                            }
                          >
                            Make Volunteer
                          </button>
                        </li>
                      )}

                      {/* Make Admin */}
                      <li>
                        <button
                          onClick={() =>
                            updateRole(user._id, "admin")
                          }
                        >
                          Make Admin
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
