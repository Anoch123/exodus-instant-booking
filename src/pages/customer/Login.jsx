import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import useThemeScripts from "../../hooks/useThemeScripts";
import { useAuth } from "../../context/AuthContext";

export default function CustomerLogin() {
  useThemeScripts();
  const navigate = useNavigate();
  const { loginCustomer } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // 1️⃣ Authenticate via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // 2️⃣ JWT is issued here
    const { session, user } = data;

    // 3️⃣ Load customer profile (if you have a customers table)
    const { data: customerProfile, error: profileError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", user.id)
      .single();

    // If customer profile doesn't exist, create a basic one from user data
    const customerData = customerProfile || {
      id: user.id,
      email: user.email,
      ...user.user_metadata,
    };

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116 is "not found" - we'll use basic user data
      console.warn("Customer profile not found, using basic user data");
    }

    // 4️⃣ Use AuthContext to store authentication state
    loginCustomer(customerData, session.access_token);

    // 5️⃣ Navigate to dashboard
    navigate("/customer/dashboard");
  };

  return (
    <div>
      <div className="hero-wrap js-partialheight" style={{ backgroundImage: "url('/images/bg_5.jpg')" }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-partialheight align-items-center" data-scrollax-parent="true">
            <div className="col-md-7 ftco-animate">
              <h1 className="mb-4">Customer Login</h1>
              <p className="caps">Travel to the any corner of the world, without going around in circles</p>
            </div>
          </div>
        </div>
      </div>

      <section className="ftco-section bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="login-wrap">
                <h3 className="mb-4 text-center">Have an account?</h3>
                <form onSubmit={handleLogin} className="login-form">
                  {error && (
                    <div className="alert alert-danger py-2 mb-3">{error}</div>
                  )}
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control rounded-left"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group d-flex">
                    <input
                      type="password"
                      className="form-control rounded-left"
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary rounded submit p-3 px-5">Login</button>
                  </div>
                </form>
              </div>
              <p className="text-center text-gray-500">
                Don't have an account?{' '}
                <a href="/customer-signup" className="text-blue-500 hover:underline font-medium">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
