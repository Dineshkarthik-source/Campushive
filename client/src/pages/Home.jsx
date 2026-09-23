import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <section className="hero">
      <h1>Everything happening on campus, in one hive.</h1>
      <p>
        Find events, join clubs and talk to people in your college — without
        digging through ten group chats.
      </p>
      <div className="row">
        <Link className="btn" to={user ? "/events" : "/register"}>
          {user ? "See upcoming events" : "Create your account"}
        </Link>
        <Link className="btn ghost" to="/clubs">Browse clubs</Link>
      </div>
    </section>
  );
}
