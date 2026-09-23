import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const empty = { title: "", description: "", location: "", date: "" };

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const load = () => api("/events").then(setEvents).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api("/events", { method: "POST", body: form });
      setForm(empty);
      load();
    } catch (err) { setError(err.message); }
  };

  const rsvp = async (id) => {
    try { await api(`/events/${id}/rsvp`, { method: "POST" }); load(); }
    catch (err) { setError(err.message); }
  };

  const remove = async (id) => {
    await api(`/events/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <section>
      <h2>Events</h2>
      {error && <p className="error">{error}</p>}
      {user && (
        <form className="panel" onSubmit={create}>
          <h3>Host an event</h3>
          <label>Title<input required value={form.title} onChange={set("title")} /></label>
          <div className="row">
            <label className="grow">Date and time
              <input type="datetime-local" required value={form.date} onChange={set("date")} />
            </label>
            <label className="grow">Location<input value={form.location} onChange={set("location")} /></label>
          </div>
          <label>Description<textarea rows={2} value={form.description} onChange={set("description")} /></label>
          <button className="btn">Publish event</button>
        </form>
      )}
      {events.length === 0 && <p className="muted">No events yet.</p>}
      <div className="grid">
        {events.map((ev) => {
          const going = user && ev.attendees.includes(user.id);
          return (
            <article key={ev._id} className="panel">
              <h3>{ev.title}</h3>
              <p className="muted">
                {new Date(ev.date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                {ev.location && ` · ${ev.location}`}
              </p>
              <p>{ev.description}</p>
              <p className="muted">{ev.attendees.length} going · hosted by {ev.createdBy?.name}</p>
              <div className="row">
                {user && (
                  <button className={going ? "btn ghost small" : "btn small"} onClick={() => rsvp(ev._id)}>
                    {going ? "Cancel RSVP" : "I'm going"}
                  </button>
                )}
                {user && ev.createdBy?._id === user.id && (
                  <button className="btn ghost small" onClick={() => remove(ev._id)}>Delete</button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
