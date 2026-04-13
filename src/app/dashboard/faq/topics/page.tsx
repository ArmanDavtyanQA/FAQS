"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { dbListFaqsByUserIdLight } from "@/lib/faq/supabase-faq";
import {
  dbDeleteTopic,
  dbInsertTopic,
  dbListTopicsByUserId,
  dbUpdateTopic,
} from "@/lib/faq/supabase-topics";
import type { FAQ, Topic } from "@/lib/faq/types";
import DashboardAreaHeader from "@/components/DashboardAreaHeader";
import DashboardSpinner from "@/components/DashboardSpinner";

const field =
  "w-full rounded-xl border border-black/[0.08] bg-white/75 px-4 py-2.5 text-sm text-ui-strong shadow-sm placeholder:text-ui-subtle focus:border-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a]/15";

const btnSm =
  "btn-ui btn-ui-secondary rounded-xl px-3 py-1.5 text-[10px] disabled:pointer-events-none disabled:opacity-45";

const btnDanger =
  "btn-ui btn-ui-danger rounded-xl px-3 py-1.5 text-[10px] disabled:pointer-events-none disabled:opacity-45";

export default function ManageTopicsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId")?.trim() || null;
  const modalChannel = searchParams.get("modalChannel")?.trim() || null;
  const prevPathRef = useRef<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  /** When set, edit-topic modal is open for this id */
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [confirmDiscardEditOpen, setConfirmDiscardEditOpen] = useState(false);
  const [topicPendingDelete, setTopicPendingDelete] = useState<Topic | null>(
    null,
  );
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [createSaving, setCreateSaving] = useState(false);
  const [confirmDiscardCreateOpen, setConfirmDiscardCreateOpen] =
    useState(false);
  const isInIframe = typeof window !== "undefined" && window.self !== window.top;

  function notifyParent(type: "faq-topics:done" | "faq-topics:updated") {
    if (typeof window === "undefined") return;
    if (window.self === window.top) return;
    window.parent.postMessage(
      { type, channel: modalChannel },
      window.location.origin,
    );
  }

  function navigateParent(href: string) {
    if (typeof window === "undefined") return;
    if (window.self === window.top) {
      router.push(href);
      return;
    }
    window.parent.postMessage(
      { type: "faq-topics:navigate", href, channel: modalChannel },
      window.location.origin,
    );
  }

  function closeCreateModal() {
    setCreateOpen(false);
    setNewTopicName("");
    setConfirmDiscardCreateOpen(false);
    setCreateSaving(false);
  }

  function requestCloseCreateModal() {
    if (newTopicName.trim()) {
      setConfirmDiscardCreateOpen(true);
      return;
    }
    closeCreateModal();
  }

  function closeEditModal() {
    setEditingTopicId(null);
    setConfirmDiscardEditOpen(false);
    setEditTitle("");
  }

  function requestCloseEditModal() {
    if (!selectedTopic) {
      closeEditModal();
      return;
    }
    if (editTitle.trim() !== selectedTopic.title) {
      setConfirmDiscardEditOpen(true);
      return;
    }
    closeEditModal();
  }

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      const params = new URLSearchParams();
      if (projectId) params.set("projectId", projectId);
      if (modalChannel) params.set("modalChannel", modalChannel);
      const scopedRedirect = params.toString()
        ? `/dashboard/faq/topics?${params.toString()}`
        : "/dashboard/faq/topics";
      router.replace(`/auth?redirectTo=${encodeURIComponent(scopedRedirect)}`);
      return;
    }
    setError(null);
    try {
      const [topicList, faqList] = await Promise.all([
        dbListTopicsByUserId(supabase, user.id, projectId ?? undefined),
        dbListFaqsByUserIdLight(supabase, user.id, projectId ?? undefined),
      ]);
      setTopics(topicList);
      setFaqs(faqList);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load topics");
      setTopics([]);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname ?? null;
    if (
      pathname === "/dashboard/faq/topics" &&
      prev != null &&
      prev !== pathname
    ) {
      void load();
    }
  }, [pathname, load]);

  const selectedTopic = useMemo(
    () => topics.find((t) => t.id === editingTopicId) ?? null,
    [topics, editingTopicId],
  );

  useEffect(() => {
    if (selectedTopic) setEditTitle(selectedTopic.title);
    else setEditTitle("");
  }, [selectedTopic]);

  const countForTopic = useCallback(
    (topicId: string) =>
      faqs.filter((f) => (f.topicIds ?? []).includes(topicId)).length,
    [faqs],
  );

  const faqsForSelected = useMemo(() => {
    if (!editingTopicId) return [];
    return faqs.filter((f) => (f.topicIds ?? []).includes(editingTopicId));
  }, [faqs, editingTopicId]);

  useEffect(() => {
    if (
      editingTopicId &&
      !topics.some((t) => t.id === editingTopicId)
    ) {
      setEditingTopicId(null);
      setConfirmDiscardEditOpen(false);
      setEditTitle("");
    }
  }, [editingTopicId, topics]);

  async function saveTitle() {
    if (!selectedTopic) return;
    const t = editTitle.trim();
    if (!t || t === selectedTopic.title) return;
    setBusyId(selectedTopic.id);
    setError(null);
    try {
      await dbUpdateTopic(supabase, selectedTopic.id, { title: t });
      setTopics((prev) =>
        prev.map((x) => (x.id === selectedTopic.id ? { ...x, title: t } : x)),
      );
      notifyParent("faq-topics:updated");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusyId(null);
    }
  }

  async function setTopicActive(topic: Topic, isActive: boolean) {
    if (topic.isActive === isActive) return;
    if (isActive && countForTopic(topic.id) === 0) {
      setError(
        "Add at least one question (with answers) linked to this topic before activating.",
      );
      return;
    }
    setBusyId(topic.id);
    setError(null);
    try {
      await dbUpdateTopic(supabase, topic.id, { isActive });
      setTopics((prev) =>
        prev.map((x) =>
          x.id === topic.id ? { ...x, isActive } : x,
        ),
      );
      notifyParent("faq-topics:updated");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!topicPendingDelete) return;
    setDeleteBusy(true);
    setError(null);
    try {
      await dbDeleteTopic(supabase, topicPendingDelete.id);
      setTopics((prev) => prev.filter((x) => x.id !== topicPendingDelete.id));
      if (editingTopicId === topicPendingDelete.id) closeEditModal();
      setTopicPendingDelete(null);
      notifyParent("faq-topics:updated");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleteBusy(false);
    }
  }

  async function saveNewTopic() {
    const title = newTopicName.trim();
    if (!title) return;
    setCreateSaving(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in.");
        return;
      }
      const row = await dbInsertTopic(supabase, {
        userId: user.id,
        projectId,
        title,
        isActive: false,
      });
      setTopics((prev) =>
        [...prev, row].sort((a, b) => a.title.localeCompare(b.title)),
      );
      setEditingTopicId(row.id);
      closeCreateModal();
      notifyParent("faq-topics:updated");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create topic");
    } finally {
      setCreateSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="-mx-4 min-h-[calc(100dvh-6rem)] bg-transparent text-[#0a0a0a] sm:-mx-6 lg:-mx-10">
        <DashboardAreaHeader>
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#0a0a0a]">
            Topics
          </span>
          {isInIframe ? (
            <button
              type="button"
              onClick={() => notifyParent("faq-topics:done")}
              className="btn-ui btn-ui-ghost h-9 rounded-xl px-3 text-[11px]"
            >
              Done
            </button>
          ) : (
            <Link
              href={projectId ? `/project/${projectId}/dashboard` : "/studio"}
              className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#6b6b6b] hover:text-[#0a0a0a]"
            >
              ← Dashboard
            </Link>
          )}
        </DashboardAreaHeader>
        <main className="mx-auto flex max-w-5xl items-center justify-center px-5 py-24">
          <DashboardSpinner label="Loading topics…" />
        </main>
      </div>
    );
  }

  return (
    <div className="-mx-4 min-h-[calc(100dvh-6rem)] bg-transparent text-[#0a0a0a] sm:-mx-6 lg:-mx-10">
      <DashboardAreaHeader>
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#0a0a0a]">
          Topics
        </span>
        {isInIframe ? (
          <button
            type="button"
            onClick={() => notifyParent("faq-topics:done")}
            className="btn-ui btn-ui-ghost h-9 rounded-xl px-3 text-[11px]"
          >
            Done
          </button>
        ) : (
          <Link
            href={projectId ? `/project/${projectId}/dashboard` : "/studio"}
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#6b6b6b] hover:text-[#0a0a0a]"
          >
            ← Dashboard
          </Link>
        )}
      </DashboardAreaHeader>

      <main className="mx-auto max-w-5xl px-5 py-14">
        <p className="label-caps mb-4">Organize</p>
        <h1 className="text-3xl font-normal tracking-tight text-[#0a0a0a]">
          Manage topics
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
          New topics start <strong className="font-medium text-[#0a0a0a]">inactive</strong> until
          at least one question is linked. Then you can activate for your public
          help center. Deactivate or delete anytime (questions stay; links to the
          topic are removed).
        </p>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setCreateOpen(true);
            }}
            className="interactive-smooth inline-flex h-10 items-center justify-center rounded-2xl border border-[#e8e6e3] bg-surface px-6 text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a] shadow-sm shadow-black/[0.06] transition-colors hover:bg-surface-muted hover:border-[#d6d3d1]"
          >
            Add topic
          </button>
        </div>

        {error && (
          <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            {error}
          </p>
        )}

        {topics.length > 0 && (
          <p className="mt-8 text-sm text-[#6b6b6b]">
            Use the Edit button to open topic details.
          </p>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e8e6e3] bg-surface shadow-sm">
          <div className="max-h-[52dvh] overflow-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="sticky top-0 z-[1]">
                <tr className="border-b border-[#e8e6e3] bg-surface-muted text-[10px] font-medium uppercase tracking-widest text-[#6b6b6b]">
                  <th className="px-4 py-3 font-medium">Topic</th>
                  <th className="px-4 py-3 font-medium">Questions</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topics.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-[#6b6b6b]"
                    >
                      No topics yet. Use <strong className="font-medium text-[#0a0a0a]">Add topic</strong>{" "}
                      above, or add topics while creating a FAQ.
                    </td>
                  </tr>
                ) : (
                  topics.map((topic) => {
                    const busy = busyId === topic.id;
                    const qCount = countForTopic(topic.id);
                    const canActivate = qCount > 0;
                    return (
                      <tr
                        key={topic.id}
                        className="border-b border-[#e8e6e3] transition-colors last:border-b-0 hover:bg-surface-muted/50"
                      >
                        <td className="px-4 py-3 font-medium text-[#0a0a0a]">
                          {topic.title}
                        </td>
                        <td className="px-4 py-3 text-[#6b6b6b]">
                          {countForTopic(topic.id)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                              topic.isActive
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-stone-200 text-stone-600"
                            }`}
                          >
                            {topic.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div
                            className="flex flex-wrap items-center justify-end gap-2"
                          >
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => setEditingTopicId(topic.id)}
                              className={btnSm}
                            >
                              Edit
                            </button>
                            {topic.isActive ? (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => void setTopicActive(topic, false)}
                                className={btnSm}
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={busy || !canActivate}
                                title={
                                  canActivate
                                    ? undefined
                                    : "Link at least one question to this topic before activating."
                                }
                                onClick={() => void setTopicActive(topic, true)}
                                className={btnSm}
                              >
                                Activate
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => {
                                if (editingTopicId === topic.id)
                                  closeEditModal();
                                setTopicPendingDelete(topic);
                              }}
                              className={btnDanger}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {selectedTopic && editingTopicId && (
        <div className="fixed inset-0 z-[102] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            disabled={busyId === selectedTopic.id}
            onClick={() => {
              if (busyId === selectedTopic.id) return;
              if (confirmDiscardEditOpen) {
                setConfirmDiscardEditOpen(false);
                return;
              }
              requestCloseEditModal();
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-topic-heading"
            className="relative z-[1] flex max-h-[min(90dvh,760px)] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-[#e8e6e3] bg-surface shadow-[0_20px_80px_rgba(0,0,0,0.1)]"
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#e8e6e3] px-6 py-4">
              <div className="min-w-0">
                <p className="label-caps text-[#6b6b6b]">Edit topic</p>
                <h2
                  id="edit-topic-heading"
                  className="mt-1 truncate text-xl font-normal tracking-tight text-[#0a0a0a]"
                >
                  {selectedTopic.title}
                </h2>
              </div>
              <button
                type="button"
                disabled={busyId === selectedTopic.id}
                onClick={() => requestCloseEditModal()}
                className="interactive-smooth -mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#6b6b6b] transition-colors hover:bg-surface-muted hover:text-[#0a0a0a] disabled:opacity-45"
                aria-label="Close"
              >
                <span className="text-xl leading-none" aria-hidden>
                  ×
                </span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="edit-topic-name"
                    className="label-caps block text-[#6b6b6b]"
                  >
                    Topic name
                  </label>
                  <input
                    id="edit-topic-name"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={`${field} mt-2`}
                    disabled={busyId === selectedTopic.id}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[#6b6b6b]">Visibility</span>
                    {selectedTopic.isActive ? (
                      <button
                        type="button"
                        disabled={busyId === selectedTopic.id}
                        onClick={() =>
                          void setTopicActive(selectedTopic, false)
                        }
                        className={btnSm}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={
                          busyId === selectedTopic.id ||
                          countForTopic(selectedTopic.id) === 0
                        }
                        title={
                          countForTopic(selectedTopic.id) > 0
                            ? undefined
                            : "Add a question linked to this topic before activating."
                        }
                        onClick={() => void setTopicActive(selectedTopic, true)}
                        className={btnSm}
                      >
                        Activate
                      </button>
                    )}
                  </div>
                  {!selectedTopic.isActive &&
                    countForTopic(selectedTopic.id) === 0 && (
                      <p className="w-full text-xs leading-relaxed text-[#6b6b6b]">
                        Add a question below to enable activation for your public
                        FAQ.
                      </p>
                    )}
                </div>
              </div>

              <div className="mt-8 border-t border-[#e8e6e3] pt-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="label-caps text-[#6b6b6b]">Questions</p>
                    <p className="mt-1 text-sm text-[#6b6b6b]">
                      FAQs linked to this topic. Add a new question with this
                      topic pre-selected.
                    </p>
                  </div>
                  {isInIframe ? (
                    <button
                      type="button"
                      onClick={() =>
                        navigateParent(
                          `/dashboard/faq/create?topic=${selectedTopic.id}${projectId ? `&projectId=${encodeURIComponent(projectId)}` : ""}`,
                        )
                      }
                      className="interactive-smooth inline-flex h-10 items-center justify-center rounded-2xl border border-[#e8e6e3] bg-surface px-6 text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a] shadow-sm shadow-black/[0.06] transition-colors hover:bg-surface-muted"
                    >
                      Add question
                    </button>
                  ) : (
                    <Link
                      href={`/dashboard/faq/create?topic=${selectedTopic.id}${projectId ? `&projectId=${encodeURIComponent(projectId)}` : ""}`}
                      className="interactive-smooth inline-flex h-10 items-center justify-center rounded-2xl border border-[#e8e6e3] bg-surface px-6 text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a] shadow-sm shadow-black/[0.06] transition-colors hover:bg-surface-muted"
                    >
                      Add question
                    </Link>
                  )}
                </div>

                {faqsForSelected.length === 0 ? (
                  <p className="mt-6 text-sm text-[#6b6b6b]">
                    No questions linked yet.
                  </p>
                ) : (
                  <ul className="mt-6 space-y-2">
                    {faqsForSelected.map((faq) => (
                      <li
                        key={faq.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e8e6e3] bg-surface-muted px-4 py-3"
                      >
                        <span className="text-sm text-[#0a0a0a]">
                          {faq.title}
                        </span>
                        {isInIframe ? (
                          <button
                            type="button"
                            onClick={() =>
                              navigateParent(
                                `/dashboard/faq/${faq.id}${projectId ? `?projectId=${encodeURIComponent(projectId)}` : ""}`,
                              )
                            }
                            className="text-[10px] font-medium uppercase tracking-widest text-[#6b6b6b] underline hover:text-[#0a0a0a]"
                          >
                            Edit FAQ
                          </button>
                        ) : (
                          <Link
                            href={`/dashboard/faq/${faq.id}${projectId ? `?projectId=${encodeURIComponent(projectId)}` : ""}`}
                            className="text-[10px] font-medium uppercase tracking-widest text-[#6b6b6b] underline hover:text-[#0a0a0a]"
                          >
                            Edit FAQ
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-[#e8e6e3] bg-surface-muted px-6 py-4">
              <div className="flex w-full flex-wrap justify-end gap-3">
                <button
                  type="button"
                  disabled={busyId === selectedTopic.id}
                  onClick={() => requestCloseEditModal()}
                  className="interactive-smooth inline-flex h-10 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-4 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-colors hover:bg-surface disabled:opacity-45"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={
                    busyId === selectedTopic.id ||
                    !editTitle.trim() ||
                    editTitle.trim() === selectedTopic.title
                  }
                  onClick={() => void saveTitle()}
                  className="interactive-smooth inline-flex h-10 items-center justify-center rounded-xl border border-[#e8e6e3] bg-[#0a0a0a] px-5 text-[11px] font-medium uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-[#262626] disabled:opacity-45"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDiscardEditOpen && selectedTopic && (
        <div className="fixed inset-0 z-[106] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/35 backdrop-blur-sm"
            onClick={() => setConfirmDiscardEditOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="discard-edit-heading"
            className="relative z-[1] w-full max-w-md overflow-hidden rounded-3xl border border-[#e8e6e3] bg-surface shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
          >
            <div className="p-6">
              <p className="label-caps text-[#6b6b6b]">Discard changes?</p>
              <h3
                id="discard-edit-heading"
                className="mt-2 text-lg font-semibold tracking-tight text-[#0a0a0a]"
              >
                Close without saving the topic name?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
                You changed the name but didn’t save. If you continue, those
                edits will be lost.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDiscardEditOpen(false)}
                  className="interactive-smooth inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-4 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-colors hover:bg-surface-muted"
                >
                  Keep editing
                </button>
                <button
                  type="button"
                  onClick={() => closeEditModal()}
                  className="interactive-smooth inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-4 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-colors hover:bg-surface-muted"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {createOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            disabled={createSaving}
            onClick={() => {
              if (createSaving) return;
              if (confirmDiscardCreateOpen) {
                setConfirmDiscardCreateOpen(false);
                return;
              }
              requestCloseCreateModal();
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-topic-heading"
            className="relative z-[1] w-full max-w-md overflow-hidden rounded-3xl border border-[#e8e6e3] bg-surface shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
          >
            <div className="border-b border-[#e8e6e3] px-6 py-4">
              <h2
                id="create-topic-heading"
                className="text-lg font-semibold tracking-tight text-[#0a0a0a]"
              >
                Create topic
              </h2>
            </div>
            <div className="px-6 py-5">
              <label
                htmlFor="new-topic-name"
                className="label-caps block text-[#6b6b6b]"
              >
                Topic name
              </label>
              <input
                id="new-topic-name"
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                disabled={createSaving}
                placeholder="e.g. Shipping, Billing"
                className={`${field} mt-2`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTopicName.trim() && !createSaving) {
                    e.preventDefault();
                    void saveNewTopic();
                  }
                }}
              />
              <p className="mt-3 text-xs leading-relaxed text-[#6b6b6b]">
                The topic is created as <strong className="font-medium text-[#0a0a0a]">inactive</strong>.
                Link at least one question, then activate to show it on your public FAQ.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 border-t border-[#e8e6e3] bg-surface-muted px-6 py-4">
              <button
                type="button"
                disabled={createSaving}
                onClick={() => {
                  if (createSaving) return;
                  requestCloseCreateModal();
                }}
                className="interactive-smooth inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-4 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-colors hover:bg-surface disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={createSaving || !newTopicName.trim()}
                onClick={() => void saveNewTopic()}
                className="interactive-smooth inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[#e8e6e3] bg-[#0a0a0a] px-4 text-[11px] font-light uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-[#262626] disabled:opacity-45"
              >
                {createSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDiscardCreateOpen && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setConfirmDiscardCreateOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="discard-create-heading"
            className="relative z-[1] w-full max-w-md overflow-hidden rounded-3xl border border-[#e8e6e3] bg-surface shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
          >
            <div className="p-6">
              <p className="label-caps text-[#6b6b6b]">Discard changes?</p>
              <h3
                id="discard-create-heading"
                className="mt-2 text-lg font-semibold tracking-tight text-[#0a0a0a]"
              >
                Close without saving?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
                You have text in the topic name field. If you continue, it will
                be lost.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDiscardCreateOpen(false)}
                  className="interactive-smooth inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-4 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-colors hover:bg-surface-muted"
                >
                  Keep editing
                </button>
                <button
                  type="button"
                  onClick={() => closeCreateModal()}
                  className="interactive-smooth inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-4 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-colors hover:bg-surface-muted"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {topicPendingDelete && (
        <div className="fixed inset-0 z-[108] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => !deleteBusy && setTopicPendingDelete(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-topic-title"
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#e8e6e3] bg-surface shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
          >
            <div className="p-6">
              <p className="label-caps text-[#6b6b6b]">Delete topic</p>
              <h3
                id="delete-topic-title"
                className="mt-2 text-lg font-semibold tracking-tight text-[#0a0a0a]"
              >
                Remove “{topicPendingDelete.title}”?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
                This cannot be undone. Questions are not deleted; they are only
                unlinked from this topic.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={deleteBusy}
                  onClick={() => setTopicPendingDelete(null)}
                  className="interactive-smooth inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[#e8e6e3] bg-surface px-4 text-[11px] font-light uppercase tracking-widest text-[#0a0a0a] shadow-sm transition-colors hover:bg-surface-muted disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteBusy}
                  onClick={() => void confirmDelete()}
                  className="interactive-smooth inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-[11px] font-light uppercase tracking-widest text-red-900 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  {deleteBusy ? "Deleting…" : "Delete topic"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
