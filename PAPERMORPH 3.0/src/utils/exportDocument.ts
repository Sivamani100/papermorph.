import React from 'react';
import { Document as DocType } from '@/state/useDocStore';
import { exportDocumentToPdf } from '@/utils/exportPdf';
import { toast } from 'sonner';
import { formatHTMLForInsertion, addPreviewStyles } from '@/utils/contentFormatter';

/**
 * Export document content to PDF in a Word-like A4 layout
 * @param doc - Document to export
 * @param contentRef - Reference to the content div in the editor
 * @param onProgress - Optional progress callback (0-100)
 */
export async function exportToPDF(
  doc: DocType,
  contentRef: React.RefObject<HTMLDivElement>,
  onProgress?: (progress: number) => void
): Promise<void> {
  if (!contentRef.current) {
    throw new Error('Content reference not available');
  }

  // Show loading toast
  const toastId = toast.loading('Preparing PDF export...');
  
  try {
    onProgress?.(10);
    
    // Prefer the main editor content (ProseMirror) if present
    const editorEl = contentRef.current.querySelector('.ProseMirror') as HTMLElement | null;
    const sourceEl = editorEl || contentRef.current;

    // Determine margins from the document (mm) and fallback to 25.4mm (1in)
    const parseMm = (val: any, fallback = 25.4) => {
      if (!val) return fallback;
      if (typeof val === 'number') return val;
      const num = parseFloat(String(val));
      return isNaN(num) ? fallback : num;
    };

    const topMm = parseMm((doc as any).pageMargins?.top, 25.4);
    const bottomMm = parseMm((doc as any).pageMargins?.bottom, 25.4);
    const leftMm = parseMm((doc as any).pageMargins?.left, 25.4);
    const rightMm = parseMm((doc as any).pageMargins?.right, 25.4);

    // Clone the content to avoid affecting the original
    const contentClone = sourceEl.cloneNode(true) as HTMLElement;
    
    // Apply the same formatting as the preview to ensure PDF matches exactly
    let formattedHTML = contentClone.innerHTML;
    formattedHTML = formatHTMLForInsertion(formattedHTML);
    formattedHTML = addPreviewStyles(formattedHTML);
    contentClone.innerHTML = formattedHTML;
    
    // Split content by page breaks to create explicit page sections
    const pageSections: HTMLElement[] = [];
    let currentSection = document.createElement('div');
    currentSection.className = 'page-section';
    
    // Process all child nodes, splitting at page breaks
    const childNodes = Array.from(contentClone.childNodes);
    for (const node of childNodes) {
      // Check if this node is a page break
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.classList.contains('page-break') || 
            (element.getAttribute('data-type') === 'pageBreak')) {
          // Found a page break - finalize current section and start a new one
          if (currentSection.childNodes.length > 0) {
            pageSections.push(currentSection);
          }
          currentSection = document.createElement('div');
          currentSection.className = 'page-section';
          continue; // Skip the page break element itself
        }
      }
      
      // Add non-page-break nodes to current section
      currentSection.appendChild(node.cloneNode(true));
    }
    
    // Add the final section if it has content
    if (currentSection.childNodes.length > 0) {
      pageSections.push(currentSection);
    }

    // If no page breaks were found, treat entire content as one section
    if (pageSections.length === 0) {
      pageSections.push(contentClone.cloneNode(true) as HTMLElement);
    }

    // We'll create a container that holds multiple page divs stacked vertically.
    const wrapperContainer = document.createElement('div');
    wrapperContainer.style.position = 'absolute';
    wrapperContainer.style.left = '-9999px';
    wrapperContainer.style.top = '0';

    // Utility: convert mm to px using 96 DPI (browser CSS px)
    const mmToPx = (mm: number) => (mm * 96) / 25.4;
    const pageWidthMm = 210;
    const pageHeightMm = 297;
    const pageInnerHeightPx = Math.max(0, mmToPx(pageHeightMm - topMm - bottomMm));

    // Append the container to the document for accurate measurements
    document.body.appendChild(wrapperContainer);

    let currentPage: HTMLElement;

    function tryAppendNode(target: HTMLElement, node: Node, nodeQueue: Node[]): boolean {
      // Attempt to append node (shallow clone) and return true if fits
      const shallow = node.cloneNode(false) as Node;
      target.appendChild(shallow);
      if (target.scrollHeight <= pageInnerHeightPx) {
        // If the shallow clone fits but the original had children, append children afterwards
        if ((node as Element).childNodes && (node as Element).childNodes.length > 0) {
          for (const child of Array.from((node as Element).childNodes)) {
            const appended = tryAppendNode(shallow as HTMLElement, child, nodeQueue);
            if (!appended) {
              // Child didn't fit; stop adding children
              break;
            }
          }
        }
        // Final check
        if (target.scrollHeight <= pageInnerHeightPx) return true;
        // otherwise remove and fail
        target.removeChild(shallow);
        return false;
      }

      // Remove shallow clone and attempt splitting if possible
      target.removeChild(shallow);

      // If it's a text node, try to split by characters using binary search
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        if (!text.trim()) return true; // whitespace can be skipped

        let low = 0;
        let high = text.length;
        let fit = 0;

        // binary search for max chars that fit
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const attempt = document.createTextNode(text.slice(0, mid));
          target.appendChild(attempt);
          if (target.scrollHeight <= pageInnerHeightPx) {
            fit = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
          target.removeChild(attempt);
        }

        if (fit === 0) return false; // not even a single char fits

        // append the fitting portion
        const head = document.createTextNode(text.slice(0, fit));
        target.appendChild(head);

        // push remainder back to queue so next page will process it
        const remainder = text.slice(fit);
        if (remainder.length > 0) {
          nodeQueue.unshift(document.createTextNode(remainder));
        }
        return true;
      }

      // If element node with children, try to add children progressively
      if (node.nodeType === Node.ELEMENT_NODE) {
        const elClone = (node as Element).cloneNode(false) as HTMLElement;
        target.appendChild(elClone);
        for (const child of Array.from((node as Element).childNodes)) {
          const appended = tryAppendNode(elClone, child, nodeQueue);
          if (!appended) {
            // If a child cannot be appended into elClone because it's too big for remaining space,
            // then stop attempting further children. If elClone has no children, remove it and fail.
            if (elClone.childNodes.length === 0) {
              target.removeChild(elClone);
              return false;
            }
            break;
          }
        }

        // Final check for target fit
        if (target.scrollHeight <= pageInnerHeightPx) return true;
        // didn't fit, remove elClone and fail
        target.removeChild(elClone);
        return false;
      }

      // Fallback: cannot split, signal failure
      return false;
    }

    // Process each page section created from page breaks
    // Each section may need to be split across multiple pages if it's too long
    for (const section of pageSections) {
      // Try to fit the entire section on a single page first
      const testPage = createPageDiv();
      wrapperContainer.appendChild(testPage);
      
      let allContentFits = true;
      const testNodeQueue: Node[] = Array.from(section.childNodes);
      
      while (testNodeQueue.length > 0 && allContentFits) {
        const node = testNodeQueue.shift() as Node;
        const appended = tryAppendNode(testPage, node, testNodeQueue);
        if (!appended) {
          allContentFits = false;
        }
      }
      
      if (allContentFits) {
        // Section fits on one page, keep it
        currentPage = testPage;
      } else {
        // Section needs multiple pages, clear test page and process properly
        wrapperContainer.removeChild(testPage);
        
        // Process this section with multi-page logic
        const nodeQueue: Node[] = Array.from(section.childNodes);
        
        while (nodeQueue.length > 0) {
          const node = nodeQueue.shift() as Node;
          
          // Create a new page if needed
          if (!currentPage || currentPage.scrollHeight >= pageInnerHeightPx) {
            currentPage = createPageDiv();
            wrapperContainer.appendChild(currentPage);
          }
          
          const appended = tryAppendNode(currentPage, node, nodeQueue);
          if (!appended) {
            // Start a new page and retry
            currentPage = createPageDiv();
            wrapperContainer.appendChild(currentPage);
            // Try again on the new page; if still fails, append it anyway
            const appendedOnNew = tryAppendNode(currentPage, node, nodeQueue);
            if (!appendedOnNew) {
              currentPage.appendChild(node.cloneNode(true));
            }
          }
        }
      }
    }

    // wrapperContainer is already appended to the document above

    function createPageDiv() {
      const page = document.createElement('div');
      page.style.width = `${pageWidthMm}mm`;
      page.style.minHeight = `${pageHeightMm}mm`;
      page.style.boxSizing = 'border-box';
      page.style.margin = '0 auto 8mm';
      page.style.background = '#ffffff';
      page.style.color = '#1f2937';
      page.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
      page.style.fontSize = '0.875rem'; // Match prose-sm (14px)
      page.style.lineHeight = '1.7142857'; // Match prose-sm leading-relaxed (approx 1.7)
      page.style.textAlign = 'left';
      page.style.padding = `${topMm}mm ${rightMm}mm ${bottomMm}mm ${leftMm}mm`;
      page.style.wordWrap = 'break-word';
      page.style.overflowWrap = 'break-word';
      (page.style as any).webkitPrintColorAdjust = 'exact';
      return page;
    }

    onProgress?.(30);
    
    try {
      // Update progress and show status
      toast.loading('Generating PDF...', { id: toastId });
      
      // Export with progress updates (use the offscreen container with individual pages)
      await exportDocumentToPdf(
        wrapperContainer,
        `${doc.title || 'Document'}.pdf`,
        { margins: { top: topMm, bottom: bottomMm, left: leftMm, right: rightMm } },
        (progress) => {
          // Map internal progress (0-1) to 30-90% of overall progress
          onProgress?.(30 + Math.floor(progress * 60));
        }
      );
      
      onProgress?.(100);
      toast.success('PDF exported successfully!', { id: toastId });
    } finally {
      // Always clean up the offscreen wrapper container
      if (wrapperContainer.parentNode) {
        wrapperContainer.parentNode.removeChild(wrapperContainer);
      }
    }
  } catch (error) {
    console.error('PDF export error:', error);
    toast.error(
      error instanceof Error ? error.message : 'Failed to export PDF',
      { id: toastId }
    );
    throw error;
  }
}

