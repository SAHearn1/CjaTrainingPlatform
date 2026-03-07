/**
 * VideoEmbed — Renders a training video from the Video Registry or a direct URL.
 *
 * Preferred usage (registry-driven, no redeploy to swap videos):
 *   <VideoEmbed videoId="LEC-M1-01" title="ACEs & Trauma Neuroscience" />
 *
 * Fallback usage (static URL):
 *   <VideoEmbed url="https://vimeo.com/123456789" title="Training Video" />
 *
 * Supported URL formats:
 *   YouTube: https://www.youtube.com/watch?v=VIDEO_ID  |  https://youtu.be/VIDEO_ID
 *   Vimeo:   https://vimeo.com/VIDEO_ID
 *   Direct:  https://cdn.example.com/video.mp4
 */
import { useVideoUrl } from "./VideoRegistry";

interface VideoEmbedProps {
  /** Registry video ID (e.g. "LEC-M1-01"). Resolves live URL from Supabase registry. */
  videoId?: string;
  /** Static fallback URL. Used when videoId is absent or has no URL in registry yet. */
  url?: string;
  title?: string;
  className?: string;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function VideoPlayer({ url, title, className }: { url: string; title: string; className: string }) {
  const ytId = getYouTubeId(url);
  const vimeoId = getVimeoId(url);
  const wrapperClass = `relative w-full rounded-xl overflow-hidden bg-black ${className}`;
  const iframeClass = "absolute inset-0 w-full h-full border-0";

  if (ytId) {
    return (
      <div className={wrapperClass} style={{ paddingBottom: "56.25%" }}>
        <iframe
          className={iframeClass}
          src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (vimeoId) {
    return (
      <div className={wrapperClass} style={{ paddingBottom: "56.25%" }}>
        <iframe
          className={iframeClass}
          src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <video className="w-full rounded-xl" controls preload="metadata" title={title}>
        <source src={url} />
        <p className="text-sm text-muted-foreground p-4">
          Your browser does not support HTML5 video.{" "}
          <a href={url} className="underline">Download the video</a>.
        </p>
      </video>
    </div>
  );
}

export function VideoEmbed({ videoId, url, title = "Training Video", className = "" }: VideoEmbedProps) {
  const registryUrl = useVideoUrl(videoId);
  const resolvedUrl = registryUrl || url;

  if (!resolvedUrl) {
    return (
      <div className={`relative w-full rounded-xl overflow-hidden bg-black/5 border border-dashed border-border flex items-center justify-center ${className}`} style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <svg className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.07A1 1 0 0121 8.88v6.24a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
          <p className="text-xs font-medium">Video coming soon</p>
          {videoId && <p className="text-xs opacity-50">{videoId}</p>}
        </div>
      </div>
    );
  }

  return <VideoPlayer url={resolvedUrl} title={title} className={className} />;
}
