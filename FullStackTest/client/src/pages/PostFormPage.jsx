import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { api } from "../lib/api";
import { useAuth } from "../context/useAuth";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { Loader3D } from "../components/Loader3D";

function PostFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [authorId, setAuthorId] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    let alive = true;
    setLoading(true);
    api
      .get(`/posts/${id}`)
      .then((res) => {
        if (!alive) return;
        setTitle(res.data.post.title || "");
        setContent(res.data.post.content || "");
        setCategory(res.data.post.category || "");
        setAuthorId(res.data.post.author?._id || "");
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        const message = err?.response?.data?.message || "Server error";
        setError(message);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id, isEdit]);

  const canEdit = !isEdit || (authorId && user?._id && String(authorId) === String(user._id));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const t = title.trim();
    const c = content.trim();
    const cat = category.trim();
    if (!t || !c) {
      setError("Field required");
      return;
    }
    setBusy(true);

    const formData = new FormData();
    formData.append("title", t);
    formData.append("content", c);
    formData.append("category", cat);
    if (file) {
      formData.append("image", file);
    }

    try {
      if (isEdit) {
        const { data } = await api.put(`/posts/${id}`, formData);
        navigate(`/posts/${data.post._id}`);
      } else {
        const { data } = await api.post("/posts", formData);
        navigate(`/posts/${data.post._id}`);
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  if (!canEdit) {
    return (
      <Container>
        <div className="py-12">
          <div className="surface rounded-3xl p-8">
            <Alert>Unauthorized</Alert>
          </div>
        </div>
      </Container>
    );
  }

  if (loading) {
    return <Loader3D loading={true} />;
  }

  return (
    <Container>
      <Loader3D loading={busy} />
      <div className="py-16">
        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.6 }}
          className="mx-auto max-w-2xl [perspective:1200px]"
        >
          <div className="card-3d surface rounded-[36px] p-10">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                {isEdit ? "Edit post" : "New post"}
              </p>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900">
                {isEdit ? "Refine your narrative." : "Compose a new story."}
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Markdown supported. Title and content are required.
              </p>
            </div>

            {error ? (
              <div className="mt-5">
                <Alert>{error}</Alert>
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-[0.24em] text-slate-500">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-3 w-full rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-black/10"
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.24em] text-slate-500">Category (optional)</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-3 w-full rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-black/10"
                  placeholder="Tech, Lifestyle, Travel"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.24em] text-slate-500">Cover Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="mt-3 w-full rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-black/10"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.24em] text-slate-500">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  className="mt-3 w-full rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-black/10"
                  placeholder="Write in Markdown..."
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-black disabled:opacity-50"
                >
                  {isEdit ? "Save changes" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                  disabled={busy}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Motion.div>
      </div>
    </Container>
  );
}

export default PostFormPage;
