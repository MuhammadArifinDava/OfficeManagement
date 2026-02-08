import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { Loader3D } from "../components/Loader3D";
import { Pagination } from "../components/Pagination";
import { Modal } from "../components/Modal";

function DivisionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const page = Number.parseInt(searchParams.get("page") || "1", 10) || 1;
  const perPage = 12;

  const [input, setInput] = useState(q);
  const [createName, setCreateName] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingName, setEditingName] = useState("");
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const params = useMemo(
    () => ({
      name: q || undefined,
      page,
      per_page: perPage,
    }),
    [q, page]
  );

  useEffect(() => {
    setInput(q);
  }, [q]);

  const setQuery = (next) => {
    const base = Object.fromEntries(searchParams.entries());
    Object.entries(next).forEach(([k, v]) => {
      if (v === "" || v === null || typeof v === "undefined") delete base[k];
      else base[k] = String(v);
    });
    setSearchParams(base);
  };

  const fetchList = () => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    api
      .get("/divisions", { params })
      .then((res) => setState({ loading: false, error: "", data: res.data }))
      .catch((err) => {
        const message = err?.response?.data?.message || "Server error";
        setState({ loading: false, error: message, data: null });
      });
  };

  useEffect(() => {
    fetchList();
  }, [params]);

  const divisions = state.data?.data?.divisions || [];
  const pagination = state.data?.pagination || { current_page: page, last_page: 1 };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    setQuery({ q: input.trim(), page: 1 });
  };

  const onCreate = async () => {
    const name = createName.trim();
    if (!name) return;
    try {
      await api.post("/divisions", { name });
      setCreateName("");
      setQuery({ page: 1 });
      fetchList();
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setState((s) => ({ ...s, error: message }));
    }
  };

  const startEdit = (division) => {
    setEditingId(division.id);
    setEditingName(division.name);
  };

  const cancelEdit = () => {
    setEditingId("");
    setEditingName("");
  };

  const saveEdit = async () => {
    const name = editingName.trim();
    if (!editingId || !name) return;
    try {
      await api.put(`/divisions/${editingId}`, { name });
      cancelEdit();
      fetchList();
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setState((s) => ({ ...s, error: message }));
    }
  };

  const onDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/divisions/${deleteModal.id}`);
      fetchList();
      setDeleteModal({ isOpen: false, id: null });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        fetchList();
        setDeleteModal({ isOpen: false, id: null });
        return;
      }
      const message = err?.response?.data?.message || "Server error";
      setState((s) => ({ ...s, error: message }));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <Container>
        <div className="pt-20 sm:pt-24">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">Directory</p>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                Divisions
              </h1>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                Search and manage divisions with pagination.
              </p>
            </div>

            <div className="surface rounded-[28px] p-5">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                Add new division
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Division name"
                  className="w-full rounded-full border border-white/15 bg-white/65 dark:bg-white/5 px-5 py-3 text-sm text-[color:var(--fg)] placeholder-[color:var(--muted)] outline-none focus:border-white/30"
                />
                <button
                  type="button"
                  onClick={onCreate}
                  className="rounded-full bg-black/90 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmitSearch} className="mt-10 grid gap-3 sm:grid-cols-[1fr_auto] items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Filter by name…"
              className="w-full rounded-full border border-white/15 bg-white/65 dark:bg-white/5 px-6 py-4 text-sm text-[color:var(--fg)] placeholder-[color:var(--muted)] shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl outline-none transition focus:border-white/30 focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
            />
            <button
              type="submit"
              className="rounded-full bg-black/90 px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-black"
            >
              Search
            </button>
          </form>

          {state.error ? (
            <div className="mt-6">
              <Alert>{state.error}</Alert>
            </div>
          ) : null}

          <Loader3D loading={state.loading} />

          {!state.loading && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {divisions.map((division) => (
                <Tilt
                  key={division.id}
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  scale={1.02}
                  transitionSpeed={1500}
                  className="h-full"
                >
                  <div className="card-3d glass-panel shine h-full rounded-[28px] p-6">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
                      Division
                    </div>

                    {editingId === division.id ? (
                      <div className="mt-4">
                        <input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full rounded-2xl border border-white/15 bg-white/65 dark:bg-white/5 px-5 py-3 text-sm text-[color:var(--fg)] outline-none focus:border-white/30"
                        />
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="inline-flex flex-1 items-center justify-center rounded-full bg-black/90 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-black"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 bg-white/60 dark:bg-white/5 px-4 py-2.5 text-xs font-semibold text-[color:var(--fg)] transition hover:-translate-y-0.5"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="mt-4 text-lg font-semibold text-[color:var(--fg)]">{division.name}</h3>
                        <div className="mt-7 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(division)}
                            className="inline-flex flex-1 items-center justify-center rounded-full bg-black/90 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-black"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(division.id)}
                            className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 bg-white/60 dark:bg-white/5 px-4 py-2.5 text-xs font-semibold text-[color:var(--fg)] transition hover:-translate-y-0.5"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </Tilt>
              ))}
            </div>
          )}

          <div className="mt-10">
            <Pagination
              page={pagination.current_page || page}
              totalPages={pagination.last_page || 1}
              onPageChange={(p) => setQuery({ page: p })}
            />
          </div>

          <Modal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
            title="Delete Division"
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
            <p>Are you sure you want to delete this division? This action cannot be undone.</p>
          </Modal>
        </div>
      </Container>
    </div>
  );
}

export default DivisionsPage;
