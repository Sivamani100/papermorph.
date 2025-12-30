import React, { useEffect, useRef, useState } from 'react';
import { useDocStore } from '@/state/useDocStore';

interface RulersProps {
  pageRef: React.RefObject<HTMLElement>;
}

/**
 * Rulers component
 * - Shows a top horizontal ruler and a left vertical ruler
 * - Draggable handles adjust page margins (top, bottom, left, right) stored in document
 */
export function Rulers({ pageRef }: RulersProps) {
  const { currentDocument, updateDocument } = useDocStore();
  const containerRef = pageRef;
  const [pxPerMm, setPxPerMm] = useState<number>(3.78); // default fallback
  const dragging = useRef<null | { type: 'left' | 'right' | 'top' | 'bottom' }>(null);

  // read margins from document, default to 25.4mm
  const margins = currentDocument?.pageMargins || {
    top: '25.4mm',
    bottom: '25.4mm',
    left: '25.4mm',
    right: '25.4mm',
  };

  const parseMm = (v?: string) => {
    if (!v) return 25.4;
    if (v.endsWith('mm')) return parseFloat(v.replace('mm', ''));
    if (v.endsWith('cm')) return parseFloat(v.replace('cm', '')) * 10;
    if (v.endsWith('in')) return parseFloat(v.replace('in', '')) * 25.4;
    if (v.endsWith('px')) return parseFloat(v.replace('px', '')) / (pxPerMm || 1);
    // default assume mm number
    return parseFloat(v);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      const widthPx = el.clientWidth; // corresponds to 210mm
      setPxPerMm(widthPx / 210);
    };
    compute();
    const ro = new ResizeObserver(() => compute());
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  const mmToPx = (mm: number) => Math.round(mm * pxPerMm);
  const pxToMm = (px: number) => px / (pxPerMm || 1);

  // positions
  const leftMm = parseMm(margins.left);
  const rightMm = parseMm(margins.right);
  const topMm = parseMm(margins.top);
  const bottomMm = parseMm(margins.bottom);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (dragging.current.type === 'left') {
        let px = e.clientX - rect.left; // position inside page
        px = Math.max(0, Math.min(px, rect.width));
        const mm = pxToMm(px);
        updateDocument({ pageMargins: { ...(currentDocument?.pageMargins || {}), left: `${mm.toFixed(2)}mm` } });
      } else if (dragging.current.type === 'right') {
        let px = rect.right - e.clientX; // distance from right edge
        px = Math.max(0, Math.min(px, rect.width));
        const mm = pxToMm(px);
        updateDocument({ pageMargins: { ...(currentDocument?.pageMargins || {}), right: `${mm.toFixed(2)}mm` } });
      } else if (dragging.current.type === 'top') {
        let px = e.clientY - rect.top; // distance from top
        px = Math.max(0, Math.min(px, rect.height));
        const mm = pxToMm(px);
        updateDocument({ pageMargins: { ...(currentDocument?.pageMargins || {}), top: `${mm.toFixed(2)}mm` } });
      } else if (dragging.current.type === 'bottom') {
        let px = rect.bottom - e.clientY; // distance from bottom
        px = Math.max(0, Math.min(px, rect.height));
        const mm = pxToMm(px);
        updateDocument({ pageMargins: { ...(currentDocument?.pageMargins || {}), bottom: `${mm.toFixed(2)}mm` } });
      }
    };
    const onMouseUp = () => { dragging.current = null; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [containerRef, currentDocument, pxPerMm, updateDocument]);

  if (!containerRef.current) return null;

  const el = containerRef.current;
  const containerWidth = el.clientWidth || 210;
  const containerHeight = el.clientHeight || 297;
  const topRulerHeight = 28;
  const leftRulerWidth = 32;

  // recompute pxPerMm based on container width (A4 210mm)
  const computedPxPerMm = containerWidth / 210;
  const mmToPxLocal = (mm: number) => Math.round(mm * computedPxPerMm);

  const leftPx = mmToPxLocal(leftMm);
  const rightPx = mmToPxLocal(rightMm);
  const topPx = mmToPxLocal(topMm);
  const bottomPx = mmToPxLocal(bottomMm);

  return (
    <>
      {/* Top ruler placed inside page container (absolute relative to page) */}
      <div style={{ position: 'absolute', top: -topRulerHeight, left: 0, width: '100%', height: topRulerHeight, pointerEvents: 'none', zIndex: 40 }}>
        <div style={{ position: 'relative', height: '100%', width: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.02), transparent)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          {/* Left handle */}
          <div
            onMouseDown={() => (dragging.current = { type: 'left' })}
            style={{ position: 'absolute', left: Math.max(0, leftPx - 6), top: 6, width: 12, height: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 2, cursor: 'ew-resize', pointerEvents: 'auto' }}
            title="Drag to change left margin"
          />

          {/* Right handle: calculate distance from right edge */}
          <div
            onMouseDown={() => (dragging.current = { type: 'right' })}
            style={{ position: 'absolute', left: Math.max(0, containerWidth - rightPx - 6), top: 6, width: 12, height: 16, background: '#fff', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 2, cursor: 'ew-resize', pointerEvents: 'auto' }}
            title="Drag to change right margin"
          />
        </div>
      </div>

      {/* Left vertical ruler inside page container */}
      <div style={{ position: 'absolute', left: -leftRulerWidth, top: 0, width: leftRulerWidth, height: '100%', background: 'linear-gradient(to right, rgba(0,0,0,0.02), transparent)', borderRight: '1px solid rgba(0,0,0,0.08)', zIndex: 40, pointerEvents: 'none' }}>
        {/* Top handle */}
        <div
          onMouseDown={() => (dragging.current = { type: 'top' })}
          style={{ position: 'absolute', left: 6, top: Math.max(0, topPx - 6), width: 16, height: 12, background: '#fff', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 2, cursor: 'ns-resize', pointerEvents: 'auto' }}
          title="Drag to change top margin"
        />

        {/* Bottom handle (distance from bottom) */}
        <div
          onMouseDown={() => (dragging.current = { type: 'bottom' })}
          style={{ position: 'absolute', left: 6, top: Math.max(0, containerHeight - bottomPx - 6), width: 16, height: 12, background: '#fff', border: '1px solid rgba(0,0,0,0.2)', borderRadius: 2, cursor: 'ns-resize', pointerEvents: 'auto' }}
          title="Drag to change bottom margin"
        />
      </div>
    </>
  );
}

export default Rulers;
