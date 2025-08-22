import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./LoginSignUp.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Clear any existing session data when component mounts
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clear any existing data before login
      localStorage.clear();
      sessionStorage.clear();

      // First, try to force logout any existing session
      try {
        await axios.post(
          "https://zerodha-9zmu.onrender.com/force-logout",
          {},
          { withCredentials: true }
        );
      } catch (logoutError) {
        console.log("Force logout completed or no session to clear");
      }

      const res = await axios.post(
        "https://zerodha-9zmu.onrender.com/login",
        form,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("Login response:", res.data);

      if (res.data.message === "Login successful" && res.data.user) {
        // Save user info
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // Verify session is working
        try {
          const verifyRes = await axios.get(
            "https://zerodha-9zmu.onrender.com/verify-session",
            { withCredentials: true }
          );
          
          if (verifyRes.data.authenticated) {
            console.log("Session verified successfully");
            // Redirect to dashboard
            window.location.href = "https://zerodha-orzy-gypy78cjm-arfat-fakihs-projects.vercel.app/";
          } else {
            alert("Session verification failed. Please try again.");
          }
        } catch (verifyError) {
          console.error("Session verification error:", verifyError);
          alert("Login successful but session verification failed. Please try refreshing the dashboard.");
          window.location.href = "https://zerodha-orzy-gypy78cjm-arfat-fakihs-projects.vercel.app/";
        }
      } else {
        alert(res.data.message || "Login failed!");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Invalid credentials!";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
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
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
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