import React, { useRef, useState, useCallback, useMemo } from 'react';

interface NodeData {
  id: string;
  x: number;
  y: number;
  label: string;
}

export function AnimatedDiagram({ nodes }: { nodes?: NodeData[] }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const origin = useRef({ x: 0, y: 0 });

  const localNodes: NodeData[] = useMemo(() => nodes || [
    { id: 'a', x: 80, y: 80, label: 'Start' },
    { id: 'b', x: 240, y: 120, label: 'Process' },
    { id: 'c', x: 120, y: 220, label: 'Decision' },
  ], [nodes]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY / 500;
    setScale(prevScale => Math.min(3, Math.max(0.5, prevScale + delta)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    origin.current = { ...offset };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({ x: origin.current.x + dx, y: origin.current.y + dy });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    try { (e.target as Element).releasePointerCapture(e.pointerId); } catch {}
  };

  return (
    <div className="rounded-lg border border-border bg-card p-2 overflow-hidden">
      <div className="text-xs text-muted-foreground mb-2">Interactive Diagram — scroll to zoom, drag to pan</div>
      <div className="w-full h-64 bg-surface relative rounded-md">
        <svg
          ref={svgRef}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="w-full h-full cursor-grab touch-none"
        >
          <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
            {localNodes.map((n) => (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <circle r={28} fill="hsl(var(--accent))" opacity={0.12} />
                <circle r={16} fill="hsl(var(--primary))" />
                <text x={22} y={6} fontSize={12} fill="hsl(var(--foreground))">{n.label}</text>
              </g>
            ))}
            {/* simple edges */}
            <line x1={80} y1={80} x2={240} y2={120} stroke={`hsl(var(--muted-foreground))`} strokeWidth={1.5} />
            <line x1={80} y1={80} x2={120} y2={220} stroke={`hsl(var(--muted-foreground))`} strokeWidth={1.5} />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default AnimatedDiagram;
