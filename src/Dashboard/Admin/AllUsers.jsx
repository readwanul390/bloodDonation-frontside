import { useEffect, useState } from "react";
import axiosSecure from "../../api/axiosSecure";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  const loadUsers = () => {
    let url = `/users?page=${page}&limit=${limit}`;

    if (filter) {
      url += `&status=${filter}`;
    }

    axiosSecure.get(url).then((res) => {
      setUsers(res.data.users);
      setTotal(res.data.total);
    });
  };

  useEffect(() => {
    loadUsers();
  }, [filter, page]);

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
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setPage(1); // reset page on filter
        }}
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
            .filter((user) => user.role !== "admin") // admin hidden
            .map((user) => (
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

                {/* ===== ACTION DROPDOWN ===== */}
                <td className="text-center">
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-sm">
                      ⋮
                    </label>

                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
                    >
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

      {/* ===== PAGINATION ===== */}
      <div className="flex justify-center gap-2 mt-6">
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
              page === num + 1 ? "btn-active" : ""
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

export default AllUsers;
