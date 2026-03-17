import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Pencil,
  Check,
  X,
  Film,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./AuthContext";
import { useVideoRegistry, VIDEO_REGISTRY_META, useContentOverrides } from "./VideoRegistry";
import { VideoEmbed } from "./VideoEmbed";
import { MODULES } from "./data";
import type { Section, Module, KeyTerm } from "./data";
import * as api from "./api";

// ── Helpers ──

function findSection(videoId: string): { module: Module; section: Section } | null {
  for (const mod of MODULES) {
    const section = mod.sections.find((s) => s.videoId === videoId);
    if (section) return { module: mod, section };
  }
  return null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Main Component ──

export function ContentReviewQueue() {
  const { accessToken } = useAuth();
  const { registry, refresh: refreshRegistry } = useVideoRegistry();
  const { overrides, refresh: refreshOverrides } = useContentOverrides();
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editingUrl, setEditingUrl] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editingText, setEditingText] = useState<string | null>(null);
  const [textDraft, setTextDraft] = useState<{ content: string[]; keyTerms: KeyTerm[] }>({ content: [], keyTerms: [] });
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<Record<string, string>>({});

  // Partition registry into pending / approved
  const pendingIds = useMemo(
    () => Object.entries(VIDEO_REGISTRY_META)
      .filter(([id]) => (registry[id]?.status ?? "not_started") === "in_review")
      .map(([id]) => id),
    [registry]
  );

  const approvedIds = useMemo(
    () => Object.entries(VIDEO_REGISTRY_META)
      .filter(([id]) => registry[id]?.status === "active")
      .map(([id]) => id),
    [registry]
  );

  const activeIds = tab === "pending" ? pendingIds : approvedIds;

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function startEditText(videoId: string) {
    const found = findSection(videoId);
    const override = overrides[videoId];
    setTextDraft({
      content: override?.content ?? found?.section.content ?? [],
      keyTerms: override?.keyTerms ?? found?.section.keyTerms ?? [],
    });
    setEditingText(videoId);
  }

  async function saveTextEdit(videoId: string) {
    if (!accessToken) return;
    setSaving(videoId + ":text");
    setError((e) => ({ ...e, [videoId]: "" }));
    try {
      await api.updateContentOverride(accessToken, videoId, {
        content: textDraft.content,
        keyTerms: textDraft.keyTerms,
      });
      await refreshOverrides();
      setEditingText(null);
    } catch (e: any) {
      setError((prev) => ({ ...prev, [videoId]: e.message ?? "Save failed" }));
    } finally {
      setSaving(null);
    }
  }

  async function handleApprove(videoId: string) {
    if (!accessToken) return;
    const url = editingUrl[videoId];
    setSaving(videoId + ":approve");
    setError((e) => ({ ...e, [videoId]: "" }));
    try {
      // Update URL first if changed
      if (url !== undefined && url !== (registry[videoId]?.url ?? "")) {
        await api.updateVideoEntry(accessToken, videoId, { url, status: "in_review" });
      }
      await api.approveVideo(accessToken, videoId, notes[videoId]);
      await refreshRegistry();
      setNotes((n) => ({ ...n, [videoId]: "" }));
    } catch (e: any) {
      setError((prev) => ({ ...prev, [videoId]: e.message ?? "Approval failed" }));
    } finally {
      setSaving(null);
    }
  }

  async function handleReject(videoId: string) {
    if (!accessToken) return;
    if (!notes[videoId]?.trim()) {
      setError((prev) => ({ ...prev, [videoId]: "Notes are required when rejecting" }));
      return;
    }
    const url = editingUrl[videoId];
    setSaving(videoId + ":reject");
    setError((e) => ({ ...e, [videoId]: "" }));
    try {
      await api.rejectVideo(accessToken, videoId, notes[videoId], url);
      await refreshRegistry();
      setNotes((n) => ({ ...n, [videoId]: "" }));
    } catch (e: any) {
      setError((prev) => ({ ...prev, [videoId]: e.message ?? "Rejection failed" }));
    } finally {
      setSaving(null);
    }
  }

  async function handleRevokeApproval(videoId: string) {
    if (!accessToken) return;
    setSaving(videoId + ":revoke");
    try {
      await api.rejectVideo(accessToken, videoId, "Approval revoked for revision", undefined);
      await refreshRegistry();
    } catch (e: any) {
      setError((prev) => ({ ...prev, [videoId]: e.message ?? "Revoke failed" }));
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#082A19" }}>Content Review Queue</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review staged videos and text content before they go live to learners.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border bg-card p-3 text-center">
          <div className="text-2xl font-bold text-amber-600">{pendingIds.length}</div>
          <div className="text-xs text-muted-foreground">Pending Review</div>
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{approvedIds.length}</div>
          <div className="text-xs text-muted-foreground">Approved</div>
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <div className="text-2xl font-bold text-foreground">{Object.keys(VIDEO_REGISTRY_META).length}</div>
          <div className="text-xs text-muted-foreground">Total Videos</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(["pending", "approved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "pending" ? `Pending Review (${pendingIds.length})` : `Approved (${approvedIds.length})`}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {activeIds.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <CheckCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            {tab === "pending" ? "No videos pending review." : "No approved videos yet."}
          </p>
        </div>
      )}

      {/* Video Cards */}
      <div className="space-y-4">
        {activeIds.map((videoId) => {
          const meta = VIDEO_REGISTRY_META[videoId];
          const entry = registry[videoId];
          const found = findSection(videoId);
          const override = overrides[videoId];
          const displayContent = override?.content ?? found?.section.content ?? [];
          const displayKeyTerms = override?.keyTerms ?? found?.section.keyTerms ?? [];
          const isOpen = expanded.has(videoId);
          const isSavingApprove = saving === videoId + ":approve";
          const isSavingReject = saving === videoId + ":reject";
          const isSavingText = saving === videoId + ":text";
          const isSavingRevoke = saving === videoId + ":revoke";
          const currentUrl = editingUrl[videoId] ?? entry?.url ?? "";
          const isEditingThisText = editingText === videoId;

          return (
            <div key={videoId} className="rounded-xl border bg-card overflow-hidden shadow-sm">
              {/* Card Header */}
              <button
                onClick={() => toggleExpand(videoId)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors text-left"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${meta.type === "lecture" ? "bg-blue-100" : "bg-purple-100"}`}>
                  {meta.type === "lecture"
                    ? <BookOpen className="w-4 h-4 text-blue-600" />
                    : <Film className="w-4 h-4 text-purple-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground">{videoId}</span>
                    {meta.module && (
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">M{meta.module}</span>
                    )}
                    {meta.phase && (
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{meta.phase}</span>
                    )}
                    {tab === "approved" && entry?.reviewedAt && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approved {formatDate(entry.reviewedAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium mt-0.5 truncate">{meta.title}</p>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>

              {/* Card Body */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t px-5 pt-5 pb-6 space-y-5">
                      {/* Two-column layout */}
                      <div className="grid lg:grid-cols-2 gap-5">
                        {/* Left: Video Player + URL */}
                        <div className="space-y-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Video</p>
                          {currentUrl && currentUrl.includes("invideo.io") ? (
                            <a
                              href={currentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors text-center p-10"
                            >
                              <Film className="w-10 h-10 text-primary/50" />
                              <span className="text-sm font-medium text-primary">Open in InVideo to Review</span>
                              <span className="text-xs text-muted-foreground">InVideo draft links cannot be embedded — click to open in a new tab</span>
                            </a>
                          ) : (
                            <VideoEmbed
                              videoId={videoId}
                              url={currentUrl || undefined}
                              title={meta.title}
                            />
                          )}
                          <div>
                            <label htmlFor={`url-${videoId}`} className="text-xs text-muted-foreground mb-1 block">Video URL</label>
                            <input
                              id={`url-${videoId}`}
                              type="url"
                              value={currentUrl}
                              onChange={(e) => setEditingUrl((prev) => ({ ...prev, [videoId]: e.target.value }))}
                              placeholder="https://vimeo.com/... or https://youtube.com/..."
                              className="w-full text-xs border rounded-md px-3 py-2 bg-background font-mono focus:ring-1 focus:ring-primary/30"
                            />
                          </div>
                          {entry?.reviewNotes && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                              <p className="text-xs text-amber-800">{entry.reviewNotes}</p>
                            </div>
                          )}
                        </div>

                        {/* Right: Text Content */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Text Content</p>
                            {found && (
                              isEditingThisText ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => saveTextEdit(videoId)}
                                    disabled={!!isSavingText}
                                    className="px-2.5 py-1 rounded text-xs bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 flex items-center gap-1"
                                  >
                                    <Check className="w-3 h-3" />
                                    {isSavingText ? "Saving…" : "Save"}
                                  </button>
                                  <button
                                    onClick={() => setEditingText(null)}
                                    className="px-2.5 py-1 rounded text-xs border hover:bg-muted"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditText(videoId)}
                                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                >
                                  <Pencil className="w-3 h-3" /> Edit
                                </button>
                              )
                            )}
                          </div>

                          {found ? (
                            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                              {/* Content bullets */}
                              <div className="space-y-2">
                                {isEditingThisText ? (
                                  <>
                                    {textDraft.content.map((bullet, i) => (
                                      <div key={i} className="flex gap-1.5">
                                        <span className="text-xs text-muted-foreground w-4 pt-1.5 shrink-0">{i + 1}.</span>
                                        <textarea
                                          value={bullet}
                                          rows={2}
                                          onChange={(e) => {
                                            const updated = [...textDraft.content];
                                            updated[i] = e.target.value;
                                            setTextDraft((d) => ({ ...d, content: updated }));
                                          }}
                                          className="flex-1 text-xs border rounded px-2 py-1.5 bg-background resize-none focus:ring-1 focus:ring-primary/30"
                                        />
                                        <button
                                          onClick={() => setTextDraft((d) => ({ ...d, content: d.content.filter((_, j) => j !== i) }))}
                                          className="self-start mt-1 p-1 rounded hover:bg-red-100 text-red-500"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      onClick={() => setTextDraft((d) => ({ ...d, content: [...d.content, ""] }))}
                                      className="text-xs text-primary hover:underline"
                                    >
                                      + Add bullet
                                    </button>
                                  </>
                                ) : (
                                  displayContent.map((text, i) => (
                                    <div key={i} className="flex gap-2 text-xs">
                                      <span className="text-muted-foreground shrink-0">{i + 1}.</span>
                                      <p className="text-foreground/80 leading-relaxed">{text}</p>
                                    </div>
                                  ))
                                )}
                              </div>

                              {/* Key Terms */}
                              {(isEditingThisText ? textDraft.keyTerms.length > 0 : displayKeyTerms.length > 0) && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Key Terms</p>
                                  <div className="space-y-1.5">
                                    {isEditingThisText ? (
                                      <>
                                        {textDraft.keyTerms.map((kt, i) => (
                                          <div key={i} className="flex gap-1.5 items-start">
                                            <div className="flex-1 space-y-1">
                                              <input
                                                value={kt.term}
                                                onChange={(e) => {
                                                  const updated = [...textDraft.keyTerms];
                                                  updated[i] = { ...updated[i], term: e.target.value };
                                                  setTextDraft((d) => ({ ...d, keyTerms: updated }));
                                                }}
                                                placeholder="Term"
                                                className="w-full text-xs border rounded px-2 py-1 bg-background font-medium focus:ring-1 focus:ring-primary/30"
                                              />
                                              <input
                                                value={kt.definition}
                                                onChange={(e) => {
                                                  const updated = [...textDraft.keyTerms];
                                                  updated[i] = { ...updated[i], definition: e.target.value };
                                                  setTextDraft((d) => ({ ...d, keyTerms: updated }));
                                                }}
                                                placeholder="Definition"
                                                className="w-full text-xs border rounded px-2 py-1 bg-background focus:ring-1 focus:ring-primary/30"
                                              />
                                            </div>
                                            <button
                                              onClick={() => setTextDraft((d) => ({ ...d, keyTerms: d.keyTerms.filter((_, j) => j !== i) }))}
                                              className="mt-1 p-1 rounded hover:bg-red-100 text-red-500"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ))}
                                        <button
                                          onClick={() => setTextDraft((d) => ({ ...d, keyTerms: [...d.keyTerms, { term: "", definition: "" }] }))}
                                          className="text-xs text-primary hover:underline"
                                        >
                                          + Add term
                                        </button>
                                      </>
                                    ) : (
                                      displayKeyTerms.map((kt) => (
                                        <div key={kt.term} className="text-xs border rounded p-2 bg-muted/50">
                                          <span className="font-medium text-primary">{kt.term}:</span>{" "}
                                          <span className="text-muted-foreground">{kt.definition}</span>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              )}

                              {override?.updatedAt && (
                                <p className="text-[10px] text-muted-foreground">
                                  Text overridden {formatDate(override.updatedAt)}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              No section text linked to this video ID.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Review Notes + Actions (pending tab only) */}
                      {tab === "pending" && (
                        <div className="space-y-3 border-t pt-4">
                          <div>
                            <label htmlFor={`notes-${videoId}`} className="text-xs text-muted-foreground mb-1 block">
                              Review Notes <span className="italic">(required for rejection)</span>
                            </label>
                            <textarea
                              id={`notes-${videoId}`}
                              value={notes[videoId] ?? ""}
                              onChange={(e) => setNotes((n) => ({ ...n, [videoId]: e.target.value }))}
                              rows={2}
                              placeholder="Add notes or corrections for this video…"
                              className="w-full text-sm border rounded-lg px-3 py-2 bg-background resize-none focus:ring-1 focus:ring-primary/30"
                            />
                          </div>

                          {error[videoId] && (
                            <div className="flex items-center gap-1.5 text-xs text-red-600">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              {error[videoId]}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(videoId)}
                              disabled={isSavingApprove || isSavingReject}
                              className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              {isSavingApprove ? "Approving…" : "Approve & Publish"}
                            </button>
                            <button
                              onClick={() => handleReject(videoId)}
                              disabled={isSavingApprove || isSavingReject}
                              className="flex-1 py-2 px-4 rounded-lg text-sm font-medium border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              {isSavingReject ? "Rejecting…" : "Reject & Send Back"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Approved tab — show review metadata + revoke */}
                      {tab === "approved" && (
                        <div className="border-t pt-4 flex items-center justify-between">
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            {entry?.reviewedAt && <p><Clock className="w-3 h-3 inline mr-1" />Approved {formatDate(entry.reviewedAt)}</p>}
                            {entry?.reviewNotes && <p className="italic">"{entry.reviewNotes}"</p>}
                          </div>
                          <button
                            onClick={() => handleRevokeApproval(videoId)}
                            disabled={saving === videoId + ":revoke"}
                            className="text-xs text-muted-foreground hover:text-foreground border rounded px-3 py-1.5 hover:bg-muted transition-colors disabled:opacity-50"
                          >
                            {isSavingRevoke ? "Revoking…" : "Revoke Approval"}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
