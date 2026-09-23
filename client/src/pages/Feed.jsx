import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const load = () => api("/posts").then(setPosts).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const publish = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const post = await api("/posts", { method: "POST", body: { text } });
      setPosts([post, ...posts]);
      setText("");
    } catch (err) { setError(err.message); }
  };

  const like = async (id) => {
    const { likes } = await api(`/posts/${id}/like`, { method: "POST" });
    setPosts(posts.map((p) => (p._id === id ? { ...p, likes } : p)));
  };

  const remove = async (id) => {
    await api(`/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p._id !== id));
  };

  return (
    <section>
      <h2>Campus feed</h2>
      {error && <p className="error">{error}</p>}
      <form className="panel" onSubmit={publish}>
        <textarea rows={3} maxLength={1000} placeholder="Share something with your campus…"
          value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn">Post</button>
      </form>
      {posts.length === 0 && <p className="muted">No posts yet. Be the first to post.</p>}
      {posts.map((p) => (
        <article key={p._id} className="panel post">
          <span className="hex-avatar">{p.author?.name?.[0]}</span>
          <div className="grow">
            <strong>{p.author?.name}</strong>
            {p.author?.department && <span className="muted"> · {p.author.department}</span>}
            <p>{p.text}</p>
            <div className="row">
              <button className="btn ghost small" onClick={() => like(p._id)}>
                {p.likes.includes(user.id) ? "Liked" : "Like"} ({p.likes.length})
              </button>
              {p.author?._id === user.id && (
                <button className="btn ghost small" onClick={() => remove(p._id)}>Delete</button>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
