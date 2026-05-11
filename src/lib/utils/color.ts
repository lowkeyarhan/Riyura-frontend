/**
 * Extracts a 2x2 grid of colors from an image source.
 * Useful for generating dynamic background gradients.
 * @param src - The image URL to extract colors from.
 * @param alpha - Optional opacity to apply to the extracted colors (0 to 1).
 * @returns A promise that resolves to an array of 4 color strings (rgba or rgb).
 */
export async function extractColors(
  src: string,
  alpha?: number,
): Promise<string[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve([]);
    }
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    img.onload = () => {
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
    };
    img.onerror = () => resolve([]);
  });
}
