import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { motion as Motion } from "framer-motion";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { Pagination } from "../components/Pagination";
import { CardSwap, Card } from "../components/CardSwap";
import { Select } from "../components/Select";
import { Loader3D } from "../components/Loader3D";

import { Modal } from "../components/Modal";

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const divisionId = searchParams.get("division_id") || "";
  const page = Number.parseInt(searchParams.get("page") || "1", 10) || 1;
  const perPage = 9;

  const [input, setInput] = useState(q);
  const [divisions, setDivisions] = useState([]);
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [dashboard, setDashboard] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, isBulk: false });
  const [isDeleting, setIsDeleting] = useState(false);

  const isLoading = useMemo(() => {
    return !dashboard || state.loading;
  }, [dashboard, state.loading]);

  const params = useMemo(
    () => ({
      name: q || undefined,
      division_id: divisionId || undefined,
      page,
      per_page: perPage,
    }),
    [q, divisionId, page]
  );

  useEffect(() => {
    setInput(q);
  }, [q]);

  useEffect(() => {
    let alive = true;
    api.get("/dashboard").then((res) => {
      if (alive) setDashboard(res.data.data);
    });
    api
      .get("/divisions", { params: { per_page: 100 } })
      .then((res) => {
        if (!alive) return;
        setDivisions(res?.data?.data?.divisions || []);
      })
      .catch(() => {
        if (!alive) return;
        setDivisions([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.resolve().then(() => {
      if (!alive) return;
      setState((s) => ({ ...s, loading: true, error: "" }));
    });

    api
      .get("/employees", { params })
      .then((res) => {
        if (!alive) return;
        setState({ loading: false, error: "", data: res.data });
      })
      .catch((err) => {
        if (!alive) return;
        const message = err?.response?.data?.message || "Server error";
        setState({ loading: false, error: message, data: null });
      });

    return () => {
      alive = false;
    };
  }, [params]);

  const employees = state.data?.data?.employees || [];
  const pagination = state.data?.pagination || { current_page: page, last_page: 1 };

  const setQuery = (next) => {
    const base = Object.fromEntries(searchParams.entries());
    Object.entries(next).forEach(([k, v]) => {
      if (v === "" || v === null || typeof v === "undefined") delete base[k];
      else base[k] = String(v);
    });
    setSearchParams(base);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setQuery({ q: input.trim(), page: 1 });
  };

  const onPageChange = (nextPage) => setQuery({ page: nextPage });

  const onDelete = (id) => {
    setDeleteModal({ isOpen: true, id, isBulk: false });
  };

  const onBulkDelete = () => {
    if (!selectedIds.length) return;
    setDeleteModal({ isOpen: true, id: null, isBulk: true });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteModal.isBulk) {
        await api.post("/employees/bulk-delete", { ids: selectedIds });
        setSelectedIds([]);
      } else {
        await api.delete(`/employees/${deleteModal.id}`);
      }
      setQuery({ page: 1 });
      setDeleteModal({ isOpen: false, id: null, isBulk: false });
    } catch (err) {
      // Handle 404 (Not Found) specifically - treat as success since it's already gone
      if (err.response && err.response.status === 404) {
         setQuery({ page: 1 });
         setDeleteModal({ isOpen: false, id: null, isBulk: false });
         return;
      }
      const message = err?.response?.data?.message || "Server error";
      setState((s) => ({ ...s, error: message }));
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const onExport = async () => {
    try {
      const response = await api.get("/employees/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `employees_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed:", err);
      setState((s) => ({ ...s, error: "Failed to export CSV" }));
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-32">
      <Loader3D loading={isLoading} />
      <section className="relative overflow-hidden py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <Motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.6 }}
              className="max-w-2xl"
            >
              <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Directory</p>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-[color:var(--fg)] sm:text-6xl">
                Employees with depth.
              </h1>
              <p className="mt-6 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
                Search, filter, paginate, and manage data—wrapped in a glassy 3D surface.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to="/employees/new"
                  className="shine inline-flex items-center justify-center rounded-full bg-black/90 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-black"
                >
                  Add Employee
                </Link>
                <Link
                  to="/divisions"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/60 dark:bg-white/5 px-6 py-3 text-sm font-semibold text-[color:var(--fg)] shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5"
                >
                  Manage Divisions
                </Link>
              </div>
            </Motion.div>

            <div className="flex items-center justify-center">
                <CardSwap width={340} height={300} cardDistance={44} verticalDistance={44}>
                {[
                  {
                    label: "Core Module",
                    title: "Employee Management",
                    desc: "Seamlessly add, edit, and manage your workforce with our intuitive 3D interface.",
                    footer: "CRUD Operations • Bulk Actions"
                  },
                  {
                    label: "Analytics",
                    title: "Real-time Insights",
                    desc: "Visualize division distribution and track workforce growth with interactive charts.",
                    footer: "Data Visualization • Live Updates"
                  },
                  {
                    label: "Security",
                    title: "Enterprise Ready",
                    desc: "Secure access control with JWT authentication and optimized performance.",
                    footer: "Secure Auth • Scalable Architecture"
                  }
                ].map((feature, i) => (
                  <Card key={i} customClass="glass-panel">
                    <div className="flex h-full flex-col justify-between p-7">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
                          {feature.label}
                        </p>
                        <h3 className="mt-4 text-lg font-semibold text-[color:var(--fg)]">
                          {feature.title}
                        </h3>
                        <p className="mt-3 text-xs leading-6 text-[color:var(--muted)]">
                          {feature.desc}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-2 text-xs text-[color:var(--muted)]">
                        {feature.footer}
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>

          {dashboard && (
            <Motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.2 }}
              className="mt-16"
            >
              <div className="mb-6 flex items-center gap-2">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--muted)]/20 to-transparent"></span>
                <span className="text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">Dashboard Overview</span>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--muted)]/20 to-transparent"></span>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
              <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.02} transitionSpeed={2000} className="glass-panel p-6 rounded-[28px] h-full">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)]">Overview</h3>
                <div className="mt-4 space-y-4">
                  <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-bold text-[color:var(--fg)]">{dashboard.stats.total_employees}</div>
                        <div className="text-xs text-[color:var(--muted)] mt-1">Employees</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-[color:var(--fg)]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-bold text-[color:var(--fg)]">{dashboard.stats.total_divisions}</div>
                        <div className="text-xs text-[color:var(--muted)] mt-1">Divisions</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-[color:var(--fg)]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                  </div>
                </div>
              </Tilt>
              
              <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.02} transitionSpeed={2000} className="glass-panel p-6 rounded-[28px] h-full">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)] mb-6">Distribution</h3>
                <div className="flex items-end justify-center gap-4 h-[160px] pb-4 px-2">
                  {dashboard.chart_data.slice(0, 4).map((d, i) => {
                    const max = Math.max(...dashboard.chart_data.map(x => x.count)) || 1;
                    const height = Math.max((d.count / max) * 100, 15); // Min 15% height for visibility
                    
                    return (
                        <div key={i} className="flex flex-col items-center gap-2 group w-full h-full justify-end">
                           <div className="relative w-full max-w-[40px] flex items-end justify-center" style={{ height: '100%' }}>
                                <div 
                                    className="w-full bg-neutral-400/60 dark:bg-white/60 rounded-sm relative transition-all duration-1000 ease-out group-hover:bg-blue-300 group-hover:scale-y-105 origin-bottom"
                                    style={{ height: `${height}%` }}
                                >
                                    {/* 3D Top Face */}
                                    <div className="absolute top-0 left-0 w-full h-[10px] bg-neutral-400/90 dark:bg-white/90 origin-bottom skew-x-[-45deg] -translate-y-full rounded-tl-sm border-b border-neutral-400/10 dark:border-white/10 transition-colors duration-1000 group-hover:bg-blue-200" />
                                    
                                    {/* 3D Side Face */}
                                    <div className="absolute top-0 right-0 w-[10px] h-full bg-neutral-400/30 dark:bg-white/30 origin-left skew-y-[-45deg] translate-x-full rounded-br-sm border-l border-neutral-400/10 dark:border-white/10 transition-colors duration-1000 group-hover:bg-blue-400" />
                                </div>
                           </div>
                           <div className="flex flex-col items-center">
                               <div className="text-[10px] font-medium text-[color:var(--muted)] truncate max-w-[60px] text-center uppercase tracking-wider">{d.name}</div>
                               <div className="text-xs font-bold text-neutral-600 dark:text-white transition-colors group-hover:text-blue-300 mt-1">{d.count}</div>
                           </div>
                        </div>
                    );
                  })}
                </div>
              </Tilt>

              {dashboard.activities && (
                <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.02} transitionSpeed={2000} className="glass-panel p-6 rounded-[28px] h-full overflow-hidden">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)] mb-4">Live Feed</h3>
                    <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {dashboard.activities.map((act) => (
                            <div key={act.id} className="flex gap-3 text-xs">
                                <div className={`mt-0.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                                    act.event === 'created' ? 'bg-green-400' :
                                    act.event === 'deleted' ? 'bg-red-400' : 'bg-blue-400'
                                }`} />
                                <div>
                                    <p className="text-[color:var(--fg)] leading-snug">{act.description}</p>
                                    <p className="text-[color:var(--muted)] mt-1 text-[10px]">{act.created_at}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Tilt>
              )}
              </div>
            </Motion.div>
          )}

          <Motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.6 }}
            className="mt-14 grid gap-3 sm:grid-cols-[1fr_240px_auto] items-center"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search by name…"
              className="w-full rounded-full border border-white/15 bg-white/65 dark:bg-white/5 px-6 py-4 text-sm text-[color:var(--fg)] placeholder-[color:var(--muted)] shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl outline-none transition focus:border-white/30 focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 sm:text-base"
            />
            <Select
              value={divisionId}
              onChange={(v) => setQuery({ division_id: v, page: 1 })}
              options={[
                { value: "", label: "All divisions" },
                ...divisions.map((d) => ({ value: d.id, label: d.name })),
              ]}
              className="rounded-full px-6 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl"
            />
            <div className="flex items-center justify-end gap-3 mt-4 sm:mt-0">
              <button
                type="submit"
                className="rounded-full bg-black/90 px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-black sm:text-base"
              >
                Search
              </button>
              {selectedIds.length > 0 && (
                <button
                  onClick={onBulkDelete}
                  disabled={isBulkDeleting}
                  className="rounded-full bg-red-500/90 px-5 py-3 text-xs font-semibold text-white shadow-lg transition hover:bg-red-600 hover:-translate-y-0.5 disabled:opacity-50"
                >
                  Delete Selected ({selectedIds.length})
                </button>
              )}
              <button
                onClick={onExport}
                type="button"
                className="rounded-full border border-white/20 bg-white/60 dark:bg-white/5 px-5 py-3 text-xs font-semibold text-[color:var(--fg)] shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5"
              >
                Export CSV
              </button>
            </div>
          </Motion.form>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          {state.error ? (
            <div className="py-6">
              <Alert>{state.error}</Alert>
            </div>
          ) : null}

          {!state.loading && !state.error && employees.length === 0 ? (
            <div className="py-16 text-center text-[color:var(--muted)]">Tidak ada data.</div>
          ) : null}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee) => (
              <Tilt
                key={employee.id}
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                scale={1.02}
                transitionSpeed={1500}
                className="h-full"
              >
                <div 
                  className={`card-3d glass-panel shine h-full rounded-[28px] p-6 transition-all duration-300 ${
                    selectedIds.includes(employee.id) ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''
                  }`}
                  onClick={() => toggleSelection(employee.id)}
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
                    <span>{employee?.division?.name || "No Division"}</span>
                    <span>{employee.position}</span>
                  </div>

                  <div className="mt-5 flex items-center gap-4">
                    {employee.image ? (
                      <img
                        src={employee.image}
                        alt={employee.name}
                        className="h-14 w-14 rounded-2xl object-cover border border-white/20 shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-2xl bg-black/10 dark:bg-white/10 border border-white/20" />
                    )}
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-[color:var(--fg)]">{employee.name}</h3>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">{employee.phone}</p>
                    </div>
                  </div>

                  <div className="mt-7 flex items-center gap-2">
                    <Link
                      to={`/employees/${employee.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-black/90 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-black"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(employee.id);
                      }}
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 bg-white/60 dark:bg-white/5 px-4 py-2.5 text-xs font-semibold text-[color:var(--fg)] transition hover:-translate-y-0.5"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>

          <div className="mt-10">
            <Pagination
              page={pagination.current_page || page}
              totalPages={pagination.last_page || 1}
              onPageChange={onPageChange}
            />
          </div>
        </Container>
      </section>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        title={deleteModal.isBulk ? "Delete Multiple Employees" : "Delete Employee"}
        footer={
          <>
            <button
              onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
              className="rounded-full border border-white/20 bg-white/60 dark:bg-white/5 px-5 py-2.5 text-xs font-semibold text-[color:var(--fg)] transition hover:bg-white/80"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="rounded-full bg-red-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        <p>
          {deleteModal.isBulk
            ? `Are you sure you want to delete ${selectedIds.length} selected employees? This action cannot be undone.`
            : "Are you sure you want to delete this employee? This action cannot be undone."}
        </p>
      </Modal>
    </div>
  );
}

export default HomePage;
