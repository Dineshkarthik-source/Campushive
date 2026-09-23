import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "", year: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register({ ...form, year: form.year ? Number(form.year) : undefined });
      nav("/feed");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="panel narrow" onSubmit={submit}>
      <h2>Join the hive</h2>
      {error && <p className="error">{error}</p>}
      <label>Full name<input required value={form.name} onChange={set("name")} /></label>
      <label>College email<input type="email" required value={form.email} onChange={set("email")} /></label>
      <label>Password (6+ characters)
        <input type="password" minLength={6} required value={form.password} onChange={set("password")} />
      </label>
      <div className="row">
        <label className="grow">Department<input value={form.department} onChange={set("department")} /></label>
        <label>Year
          <select value={form.year} onChange={set("year")}>
            <option value="">—</option>
            {[1, 2, 3, 4].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
      </div>
      <button className="btn">Create account</button>
      <p className="muted">Already a member? <Link to="/login">Log in</Link></p>
    </form>
  );
}
