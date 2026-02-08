import { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { useAuth } from "../context/useAuth";

function ProfilePage() {
  const { user, refreshMe } = useAuth();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  const canSubmit = useMemo(() => Boolean(name.trim()), [name]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!canSubmit) return;
    setBusy(true);
    try {
      await api.put("/me", { name: name.trim() });
      await refreshMe();
      setSuccess("Berhasil menyimpan perubahan.");
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container>
      <div className="pt-20 sm:pt-24 pb-32">
        <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Account</p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
          Profile
        </h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
          Update your full name and see it reflect instantly in the navbar.
        </p>

        {error ? (
          <div className="mt-6">
            <Alert>{error}</Alert>
          </div>
        ) : null}

        {success ? (
          <div className="mt-6">
            <Alert>{success}</Alert>
          </div>
        ) : null}

        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]"
        >
          <div className="surface rounded-[32px] p-7">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">Current</div>
            <div className="mt-5 space-y-3">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Name</div>
                <div className="mt-2 text-lg font-semibold text-[color:var(--fg)]">{user?.name || "-"}</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Username</div>
                  <div className="mt-2 text-sm text-[color:var(--fg)]">{user?.username || "-"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Email</div>
                  <div className="mt-2 text-sm text-[color:var(--fg)]">{user?.email || "-"}</div>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Phone</div>
                <div className="mt-2 text-sm text-[color:var(--fg)]">{user?.phone || "-"}</div>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="glass-panel rounded-[32px] p-7">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">Edit</div>
            <div className="mt-5">
              <label className="block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                Full name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-white/15 bg-white/65 dark:bg-white/5 px-5 py-3 text-sm text-[color:var(--fg)] outline-none focus:border-white/30"
                placeholder="Nama lengkap"
              />
            </div>
            <button
              type="submit"
              disabled={busy || !canSubmit}
              className="mt-8 w-full rounded-full bg-black/90 px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-black disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save"}
            </button>
          </form>
        </Motion.div>
      </div>
    </Container>
  );
}

export default ProfilePage;
