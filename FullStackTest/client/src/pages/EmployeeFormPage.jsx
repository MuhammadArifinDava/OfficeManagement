import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { Loader3D } from "../components/Loader3D";
import { Select } from "../components/Select";

function EmployeeFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [divisions, setDivisions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [isDivisionsLoading, setIsDivisionsLoading] = useState(true);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(isEdit);
  const [error, setError] = useState("");

  const loading = isDivisionsLoading || isEmployeeLoading;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [division, setDivision] = useState("");
  const [position, setPosition] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // ... (keep useEffects and logic)

  // Fetch logic omitted for brevity in SearchReplace but assumed to be unchanged
  // actually I need to be careful with SearchReplace. I should just replace imports and the render part.


  useEffect(() => {
    let alive = true;

    // Safety timeout to prevent infinite loading
    const timer = setTimeout(() => {
      if (alive) setIsDivisionsLoading(false);
    }, 10000);

    api
      .get("/divisions", { params: { per_page: 100 } })
      .then((res) => {
        if (!alive) return;
        const list = res?.data?.data?.divisions || [];
        setDivisions(list);
        if (!division && list[0]?.id) setDivision(list[0].id);
      })
      .catch(() => {
        if (!alive) return;
        setDivisions([]);
        setError("Gagal memuat data divisi.");
      })
      .finally(() => {
        if (!alive) return;
        setIsDivisionsLoading(false);
        clearTimeout(timer);
      });
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let alive = true;
    setIsEmployeeLoading(true);
    api
      .get(`/employees/${id}`)
      .then((res) => {
        if (!alive) return;
        const employee = res?.data?.data?.employee;
        setName(employee?.name || "");
        setPhone(employee?.phone || "");
        setDivision(employee?.division?.id || "");
        setPosition(employee?.position || "");
        setImagePreview(employee?.image || "");
      })
      .catch((err) => {
        if (!alive) return;
        const message = err?.response?.data?.message || "Server error";
        setError(message);
      })
      .finally(() => {
        if (!alive) return;
        setIsEmployeeLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [isEdit, id]);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const canSubmit = useMemo(() => {
    if (!name.trim() || !phone.trim() || !division || !position.trim()) return false;
    if (!isEdit && !imageFile) return false;
    return true;
  }, [name, phone, division, position, imageFile, isEdit]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!canSubmit) return;
    setBusy(true);

    const form = new FormData();
    form.append("name", name.trim());
    form.append("phone", phone.trim());
    form.append("division", division);
    form.append("position", position.trim());
    if (imageFile) form.append("image", imageFile);

    try {
      if (isEdit) {
        await api.put(`/employees/${id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/employees", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/");
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <Container>
        <div className="pt-20 sm:pt-24">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted)]">
                {isEdit ? "Edit employee" : "Create employee"}
              </p>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
                {isEdit ? "Refine details." : "Add a new profile."}
              </h1>
            </div>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/60 dark:bg-white/5 px-6 py-3 text-sm font-semibold text-[color:var(--fg)] shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5"
            >
              Back
            </Link>
          </div>

          {error ? (
            <div className="mt-6">
              <Alert>{error}</Alert>
            </div>
          ) : null}

          <Loader3D loading={loading} />
          
          {!loading && (
            <Motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
            >
              <div className="surface rounded-[32px] p-7">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)]">Preview</div>
                <Tilt
                  tiltMaxAngleX={5}
                  tiltMaxAngleY={5}
                  perspective={1000}
                  scale={1.02}
                  transitionSpeed={1000}
                  className="mt-5 overflow-hidden rounded-[28px] border border-white/15 bg-black/5 dark:bg-white/5 shadow-2xl"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-72 w-full object-cover" />
                  ) : (
                    <div className="flex h-72 items-center justify-center text-sm text-[color:var(--muted)]">
                      No image
                    </div>
                  )}
                </Tilt>
                <div className="mt-5">
                  <label className="block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                    Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="mt-3 w-full rounded-2xl border border-white/15 bg-white/65 dark:bg-white/5 px-5 py-3 text-sm text-[color:var(--fg)] file:mr-3 file:rounded-full file:border-0 file:bg-black/90 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
                  />
                  {isEdit ? (
                    <p className="mt-3 text-xs text-[color:var(--muted)]">
                      Upload optional—leave empty to keep current photo.
                    </p>
                  ) : null}
                </div>
              </div>

              <form onSubmit={onSubmit} className="glass-panel rounded-[32px] p-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-3 w-full rounded-2xl border border-white/15 bg-white/65 dark:bg-white/5 px-5 py-3 text-sm text-[color:var(--fg)] outline-none focus:border-white/30"
                      placeholder="Nama karyawan"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Phone</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-3 w-full rounded-2xl border border-white/15 bg-white/65 dark:bg-white/5 px-5 py-3 text-sm text-[color:var(--fg)] outline-none focus:border-white/30"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Division</label>
                    <Select
                      value={division}
                      onChange={setDivision}
                      options={divisions.map((d) => ({ value: d.id, label: d.name }))}
                      placeholder="Select division…"
                      className="mt-3"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Position</label>
                    <input
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="mt-3 w-full rounded-2xl border border-white/15 bg-white/65 dark:bg-white/5 px-5 py-3 text-sm text-[color:var(--fg)] outline-none focus:border-white/30"
                      placeholder="Jabatan"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy || !canSubmit}
                  className="mt-8 w-full rounded-full bg-black/90 px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-black disabled:opacity-50"
                >
                  {busy ? "Saving..." : isEdit ? "Save changes" : "Create employee"}
                </button>
              </form>
            </Motion.div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default EmployeeFormPage;
