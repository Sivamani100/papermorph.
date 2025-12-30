import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  src: string | null;
  open: boolean;
  aspect?: number | null; // width/height or null for free
  onCancel: () => void;
  onCrop: (dataUrl: string) => void;
};

export default function ImageCropper({ src, open, aspect = null, onCancel, onCrop }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(aspect ?? null);
  const [rotation, setRotation] = useState<number>(0); // degrees 0/90/180/270
  const [scale, setScale] = useState<number>(1); // zoom multiplier

  const fitMax = { w: 900, h: 560 };

  // load image and initialize canvas
  useEffect(() => {
    if (!src || !canvasRef.current) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      computeAndDraw(img, rotation, scale);
    };
    img.onerror = () => console.error('Failed to load image for cropping');
    img.src = src;
  }, [src]);

  // redraw when rotation/scale/aspect change
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    computeAndDraw(img, rotation, scale);
  }, [rotation, scale, aspectRatio]);

  const computeAndDraw = (img: HTMLImageElement, rot: number, scl: number) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    // compute fit ratio to fit within fitMax
    let w = img.width;
    let h = img.height;
    const baseRatio = Math.min(fitMax.w / w, fitMax.h / h, 1);
    w = Math.round(w * baseRatio * scl);
    h = Math.round(h * baseRatio * scl);

    // swap for 90/270 rotation
    if (rot % 180 !== 0) {
      canvas.width = h;
      canvas.height = w;
    } else {
      canvas.width = w;
      canvas.height = h;
    }

    // clear and draw transformed image centered
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();

    // if no selection exists yet, initialize selection to full canvas
    setRect((prev) => prev ?? { x: 0, y: 0, w: canvas.width, h: canvas.height });

    // update preview
    const pv = previewRef.current;
    if (pv) {
      pv.width = Math.min(300, canvas.width);
      pv.height = Math.min(200, canvas.height);
      const pctx = pv.getContext('2d')!;
      pctx.clearRect(0, 0, pv.width, pv.height);
      pctx.drawImage(canvas, 0, 0, pv.width, pv.height);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onDown = (e: MouseEvent) => {
      const rectB = canvas.getBoundingClientRect();
      const x = e.clientX - rectB.left;
      const y = e.clientY - rectB.top;
      setStart({ x, y });
      setDragging(true);
    };
    const onMove = (e: MouseEvent) => {
      if (!dragging || !start) return;
      const rectB = canvas.getBoundingClientRect();
      const x = e.clientX - rectB.left;
      const y = e.clientY - rectB.top;
      let x0 = Math.min(start.x, x);
      let y0 = Math.min(start.y, y);
      let w = Math.abs(x - start.x);
      let h = Math.abs(y - start.y);
      if (aspectRatio) {
        // enforce aspect ratio: width / height = aspectRatio
        if (w / Math.max(1, h) > aspectRatio) {
          h = Math.round(w / aspectRatio);
        } else {
          w = Math.round(h * aspectRatio);
        }
      }
      // clamp to canvas
      const canvasEl = canvasRef.current!;
      x0 = Math.max(0, Math.min(x0, canvasEl.width - 1));
      y0 = Math.max(0, Math.min(y0, canvasEl.height - 1));
      w = Math.max(1, Math.min(w, canvasEl.width - x0));
      h = Math.max(1, Math.min(h, canvasEl.height - y0));
      setRect({ x: x0, y: y0, w, h });
      drawSelection();
    };
    const onUp = () => {
      setDragging(false);
      setStart(null);
    };
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, start, aspectRatio]);

  const drawSelection = () => {
    const canvas = canvasRef.current;
    const pv = previewRef.current;
    if (!canvas || !rect) return;
    const ctx = canvas.getContext('2d')!;
    // redraw base from imageRef by re-computing draw (to include rotation/scale)
    const img = imgRef.current;
    if (img) computeAndDraw(img, rotation, scale);

    // overlay selection without reinitializing the base image drawing
    if (rect) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.w - 1, rect.h - 1);
    }

    // preview from displayed canvas
    if (pv) {
      const pctx = pv.getContext('2d')!;
      pctx.clearRect(0, 0, pv.width, pv.height);
      pctx.drawImage(canvas, rect.x, rect.y, rect.w, rect.h, 0, 0, pv.width, pv.height);
    }
  };

  const doCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas || !rect) return;
    const out = document.createElement('canvas');
    out.width = Math.max(1, Math.round(rect.w));
    out.height = Math.max(1, Math.round(rect.h));
    const ctx = out.getContext('2d')!;
    // draw from displayed canvas (which already has rotation/scale applied)
    ctx.drawImage(canvas, rect.x, rect.y, rect.w, rect.h, 0, 0, out.width, out.height);
    const dataUrl = out.toDataURL('image/png');
    onCrop(dataUrl);
  };

  if (!src) return null;

  const aspectPresets: Array<{ key: string; label: string; value: number | null }> = [
    { key: 'free', label: 'Free', value: null },
    { key: 'orig', label: 'Original', value: null },
    { key: '1:1', label: '1:1', value: 1 },
    { key: '4:3', label: '4:3', value: 4 / 3 },
    { key: '16:9', label: '16:9', value: 16 / 9 },
    { key: '3:2', label: '3:2', value: 3 / 2 },
  ];

  const applyAspectPreset = (preset: typeof aspectPresets[number]) => {
    if (preset.key === 'orig' && imgRef.current) {
      setAspectRatio(imgRef.current.width / imgRef.current.height);
    } else {
      setAspectRatio(preset.value);
    }
  };

  const rotateLeft = () => setRotation((r) => (r + 270) % 360);
  const rotateRight = () => setRotation((r) => (r + 90) % 360);
  const resetTransforms = () => { setRotation(0); setScale(1); };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex gap-1">
                {aspectPresets.map((p) => (
                  <Button key={p.key} size="sm" variant="outline" onClick={() => applyAspectPreset(p)}>
                    {p.label}
                  </Button>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={rotateLeft}>⟲</Button>
                <Button size="sm" variant="outline" onClick={rotateRight}>⟳</Button>
                <div className="text-xs text-muted-foreground">Zoom</div>
                <input type="range" min="0.5" max="2" step="0.05" value={scale} onChange={(e) => setScale(Number(e.target.value))} />
                <Button size="sm" variant="ghost" onClick={resetTransforms}>Reset</Button>
              </div>
            </div>

            <canvas ref={canvasRef} className="w-full border" style={{ background: '#000' }} />
          </div>
          <div className="w-64 flex flex-col gap-2">
            <div className="text-xs text-muted-foreground">Preview</div>
            <canvas ref={previewRef} className="w-full h-40 border rounded" />
            <div className="flex gap-2 mt-2">
              <Button onClick={doCrop} className="flex-1">Crop & Insert</Button>
              <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2">Tip: drag on the image to select an area. Use presets, rotate, and zoom for precise crops.</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
