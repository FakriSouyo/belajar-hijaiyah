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

  // Fungsi untuk desktop
  const startDrawingDesktop = (e) => {
    isDrawing.current = true;
    drawDesktop(e);
  };

  const stopDrawingDesktop = () => {
    isDrawing.current = false;
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.beginPath();
  };

  const drawDesktop = (e) => {
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

  // Fungsi untuk mobile
  const startDrawingMobile = (e) => {
    isDrawing.current = true;
    drawMobile(e);
  };

  const stopDrawingMobile = () => {
    isDrawing.current = false;
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.beginPath();
  };

  const drawMobile = (e) => {
    if (!isDrawing.current) return;

    const canvas = ref.current;
    const rect = canvas.getBoundingClientRect();
    const context = canvas.getContext('2d');
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

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
      // Event listeners untuk desktop
      onMouseDown={startDrawingDesktop}
      onMouseUp={stopDrawingDesktop}
      onMouseOut={stopDrawingDesktop}
      onMouseMove={drawDesktop}
      // Event listeners untuk mobile
      onTouchStart={startDrawingMobile}
      onTouchEnd={stopDrawingMobile}
      onTouchCancel={stopDrawingMobile}
      onTouchMove={drawMobile}
      style={{ border: '1px solid black', borderRadius: '15px', touchAction: 'none' }}
    />
  );
});

export default SimpleCanvas;