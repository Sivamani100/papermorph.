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
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    // @ts-ignore
    jsPDF = (window as any).jspdf?.jsPDF || (window as any).jsPDF;
  }

  if (!html2canvas) throw new Error('html2canvas not available');
  if (!jsPDF) throw new Error('jspdf not available');

  // Render the element to canvas
  const scale = options?.scale ?? 2;
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  onProgress?.(0.1);

  const imgData = canvas.toDataURL('image/png');

  // Create PDF and add image(s) with explicit margins, similar to Word layout.
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Margins (mm) — default to ~8mm if not provided
  const marginTopMm = options?.margins?.top ?? 8;
  const marginBottomMm = options?.margins?.bottom ?? 8;
  const marginLeftMm = options?.margins?.left ?? 8;
  const marginRightMm = options?.margins?.right ?? 8;
  const usablePageHeightMm = pdfHeight - marginTopMm - marginBottomMm;
  const usablePageWidthMm = pdfWidth - marginLeftMm - marginRightMm;

  // Compute image dimensions in mm based on usable page width
  const imgProps = (pdf as any).getImageProperties(imgData);
  const imgWidthMm = usablePageWidthMm;
  const imgHeightMm = (imgProps.height * imgWidthMm) / imgProps.width;

  if (imgHeightMm <= usablePageHeightMm) {
    // Single page: start drawing at top + left margin
    pdf.addImage(imgData, 'PNG', marginLeftMm, marginTopMm, imgWidthMm, imgHeightMm);
    onProgress?.(1);
  } else {
    // Multi-page: slice the rendered canvas into page-sized strips that respect margins.
    // This avoids relying on negative positioning of a single large image and prevents
    // clipping/rounding errors when the image is very tall.
    const canvasWidthPx = canvas.width;
    const canvasHeightPx = canvas.height;

    // px per mm for the image when drawn to `imgWidthMm`
    const pxPerMm = canvasWidthPx / imgWidthMm;

    // height of one page slice in pixels (source canvas coordinates)
    const sliceHeightPx = Math.round(usablePageHeightMm * pxPerMm);

    const totalSlices = Math.ceil(canvasHeightPx / sliceHeightPx) || 1;
    let yPx = 0;
    let pageIndex = 0;

    while (yPx < canvasHeightPx) {
        // Create a temporary canvas for this page slice and fill white background
        const sliceH = Math.min(sliceHeightPx, canvasHeightPx - yPx);
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = canvasWidthPx;
        tmpCanvas.height = sliceH;
        const ctx = tmpCanvas.getContext('2d');
        if (!ctx) throw new Error('Cannot create canvas context for PDF slicing');

        // Ensure page slice background is white (margins will remain white in the PDF)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);

        // draw the slice from the full canvas
        ctx.drawImage(canvas, 0, yPx, canvasWidthPx, sliceH, 0, 0, canvasWidthPx, sliceH);

      const sliceData = tmpCanvas.toDataURL('image/png');

      if (pageIndex === 0) {
        pdf.addImage(sliceData, 'PNG', marginLeftMm, marginTopMm, imgWidthMm, (sliceH / pxPerMm));
      } else {
        pdf.addPage();
        pdf.addImage(sliceData, 'PNG', marginLeftMm, marginTopMm, imgWidthMm, (sliceH / pxPerMm));
      }

      // progress update based on slices completed
      onProgress?.((pageIndex + 1) / totalSlices);

      yPx += sliceHeightPx;
      pageIndex += 1;
    }
  }

  pdf.save(filename);
}
