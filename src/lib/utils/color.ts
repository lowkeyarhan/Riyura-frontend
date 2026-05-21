function loadImageColors(src: string, alpha?: number): Promise<string[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve([]);

    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = src;

    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        if (!ctx) return resolve([]);
        c.width = c.height = 2;
        ctx.drawImage(img, 0, 0, 2, 2);
        const d = ctx.getImageData(0, 0, 2, 2).data;
        const out: string[] = [];
        for (let i = 0; i < d.length; i += 4) {
          if (alpha !== undefined) {
            out.push(`rgba(${d[i]}, ${d[i + 1]}, ${d[i + 2]}, ${alpha})`);
          } else {
            out.push(`rgb(${d[i]}, ${d[i + 1]}, ${d[i + 2]})`);
          }
        }
        resolve(out);
      } catch {
        // Canvas is tainted (CORS), resolve empty
        resolve([]);
      }
    };

    img.onerror = () => resolve([]);
  });
}

export async function extractColors(
  src: string,
  alpha?: number,
): Promise<string[]> {
  if (typeof window === "undefined") return [];

  // Try direct first
  const direct = await loadImageColors(src, alpha);
  if (direct.length > 0) return direct;

  // Fallback: proxy through Next.js image optimizer (same-origin, no CORS block)
  try {
    const proxied = `/_next/image?url=${encodeURIComponent(src)}&w=8&q=75`;
    const via = await loadImageColors(proxied, alpha);
    if (via.length > 0) return via;
  } catch {
    // ignore
  }

  return [];
}
