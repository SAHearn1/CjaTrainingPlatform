/**
 * VideoEmbed — Renders a YouTube or Vimeo video in a responsive iframe.
 *
 * For production: replace placeholder URLs in data.ts with real hosted
 * video URLs from your video CDN (e.g., Vimeo PRO, Bunny.net, Cloudflare Stream).
 *
 * URL formats supported:
 *   YouTube: https://www.youtube.com/watch?v=VIDEO_ID
 *             https://youtu.be/VIDEO_ID
 *   Vimeo:   https://vimeo.com/VIDEO_ID
 *   Direct:  https://cdn.example.com/video.mp4 (renders <video> element)
 */
interface VideoEmbedProps {
  url: string;
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

export function VideoEmbed({ url, title = "Training Video", className = "" }: VideoEmbedProps) {
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

  // Direct video file
  return (
    <div className={wrapperClass}>
      <video
        className="w-full rounded-xl"
        controls
        preload="metadata"
        title={title}
      >
        <source src={url} />
        <p className="text-sm text-muted-foreground p-4">
          Your browser does not support HTML5 video. <a href={url} className="underline">Download the video</a>.
        </p>
      </video>
    </div>
  );
}
