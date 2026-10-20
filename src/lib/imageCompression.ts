/**
 * Utility for client-side image compression (< 100 KB) and uploading
 */

export interface CompressionResult {
  blob: Blob;
  base64: string;
  sizeKb: number;
}

export function compressImageBelow100Kb(
  file: File,
  maxDimension = 1200
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = async () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas 2D context tidak tersedia'));
        }

        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        const attemptCompression = (q: number, w: number, h: number): Promise<Blob> => {
          return new Promise((res) => {
            canvas.width = w;
            canvas.height = h;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
            canvas.toBlob(
              (b) => {
                res(b || new Blob());
              },
              'image/jpeg',
              q
            );
          });
        };

        let blob = await attemptCompression(quality, width, height);

        // Progressively scale down until under 98 KB (limit < 100 KB)
        while (blob.size > 98 * 1024 && (quality > 0.3 || width > 400)) {
          if (quality > 0.4) {
            quality -= 0.12;
          } else {
            width = Math.round(width * 0.85);
            height = Math.round(height * 0.85);
          }
          blob = await attemptCompression(quality, width, height);
        }

        const sizeKb = Number((blob.size / 1024).toFixed(1));
        const finalReader = new FileReader();
        finalReader.readAsDataURL(blob);
        finalReader.onloadend = () => {
          resolve({
            blob,
            base64: finalReader.result as string,
            sizeKb,
          });
        };
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export async function uploadImageWithAutoCompression(
  file: File,
  maxDimension = 1200
): Promise<{ url: string; sizeKb: number; message: string }> {
  const compressed = await compressImageBelow100Kb(file, maxDimension);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base64: compressed.base64,
      ext: 'jpg',
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal mengunggah gambar');
  }

  return {
    url: json.url,
    sizeKb: compressed.sizeKb,
    message: json.message || 'Berhasil mengunggah gambar',
  };
}
