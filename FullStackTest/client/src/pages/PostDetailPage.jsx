import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "../lib/api";
import { useAuth } from "../context/useAuth";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { Loader3D } from "../components/Loader3D";
import { getPostImageUrl, getUserAvatarUrl } from "../utils/imageUtils";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [postState, setPostState] = useState({ loading: true, error: "", post: null });
  const [commentsState, setCommentsState] = useState({ loading: true, error: "", items: [] });
  const [commentInput, setCommentInput] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);
  const [commentEditId, setCommentEditId] = useState("");
  const [commentEditText, setCommentEditText] = useState("");

  const isOwner = useMemo(() => {
    if (!user || !postState.post?.author?._id) return false;
    return String(user._id) === String(postState.post.author._id);
  }, [user, postState.post]);

  const imageUrl = useMemo(() => {
    return getPostImageUrl(postState.post);
  }, [postState.post]);

  const loadPost = useCallback(() => {
    setPostState((s) => ({ ...s, loading: true, error: "" }));
    return api
      .get(`/posts/${id}`)
      .then((res) => setPostState({ loading: false, error: "", post: res.data.post }))
      .catch((err) => {
        const message = err?.response?.data?.message || "Server error";
        setPostState({ loading: false, error: message, post: null });
      });
  }, [id]);

  const loadComments = useCallback(() => {
    setCommentsState((s) => ({ ...s, loading: true, error: "" }));
    return api
      .get(`/posts/${id}/comments`)
      .then((res) => setCommentsState({ loading: false, error: "", items: res.data.items || [] }))
      .catch((err) => {
        const message = err?.response?.data?.message || "Server error";
        setCommentsState({ loading: false, error: message, items: [] });
      });
  }, [id]);

  useEffect(() => {
    let alive = true;
    Promise.all([loadPost(), loadComments()]).finally(() => {
      if (!alive) return;
    });
    return () => {
      alive = false;
    };
  }, [loadComments, loadPost]);

  const onDeletePost = async () => {
    const ok = window.confirm("Are you sure you want to delete this post?");
    if (!ok) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate("/");
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setPostState((s) => ({ ...s, error: message }));
    }
  };

  const onCreateComment = async (e) => {
    e.preventDefault();
    const content = commentInput.trim();
    if (!content) return;
    setCommentBusy(true);
    try {
      await api.post(`/posts/${id}/comments`, { content });
      setCommentInput("");
      await loadComments();
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setCommentsState((s) => ({ ...s, error: message }));
    } finally {
      setCommentBusy(false);
    }
  };

  const startEditComment = (comment) => {
    setCommentEditId(comment._id);
    setCommentEditText(comment.content || "");
  };

  const cancelEditComment = () => {
    setCommentEditId("");
    setCommentEditText("");
  };

  const onUpdateComment = async (e) => {
    e.preventDefault();
    const content = commentEditText.trim();
    if (!content) return;

    try {
      await api.put(`/comments/${commentEditId}`, { content });
      setCommentEditId("");
      setCommentEditText("");
      await loadComments();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update comment");
    }
  };

  const onDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      await loadComments();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete comment");
    }
  };

  if (postState.loading) return <Loader3D loading={true} />;
  if (postState.error)
    return (
      <Container>
        <div className="py-8">
          <Alert>{postState.error}</Alert>
        </div>
      </Container>
    );
  if (!postState.post)
    return (
      <Container>
        <div className="py-8">
          <Alert>Post not found</Alert>
        </div>
      </Container>
    );

  const { post } = postState;

  return (
    <div className="bg-transparent pb-20">
      <div className="h-[58vh] w-full overflow-hidden bg-slate-900 relative">
        <div className="absolute inset-0 bg-black/20 mix-blend-overlay z-10" />
        <img
          src={imageUrl}
          alt={post.title}
          className="h-full w-full object-cover opacity-90 blur-[1px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20" />
        <div className="absolute bottom-0 left-0 right-0 p-10 z-30">
          <Container>
            <Motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.6 }}
              className="mx-auto max-w-4xl"
            >
              <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80 ring-1 ring-inset ring-white/25 mb-6">
                {post.category ? post.category : "Article"}
              </span>
              <h1 className="font-display text-4xl font-semibold text-white sm:text-6xl leading-tight mb-6">
                {post.title}
              </h1>
            </Motion.div>
          </Container>
        </div>
      </div>

      <Container>
        <div className="glass-panel mx-auto max-w-4xl -mt-14 relative z-40 p-10 rounded-[36px] border border-white/60">
          <div className="flex flex-col gap-6 border-b border-slate-200/50 pb-8 mb-8 sm:flex-row sm:items-center sm:justify-between">
            <Link 
              to={post.author?._id ? `/author/${post.author._id}` : "#"}
              className="flex items-center gap-4 hover:opacity-80 transition-opacity"
              onClick={(e) => {
                if (!post.author?._id) e.preventDefault();
              }}
            >
              {getUserAvatarUrl(post.author) ? (
                <img
                  src={getUserAvatarUrl(post.author)}
                  alt={post.author?.username}
                  className="h-12 w-12 rounded-full object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
                  {post.author?.username?.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-900 text-lg">{post.author?.username}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{formatDate(post.createdAt)}</p>
              </div>
            </Link>
            {isOwner ? (
              <div className="flex items-center gap-3">
                <Link
                  to={`/edit/${post._id}`}
                  className="rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Edit Post
                </Link>
                <button
                  onClick={onDeletePost}
                  className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-black/90"
                >
                  Delete Post
                </button>
              </div>
            ) : null}
          </div>

          <article className="prose prose-lg prose-stone max-w-none text-slate-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </article>

          <div className="mt-16 border-t border-slate-200/50 pt-10">
            <h2 className="font-display text-3xl font-semibold text-slate-900 mb-8 flex items-center gap-3">
              <span className="h-7 w-1 rounded-full bg-slate-900" />
              Comments ({commentsState.items.length})
            </h2>

            {commentsState.error ? (
              <div className="mb-6">
                <Alert>{commentsState.error}</Alert>
              </div>
            ) : null}

            {isAuthenticated && user ? (
              <form onSubmit={onCreateComment} className="mb-12 flex gap-4 items-start bg-white/80 p-6 rounded-[28px] border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                {getUserAvatarUrl(user) ? (
                  <img
                    src={getUserAvatarUrl(user)}
                    alt={user.username}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                    {user?.username?.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="w-full rounded-[22px] border border-white/60 bg-white/90 p-4 text-sm shadow-sm ring-1 ring-inset ring-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-black/10 min-h-[110px]"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={commentBusy || !commentInput.trim()}
                      className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-black disabled:opacity-50"
                    >
                      {commentBusy ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="rounded-[28px] bg-white/80 border border-white/60 p-8 text-center mb-12">
                <p className="text-slate-600 font-medium">
                  Please{" "}
                  <Link to="/login" className="text-slate-900 font-semibold">
                    log in
                  </Link>{" "}
                  to join the discussion.
                </p>
              </div>
            )}

            {commentsState.loading ? (
              <Spinner />
            ) : (
              <div className="space-y-8">
                {commentsState.items.map((comment) => {
                  const isCommentOwner =
                    user && String(comment.author?._id) === String(user._id);
                  const isEditing = commentEditId === comment._id;

                  return (
                    <div key={comment._id} className="flex gap-4">
                      {getUserAvatarUrl(comment.author) ? (
                        <img
                          src={getUserAvatarUrl(comment.author)}
                          alt={comment.author?.username}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm flex-shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-500 font-semibold text-sm">
                          {comment.author?.username?.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-slate-900 text-sm">
                            {comment.author?.username}
                          </p>
                          <time className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                            {formatDate(comment.createdAt)}
                          </time>
                        </div>

                        {isEditing ? (
                          <form onSubmit={onUpdateComment} className="mt-2">
                            <textarea
                              value={commentEditText}
                              onChange={(e) => setCommentEditText(e.target.value)}
                              className="w-full rounded-[18px] border border-slate-200 bg-white/90 text-sm p-3"
                              rows={3}
                            />
                            <div className="mt-2 flex gap-2">
                              <button
                                type="submit"
                                className="text-xs font-semibold text-slate-900"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditComment}
                                className="text-xs font-medium text-slate-500"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="text-slate-700 text-sm leading-relaxed">
                            {comment.content}
                          </div>
                        )}

                        {isCommentOwner && !isEditing ? (
                          <div className="mt-2 flex gap-3">
                            <button
                              onClick={() => startEditComment(comment)}
                              className="text-xs font-medium text-slate-500 hover:text-slate-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDeleteComment(comment._id)}
                              className="text-xs font-medium text-slate-500 hover:text-slate-900"
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>

      <div className="fixed bottom-10 right-10 z-50">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 rounded-full bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1 hover:bg-black hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}

export default PostDetailPage;
