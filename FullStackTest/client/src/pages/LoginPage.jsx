import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { api } from "../lib/api";
import { useAuth } from "../context/useAuth";
import { Alert } from "../components/Alert";
import { Loader3D } from "../components/Loader3D";

function LoginPage() {
  const navigate = useNavigate();
  const { setToken, setUser, isAuthenticated } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const un = username.trim();
    const pw = password;
    if (!un || !pw) {
      setError("Field required");
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post("/login", { username: un, password: pw });
      setToken(data?.data?.token || "");
      setUser(data?.data?.admin || null);
      navigate("/");
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Loader3D loading={busy} />
      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.6 }}
        className="w-full max-w-md mx-auto p-4 [perspective:1200px]"
      >
        <div className="card-3d surface rounded-[32px] p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">Welcome back</p>
            <h1 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[color:var(--fg)]">
              Login.
            </h1>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              Gunakan kredensial statis sesuai soal.
            </p>
          </div>

          {error ? (
            <div className="mt-5">
              <Alert>{error}</Alert>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-3 w-full rounded-full border border-white/10 bg-white/70 dark:bg-white/5 px-5 py-3 text-sm outline-none transition focus:border-white/25 focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-3 w-full rounded-full border border-white/10 bg-white/70 dark:bg-white/5 px-5 py-3 text-sm outline-none transition focus:border-white/25 focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-black/90 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-black disabled:opacity-50"
              >
                Login
              </button>
            </form>
          </div>
        </Motion.div>
      </div>
  );
}

export default LoginPage;
