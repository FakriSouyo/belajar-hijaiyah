import React, { useRef, useEffect, forwardRef } from 'react';

const SimpleCanvas = forwardRef(({ width, height, lineColor, backgroundColor }, ref) => {
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.lineWidth = 10;
    context.lineCap = 'round';
    context.strokeStyle = lineColor;
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);
  }, []);

  const startDrawing = (e) => {
    isDrawing.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.beginPath();
  };

  const draw = (e) => {
    if (!isDrawing.current) return;

    const canvas = ref.current;
    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext('2d');
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  };

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      onMouseMove={draw}
      style={{ border: '1px solid black', borderRadius: '15px' }} // Added borderRadius
    />
  );
});

export default SimpleCanvas;
