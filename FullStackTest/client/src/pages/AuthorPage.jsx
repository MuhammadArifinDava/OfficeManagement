import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { Loader3D } from "../components/Loader3D";
import { getPostImageUrl, getUserAvatarUrl } from "../utils/imageUtils";

function AuthorPage() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: "", user: null, posts: [] });

  const avatarUrl = useMemo(() => getUserAvatarUrl(state.user), [state.user]);

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: "", user: null, posts: [] });
    api
      .get(`/users/${id}`)
      .then((res) => {
        if (!alive) return;
        setState({ loading: false, error: "", user: res.data.user, posts: res.data.posts || [] });
      })
      .catch((err) => {
        if (!alive) return;
        const message = err?.response?.data?.message || "Server error";
        setState({ loading: false, error: message, user: null, posts: [] });
      });
    return () => {
      alive = false;
    };
  }, [id]);

  if (state.loading) {
    return <Loader3D loading={true} />;
  }

  if (state.error) {
    return (
      <Container>
        <div className="py-16">
          <Alert>{state.error}</Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-md">
              <div className="h-full w-full overflow-hidden rounded-2xl bg-white">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-700 font-bold">
                    {(state.user?.username || "U").slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Author</div>
              <div className="text-lg font-semibold text-slate-900">
                {state.user?.name || state.user?.username || "-"}
              </div>
              <div className="text-sm text-slate-600">@{state.user?.username}</div>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-lg font-semibold">Articles by {state.user?.username}</h2>

        <div className="mt-4">
          {state.posts.length === 0 ? (
            <div className="surface rounded-2xl p-6 text-sm text-slate-600">
              This author hasn’t created any posts yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {state.posts.map((p) => (
                <Tilt
                  key={p._id}
                  className="h-full"
                  perspective={1400}
                  glareEnable={true}
                  glareMaxOpacity={0.45}
                  scale={1.01}
                  gyroscope={false}
                  transitionSpeed={1500}
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                >
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl">
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={getPostImageUrl(p)}
                        alt={p.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                    </div>
                    
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-block rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                          {p.category || "Post"}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold leading-snug text-slate-900 line-clamp-2">
                        {p.title}
                      </h3>
                      
                      <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                        <span>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}</span>
                      </div>

                      <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100">
                        <Link
                          to={`/posts/${p._id}`}
                          className="flex-1 rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-black"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </Tilt>
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default AuthorPage;