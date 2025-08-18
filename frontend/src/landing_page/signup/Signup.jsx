import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./LoginSignUp.css";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://zerodha-u26q.onrender.com/signup", form, { withCredentials: true });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Error: " + err.response.data.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control"
            name="username"
            placeholder="Username (optional)"
            value={form.username}
            onChange={handleChange}
          />
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-primary">
            Signup
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
