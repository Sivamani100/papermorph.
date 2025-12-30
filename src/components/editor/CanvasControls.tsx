import React, { useState } from 'react';
import { 
  ZoomOut, 
  ZoomIn, 
  Maximize, 
  ChevronDown,
  HelpCircle
} from 'lucide-react';

interface CanvasControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onToggleFullscreen: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  snapEnabled: boolean;
  onToggleSnap: () => void;
}

const CanvasControls: React.FC<CanvasControlsProps> = ({
  zoom,
  onZoomChange,
  onToggleFullscreen,
  showGrid,
  onToggleGrid,
  snapEnabled,
  onToggleSnap,
}) => {
  const [gridSize, setGridSize] = useState('5mm');
  const [mousePosition, setMousePosition] = useState({ x: 205.26, y: 18.6 });

  return (
    <div className="canvas-controls">
      {/* Left Controls - Zoom */}
      <div className="canvas-controls-left">
        <button className="canvas-zoom-btn" onClick={() => onZoomChange(Math.max(25, zoom - 10))}>
          <ZoomOut size={16} />
        </button>
        <span className="canvas-zoom-value">{zoom}%</span>
        <button className="canvas-zoom-btn" onClick={() => onZoomChange(Math.min(400, zoom + 10))}>
          <ZoomIn size={16} />
        </button>
        <button className="canvas-control-btn" onClick={onToggleFullscreen}>
          <Maximize size={16} />
        </button>

        <div className="canvas-view-toggles">
          <button className="canvas-toggle-btn">W</button>
          <button className="canvas-toggle-btn">P</button>
          <button className="canvas-toggle-btn active">H</button>
          <button className="canvas-toggle-btn">F</button>
          <button className="canvas-toggle-btn">¶</button>
        </div>

        <button className="canvas-mode-btn active">
          B
        </button>
      </div>

      {/* Right Controls - Grid & Snap */}
      <div className="canvas-controls-right">
        <button 
          className={`canvas-option-btn ${showGrid ? '' : 'inactive'}`}
          onClick={onToggleGrid}
        >
          Grid
        </button>
        
        <button 
          className={`canvas-snap-btn ${snapEnabled ? 'active' : ''}`}
          onClick={onToggleSnap}
        >
          Snap
        </button>

        <button className="canvas-size-btn">
          <span>{gridSize}</span>
          <ChevronDown size={12} />
        </button>

        <button className="canvas-option-btn">Mini</button>
        
        <button className="canvas-help-btn">
          <HelpCircle size={14} />
        </button>
        
        <button 
          className={`canvas-snap-btn ${snapEnabled ? 'active' : ''}`}
          onClick={onToggleSnap}
        >
          Snap
        </button>

        {/* Coordinates Display */}
        <div className="canvas-coords">
          <span>X: {mousePosition.x.toFixed(2)} mm • Y: {mousePosition.y.toFixed(2)} mm</span>
        </div>
      </div>
    </div>
  );
};

export default CanvasControls;
