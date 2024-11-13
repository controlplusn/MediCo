import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import '../assets/styles/contentnotes.css';

export const ContentNotes = () => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState(null); 
  const [isDrawing, setIsDrawing] = useState(false); 
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const img = new Image();
    img.src = "https://via.placeholder.com/20";
    img.onload = () => {
      ctx.drawImage(img, 50, 50, 1450, 150); 
    };

    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#1E2022";
    ctx.fillText("Human Body", 50, 220 + 20);

    const contentText = [
      "The physical substance of the human organism, composed of living cells and extracellular materials and organized into tissues, organs, and systems.",
      "Human anatomy and physiology are treated in many different articles. For detailed discussions of specific tissues, organs, and systems, see human blood; cardiovascular system; human digestive system; human endocrine system; renal system; skin; human muscle system; nervous system; human reproductive system; human respiration; human sensory reception; and human skeletal system. For a description of how the body develops, from conception through old age, see aging; growth; prenatal development; and human development."
    ];

    ctx.font = "16px Arial";
    contentText.forEach((line, index) => {
      ctx.fillText(line, 50, 250 + 20 +(index * 30)); 
    });

    ctx.font = "16px Arial";
    ctx.fillStyle = "#C9D6DF"
    ctx.fillText("Type '/' or add text...", 50, 420);

  }, []); 

  const handleMouseDown = (e) => {
    if (tool) {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const { offsetX, offsetY } = e.nativeEvent;
      setLastPosition({ x: offsetX, y: offsetY });

      if (tool === 'pen') {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
      } else if (tool === 'eraser') {
        ctx.clearRect(offsetX - 10, offsetY - 10, 20, 20); 
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isDrawing && tool === 'pen') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const { offsetX, offsetY } = e.nativeEvent;

      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
      setLastPosition({ x: offsetX, y: offsetY });
    } else if (isDrawing && tool === 'eraser') {
      const { offsetX, offsetY } = e.nativeEvent;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(offsetX - 10, offsetY - 10, 20, 20); 
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleToolSelect = (selectedTool) => {
    setTool(selectedTool);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
      ></canvas>

        <div className="btn--notes">
          <div className="btn--item">
            <Icon 
              icon="ph:arrow-u-up-left-light" 
              onClick={() => handleToolSelect('pen')} 
              title="Pen Tool"
            />
          </div>
          <div className="btn--item">
            <Icon 
              icon="ph:highlighter-fill" 
              onClick={() => handleToolSelect('highlighter')} 
              title="Highlighter Tool"
            />
          </div>
          <div className="btn--item">
            <Icon 
              icon="mdi:pen" 
              onClick={() => handleToolSelect('pen')} 
              title="Pen Tool"
            />
          </div>
          <div className="btn--item">
            <Icon 
              icon="gravity-ui:eraser" 
              onClick={() => handleToolSelect('eraser')} 
              title="Eraser Tool"
            />
          </div>
          <div className="btn--item">
            <Icon 
              icon="mdi-light:table" 
              onClick={() => handleToolSelect('table')} 
              title="Table Tool"
            />
          </div>
          <div className="btn--item">
            <Icon 
              icon="solar:gallery-add-bold" 
              onClick={() => handleToolSelect('add')} 
              title="Add Tool"
            />
          </div>
          <div className="btn--item">
            <Icon 
              icon="ph:arrow-u-up-right" 
              onClick={() => handleToolSelect('arrow')} 
              title="Arrow Tool"
            />
          </div>
        </div>
      </div>
  );
};

export default ContentNotes;
