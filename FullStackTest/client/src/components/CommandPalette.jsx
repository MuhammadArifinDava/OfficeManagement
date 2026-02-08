import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!open) return;
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        api.get("/employees", { params: { name: query, per_page: 5 } }).then((res) => {
          setResults(res.data.data.employees || []);
        });
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, open]);

  const handleSelect = (id) => {
    setOpen(false);
    navigate(`/employees/${id}/edit`);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[10060] flex items-start justify-center pt-[20vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="surface relative w-full max-w-lg overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10"
          >
            <div className="flex items-center border-b border-white/10 px-4">
              <svg
                className="mr-2 h-5 w-5 text-[color:var(--muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                autoFocus
                className="flex-1 bg-transparent py-4 text-sm text-[color:var(--fg)] placeholder-[color:var(--muted)] outline-none"
                placeholder="Search employees..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="text-xs text-[color:var(--muted)] bg-white/10 px-2 py-1 rounded">ESC</div>
            </div>
            {results.length > 0 && (
              <div className="max-h-[300px] overflow-y-auto p-2">
                <div className="text-[10px] uppercase tracking-wider text-[color:var(--muted)] px-2 py-2">
                  Employees
                </div>
                {results.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() => handleSelect(employee.id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-[color:var(--fg)] hover:bg-white/10 transition-colors"
                  >
                    {employee.image ? (
                        <img src={employee.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-white/10" />
                    )}
                    <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-xs text-[color:var(--muted)]">{employee.position}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {query && results.length === 0 && (
              <div className="p-4 text-center text-sm text-[color:var(--muted)]">
                No results found.
              </div>
            )}
            {!query && (
                <div className="p-4 text-center text-xs text-[color:var(--muted)]">
                    Type to search...
                </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
