/**
 * Programmatic PDF export using html2canvas + jsPDF
 * Produces a PDF generated from a DOM element and avoids browser print headers/footers.
 * This implementation attempts to dynamically import libraries, but falls back to CDN UMD builds
 * so the functionality works even if the packages aren't installed via npm.
 */
export async function exportDocumentToPdf(
  element: HTMLElement,
  filename = 'document.pdf',
  options?: {
    margins?: { top?: number; bottom?: number; left?: number; right?: number };
    scale?: number;
  },
  onProgress?: (progress: number) => void
) {
  if (!element) throw new Error('No element provided to export');

  // Helper to load a script tag from CDN
  const loadScript = (url: string) => new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) return resolve();
    const s = document.createElement('script');
    s.src = url;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = (e) => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(s);
  });

  // Try dynamic import but ignore Vite pre-bundling; fall back to CDN UMD if unavailable
  let html2canvas: any = null;
  let jsPDF: any = null;

  try {
    // @ts-ignore - instruct bundler to ignore
    const mod = await import(/* @vite-ignore */ 'html2canvas');
    html2canvas = mod?.default || mod;
  } catch (e) {
    // Fallback: load from CDN
    await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
    // @ts-ignore
    html2canvas = (window as any).html2canvas;
  }

  try {
    // @ts-ignore
    const m = await import(/* @vite-ignore */ 'jspdf');
    jsPDF = m?.jsPDF || m?.default || m;
  } catch (e) {
    // Fallback: load UMD build from CDN (exposes window.jspdf)
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
    // @ts-ignore
    jsPDF = (window as any).jspdf?.jsPDF || (window as any).jsPDF;
  }

  if (!html2canvas || !jsPDF) {
    throw new Error('Failed to load PDF export libraries');
  }

  const scale = options?.scale || 2;
  const margins = {
    top: options?.margins?.top || 10,
    bottom: options?.margins?.bottom || 10,
    left: options?.margins?.left || 10,
    right: options?.margins?.right || 10,
  };

  onProgress?.(0.1);

  // Capture the element as canvas
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
  });

  onProgress?.(0.5);

  // Get image dimensions
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // Create PDF with A4 dimensions (in mm)
  const pdf = new jsPDF({
    orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Calculate image dimensions in mm (maintaining aspect ratio)
  const mmWidth = (imgWidth * (25.4 / 96)) / scale; // Convert pixels to mm at 96 DPI
  const mmHeight = (imgHeight * (25.4 / 96)) / scale;

  // Scale image to fit page with margins
  const maxWidth = pageWidth - margins.left - margins.right;
  const maxHeight = pageHeight - margins.top - margins.bottom;
  
  let finalWidth = mmWidth;
  let finalHeight = mmHeight;
  
  if (mmWidth > maxWidth) {
    finalWidth = maxWidth;
    finalHeight = (mmHeight * maxWidth) / mmWidth;
  }
  
  if (finalHeight > maxHeight) {
    const tempHeight = maxHeight;
    finalWidth = (finalWidth * maxHeight) / finalHeight;
    finalHeight = tempHeight;
  }

  // Center the image on the page
  const x = (pageWidth - finalWidth) / 2;
  const y = (pageHeight - finalHeight) / 2;

  // Add image to PDF
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);

  onProgress?.(0.9);

  // Save the PDF
  pdf.save(filename);

  onProgress?.(1.0);
}
