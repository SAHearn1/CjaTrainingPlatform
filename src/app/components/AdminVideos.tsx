import { useState, useMemo } from "react";
import { Check, Pencil, X, ExternalLink, Film, BookOpen, Clapperboard } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useVideoRegistry, VIDEO_REGISTRY_META, type VideoStatus, type VideoType } from "./VideoRegistry";
import { updateVideoEntry } from "./api";
import { VideoEmbed } from "./VideoEmbed";

const STATUS_CONFIG: Record<VideoStatus, { label: string; className: string }> = {
  not_started: { label: "Not Started", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  in_review:   { label: "In Review",   className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  ready:       { label: "Ready",       className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  active:      { label: "Active",      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

const TYPE_ICON: Record<VideoType, typeof Film> = {
  lecture:    BookOpen,
  vignette:   Film,
  simulation: Clapperboard,
};

const TYPE_LABEL: Record<VideoType, string> = {
  lecture:    "Lecture",
  vignette:   "Vignette",
  simulation: "Simulation",
};

export function AdminVideos() {
  const { accessToken } = useAuth();
  const { registry, refresh } = useVideoRegistry();

  const [filterType, setFilterType] = useState<VideoType | "all">("all");
  const [filterModule, setFilterModule] = useState<number | "all">("all");
  const [filterStatus, setFilterStatus] = useState<VideoStatus | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editStatus, setEditStatus] = useState<VideoStatus>("not_started");
  const [saving, setSaving] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const entries = useMemo(() => {
    return Object.entries(VIDEO_REGISTRY_META)
      .filter(([, meta]) => filterType === "all" || meta.type === filterType)
      .filter(([, meta]) => filterModule === "all" || meta.module === filterModule)
      .filter(([id]) => {
        if (filterStatus === "all") return true;
        const entry = registry[id];
        const status: VideoStatus = entry?.status ?? "not_started";
        return status === filterStatus;
      });
  }, [filterType, filterModule, filterStatus, registry]);

  const stats = useMemo(() => {
    const total = Object.keys(VIDEO_REGISTRY_META).length;
    const active = Object.values(registry).filter(e => e.status === "active").length;
    const ready = Object.values(registry).filter(e => e.status === "ready").length;
    const inReview = Object.values(registry).filter(e => e.status === "in_review").length;
    const notStarted = total - active - ready - inReview;
    return { total, active, ready, inReview, notStarted };
  }, [registry]);

  function startEdit(videoId: string) {
    const entry = registry[videoId];
    setEditingId(videoId);
    setEditUrl(entry?.url ?? "");
    setEditStatus(entry?.status ?? "not_started");
    setSaveError(null);
  }

  async function saveEdit() {
    if (!editingId || !accessToken) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateVideoEntry(accessToken, editingId, { url: editUrl, status: editStatus });
      await refresh();
      setEditingId(null);
    } catch (e: any) {
      setSaveError(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const modules = Array.from(new Set(Object.values(VIDEO_REGISTRY_META).map(m => m.module).filter(Boolean))) as number[];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#082A19" }}>Video Registry</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage all training video URLs. Changes go live immediately — no redeployment required.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Active", value: stats.active, color: "text-green-600" },
          { label: "Ready", value: stats.ready, color: "text-blue-600" },
          { label: "In Review", value: stats.inReview, color: "text-yellow-600" },
          { label: "Not Started", value: stats.notStarted, color: "text-gray-500" },
        ].map(s => (
          <div key={s.label} className="rounded-lg border bg-card p-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value as any)}
          className="text-sm border rounded-md px-3 py-1.5 bg-background"
        >
          <option value="all">All Types</option>
          <option value="lecture">Lectures</option>
          <option value="vignette">Vignettes</option>
          <option value="simulation">Simulations</option>
        </select>
        <select
          value={filterModule}
          onChange={e => setFilterModule(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="text-sm border rounded-md px-3 py-1.5 bg-background"
        >
          <option value="all">All Modules</option>
          {modules.map(m => <option key={m} value={m}>Module {m}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          className="text-sm border rounded-md px-3 py-1.5 bg-background"
        >
          <option value="all">All Statuses</option>
          <option value="not_started">Not Started</option>
          <option value="in_review">In Review</option>
          <option value="ready">Ready</option>
          <option value="active">Active</option>
        </select>
        <span className="text-sm text-muted-foreground ml-auto">{entries.length} videos</span>
      </div>

      {/* Video Preview Modal */}
      {previewId && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewId(null)}
        >
          <div
            className="bg-card rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div>
                <p className="font-semibold text-sm">{VIDEO_REGISTRY_META[previewId]?.title}</p>
                <p className="text-xs text-muted-foreground">{previewId}</p>
              </div>
              <button onClick={() => setPreviewId(null)} className="p-1 rounded hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <VideoEmbed videoId={previewId} title={VIDEO_REGISTRY_META[previewId]?.title} />
            </div>
          </div>
        </div>
      )}

      {/* Video Table */}
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Video ID</th>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Phase</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">URL</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {entries.map(([videoId, meta]) => {
              const entry = registry[videoId];
              const status: VideoStatus = entry?.status ?? "not_started";
              const url = entry?.url ?? "";
              const isEditing = editingId === videoId;
              const Icon = TYPE_ICON[meta.type];

              return (
                <tr key={videoId} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{videoId}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium leading-tight">{meta.title}</div>
                    {meta.sectionTitle && (
                      <div className="text-xs text-muted-foreground">{meta.sectionTitle}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-xs">{TYPE_LABEL[meta.type]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {meta.phase && <span className="text-xs text-muted-foreground">{meta.phase}</span>}
                    {meta.module && <span className="text-xs text-muted-foreground ml-1">· M{meta.module}</span>}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value as VideoStatus)}
                        className="text-xs border rounded px-2 py-1 bg-background"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_review">In Review</option>
                        <option value="ready">Ready</option>
                        <option value="active">Active</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[status].className}`}>
                        {STATUS_CONFIG[status].label}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    {isEditing ? (
                      <div className="space-y-1">
                        <input
                          type="url"
                          value={editUrl}
                          onChange={e => setEditUrl(e.target.value)}
                          placeholder="https://vimeo.com/... or https://youtube.com/..."
                          className="w-full text-xs border rounded px-2 py-1.5 bg-background font-mono"
                        />
                        {saveError && <p className="text-xs text-red-500">{saveError}</p>}
                      </div>
                    ) : url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:underline truncate max-w-[200px]"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{url}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No URL yet</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={saveEdit}
                            disabled={saving}
                            className="p-1.5 rounded hover:bg-green-100 text-green-700 disabled:opacity-50"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded hover:bg-red-100 text-red-600"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(videoId)}
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                            title="Edit URL / status"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {url && (
                            <button
                              onClick={() => setPreviewId(videoId)}
                              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                              title="Preview video"
                            >
                              <Film className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {entries.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No videos match the current filters.
          </div>
        )}
      </div>

      {/* Workflow Instructions */}
      <div className="rounded-lg border bg-muted/30 p-5 space-y-3">
        <h3 className="font-semibold text-sm">Video Generation Workflow</h3>
        <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
          <li>Generate the video using InVideo (or any platform) using the brief from the Video Production Matrix spreadsheet.</li>
          <li>Publish the video as <strong>Unlisted</strong> on YouTube / Vimeo, or get the hosted URL from InVideo/Cloudflare.</li>
          <li>Click <strong>Edit</strong> on the video row above, paste the URL, set status to <strong>Active</strong>, and save.</li>
          <li>The video goes live on the platform immediately — no code change or redeploy needed.</li>
          <li>To replace a video: edit the same row with the new URL. The old URL is overwritten in the registry.</li>
        </ol>
      </div>
    </div>
  );
}
