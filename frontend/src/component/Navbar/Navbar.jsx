import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Navbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = async () => {
    await axios.post(`${API_BASE_URL}/user/logout`,{}, { withCredentials: true });

    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border">
      <div className="container-fluid">
        <Link className="navbar-brand hover-brand" to="/">
          Task Manager
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link hover-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/alltask" className="nav-link hover-link">
                All Tasks
              </Link>
            </li>

            {/* Admin-Only Dashboard */}
            {role === "admin" && (
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link hover-link">
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Authenticated User Actions */}
          <ul className="navbar-nav ms-auto">
            {name ? (
              <>
                <li className="nav-item d-flex align-items-center me-3">
                  <span className="badge bg-secondary hover-badge">{role}</span>
                </li>
                <li className="nav-item d-flex align-items-center me-3">
                  <span className="fw-bold hover-username">{name}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger hover-button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/register" className="nav-link hover-link">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link hover-link">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