/**
 * Export document to DOCX format
 * For now, this creates a simple HTML download
 * @param doc - Document to export
 * @param contentRef - Reference to the content div in the editor
 */
export async function exportToDOCX(
  doc: DocType,
  contentRef: React.RefObject<HTMLDivElement>
): Promise<void> {
  if (!contentRef.current) {
    throw new Error('Content reference not available');
  }

  try {
    // We want only the first A4 sheet content (canvas) to be exported to Word.
    // Determine page inner height in mm accounting for margins provided in `doc.pageMargins`.
    const parseMm = (val: any, fallback = 25.4) => {
      if (!val) return fallback;
      if (typeof val === 'number') return val;
      const num = parseFloat(String(val));
      return isNaN(num) ? fallback : num;
    };

    const topMm = parseMm(doc.pageMargins?.top);
    const bottomMm = parseMm(doc.pageMargins?.bottom);
    const leftMm = parseMm(doc.pageMargins?.left);
    const rightMm = parseMm(doc.pageMargins?.right);

    const pageHeightMm = 297; // A4 height
    const pageInnerHeightMm = Math.max(0, pageHeightMm - topMm - bottomMm);

    // Convert mm to px assuming 96dpi
    const mmToPx = (mm: number) => (mm * 96) / 25.4;
    const pageInnerHeightPx = mmToPx(pageInnerHeightMm);

    // Find the editor content element (ProseMirror) inside the contentRef
    const editorEl = contentRef.current.querySelector('.ProseMirror') as HTMLElement | null;
    const sourceEl = editorEl || contentRef.current;

    // Create a temporary container to accumulate nodes that fit into one A4 page
    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.left = '-9999px';
    temp.style.top = '-9999px';
    temp.style.width = '210mm';
    temp.style.padding = `${topMm}mm ${rightMm}mm ${bottomMm}mm ${leftMm}mm`;
    temp.style.boxSizing = 'border-box';
    temp.style.visibility = 'hidden';
    document.body.appendChild(temp);

    // Iterate child nodes and append until height exceeds one page
    const children = Array.from(sourceEl.childNodes);
    for (const node of children) {
      const clone = node.cloneNode(true) as Node;
      temp.appendChild(clone);
      if (temp.scrollHeight > pageInnerHeightPx) {
        // Remove the last node that caused overflow
        temp.removeChild(clone);
        break;
      }
    }

    const html = temp.innerHTML;

    // Build an MS Word compatible HTML wrapper so Word opens it as editable content
    const docContent = `
      <!DOCTYPE html>
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>${doc.title || 'Document'}</title>
        <style>
          @page { size: 210mm 297mm; margin: ${topMm}mm ${rightMm}mm ${bottomMm}mm ${leftMm}mm; }
          body { font-family: Arial, Helvetica, sans-serif; line-height: 1.6; }
          p { margin: 0.5em 0; }
          table { border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 4px; }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    // Clean up temp container
    document.body.removeChild(temp);

    // Download as legacy Word-compatible HTML (.doc) so Word opens it as editable
    const blob = new Blob([docContent], { type: 'application/msword' });
    const link = document.createElement('a') as HTMLAnchorElement;
    link.href = URL.createObjectURL(blob);
    link.download = `${doc.title || 'Document'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw new Error('Failed to generate DOCX. Please try again.');
  }
}

/**
 * Export document to HTML
 * @param doc - Document to export
 * @param contentRef - Reference to the content div in the editor
 */
export async function exportToHTML(
  doc: DocType,
  contentRef: React.RefObject<HTMLDivElement>
): Promise<void> {
  if (!contentRef.current) {
    throw new Error('Content reference not available');
  }

  try {
    const html = contentRef.current.innerHTML;

    const docContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${doc.title || 'Document'}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #fff;
            }
            .content {
              max-width: 210mm;
              margin: 25.4mm auto;
              padding: 25.4mm;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            p { margin: 0.5em 0; }
            h1, h2, h3, h4, h5, h6 { margin-top: 1em; margin-bottom: 0.5em; font-weight: 600; }
            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; }
            h3 { font-size: 1.17em; }
            ul, ol { padding-left: 1.5em; margin: 0.5em 0; }
            li { margin: 0.25em 0; }
            table { border-collapse: collapse; width: 100%; margin: 1em 0; }
            th, td { border: 1px solid #ddd; padding: 0.5em; text-align: left; }
            th { background-color: #f5f5f5; font-weight: 600; }
            blockquote { border-left: 4px solid #007bff; padding-left: 1em; margin: 1em 0; }
            code { background-color: #f5f5f5; padding: 0.2em 0.4em; border-radius: 0.25em; }
            a { color: #007bff; text-decoration: underline; }
            img { max-width: 100%; height: auto; margin: 1em 0; }
          </style>
        </head>
        <body>
          <div class="content">
            ${html}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([docContent], { type: 'text/html' });
    const link = document.createElement('a') as HTMLAnchorElement;
    link.href = URL.createObjectURL(blob);
    link.download = `${doc.title || 'Document'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error generating HTML:', error);
    throw new Error('Failed to generate HTML. Please try again.');
  }
}

/**
 * Export document as plain text
 * @param doc - Document to export
 * @param contentRef - Reference to the content div in the editor
 */
export async function exportToTXT(
  doc: DocType,
  contentRef: React.RefObject<HTMLDivElement>
): Promise<void> {
  if (!contentRef.current) {
    throw new Error('Content reference not available');
  }

  try {
    const element = contentRef.current.cloneNode(true) as HTMLElement;
    
    // Remove script tags and style tags
    element.querySelectorAll('script, style').forEach(el => el.remove());
    
    // Extract text content
    let text = element.innerText || element.textContent || '';
    
    // Clean up excessive whitespace
    text = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a') as HTMLAnchorElement;
    link.href = URL.createObjectURL(blob);
    link.download = `${doc.title || 'Document'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error generating TXT:', error);
    throw new Error('Failed to generate TXT. Please try again.');
  }
}
