import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      nav("/feed");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="panel narrow" onSubmit={submit}>
      <h2>Log in</h2>
      {error && <p className="error">{error}</p>}
      <label>Email
        <input type="email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>
      <label>Password
        <input type="password" required value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </label>
      <button className="btn">Log in</button>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </form>
  );
}
