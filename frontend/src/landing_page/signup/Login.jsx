import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./LoginSignUp.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(
      "https://zerodha-2v0l.onrender.com/auth/login",
      form,
      { withCredentials: true }
    );

    console.log("Login response:", res.data);

    if (res.data.message === "Login successful") {
      // Save user info or session
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to dashboard app
      window.location.href = "https://zerodha-orzy-84ac2hk4w-arfat-fakihs-projects.vercel.app/";
    } else {
      alert(res.data.message || "Login failed!");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Invalid credentials!");
  }
};


  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
