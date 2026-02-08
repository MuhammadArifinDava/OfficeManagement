import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import Dock from "./Dock";
import { VscAccount, VscHome, VscOrganization, VscSignOut } from "react-icons/vsc";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, setMode, effective } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const displayName = user?.name || user?.username || "User";

  const items = useMemo(() => {
    if (!isAuthenticated) return [];
    return [
      {
        icon: <VscHome size={24} className="text-white" />,
        label: "Employees",
        onClick: () => navigate("/"),
      },
      {
        icon: <VscOrganization size={24} className="text-white" />,
        label: "Divisions",
        onClick: () => navigate("/divisions"),
      },
      {
        icon: <VscAccount size={24} className="text-white" />,
        label: "Profile",
        onClick: () => navigate("/profile"),
      },
    ];
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || location.pathname === "/login") return null;

  return (
    <div className="relative z-[9999]">
      <Dock
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={90}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 origin-bottom scale-75 sm:scale-100 sm:bottom-6"
      />

      <div ref={menuRef} className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[10050]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="surface card-3d shine inline-flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold text-[color:var(--fg)]"
        >
          <span className="h-8 w-8 rounded-full bg-black/10 dark:bg-white/10 border border-white/20 flex items-center justify-center text-xs">
            {displayName.slice(0, 2).toUpperCase()}
          </span>
          <span className="max-w-[160px] truncate">{displayName}</span>
          <span className="text-xs text-[color:var(--muted)]">{effective === "dark" ? "Dark" : "Light"}</span>
        </button>

        {open ? (
          <div className="mt-3 w-[280px] rounded-[24px] surface p-4">
            <div className="px-2 pb-3">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">Signed in</div>
              <div className="mt-2 text-sm font-semibold text-[color:var(--fg)]">{displayName}</div>
              <div className="mt-1 text-xs text-[color:var(--muted)]">{user?.email || "-"}</div>
            </div>

            <div className="border-t border-white/15 pt-3">
              <div className="px-2 text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">Theme</div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { key: "system", label: "OS" },
                  { key: "light", label: "Light" },
                  { key: "dark", label: "Dark" },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setMode(t.key)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                      mode === t.key
                        ? "bg-black/90 text-white"
                        : "border border-white/20 bg-white/60 dark:bg-white/5 text-[color:var(--fg)]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-white/15 pt-3">
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
                className="w-full rounded-full bg-black/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black inline-flex items-center justify-center gap-2"
              >
                <VscSignOut size={18} className="text-white" />
                Logout
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { Navbar };
