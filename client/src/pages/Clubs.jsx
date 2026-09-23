import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const empty = { name: "", description: "", category: "" };

export default function Clubs() {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const load = () => api("/clubs").then(setClubs).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api("/clubs", { method: "POST", body: form });
      setForm(empty);
      load();
    } catch (err) { setError(err.message); }
  };

  const toggle = async (id) => {
    try { await api(`/clubs/${id}/join`, { method: "POST" }); load(); }
    catch (err) { setError(err.message); }
  };

  return (
    <section>
      <h2>Clubs</h2>
      {error && <p className="error">{error}</p>}
      {user && (
        <form className="panel" onSubmit={create}>
          <h3>Start a club</h3>
          <div className="row">
            <label className="grow">Name<input required value={form.name} onChange={set("name")} /></label>
            <label className="grow">Category<input placeholder="Tech, Sports, Arts…" value={form.category} onChange={set("category")} /></label>
          </div>
          <label>What is it about?<textarea rows={2} value={form.description} onChange={set("description")} /></label>
          <button className="btn">Create club</button>
        </form>
      )}
      {clubs.length === 0 && <p className="muted">No clubs yet.</p>}
      <div className="grid">
        {clubs.map((c) => {
          const joined = user && c.members.includes(user.id);
          return (
            <article key={c._id} className="panel">
              <h3>{c.name}</h3>
              <p className="muted">{c.category} · {c.members.length} members</p>
              <p>{c.description}</p>
              {user && (
                <button className={joined ? "btn ghost small" : "btn small"} onClick={() => toggle(c._id)}>
                  {joined ? "Leave club" : "Join club"}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
